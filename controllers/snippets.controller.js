const Snippet = require('../models/Snippet.model');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

exports.createSnippet = async (request, response) => {
  try {
    // create a snippet
    const snippet = await Snippet.insert(request.body);
    // stringifies and sends as a json for you
    response.status(201).send(snippet);
  } catch (error) {
    if (error instanceof ErrorWithHttpStatus)
      response.status(error.status).send(error.message);
    else response.status(500).send('server error');
  }
};

exports.getAllSnippets = async ({ query }, response, next) => {
  try {
    // 1. get data from Snippets model
    // ? request.query brings back the object you are asking for
    const snippets = await Snippet.select(query);
    // 2. Send out
    // ? just like response.end so make sure code is complete
    response.send(snippets);
  } catch (error) {
    next(error);
  }
};

exports.getSnippetsById = async ({ params: { id } }, response, next) => {
  try {
    // get the data: call Snippet.select passing an id (from request.params)
    const snippet = await Snippet.select({ id });
    if (snippet.length === 0) {
      throw new ErrorWithHttpStatus('ID does not exist', 404); // 404
    }
    // send that snippet back
    response.status(200).send(snippet[0]);
  } catch (error) {
    if (error instanceof ErrorWithHttpStatus)
      response.status(error.status).send(error.message);
    else response.status(404).send('Server Error');
  }
};

exports.updateSnippetsFile = async (
  { params: { id }, body },
  response,
  next
) => {
  try {
    // Update information in snippet id
    await Snippet.update(id, body);
    // Send status
    response.status(200).send(`ID:${id} updated!`);
  } catch (err) {
    response.status(400).send(err.message);
  }
};

exports.deleteSnippet = async ({ params: { id } }, response) => {
  try {
    await Snippet.delete(id);
    response.status(200).send('succesfully deleted');
  } catch (err) {
    response.status(400).send(err.message);
  }
};
