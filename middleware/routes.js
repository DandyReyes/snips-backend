const express = require('express');
// Making a router object
const router = express.Router();
const Snippet = require('../models/Snippet.model');
const snippetsController = require('../controllers/snippets.controller');

// make routes on express
router.get('/', (request, response) => {
  console.log("we're in the router");
  response.send('welcome to snips');
});

/* Snippets routes */
router.post('/api/snippets', snippetsController.createSnippet);
router.get('/api/snippets', snippetsController.getAllSnippets);
router.get('/api/snippets/:id', snippetsController.getSnippetsById);
router.patch('/api/snippets/:id', snippetsController.updateSnippetsFile);
router.delete('/api/snippets/:id', snippetsController.deleteSnippet);

module.exports = router;
