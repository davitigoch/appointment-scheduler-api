import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  startTime: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2}$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2}$/
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure unique time slots
timeSlotSchema.index({ serviceId: 1, date: 1, startTime: 1 }, { unique: true });

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

export default TimeSlot;