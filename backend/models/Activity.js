const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true, // Free text field as requested
  },
  place: {
    type: String,
    required: true,
    trim: true,
  },
  availableDates: [{
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // Format: "09:00"
    },
    endTime: {
      type: String,
      required: true, // Format: "17:00"
    },
  }],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPlaces: {
    type: Number,
    required: true,
    min: 1,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Method to get available time slots for a specific date
activitySchema.methods.getTimeSlots = function(date) {
  const availableDate = this.availableDates.find(d => 
    d.date.toDateString() === new Date(date).toDateString()
  );
  
  if (!availableDate) return [];
  
  const slots = [];
  const start = parseInt(availableDate.startTime.split(':')[0]);
  const end = parseInt(availableDate.endTime.split(':')[0]);
  
  for (let hour = start; hour < end; hour++) {
    const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push(timeSlot);
  }
  
  return slots;
};

module.exports = mongoose.model('Activity', activitySchema);
