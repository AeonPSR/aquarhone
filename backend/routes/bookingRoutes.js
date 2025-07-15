const express = require('express');
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getAllBookings, // Admin only
  getActivityBookings, // Admin only
} = require('../controllers/bookingController');

const router = express.Router();

// All booking routes require authentication
router.use(requireAuth);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin routes (will be checked in controller)
router.get('/admin/all', getAllBookings);
router.get('/admin/activity/:activityId', getActivityBookings);

module.exports = router;
