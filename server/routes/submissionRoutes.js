// Submission routes
const express = require('express');
const {
  submitTask,
  getAllSubmissions,
  getStudentSubmissions,
  updateSubmission
} = require('../controllers/submissionController');
const { authMiddleware, adminMiddleware, studentMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/submissions - Submit task (student)
router.post('/', authMiddleware, studentMiddleware, submitTask);

// GET /api/submissions - Get all submissions (admin)
router.get('/admin/all', authMiddleware, adminMiddleware, getAllSubmissions);

// GET /api/submissions/my - Get student's submissions
router.get('/my/submissions', authMiddleware, studentMiddleware, getStudentSubmissions);

// PUT /api/submissions/:id - Update submission with marks/feedback (admin)
router.put('/:id', authMiddleware, adminMiddleware, updateSubmission);

module.exports = router;
