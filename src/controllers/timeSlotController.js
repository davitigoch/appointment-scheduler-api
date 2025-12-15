import TimeSlot from '../models/TimeSlot.js';

// Get all time slots
export const getAllTimeSlots = async (req, res, next) => {
  try {
    const { serviceId, date, available } = req.query;
    let filter = {};
    
    if (serviceId) {
      filter.serviceId = serviceId;
    }
    
    if (date) {
      filter.date = date;
    }
    
    if (available === 'true') {
      filter.isBooked = false;
    }
    
    const timeSlots = await TimeSlot.find(filter).populate('serviceId', 'name durationMinutes price');
    res.status(200).json({
      message: 'Time slots retrieved successfully',
      data: timeSlots
    });
  } catch (error) {
    next(error);
  }
};

// Get time slot by ID
export const getTimeSlotById = async (req, res, next) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id).populate('serviceId');
    if (!timeSlot) {
      return res.status(404).json({
        message: 'Time slot not found'
      });
    }
    res.status(200).json({
      message: 'Time slot retrieved successfully',
      data: timeSlot
    });
  } catch (error) {
    next(error);
  }
};

// Create new time slot
export const createTimeSlot = async (req, res, next) => {
  try {
    const timeSlot = new TimeSlot(req.body);
    await timeSlot.save();
    await timeSlot.populate('serviceId', 'name durationMinutes price');
    res.status(201).json({
      message: 'Time slot created successfully',
      data: timeSlot
    });
  } catch (error) {
    next(error);
  }
};

// Delete time slot
export const deleteTimeSlot = async (req, res, next) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({
        message: 'Time slot not found'
      });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};