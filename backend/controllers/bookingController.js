const Booking = require('../models/Booking');
const Activity = require('../models/Activity');

const createBooking = async (req, res) => {
  try {
    const { activityId, selectedDate, timeSlot, numberOfPlaces } = req.body;

    // Validate activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Check if the selected date is available for this activity
    const isDateAvailable = activity.availableDates.some(availableDate => 
      new Date(availableDate.date).toDateString() === new Date(selectedDate).toDateString()
    );

    if (!isDateAvailable) {
      return res.status(400).json({ error: 'Selected date is not available for this activity' });
    }

    // Check if there are enough places available
    const existingBookings = await Booking.find({
      activity: activityId,
      selectedDate: new Date(selectedDate),
      timeSlot,
      status: 'confirmed'
    });

    const bookedPlaces = existingBookings.reduce((total, booking) => total + booking.numberOfPlaces, 0);
    const remainingPlaces = activity.totalPlaces - bookedPlaces;

    if (numberOfPlaces > remainingPlaces) {
      return res.status(400).json({ 
        error: `Not enough places available. Only ${remainingPlaces} places remaining.` 
      });
    }

    // Calculate total price
    const totalPrice = numberOfPlaces * activity.price;

    // Create booking
    const booking = await Booking.create({
      user: req.userId,
      activity: activityId,
      selectedDate: new Date(selectedDate),
      timeSlot,
      numberOfPlaces,
      totalPrice,
      status: 'confirmed'
    });

    // Populate the booking with activity and user details
    await booking.populate('activity', 'name place price');
    await booking.populate('user', 'name email');

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('activity', 'name place price type')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('activity', 'name place price type description')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await booking.populate('activity', 'name place');
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const bookings = await Booking.find()
      .populate('activity', 'name place price type')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActivityBookings = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { activityId } = req.params;

    const bookings = await Booking.find({ activity: activityId })
      .populate('user', 'name email')
      .sort({ selectedDate: 1, timeSlot: 1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  getActivityBookings,
};
