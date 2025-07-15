const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const { requireAdmin } = require('../middlewares/adminMiddleware');

const createActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const activity = await Activity.create({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      place: req.body.place,
      availableDates: req.body.availableDates,
      price: req.body.price,
      totalPlaces: req.body.totalPlaces,
      createdBy: req.userId,
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // If availableDates are being updated, check for removed dates
    if (req.body.availableDates) {
      const oldDates = activity.availableDates.map(d => new Date(d.date).toDateString());
      const newDates = req.body.availableDates.map(d => new Date(d.date).toDateString());
      const removedDates = oldDates.filter(date => !newDates.includes(date));

      // Cancel bookings for removed dates
      if (removedDates.length > 0) {
        const cancelledBookings = await Booking.updateMany(
          {
            activity: activity._id,
            status: 'confirmed',
            selectedDate: { 
              $in: removedDates.map(dateStr => new Date(dateStr))
            }
          },
          { status: 'cancelled' }
        );

        console.log(`Cancelled ${cancelledBookings.modifiedCount} bookings for removed dates`);
      }
    }

    // Update fields
    activity.name = req.body.name || activity.name;
    activity.description = req.body.description || activity.description;
    activity.type = req.body.type || activity.type;
    activity.place = req.body.place || activity.place;
    activity.availableDates = req.body.availableDates || activity.availableDates;
    activity.price = req.body.price || activity.price;
    activity.totalPlaces = req.body.totalPlaces || activity.totalPlaces;

    await activity.save();
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Cancel all confirmed bookings for this activity
    const cancelledBookings = await Booking.updateMany(
      { 
        activity: activity._id, 
        status: 'confirmed' 
      },
      { status: 'cancelled' }
    );

    console.log(`Cancelled ${cancelledBookings.modifiedCount} bookings for deleted activity: ${activity.name}`);

    await activity.deleteOne();
    res.json({ 
      message: 'Activity deleted successfully',
      cancelledBookings: cancelledBookings.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActivityTimeSlots = async (req, res) => {
  try {
    const { id, date } = req.params;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const timeSlots = activity.getTimeSlots(date);
    
    // Get existing bookings for this date to calculate remaining places
    const bookings = await Booking.find({
      activity: id,
      selectedDate: new Date(date),
      status: 'confirmed'
    });

    // Calculate remaining places for each time slot
    const slotsWithAvailability = timeSlots.map(slot => {
      const bookedPlaces = bookings
        .filter(booking => booking.timeSlot === slot)
        .reduce((total, booking) => total + booking.numberOfPlaces, 0);
      
      return {
        timeSlot: slot,
        remainingPlaces: activity.totalPlaces - bookedPlaces,
        totalPlaces: activity.totalPlaces
      };
    });

    res.json(slotsWithAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  getActivityTimeSlots,
};
