const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { Client } = require('pg');
const PORT = process.env.PORT || 8080;

const client = new Client({
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'web_oct14_w5d1'
});
client.connect();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const Project = require('./models/project')(client);
const Task = require('./models/task')(client);

app.get('/projects', (req, res) => {
  Project.list()
    .then(rows => {
      res.render('projects/index', { projects: rows });
    })
    .catch(err => {
      console.error('Got an error', err);
      res.status(500).send(err.message);
    });
});

app.post('/projects', (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(422).send('Invalid form data, please try again');
    return;
  }

  Project.create(name)
    .then(project => {
      res.redirect(`/projects/${project.id}`);
    })
    .catch(err => {
      console.error('Got an error', err);
      res.status(500).send(err.message);
    });
});

app.get('/projects/new', (req, res) => {
  res.render('projects/new');
});

app.get('/projects/:id', (req, res) => {
  Promise.all([
    Project.show(req.params.id),
    Task.listForProject(req.params.id)
  ])
    .then(([project, tasks]) => {
      res.render('projects/show', { project, tasks });
    })
    .catch(err => {
      console.error('Got an error', err);
      res.status(500).send(err.message);
    });
});

app.get('/projects/:id/edit', (req, res) => {
  Project.show(req.params.id)
    .then(project => {
      res.render('projects/edit', { project });
    })
    .catch(err => {
      console.error('Got an error', err);
      res.status(500).send(err.message);
    });
});

app.post('/projects/:id/edit', (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(422).send('Invalid form data, please try again');
    return;
  }

  Project.update(req.params.id, name)
    .then(project => {
      res.redirect(`/projects/${project.id}`);
    })
    .catch(err => {
      console.error('Got an error', err);
      res.status(500).send(err.message);
    });
});

app.get('/projects/:id/delete', (req, res) => {
  Project.remove(req.params.id)
    .then(() => {
      res.redirect('/projects');
    })
    .catch(err => {
      console.error('Got an error', err);
      res.status(500).send(err.message);
    });
});


app.listen(PORT, () => {
  console.log(`Application is listening @ http://localhost:${PORT}`);
});
