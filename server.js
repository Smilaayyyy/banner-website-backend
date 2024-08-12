const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 10000
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Endpoint to get the current banner content
app.get('/api/banner', (req, res) => {
  db.query('SELECT * FROM banner WHERE id = 1', (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: 'Banner not found' });
      return;
    }
    res.json(result[0]);
  });
});

// Endpoint to update the banner content
app.post('/api/banner', (req, res) => {
  const { description, timer, link, isVisible } = req.body;
  db.query(
    'UPDATE banner SET description = ?, timer = ?, link = ?, isVisible = ? WHERE id = 1',
    [description, timer, link, isVisible],
    (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Database update failed' });
        return;
      }
      res.json({ description, timer, link, isVisible });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
