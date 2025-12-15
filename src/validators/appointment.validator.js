import { body } from 'express-validator';

const createAppointment = [
  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required')
    .isMongoId()
    .withMessage('Service ID must be a valid MongoDB ObjectId'),
  
  body('timeSlotId')
    .notEmpty()
    .withMessage('Time slot ID is required')
    .isMongoId()
    .withMessage('Time slot ID must be a valid MongoDB ObjectId'),
  
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name must be between 1 and 100 characters'),
  
  body('customerEmail')
    .notEmpty()
    .withMessage('Customer email is required')
    .trim()
    .isEmail()
    .withMessage('Customer email must be a valid email address')
    .normalizeEmail()
];

const updateAppointmentStatus = [
  body('status')
    .optional()
    .isIn(['booked', 'cancelled', 'completed'])
    .withMessage('Status must be one of: booked, cancelled, completed')
];

export { createAppointment, updateAppointmentStatus };