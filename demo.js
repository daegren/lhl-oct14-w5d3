const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'web_oct14_w5d1'
});
client.connect();

client.query('SELECT tasks.id as task_id, title, completed, projects.id as project_id, NOW() as time FROM projects JOIN tasks ON tasks.project_id = projects.id WHERE projects.id = 1')
  .then(res => {
    console.log('Got a response from the DB!\n');

    console.log(res.rows);
  }).catch(err => {
    console.error('Got an error', err);
  }).finally(() => {
    client.end();
  });
