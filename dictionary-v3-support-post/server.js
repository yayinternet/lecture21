const express = require('express');
const bodyParser = require('body-parser');
const fse = require('fs-extra');

const app = express();
const jsonParser = bodyParser.json();

// Load a JSON file containing english words.
const englishDictionary = require('./dictionary.json');

app.use(express.static('public'));

function onLookupWord(req, res) {
  const routeParams = req.params;
  const word = routeParams.word;

  const key = word.toLowerCase();
  const definition = englishDictionary[key];

  res.json({
    word: word,
    definition: definition
  });
}
app.get('/lookup/:word', onLookupWord);

async function onSetWord(req, res) {
  const routeParams = req.params;
  const word = routeParams.word;
  const definition = req.body.definition;
  const key = word.toLowerCase();
  englishDictionary[key] = definition;
  // Write the entry back to the JSON file. 
  await fse.writeJson('./dictionary.json', englishDictionary);
  res.json({ success: true});
}
app.post('/set/:word', jsonParser, onSetWord);

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
