import { body } from 'express-validator';

const createTimeSlot = [
  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required')
    .isMongoId()
    .withMessage('Service ID must be a valid MongoDB ObjectId'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Start time must be in HH:mm format'),
  
  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('End time must be in HH:mm format')
    .custom((endTime, { req }) => {
      const startTime = req.body.startTime;
      if (!startTime) return true;

      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      return true;
    })
];

export { createTimeSlot };
