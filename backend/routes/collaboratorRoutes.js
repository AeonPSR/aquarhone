const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  addCollaborator,
  removeCollaborator,
} = require('../controllers/collaboratorController');

const router = express.Router({ mergeParams: true }); // mergeParams is CRUCIAL for req.params.id

// All routes require auth
router.use(requireAuth);

// POST /api/projects/:id/collaborators
router.post('/', addCollaborator);

// DELETE /api/projects/:id/collaborators/:userId
router.delete('/:userId', removeCollaborator);

module.exports = router;
