'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 6660;
const app = express();

const conString = 'postgres://cameron:1234@localhost:5432/portfolio';

const client = new pg.Client(conString);
client.connect();
client.on('error', function(error) {
  console.error(error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

app.get('/', (request, response) => response.sendFile('index.html', {root: '.'}));

app.get('/new', (request, response) => response.sendFile('public/new.html', {root: '.'}));

// app.use(function(request, response, next) {
//   console.log('YOU WENT THE WRONG WAY!')
//   response.status(404).sendFile('404.html', { root:'./public'})
// });

app.get('/projects', (request, response) => {
  client.query(`
    SELECT * FROM projects;
  `)
  .then(result => response.send(result.rows))
  .catch(console.error)
});

app.post('/projects', (request, response) => {
  client.query(`
    INSERT INTO
    projects(title, category, "lastUpdated", body, projectUrl, projectImageUrl)
    SELECT $1, $2, $3, $4, $4, $5;
  `,
    [
      request.body.title,
      request.body.category,
      request.body.lastUpdated,
      request.body.body
    ]
  )
  .then(() => response.send('Insert Complete'))
  .catch(console.error);
});

app.put('/projects/:id', (request, response) => {
  client.query(`
    UPDATE projects
    SET title=$1, category=$2, lastUpdated=$3, body=$4, projectUrl=$5, projectImageUrl=$6
    WHERE project_id=$7;
  `,
    [
      request.body.title,
      request.body.category,
      request.body.lastUpdated,
      request.body.body,
      request.body.projectUrl,
      request.body.projectImageUrl,
      request.params.id
    ]
  )
  .then(() => response.send('Update complete'))
  .catch(console.error);
});

app.delete('/projects/:id', (request, response) => {
  client.query(`
    DELETE FROM projects WHERE project_id=$1;
    `,
    [request.params.id]
  )
  .then(() => response.send('Delete complete'))
  .catch(console.error);
});

loadDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

///////////// *** DATABASE LOADERS *** /////////////
function loadProjects() {
  client.query(`SELECT COUNT(*) FROM projects;`)
  .then(result => {
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/sourceData.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            projects(title, category, "lastUpdated", body, projectUrl, projectImageUrl)
            SELECT $1, $2, $3, $4, $5, $6;
          `,
            [ele.title, ele.category, ele.lastUpdated, ele.body]
          )
          .catch(console.error);
        })
      })
    }
  })
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    projects (
      project_id SERIAL PRIMARY KEY,
      title VARCHAR(75) NOT NULL,
      category VARCHAR(20),
      "lastUpdated" DATE,
      body TEXT NOT NULL,
      projectUrl text NOT NULL,
      projectImageUrl text NOT NULL
    );`
  )
  .then(loadProjects)
  .catch(console.error);
}
