// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();


// ==========================
// CORS CONFIGURATION
// ==========================
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());


// ==========================
// BODY PARSER
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================
// API ROUTES
// ==========================
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);


// ==========================
// HEALTH CHECK
// ==========================
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});


// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


// ==========================
// ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});


// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`=================================`);
});