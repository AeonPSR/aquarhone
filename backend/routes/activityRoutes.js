const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  getActivityTimeSlots,
} = require('../controllers/activityController');

const router = express.Router();

// Public routes (users can view activities without auth)
router.get('/', getActivities);
router.get('/:id', getActivity);
router.get('/:id/timeslots/:date', getActivityTimeSlots);

// Protected routes (require auth)
router.use(requireAuth);

// Admin only routes (will be checked in controller)
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
