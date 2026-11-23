require('dotenv').config();
const express = require('express');
const sql = require('mssql'); 
const app = express();

app.use(express.json()); 

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: { trustServerCertificate: true },
};

app.get('/', (req, res) => {
  res.send('Welcome to the Book Category API');
});

app.get('/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Biography' }
  ]);
});

app.get('/about', (req, res) => {
  res.send('Hello, I am Danish studying IT at Ngee Ann Polytechnic.');
});


app.get('/publishers', async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const sqlQuery = 'SELECT PublisherID, Name FROM Publisher';
    const request = connection.request();
    const result = await request.query(sqlQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) await connection.close();
  }
});

app.get('/publishers/:id', async (req, res) => {
  const publisherId = parseInt(req.params.id);
  if (isNaN(publisherId)) {
    return res.status(400).json({ error: 'Invalid publisher ID' });
  }

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input('id', publisherId);
    const sqlQuery = `SELECT PublisherID, Name
FROM Publisher
WHERE PublisherID = @id`;
    const result = await request.query(sqlQuery);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) await connection.close();
  }
});

app.post('/publishers', async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input('id', req.body.id);
    request.input('name', req.body.name);
    const sqlQuery = `INSERT INTO Publisher (PublisherID, Name)
OUTPUT INSERTED.*
VALUES (@id, @name)`;
    const result = await request.query(sqlQuery);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) await connection.close();
  }
});


app.put('/publishers/:id', async (req, res) => {
  const publisherId = parseInt(req.params.id);
  if (isNaN(publisherId)) {
    return res.status(400).json({ error: 'Invalid publisher ID' });
  }

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input('id', publisherId);
    request.input('name', req.body.name);
    const sqlQuery = `UPDATE Publisher
SET Name = @name
OUTPUT INSERTED.*
WHERE PublisherID = @id`;
    const result = await request.query(sqlQuery);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) await connection.close();
  }
});


app.delete('/publishers/:id', async (req, res) => {
  const publisherId = parseInt(req.params.id);
  if (isNaN(publisherId)) {
    return res.status(400).json({ error: 'Invalid publisher ID' });
  }

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input('id', publisherId);
    const sqlQuery = `DELETE FROM Publisher
WHERE PublisherID = @id`;
    const result = await request.query(sqlQuery);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});



























