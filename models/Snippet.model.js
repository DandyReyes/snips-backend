const fs = require('fs').promises;
// Module to create paths
const path = require('path');
const shortid = require('shortid');
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
      throw Error('missing properties');
    }
    // Read snippets.json
    const dbpath = path.join(__dirname, '..', 'db', 'snippets.json');
    const snippets = JSON.parse(await fs.readFile(dbpath));
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
    await fs.writeFile(dbpath, JSON.stringify(snippets));
    return snippets[snippets.length - 1];
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

/* Read */
/**
 * Selects snippets from db.
 * Can accept optional query object to filter results.
 * @param {Object} [query]
 * @returns {Promise<Snippet[]>} array of snippet objects
 * * {author: 'Scott', language: 'javascript'}
 */
exports.select = async (query = {} /** Incase select statement is empty */) => {
  try {
    // 1. Read the file
    const dbpath = path.join(__dirname, '..', 'db', 'snippets.json');
    const snippets = JSON.parse(await fs.readFile(dbpath));
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
    throw err;
  }
};

/* Update */

/* Delete */
