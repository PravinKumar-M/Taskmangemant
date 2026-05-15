// Submission controller - handles student submissions and feedback
const pool = require('../models/db');

// Submit task answer (student)
const submitTask = async (req, res) => {
  try {
    const { task_id, answer } = req.body;
    const student_id = req.user.id;

    // Validation
    if (!task_id || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task_id and answer'
      });
    }

    const connection = await pool.getConnection();

    try {
      // Check if task exists
      const [tasks] = await connection.query(
        'SELECT * FROM tasks WHERE id = ?',
        [task_id]
      );

      if (tasks.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      const task = tasks[0];
      let marks = null;
      let feedback = null;

      // Auto-grade MCQ
      if (task.type === 'mcq') {
        try {
          const correctAnswers = typeof task.correct_answer === 'string' ? JSON.parse(task.correct_answer) : task.correct_answer;
          const studentAnswers = typeof answer === 'string' ? JSON.parse(answer) : answer;
          
          if (Array.isArray(correctAnswers) && Array.isArray(studentAnswers)) {
            let correctCount = 0;
            for (let i = 0; i < correctAnswers.length; i++) {
              if (studentAnswers[i] === correctAnswers[i]) {
                correctCount++;
              }
            }
            marks = Math.round((correctCount / correctAnswers.length) * 100);
            feedback = `You got ${correctCount} out of ${correctAnswers.length} correct. (Auto-graded)`;
          } else {
            // Fallback for old single MCQ format
            if (answer === task.correct_answer) {
              marks = 100;
              feedback = 'Correct answer! (Auto-graded)';
            } else {
              marks = 0;
              feedback = `Incorrect answer. The correct answer was: ${task.correct_answer} (Auto-graded)`;
            }
          }
        } catch (e) {
          // Fallback if JSON parse fails
          if (answer === task.correct_answer) {
            marks = 100;
            feedback = 'Correct answer! (Auto-graded)';
          } else {
            marks = 0;
            feedback = `Incorrect answer. The correct answer was: ${task.correct_answer} (Auto-graded)`;
          }
        }
      }

      // Check if submission already exists
      const [existingSubmissions] = await connection.query(
        'SELECT * FROM submissions WHERE task_id = ? AND student_id = ?',
        [task_id, student_id]
      );

      let result;
      if (existingSubmissions.length > 0) {
        // Update existing submission
        const [updateResult] = await connection.query(
          'UPDATE submissions SET answer = ?, marks = ?, feedback = ?, submitted_at = NOW() WHERE task_id = ? AND student_id = ?',
          [answer, marks, feedback, task_id, student_id]
        );
        result = updateResult;
      } else {
        // Create new submission
        const [insertResult] = await connection.query(
          'INSERT INTO submissions (task_id, student_id, answer, marks, feedback) VALUES (?, ?, ?, ?, ?)',
          [task_id, student_id, answer, marks, feedback]
        );
        result = insertResult;
      }

      connection.release();

      return res.status(201).json({
        success: true,
        message: 'Task submitted successfully'
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Submit task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting task',
      error: error.message
    });
  }
};

// Get all submissions (admin)
const getAllSubmissions = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [submissions] = await connection.query(
        `SELECT s.*, u.name as student_name, u.email as student_email, t.title as task_title
         FROM submissions s
         JOIN users u ON s.student_id = u.id
         JOIN tasks t ON s.task_id = t.id
         ORDER BY s.submitted_at DESC`
      );

      connection.release();

      return res.status(200).json({
        success: true,
        submissions
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Get submissions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching submissions'
    });
  }
};

// Get submissions for a student
const getStudentSubmissions = async (req, res) => {
  try {
    const student_id = req.user.id;

    const connection = await pool.getConnection();

    try {
      const [submissions] = await connection.query(
        `SELECT s.*, t.title as task_title, t.description as task_description
         FROM submissions s
         JOIN tasks t ON s.task_id = t.id
         WHERE s.student_id = ?
         ORDER BY s.submitted_at DESC`,
        [student_id]
      );

      connection.release();

      return res.status(200).json({
        success: true,
        submissions
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Get student submissions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching submissions'
    });
  }
};

// Update submission with marks and feedback (admin)
const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;

    // Validation
    if (marks === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide marks'
      });
    }

    const connection = await pool.getConnection();

    try {
      // Check if submission exists
      const [submissions] = await connection.query(
        'SELECT * FROM submissions WHERE id = ?',
        [id]
      );

      if (submissions.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      // Update submission
      await connection.query(
        'UPDATE submissions SET marks = ?, feedback = ? WHERE id = ?',
        [marks, feedback, id]
      );

      connection.release();

      return res.status(200).json({
        success: true,
        message: 'Submission updated successfully'
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Update submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating submission'
    });
  }
};

module.exports = {
  submitTask,
  getAllSubmissions,
  getStudentSubmissions,
  updateSubmission
};
