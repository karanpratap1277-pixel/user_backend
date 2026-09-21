const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysecretpassword',
  database: 'user_db',
  waitForConnections: true,
  connectionLimit: 10
});


pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error('Error creating table:', err);
  else console.log('MySQL connected and table verified/created.');
});

app.post('/api/users', (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'Name, email, and mobile are required fields.' });
  }

  const query = 'INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)';
  
  pool.query(query, [name, email, mobile], (err, results) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ error: 'Failed to save user data in the database.' });
    }
    
    res.status(201).json({
      message: 'User data stored successfully!',
      userId: results.insertId
    });
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend service running on http://localhost:${PORT}`);
});