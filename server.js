'use strict';

const express = require('express');

const app = express();

const PORT = process.env.PORT || 6660;

app.use(express.static('./public'));

app.get('/', function(request, response) {
  response.sendFile('public/index.html', {root: '.'});
});

app.get('/new', function(request, response) {
  response.sendFile('public/new.html', {root: '.'});
});

// Utilized an arrow function in my app.listen() method
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

app.use(function(request, response, next) {
  console.log('YOU WENT THE WRONG WAY!')
  response.status(404).sendFile('404.html', { root:'./public'})
})
