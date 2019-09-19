// formats anything that's not parameterized like the keys
const format = require('pg-format');
const shortid = require('shortid');
const { readJsonFromDb, writeJsonToDb } = require('../utils/db.utils');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');
const db = require('../db');

/**
 * @typedef {Object} Snippet
 * @property {string} id
 * @property {string} author
 * @property {string} code
 * @property {string} title
 * @property {string} description
 * @property {string} language
 * @property {string[]} comments
 * @property {number} favorites
 */

/* Create */
/**
 * Inserts a new snippet into the db.
 * @param {Snippet} newSnippet - the data to create the snippet with
 * @returns {Promise<Snippet>} the create snippet
 */
exports.insert = async ({ author, code, title, description, language }) => {
  try {
    if (!author || !code || !title || !description || !language) {
      throw new ErrorWithHttpStatus('missing properties', 400);
    }
    return db.query(
      `INSERT INTO snippet (code, title, description, author, language) VALUES 
      ($1, $2, $3, $4, $5) RETURNING *`,
      [author, code, title, description, language]
    );
  } catch (error) {
    if (error instanceof ErrorWithHttpStatus) throw error;
    else throw new ErrorWithHttpStatus('database error');
  }
};

/**
 * Read
 * Selects snippets from db.
 * Can accept optional query object to filter results.
 * @param {Object} [query]
 * @returns {Promise<Snippet[]>} array of snippet objects
 * * {author: 'Scott', language: 'javascript'}
 */
exports.select = async (query = {} /** Incase select statement is empty */) => {
  try {
    const clauses = Object.keys(query)
      .map((key, i) => `%I=$${i + 1}`)
      .join(' AND ');
    const formattedSelect = format(
      `SELECT * FROM snippet ${clauses.length ? `WHERE  ${clauses}` : ''}`,
      ...Object.keys(query)
    );
    const results = await db.query(formattedSelect, Object.values(query));
    return results.rows;

    // const result = await db.query('SELECT * FROM snippet ORDER BY id');
    // return result.rows;
    /*
    // 1. Read the file
    const snippets = await readJsonFromDb('snippets');
    // 2. Parse it
    // const parsedSnippets = JSON.parse(snippets);
    // ? Filter snippets with query
    // ? check if every query key
    // ? snippet[key] === query[key]
    const filtered = snippets.filter(snippet =>
      // ! Look into this further
      Object.keys(query).every(key => query[key] === snippet[key])
    );
    // 3. Return data
    return filtered;
    */
  } catch (err) {
    throw new ErrorWithHttpStatus('database error', 500);
  }
};

/**
 * Updates a snippet
 * @param {string} id - id of the snippet to update
 * @param {Snippet} newData - subset of values to update
 */
exports.update = async (id, { author, code, title, description, language }) =>
  db.query(
    `UPDATE 
      snippet
     SET 
      author = COALESCE($1, author), 
      code = COALESCE($2, code), 
      title = COALESCE($3, title), 
      description = COALESCE($4, description), 
      language = COALESCE($5, language) 
     WHERE 
      id = $6`,
    [author, code, title, description, language, id]
  );
// if (updateUserInfo.rowCount === 0)
//   throw new ErrorWithHttpStatus(`Snippet ID ${id} not found`, 500);

/*
  // TODO: error on id not found
  // 1. read file
  const snippets = await readJsonFromDb('snippets');
  // 2. Find the entry with id
  // 3. update the snippet with appropriate data (make sure to validate!)
  const updatedSnippets = snippets.map(snippet => {
    // if it's not what we want, just return it
    if (snippet.id !== id) return snippet;
    // Loop over keys in newData
    Object.keys(newData).forEach(key => {
      // check if snippet has the key and set it
      if (key in snippet) snippet[key] = newData[key];
      // TODO: 400 error on key DNE
    });
    return snippet;
  });
  // 4. write back to db
  return writeJsonToDb('snippets', updatedSnippets);
  */

/**
 * Delete
 * @param {string} id
 */
exports.delete = async id => {
  try {
    // test if this id exists
    const result = await db.query(`SELECT id FROM snippet WHERE id = $1`, [id]);
    if (result.rowCount === 0)
      throw new ErrorWithHttpStatus(`Snippet ID ${id} not found`, 500);
    return db.query(`DELETE FROM snippet WHERE id = ${id}`);
    /*
  // 1. read the file
  const snippets = await readJsonFromDb('snippets');
  // 2. filter snippets for everything except snippet.id === id
  const newSnippet = snippets.filter(snippet => snippet.id !== id);
  // ? if you get the same length as you
  // ? started with then you must have not found it! DNE
  if (newSnippet.length === snippets.length) return;
  // TODO: error if trying to delete a snippet DNE
  // 3. write the file
  return writeJsonToDb('snippets', newSnippet);
  */
  } catch (err) {
    if (err instanceof ErrorWithHttpStatus) throw err;
    else throw new ErrorWithHttpStatus('Database error', 500);
  }
};
