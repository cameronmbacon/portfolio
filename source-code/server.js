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

app.get('/new', (request, response) => response.sendFile('new.html', {root: '.'}));

// app.use(function(request, response, next) {
//   console.log('YOU WENT THE WRONG WAY!')
//   response.status(404).sendFile('404.html', { root:'./public'})
// });

app.get('/projects', (request, response) => {
  client.query(`
    SELECT * FROM projects
    INNER JOIN urls
      ON projects.projectUrl_id=urls.projectUrl_id;`
  )
  .then(result => response.send(result.rows))
  .catch(console.error)
});

app.post('/projects', (request, response) => {
  client.query(
    'INSERT INTO urls(projectUrl, "projectImageUrl") VALUES($1, $2) ON CONFLICT DO NOTHING',
    [request.body.projectUrl, request.body.projectImageUrl]
  )
  .then(() => {
    client.query(`
      INSERT INTO
      projects(projectUrl_id, title, category, "lastUpdated", body)
      SELECT projectUrl_id, $1, $2, $3, $4
      FROM urls
      WHERE projectUrl=$5;
      `,
      [
        request.body.title,
        request.body.category,
        request.body.lastUpdated,
        request.body.body,
        request.body.projectUrl
      ]
    )
  })
  .then(() => response.send('Insert Complete'))
  .catch(console.error);
});

app.put('/projects/:id', (request, response) => {
  client.query(`
    UPDATE urls
    SET projectUrl=$1, "projectImageUrl"=$2
    WHERE projectUrl_id=$3;
    `,
    [request.body.projectUrl, request.body.projectImageUrl, request.body.projectUrl_id]
  )
  .then(() => {
    client.query(`
      UPDATE projects
      SET projectUrl_id=$1 title=$2, category=$3, "lastUpdated"=$4, body=$5
      WHERE project_id=$6;
      `,
      [
        request.body.projectUrl_id,
        request.body.title,
        request.body.category,
        request.body.lastUpdated,
        request.body.body,
        request.params.id
      ]
    )
  })
  .then(() => response.send('Update complete'))
  .catch(console.error);
});

app.delete('/projects/:id', (request, response) => {
  client.query(`
    DELETE FROM projects WHERE project_id=$1;`,
    [request.params.id]
  )
  .then(() => response.send('Delete complete'))
  .catch(console.error);
});

app.delete('/projects', (request, response) => {
  client.query('DELETE FROM projects')
  .then(() => response.send('Delete complete'))
  .catch(console.error);
});

loadDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

///////////// *** DATABASE LOADERS *** /////////////
function loadUrls() {
  fs.readFile('./public/data/sourceData.json', (err, fd) => {
    JSON.parse(fd.toString()).forEach(ele => {
      client.query(
        'INSERT INTO urls(projectUrl, "projectImageUrl") VALUES($1, $2) ON CONFLICT DO NOTHING',
        [ele.projectUrl, ele.projectImageUrl]
      )
      .catch(console.error);
    })
  })
}

function loadProjects() {
  client.query('SELECT COUNT(*) FROM projects')
  .then(result => {
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/sourceData.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            projects(projectUrl_id, title, category, "lastUpdated", body)
            SELECT projectUrl_id, $1, $2, $3, $4
            FROM urls
            WHERE projectUrl=$5;
            `,
            [ele.title, ele.category, ele.lastUpdated, ele.body, ele.projectUrl]
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
    urls (
      projectUrl_id SERIAL PRIMARY KEY,
      projectUrl VARCHAR(150) UNIQUE NOT NULL,
      "projectImageUrl" VARCHAR(150)
    );`
  )
  .then(loadUrls)
  .catch(console.error);

  client.query(`
    CREATE TABLE IF NOT EXISTS
    projects (
      project_id SERIAL PRIMARY KEY,
      projectUrl_id INTEGER NOT NULL REFERENCES urls(projectUrl_id),
      title VARCHAR(75) NOT NULL,
      category VARCHAR(20),
      "lastUpdated" DATE,
      body TEXT NOT NULL
    );`
  )
  .then(loadProjects)
  .catch(console.error);
}
