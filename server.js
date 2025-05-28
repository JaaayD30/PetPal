import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import { OAuth2Client } from 'google-auth-library';
import { authenticateToken, generateToken } from './jwtUtils.js';
import dotenv from 'dotenv';
dotenv.config();






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
      token,  // send token to client
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
  
    const token = generateToken(user); // <-- Add this line here
  
    res.status(200).json({
      message: 'Login successful',
      token,  // <-- Send the generated token
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
      userResult = await pool.query(
        'INSERT INTO "users1" (full_name, username, email) VALUES ($1, $2, $3) RETURNING *',
        [name, email, email]
      );
    }

    const user = userResult.rows[0];
    const jwtToken = generateToken(user); // ✅ Renamed to avoid collision

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken, // ✅ Make sure you actually return the JWT token here
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

  // Basic validation (optional, can be more strict)
  if (!name || !breed || !bloodType || !age || !sex || !address || !kilos || !details) {
    return res.status(400).json({ message: 'Missing required pet fields' });
  }

  try {
    // Check if pet belongs to this user first
    const petCheck = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [petId, userId]);
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    // Update pet info
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

app.delete('/api/pets/:id', authenticateToken, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if pet belongs to this user first
    const petCheck = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [petId, userId]);
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    // Delete pet images first (if you want to clean up)
    await pool.query('DELETE FROM pet_images WHERE pet_id = $1', [petId]);

    // Delete pet record
    await pool.query('DELETE FROM pets WHERE id = $1', [petId]);

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ message: 'Failed to delete pet' });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

