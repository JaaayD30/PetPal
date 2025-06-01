import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import { OAuth2Client } from 'google-auth-library';
import { authenticateToken, generateToken } from './jwtUtils.js';
import dotenv from 'dotenv';
import { sendResetPasswordEmail } from './emailService.js';
import crypto from 'crypto';


dotenv.config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***hidden***' : 'NOT SET');
const { Pool } = pkg;
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Disable COOP and COEP for local testing
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'User',
  password: '123',
  port: 5432,
});

// ==================== AUTH ROUTES ====================

app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, password, address, phone } = req.body;

  if (!fullName || !username || !email || !password || !address || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO "users1" (full_name, username, email, password, address, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fullName, username, email, hashedPassword, address, phone]
    );

    const user = newUser.rows[0];
    const token = generateToken(user);

    res.status(200).json({
      message: 'Signup successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const result = await pool.query('SELECT * FROM "users1" WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Check if email exists (for Google signup)
app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const result = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);
    res.json({ exists: result.rows.length > 0 });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ message: 'Server error during email check' });
  }
});

// Google OAuth login
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body; // Google ID token from client

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    let userResult = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // Using email as username for simplicity; adjust as needed
      userResult = await pool.query(
        'INSERT INTO "users1" (full_name, username, email) VALUES ($1, $2, $3) RETURNING *',
        [name, email, email]
      );
    }

    const user = userResult.rows[0];
    const jwtToken = generateToken(user);

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
});

// Update user details (except email)
app.put('/api/update-user/:id', async (req, res) => {
  const userId = req.params.id;
  const { fullName, username, password, address, phone } = req.body;

  if (!fullName || !username || !password || !address || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `UPDATE "users1"
       SET full_name = $1, username = $2, password = $3, address = $4, phone = $5
       WHERE id = $6 RETURNING *`,
      [fullName, username, hashedPassword, address, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = result.rows[0];

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        username: updatedUser.username,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
      },
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// ==================== PET ROUTES ====================

// Add pet route with auth
app.post('/api/pets', authenticateToken, async (req, res) => {
  const {
    images,
    name,
    breed,
    bloodType,
    age,
    sex,
    address,
    kilos,
    details,
  } = req.body;

  const userId = req.user.id; // get userId from JWT token

  if (!name || !breed || !bloodType || !age || !sex || !address || !kilos || !details) {
    return res.status(400).json({ message: 'Missing required pet fields' });
  }

  try {
    const petResult = await pool.query(
      `INSERT INTO pets (user_id, name, breed, blood_type, age, sex, address, kilos, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, name, breed, bloodType, age, sex, address, kilos, details]
    );

    const pet = petResult.rows[0];

    if (images && images.length > 0) {
      for (const base64Image of images) {
        const base64Data = base64Image.split(',')[1];
        const imgBuffer = Buffer.from(base64Data, 'base64');

        await pool.query(
          'INSERT INTO pet_images (pet_id, image) VALUES ($1, $2)',
          [pet.id, imgBuffer]
        );
      }
    }

    res.status(201).json({ message: 'Pet added successfully', pet });
  } catch (err) {
    console.error('Error adding pet:', err);
    res.status(500).json({ message: 'Failed to add pet' });
  }
});

app.get('/api/pets', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const petsResult = await pool.query('SELECT * FROM pets WHERE user_id = $1', [userId]);
    const pets = petsResult.rows;

    for (const pet of pets) {
      const imagesResult = await pool.query(
        'SELECT encode(image, \'base64\') AS base64image FROM pet_images WHERE pet_id = $1',
        [pet.id]
      );
      pet.images = imagesResult.rows.map(row => `data:image/jpeg;base64,${row.base64image}`);
    }

    res.status(200).json(pets);
  } catch (err) {
    console.error('Error fetching user pets:', err);
    res.status(500).json({ message: 'Failed to fetch user pets' });
  }
});

app.put('/api/pets/:id', authenticateToken, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user.id;
  const {
    name,
    breed,
    bloodType,
    age,
    sex,
    address,
    kilos,
    details,
  } = req.body;

  if (!name || !breed || !bloodType || !age || !sex || !address || !kilos || !details) {
    return res.status(400).json({ message: 'Missing required pet fields' });
  }

  try {
    const petCheck = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [petId, userId]);
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    const updateResult = await pool.query(
      `UPDATE pets SET
        name = $1,
        breed = $2,
        blood_type = $3,
        age = $4,
        sex = $5,
        address = $6,
        kilos = $7,
        details = $8
       WHERE id = $9
       RETURNING *`,
      [name, breed, bloodType, age, sex, address, kilos, details, petId]
    );

    res.status(200).json({ message: 'Pet updated successfully', pet: updateResult.rows[0] });
  } catch (err) {
    console.error('Error updating pet:', err);
    res.status(500).json({ message: 'Failed to update pet' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users1 WHERE email = $1', [email]);

    // Even if not found, return 200 to prevent email enumeration
    if (user.rows.length === 0) {
      return res.status(200).json({ message: 'If your email is registered, a reset link will be sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 180000); // 3minutes

    await pool.query(
      'UPDATE users1 SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [token, expiry, email]
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    try {
      await sendResetPasswordEmail(email, resetLink);
    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
      return res.status(500).json({ message: 'Failed to send email. Please try again.' });
    }

    res.json({ message: 'If your email is registered, a reset link will be sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users1 WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users1 SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2',
      [hashedPassword, token]
    );

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== Start server ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
