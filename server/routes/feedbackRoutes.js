const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, submitFeedback);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllFeedbacks);

module.exports = router;
