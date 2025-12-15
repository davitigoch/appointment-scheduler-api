import Appointment from '../models/Appointment.js';
import TimeSlot from '../models/TimeSlot.js';

// Get all appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, customerEmail } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (customerEmail) {
      filter.customerEmail = customerEmail;
    }
    
    const appointments = await Appointment.find(filter)
      .populate('serviceId', 'name durationMinutes price')
      .populate('timeSlotId', 'date startTime endTime');
    
    res.status(200).json({
      message: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('serviceId')
      .populate('timeSlotId');
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }
    
    res.status(200).json({
      message: 'Appointment retrieved successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Create new appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { serviceId, timeSlotId, customerName, customerEmail } = req.body;
    
    // Atomic operation to prevent double booking
    const timeSlot = await TimeSlot.findOneAndUpdate(
      { _id: timeSlotId, isBooked: false },
      { isBooked: true },
      { new: true }
    );
    
    if (!timeSlot) {
      return res.status(409).json({
        message: 'Time slot is not available or already booked'
      });
    }
    
    // Create appointment
    const appointment = new Appointment({
      serviceId,
      timeSlotId,
      customerName,
      customerEmail
    });
    
    await appointment.save();
    await appointment.populate('serviceId', 'name durationMinutes price');
    await appointment.populate('timeSlotId', 'date startTime endTime');
    
    res.status(201).json({
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    // If appointment creation fails, rollback time slot booking
    if (req.body.timeSlotId) {
      await TimeSlot.findByIdAndUpdate(
        req.body.timeSlotId,
        { isBooked: false }
      );
    }
    next(error);
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        message: 'Appointment is already cancelled'
      });
    }
    
    // Update appointment status and free up the time slot
    appointment.status = 'cancelled';
    await appointment.save();
    
    await TimeSlot.findByIdAndUpdate(
      appointment.timeSlotId,
      { isBooked: false }
    );
    
    await appointment.populate('serviceId', 'name durationMinutes price');
    await appointment.populate('timeSlotId', 'date startTime endTime');
    
    res.status(200).json({
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Delete appointment
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }
    
    // Free up the time slot if appointment is confirmed
    if (appointment.status === 'confirmed') {
      await TimeSlot.findByIdAndUpdate(
        appointment.timeSlotId,
        { isBooked: false }
      );
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};