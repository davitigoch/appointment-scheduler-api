import Appointment from '../models/appointment.model.js';
import TimeSlot from '../models/timeslot.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

const createAppointment = catchAsync(async (req, res) => {
  const { serviceId, timeSlotId, customerName, customerEmail } = req.body;

  // Atomically update TimeSlot to prevent double booking
  const timeSlot = await TimeSlot.findOneAndUpdate(
    { _id: timeSlotId, isBooked: false },
    { isBooked: true },
    { new: true }
  );

  if (!timeSlot) {
    throw new ApiError(409, 'Time slot is already booked or not found');
  }

  // Validate serviceId matches the TimeSlot's serviceId
  if (timeSlot.serviceId.toString() !== serviceId) {
    // Roll back the booking
    await TimeSlot.findByIdAndUpdate(timeSlotId, { isBooked: false });
    throw new ApiError(400, 'serviceId does not match this time slot');
  }

  // Create appointment
  const appointment = await Appointment.create({
    serviceId,
    timeSlotId,
    customerName,
    customerEmail
  });

  // Populate appointment data
  await appointment.populate('serviceId');
  await appointment.populate('timeSlotId');

  res.status(201).json({
    message: 'Appointment created successfully',
    data: appointment
  });
});

const getAllAppointments = catchAsync(async (req, res) => {
  const { serviceId, status } = req.query;
  const filter = {};

  if (serviceId) {
    filter.serviceId = serviceId;
  }

  if (status) {
    filter.status = status;
  }

  const appointments = await Appointment.find(filter)
    .populate('serviceId')
    .populate('timeSlotId');

  res.status(200).json({
    message: 'Appointments retrieved successfully',
    data: appointments
  });
});

const getAppointmentById = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('serviceId')
    .populate('timeSlotId');

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  res.status(200).json({
    message: 'Appointment retrieved successfully',
    data: appointment
  });
});

const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  // If cancelling appointment, free the timeslot
  if (status === 'cancelled' && appointment.status !== 'cancelled') {
    await TimeSlot.findByIdAndUpdate(appointment.timeSlotId, { isBooked: false });
  }

  // Update appointment status
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('serviceId').populate('timeSlotId');

  res.status(200).json({
    message: 'Appointment status updated successfully',
    data: updatedAppointment
  });
});

const deleteAppointment = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  // Free the timeslot
  await TimeSlot.findByIdAndUpdate(appointment.timeSlotId, { isBooked: false });

  // Delete appointment
  await Appointment.findByIdAndDelete(req.params.id);

  res.status(204).send();
});

export {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment
};