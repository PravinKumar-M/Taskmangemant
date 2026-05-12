// Authentication routes
const express = require('express');
const { register, login, googleLogin } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/google - Google Sign-In
router.post('/google', googleLogin);

module.exports = router;
