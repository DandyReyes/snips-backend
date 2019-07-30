const fs = require('fs').promises;
const path = require('path');

async function logger(request, response, next) {
  const info = `Method: ${request.method}, Path: ${
    request.path
  }, TimeStamp: ${Date.now()}\n`;
  // * append "method path timestamp" to log.txt
  // ? ex: GET / 232534534535
  // ! Warning: be careful about pathing
  const filePath = path.join(__dirname, `log.txt`);
  try {
    await fs.appendFile(filePath, info);
  } catch (err) {
    console.error(err);
  } finally {
    // next says, move onto the next piece of middleware
    next();
  }
}

module.exports = logger;
