// Get the snippet.model.js data
const Snippet = require('./models/Snippet.model');

// Deal with promise from snippet.select
async function testModels() {
  const snippets = await Snippet.select();
  console.log(snippets);
}

testModels();
