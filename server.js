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

app.listen(PORT, function() {
  console.log('your app is being served on localhost:6660');
})

app.use(function(request, response, next) {
  console.log('YOU WENT THE WRONG WAY!')
  response.status(404).sendFile('404.html', { root:'./public'})
})
