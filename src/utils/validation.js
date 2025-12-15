import Joi from 'joi';

// Service validation schemas
export const serviceSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(1).max(100),
    description: Joi.string().required().min(1).max(500),
    durationMinutes: Joi.number().integer().required().min(1).max(1440),
    price: Joi.number().required().min(0)
  }),
  
  update: Joi.object({
    name: Joi.string().min(1).max(100),
    description: Joi.string().min(1).max(500),
    durationMinutes: Joi.number().integer().min(1).max(1440),
    price: Joi.number().min(0)
  }).min(1)
};

// TimeSlot validation schemas
export const timeSlotSchemas = {
  create: Joi.object({
    serviceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required()
  })
};

// Appointment validation schemas
export const appointmentSchemas = {
  create: Joi.object({
    serviceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    timeSlotId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    customerName: Joi.string().required().min(1).max(100),
    customerEmail: Joi.string().email().required()
  })
};

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: `Validation error: ${error.details[0].message}`
      });
    }
    next();
  };
};