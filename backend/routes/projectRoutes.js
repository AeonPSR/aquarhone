const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

router.use(requireAuth); // All routes require auth

const taskRoutes = require('./taskRoutes');
router.use('/:projectId/tasks', taskRoutes); //THat's forwarded to taskRoutes.js
const collaboratorRoutes = require('./collaboratorRoutes');
router.use('/:id/collaborators', collaboratorRoutes); //fw collaboratorRoutes.js
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
//CRUD: 4 basic operations we can do on data:
//Create
//Read
//Update
//Delete

module.exports = router;
