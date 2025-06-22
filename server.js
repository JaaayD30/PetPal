import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import { OAuth2Client } from 'google-auth-library';
import { authenticateToken, generateToken } from './jwtUtils.js';
import dotenv from 'dotenv';
import { sendResetPasswordEmail } from './emailService.js';
import crypto from 'crypto';
import fetch from 'node-fetch';

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

// Update user details (except email and password)
app.put('/api/update-user/:id', async (req, res) => {
  const userId = req.params.id;
  const { fullName, username, address, phone } = req.body;

  // Validate required fields (no password)
  if (!fullName || !username || !address || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `UPDATE "users1"
       SET full_name = $1, username = $2, address = $3, phone = $4
       WHERE id = $5 RETURNING *`,
      [fullName, username, address, phone, userId]
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

// Get profile picture
app.get('/api/users/profile-picture', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT encode(profile_picture, \'base64\') AS base64image FROM users1 WHERE id = $1',
      [userId]
    );

    if (!result.rows[0].base64image) {
      return res.json({ image: null }); // No image set
    }

    const image = `data:image/jpeg;base64,${result.rows[0].base64image}`;
    res.json({ image });
  } catch (err) {
    console.error('Error fetching profile picture:', err);
    res.status(500).json({ message: 'Failed to fetch profile picture' });
  }
});


// Upload or update profile picture
app.put('/api/users/profile-picture', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'No image provided' });
  }

  try {
    const base64Data = image.split(',')[1];
    const imgBuffer = Buffer.from(base64Data, 'base64');

    await pool.query(
      'UPDATE users1 SET profile_picture = $1 WHERE id = $2',
      [imgBuffer, userId]
    );

    res.json({ message: 'Profile picture updated successfully' });
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ message: 'Failed to update profile picture' });
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
    details
  } = req.body;

  const userId = req.user.id;

  if (!name || !breed || !bloodType || !age || !sex || !address || !kilos || !details) {
    return res.status(400).json({ message: 'Missing required pet fields' });
  }

  try {
    // 🌐 Geocode address using OpenStreetMap
    let lat = null;
    let lon = null;

    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
      headers: {
        'User-Agent': 'PetPalApp/1.0 (resonablejmar@gmail.com)' // ← use any valid email
      }
    });
    
    const geoData = await geoRes.json();

    if (geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
    }
    

    // 🐶 Insert pet into `pets` table
    const insertPetQuery = `
      INSERT INTO pets (user_id, name, breed, blood_type, age, sex, address, kilos, details, lat, lon)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const petResult = await pool.query(insertPetQuery, [
      userId, name, breed, bloodType, age, sex, address, kilos, details, lat, lon
    ]);

    const pet = petResult.rows[0];

    // 🖼️ Store images into `pet_images` table
    if (images && Array.isArray(images)) {
      for (const base64Image of images) {
        const base64Data = base64Image.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        await pool.query(
          'INSERT INTO pet_images (pet_id, image) VALUES ($1, $2)',
          [pet.id, imageBuffer]
        );
      }
    }

    res.status(201).json({ message: 'Pet added successfully', pet });

  } catch (error) {
    console.error('Error saving pet:', error);
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

// Public route: Get all pets from all users with their images
app.get('/api/all-pets', async (req, res) => {
  try {
    const petsResult = await pool.query('SELECT * FROM pets');
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
    console.error('Error fetching all pets:', err);
    res.status(500).json({ message: 'Failed to fetch pets' });
  }
});

app.delete('/api/pets/:id', authenticateToken, async (req, res) => {
  const petId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if the pet belongs to the user
    const petCheck = await pool.query(
      'SELECT * FROM pets WHERE id = $1 AND user_id = $2',
      [petId, userId]
    );

    if (petCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    // Delete related favorites
    await pool.query('DELETE FROM favorites WHERE pet_id = $1', [petId]);

    // Delete pet images
    await pool.query('DELETE FROM pet_images WHERE pet_id = $1', [petId]);

    // Delete the pet
    await pool.query('DELETE FROM pets WHERE id = $1 AND user_id = $2', [petId, userId]);

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ message: 'Failed to delete pet' });
  }
});

// server.js
app.post('/api/connect-request', authenticateToken, async (req, res) => {
  const { petId, recipientId } = req.body;
  const senderId = req.user.id;

  if (recipientId === senderId) {
    return res.status(400).json({ message: 'You cannot send a request to yourself.' });
  }

  try {
    // 🚨 Check if they're already matched
    const matchCheck = await pool.query(`
      SELECT * FROM matches
      WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
    `, [senderId, recipientId]);

    if (matchCheck.rows.length > 0) {
      return res.status(400).json({ message: 'You already connected to this user.' });
    }

    // 🚨 Check for existing connect request
    const existing = await pool.query(
      'SELECT * FROM notifications WHERE sender_id = $1 AND recipient_id = $2 AND type = $3',
      [senderId, recipientId, 'connect']
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You already sent a connection. Please wait for the response.' });
    }

    // ✅ Insert new connect request (message is generic)
    await pool.query(
      'INSERT INTO notifications (sender_id, recipient_id, message, type) VALUES ($1, $2, $3, $4)',
      [senderId, recipientId, 'wants to connect with you', 'connect']
    );

    res.status(200).json({ message: 'Connect request sent!' });
  } catch (error) {
    console.error('Connect request failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/api/notifications', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT n.id, n.sender_id, n.message, n.created_at, n.type,
              u.full_name AS sender_name,
              encode(u.profile_picture, 'base64') AS base64image
       FROM notifications n
       JOIN users1 u ON n.sender_id = u.id
       WHERE n.recipient_id = $1
       ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});


app.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log('Attempting to delete notif ID:', id);
  console.log('Authenticated user:', req.user.id);

  try {
    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 AND recipient_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      console.log('No matching notification or unauthorized');
      return res.status(404).json({ message: 'Notification not found or not authorized' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete single notification error:', err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});



app.delete('/api/notifications', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE recipient_id = $1', [req.user.id]);
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    console.error('Delete all notifications error:', err);
    res.status(500).json({ message: 'Failed to clear notifications' });
  }
});


// ✅ Enhanced Match Details API: includes pet images
// ✅ Enhanced Match Details API: includes pet images and profile image
app.get('/api/match-details/:senderId', authenticateToken, async (req, res) => {
  const { senderId } = req.params;

  try {
    const userResult = await pool.query(
      `SELECT id, full_name, email, address, phone, encode(profile_picture, 'base64') AS base64image
       FROM users1
       WHERE id = $1`,
      [senderId]
    );

    
    

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const petsResult = await pool.query('SELECT * FROM pets WHERE user_id = $1', [senderId]);
    const pets = petsResult.rows;

    for (const pet of pets) {
      const imagesResult = await pool.query(
        "SELECT encode(image, 'base64') AS base64image FROM pet_images WHERE pet_id = $1",
        [pet.id]
      );
      pet.images = imagesResult.rows.map(row => `data:image/jpeg;base64,${row.base64image}`);
    }

    res.json({ owner: userResult.rows[0], pets });
  } catch (err) {
    console.error('Error fetching match details:', err);
    res.status(500).json({ message: 'Failed to fetch match details' });
  }
});

// 2. POST Confirm Match
app.post('/api/confirm-match', authenticateToken, async (req, res) => {
  const { senderId } = req.body;
  const recipientId = req.user.id;

  try {
    // Prevent duplicate matches
    const existing = await pool.query(
      'SELECT * FROM matches WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
      [senderId, recipientId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Match already exists' });
    }

    // Insert mutual match
    await pool.query('INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2)', [senderId, recipientId]);

    // Notify both users
    await pool.query(
      `INSERT INTO notifications (sender_id, recipient_id, message, status)
       VALUES
        ($1, $2, $3, 'pending'),
        ($2, $1, $3, 'pending')`,
      [recipientId, senderId, 'You found a match!']
    );

    res.json({ message: 'Match confirmed and notification sent to both users.' });
  } catch (err) {
    console.error('Error confirming match:', err);
    res.status(500).json({ message: 'Failed to confirm match' });
  }
});

// Optional: Fetch matches for logged-in user
app.get('/api/my-matches', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const matches = await pool.query(
      'SELECT * FROM matches WHERE user1_id = $1 OR user2_id = $1',
      [userId]
    );
    res.json(matches.rows);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
});



app.post('/api/confirm-match', authenticateToken, async (req, res) => {
  const { senderId } = req.body;
  const recipientId = req.user.id;

  // Check if match exists
  const existing = await pool.query(
    'SELECT * FROM matches WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
    [senderId, recipientId]
  );

  if (existing.rows.length > 0) {
    return res.status(400).json({ message: 'Match already exists' });
  }

  // Insert match
  await pool.query('INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2)', [senderId, recipientId]);

  // Notify both users
  await pool.query(
    `INSERT INTO notifications (sender_id, recipient_id, message, status)
     VALUES
      ($1, $2, $3, 'pending'),
      ($2, $1, $3, 'pending')`,
    [recipientId, senderId, 'You found a match!']
  );

  res.json({ message: 'Match confirmed and notification sent to both users.' });
});


// Get detailed matches (profile info of matched users)
app.get('/api/my-matches/details', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.full_name, u.email, u.address, u.phone,
        encode(u.profile_picture, 'base64') AS base64image
      FROM matches m
      JOIN users1 u 
        ON u.id = CASE 
                    WHEN m.user1_id = $1 THEN m.user2_id 
                    ELSE m.user1_id 
                 END
      WHERE m.user1_id = $1 OR m.user2_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching matched users with details:', err);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
});


app.delete('/api/matches/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const matchUserId = parseInt(req.params.id, 10);

  try {
    const result = await pool.query(`
      DELETE FROM matches 
      WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
    `, [userId, matchUserId]);

    res.json({ message: 'Match removed successfully' });
  } catch (err) {
    console.error('Error removing match:', err);
    res.status(500).json({ message: 'Failed to remove match' });
  }
});




// ==================== Start server ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
