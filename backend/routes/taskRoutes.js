const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  addTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router({ mergeParams: true }); // needed to access :projectId

router.use(requireAuth);

router.post('/', addTask);
router.get('/', getTasks);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
