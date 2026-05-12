// Task controller - handles task operations
const pool = require('../models/db');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [tasks] = await connection.query(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );

      connection.release();

      return res.status(200).json({
        success: true,
        tasks
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

// Create task (admin only)
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query(
        'INSERT INTO tasks (title, description) VALUES (?, ?)',
        [title, description]
      );

      connection.release();

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        taskId: result.insertId
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
};

// Delete task (admin only)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query(
        'DELETE FROM tasks WHERE id = ?',
        [id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    try {
      const [tasks] = await connection.query(
        'SELECT * FROM tasks WHERE id = ?',
        [id]
      );

      connection.release();

      if (tasks.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      return res.status(200).json({
        success: true,
        task: tasks[0]
      });
    } catch (dbError) {
      connection.release();
      throw dbError;
    }
  } catch (error) {
    console.error('Get task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
  getTaskById
};
