// Task routes
const express = require('express');
const { getAllTasks, createTask, getTaskById, deleteTask } = require('../controllers/taskController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/tasks - Get all tasks (public)
router.get('/', getAllTasks);

// GET /api/tasks/:id - Get task by ID (public)
router.get('/:id', getTaskById);

// POST /api/tasks - Create task (admin only)
router.post('/', authMiddleware, adminMiddleware, createTask);

// DELETE /api/tasks/:id - Delete task (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteTask);

module.exports = router;
