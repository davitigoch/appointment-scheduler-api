import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  cancelAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { validate, appointmentSchemas } from '../utils/validation.js';

const router = express.Router();

router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', validate(appointmentSchemas.create), createAppointment);
router.put('/:id/cancel', cancelAppointment);
router.delete('/:id', deleteAppointment);

export default router;