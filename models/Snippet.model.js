const shortid = require('shortid');
const { readJsonFromDb, writeJsonToDb } = require('../utils/db.utils');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

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
    // Read snippets.json
    const snippets = await readJsonFromDb('snippets');
    // Grab Data from a newSnippet (validate)
    // make newSnippet a proper object
    // generate default data (id, comments, favorites)
    // push that object into snippet
    snippets.push({
      id: shortid.generate(), // ? Generate a new id per user
      author,
      code,
      title,
      description,
      language,
      comments: [],
      favorites: 0,
    });
    // Write to the file
    await writeJsonToDb('snippets', snippets);
    return snippets[snippets.length - 1];
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
    // 1. Read the file
    const snippets = await readJsonFromDb('snippets');
    // 2. Parse it
    /* const parsedSnippets = JSON.parse(snippets); */
    // ? Filter snippets with query
    // ? check if every query key
    // ? snippet[key] === query[key]
    const filtered = snippets.filter(snippet =>
      // ! Look into this further
      Object.keys(query).every(key => query[key] === snippet[key])
    );
    // 3. Return data
    return filtered;
  } catch (err) {
    throw new ErrorWithHttpStatus('database error', 500);
  }
};

/**
 * Updates a snippet
 * @param {string} id - id of the snippet to update
 * @param {Snippet} newData - subset of values to update
 */
exports.update = async (id, newData) => {
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
};

/**
 * Delete
 * @param {string} id
 */
exports.delete = async id => {
  // 1. read the file
  const snippets = await readJsonFromDb('snippets');
  // 2. filter snippets for everything except snippet.id === id
  const newSnippet = snippets.filter(snippet => snippet.id !== id);
  // ? if you get the same length as you
  // ? started with then you mast have not found it! DNE
  if (newSnippet.length === snippets.length) return;
  // TODO: error if trying to delete a snippet DNE
  // 3. write the file
  return writeJsonToDb('snippets', newSnippet);
};
