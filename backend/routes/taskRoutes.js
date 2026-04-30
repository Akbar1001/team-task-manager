const express = require('express');
const router = express.Router();
const {
  getProjectTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getDashboardOverview,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Task routes
router.get('/project/:projectId', getProjectTasks);
router.get('/dashboard/overview', getDashboardOverview);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Comment routes
router.post('/:id/comments', addComment);

module.exports = router;
