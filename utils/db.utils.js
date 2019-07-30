const fs = require('fs').promises;
const path = require('path');

/**
 * Gets absolute path to `resource` db file
 * @param {string} resource
 * @returns {string} file path
 */
const dbpath = resource => path.join(__dirname, '..', 'db', `${resource}.json`);

/**
 * Reads and pases JSON data from DB
 * @param {string} resource - resource to fetch
 * @returns {Promise<Object>} parsed data
 */
exports.readJsonFromDb = async resource =>
  JSON.parse(await fs.readFile(dbpath(resource)));
/**
 * Writes JSON data to DB file
 * @param {string} resource - resource to write to
 * @param {Object} data - data to write to
 * @return {Promise<void>}
 */
exports.writeJsonToDb = (resource, data) =>
  fs.writeFile(dbpath(resource), JSON.stringify(data));
