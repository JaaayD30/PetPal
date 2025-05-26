import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import { OAuth2Client } from 'google-auth-library';

const { Pool } = pkg;
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));  // Increase limit to 10 megabytes or more


// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'User',
  password: '123',
  port: 5432,
});

// Disable COOP and COEP for local testing
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// 🔒 Signup route
app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, password, address, phone } = req.body;

  if (!fullName || !username || !email || !password || !address || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already has an account with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO "users1" (full_name, username, email, password, address, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fullName, username, email, hashedPassword, address, phone]
    );

    const user = newUser.rows[0];

    res.status(200).json({
      message: 'Signup successful',
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

// 🔑 Login route
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

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        password: password, // Only for testing purposes
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ Check if email exists (used in Google sign up flow)
app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const result = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);
    const exists = result.rows.length > 0;
    res.json({ exists });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ message: 'Server error during email check' });
  }
});

// ✅ Google OAuth Login route
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    const result = await pool.query('SELECT * FROM "users1" WHERE email = $1', [email]);
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      const newUser = await pool.query(
        'INSERT INTO "users1" (full_name, username, email) VALUES ($1, $2, $3) RETURNING *',
        [name, email, email]
      );
      user = newUser.rows[0];
    }

    res.status(200).json({
      message: 'Google login successful',
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

// ✏️ Update user details (except email)
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

app.post('/api/pets', async (req, res) => {
  const {
    images, // array of base64 strings like "data:image/jpeg;base64,..."
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
    // Insert pet info first
    const petResult = await pool.query(
      `INSERT INTO pets (name, breed, blood_type, age, sex, address, kilos, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, breed, bloodType, age, sex, address, kilos, details]
    );

    const pet = petResult.rows[0];

    // Now insert each image into pet_images table
    if (images && images.length > 0) {
      for (const base64Image of images) {
        // Remove the "data:image/jpeg;base64," part to get raw base64 data
        const base64Data = base64Image.split(',')[1];
        const imgBuffer = Buffer.from(base64Data, 'base64');

        await pool.query(
          `INSERT INTO pet_images (pet_id, image) VALUES ($1, $2)`,
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




// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
