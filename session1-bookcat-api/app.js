require('dotenv').config();
const express = require('express');
const app = express();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: { trustServerCertificate: true },
}

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

app.listen(3000, () => {
  console.log('Listening on port 3000');
});