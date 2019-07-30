const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

// if you call next with something in param then it will go to the beggining param
/**
 * Sends appropriate error message and code to client
 * @param {Error} error
 * @param {Request} request
 * @param {Response} response
 * @param {Function} next
 */
const errorHandler = (error, request, response, next) => {
  if (error instanceof ErrorWithHttpStatus)
    response.status(error.status).send(error.message);
  else response.status(404).send('Server Error');
};

module.exports = errorHandler;
