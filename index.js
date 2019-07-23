// Get the snippet.model.js data
const Snippet = require('./models/Snippet.model');

// Deal with promise from snippet.select
async function testModels() {
  //   const snippets = await Snippet.select();
  //   console.log(snippets);
  try {
    const newSnippet = await Snippet.insert({
      author: 'CJ',
      code: 'code',
      title: 'test.js',
      description: 'this works great',
      language: 'javascript',
    });
    console.log(newSnippet);
  } catch (err) {
    console.log(err);
  }
}

testModels();
