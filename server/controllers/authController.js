// Authentication controller - handles login and registration
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../models/db');

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and password' 
      });
    }

    const connection = await pool.getConnection();

    try {
      // Check if user already exists
      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length > 0) {
        connection.release();
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );

      connection.release();

      return res.status(201).json({ 
        success: true, 
        message: 'User registered successfully',
        userId: result.insertId
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    const connection = await pool.getConnection();

    try {
      // Get user from database
      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        connection.release();
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      const user = users[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        connection.release();
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      connection.release();

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '7d' }
      );

      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Google Sign-In
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google'
      });
    }

    const connection = await pool.getConnection();

    try {
      // Check if user already exists with this email
      const [existingUsers] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      let user;

      if (existingUsers.length > 0) {
        // User exists — update google_id if not set
        user = existingUsers[0];
        if (!user.google_id) {
          await connection.query(
            'UPDATE users SET google_id = ? WHERE id = ?',
            [googleId, user.id]
          );
        }
      } else {
        // New user — create account with Google info
        const randomPassword = await bcrypt.hash(googleId + Date.now(), 10);
        const [result] = await connection.query(
          'INSERT INTO users (name, email, password, role, google_id) VALUES (?, ?, ?, ?, ?)',
          [name, email, randomPassword, 'student', googleId]
        );
        user = {
          id: result.insertId,
          name,
          email,
          role: 'student'
        };
      }

      connection.release();

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Google login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin
};

