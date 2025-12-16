import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment
} from '../controllers/appointment.controller.js';
import validate from '../middleware/validate.js';
import {
  createAppointment as createAppointmentValidation,
  updateAppointmentStatus as updateAppointmentStatusValidation
} from '../validators/appointment.validator.js';

const router = express.Router();

router
  .route('/')
  .post(validate(createAppointmentValidation), createAppointment)
  .get(getAllAppointments);

router
  .route('/:id')
  .get(getAppointmentById)
  .delete(deleteAppointment);

router
  .route('/:id/status')
  .put(validate(updateAppointmentStatusValidation), updateAppointmentStatus);

export default router;