// bring in the module for express
const express = require('express');
// create express constructor
const app = express();
// Bring in the routes js file
const router = require('./middleware/routes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Lets you use the routes in file
/* Middleware */
app.use(express.json()); // parses requests with JSON payloads
app.use(logger);
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log('Snips Server running on port 5000');
});
