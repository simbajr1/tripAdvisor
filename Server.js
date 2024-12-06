const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Added CORS package
const app = express();
const port = 3000;

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all origins (use your ngrok URL or specific domains if needed)
app.use(cors());

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Your MySQL username (default is 'root' for XAMPP)
  password: '',           // Your MySQL password (default is '' for XAMPP)
  database: 'tripadvisor' // The name of the database
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Serve the sign-up page when visiting the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Change 'index.html' to your actual sign-up page
});

// Sign-up route (no password hashing, directly store password)
app.post('/index.html', (req, res) => {
  const { username, password, cpassword } = req.body;

  // Check if passwords match
  if (password !== cpassword) {
    return res.status(400).send('Passwords do not match');
  }

  // SQL query to check if username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error checking username');
    }
    if (results.length > 0) {
      return res.status(400).send('Username already exists');
    }

    // SQL query to insert the new user into the database (no hashing)
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).send('Error creating user');
      }
      res.status(201).send('User created successfully');
    });
  });
});

// Login route (compare plain-text password directly)
app.post('/me.html', (req, res) => {
  const { username, password } = req.body;

  // Validate incoming data
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // SQL query to find the user by username
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error checking credentials');
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    // Get user details
    const user = results[0];

    // Compare the input password with the stored password
    if (password === user.password) {
      // Successful login
      res.status(200).send('Login successful');
    } else {
      // Incorrect password
      res.status(400).send('Invalid credentials');
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
