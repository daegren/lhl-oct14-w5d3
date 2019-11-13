module.exports = (db) => {
  const list = () =>
    db.query('SELECT * FROM projects;')
      .then(res => res.rows);

  const show = id =>
    db.query('SELECT * FROM projects WHERE id = $1 LIMIT 1', [id])
      .then(res => res.rows[0]);

  const create = name =>
    db.query('INSERT INTO projects (name) VALUES ($1) RETURNING *', [name])
      .then(res => res.rows[0]);

  const update = (id, name) =>
    db.query('UPDATE projects SET name = $1 WHERE id = $2 RETURNING *', [name, id])
      .then(res => res.rows[0]);

  const remove = id =>
    db.query('DELETE FROM projects WHERE id = $1', [id]);


  return { list, show, create, update, remove };
};
