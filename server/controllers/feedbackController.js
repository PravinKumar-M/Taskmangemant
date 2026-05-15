const pool = require('../models/db');

// Submit new feedback (student)
const submitFeedback = async (req, res) => {
  try {
    const { reg_no, phone, feedback_text } = req.body;
    const student_id = req.user.id;

    if (!reg_no || !phone || !feedback_text) {
      return res.status(400).json({ success: false, message: 'Please provide roll number, phone, and feedback' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query(
        'INSERT INTO app_feedbacks (student_id, reg_no, phone, feedback_text) VALUES (?, ?, ?, ?)',
        [student_id, reg_no, phone, feedback_text]
      );
      connection.release();
      return res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Submit feedback error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all feedbacks (admin)
const getAllFeedbacks = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [feedbacks] = await connection.query(
        `SELECT f.*, u.name as student_name, u.email as student_email
         FROM app_feedbacks f
         JOIN users u ON f.student_id = u.id
         ORDER BY f.created_at DESC`
      );
      connection.release();
      return res.status(200).json({ success: true, feedbacks });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Get feedbacks error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitFeedback, getAllFeedbacks };
