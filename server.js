import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import { OAuth2Client } from 'google-auth-library';

const { Pool } = pkg;
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use environment variable for client ID
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend to communicate with backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'User',
  password: '123',
  port: 5432,
});

// Add middleware to disable COOP and COEP headers for local testing
app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO "users1" (full_name, username, email, password) VALUES ($1, $2, $3, $4)',
      [fullName, username, email, hashedPassword]
    );

    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login endpoint using username
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM "users1" WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth Login endpoint
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Use environment variable for client ID
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    const result = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } else {
      await pool.query(
        'INSERT INTO "users1" (full_name, username, email) VALUES ($1, $2, $3)',
        [name, email, email]
      );
      res.status(200).json({ message: 'User created successfully', user: { full_name: name, email } });
    }
  } catch (err) {
    console.error('Error during Google login:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
