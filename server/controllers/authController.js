// Authentication controller - handles login and registration
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

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

module.exports = {
  register,
  login
};
