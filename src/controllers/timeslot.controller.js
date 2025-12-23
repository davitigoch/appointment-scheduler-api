import TimeSlot from '../models/timeslot.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';



/**
 * Create a new time slot
 * Handles duplicate time slots using MongoDB unique index 
 */
const createTimeSlot = catchAsync(async (req, res) => {
  try {
    const timeSlot = await TimeSlot.create(req.body);

    res.status(201).json({
      message: 'Time slot created successfully',
      data: timeSlot
    });
  } catch (error) {
    // Duplicate key error 
    if (error.code === 11000) {
      throw new ApiError(
        409,
        'Time slot already exists for this service at the specified date and time'
      );
    }
    throw error;
  }
});

/**
 * Get all time slots
 * Supports optional query filters: serviceId, date, isBooked
 */
const getAllTimeSlots = catchAsync(async (req, res) => {
  const { serviceId, date, isBooked } = req.query;
  const filter = {};

  if (serviceId) filter.serviceId = serviceId;
  if (date) filter.date = date;
  if (isBooked !== undefined) filter.isBooked = isBooked === 'true';

  const timeSlots = await TimeSlot.find(filter).populate(
    'serviceId',
    'name durationMinutes price'
  );

  res.status(200).json({
    message: 'Time slots retrieved successfully',
    data: timeSlots
  });
});

/**
 * Get a single time slot by ID
 */
const getTimeSlotById = catchAsync(async (req, res) => {
  const timeSlot = await TimeSlot.findById(req.params.id).populate('serviceId');

  if (!timeSlot) {
    throw new ApiError(404, 'Time slot not found');
  }

  res.status(200).json({
    message: 'Time slot retrieved successfully',
    data: timeSlot
  });
});

/**
 * Update a time slot
 * Handles duplicate key conflicts (409)
 */
const updateTimeSlot = catchAsync(async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('serviceId', 'name durationMinutes price');

    if (!timeSlot) {
      throw new ApiError(404, 'Time slot not found');
    }

    res.status(200).json({
      message: 'Time slot updated successfully',
      data: timeSlot
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        'Time slot already exists for this service at the specified date and time'
      );
    }
    throw error;
  }
});

/**
 * Delete a time slot
 */
const deleteTimeSlot = catchAsync(async (req, res) => {
  const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);

  if (!timeSlot) {
    throw new ApiError(404, 'Time slot not found');
  }

  res.status(204).send();
});

export {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
};
