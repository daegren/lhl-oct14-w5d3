module.exports = db => {
  const listForProject = projectId =>
    db.query('SELECT * FROM tasks WHERE project_id = $1', [projectId])
      .then(res => res.rows);

  return { listForProject };
};
