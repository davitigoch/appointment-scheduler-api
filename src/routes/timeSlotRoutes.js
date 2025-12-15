import express from 'express';
import {
  getAllTimeSlots,
  getTimeSlotById,
  createTimeSlot,
  deleteTimeSlot
} from '../controllers/timeSlotController.js';
import { validate, timeSlotSchemas } from '../utils/validation.js';

const router = express.Router();

router.get('/', getAllTimeSlots);
router.get('/:id', getTimeSlotById);
router.post('/', validate(timeSlotSchemas.create), createTimeSlot);
router.delete('/:id', deleteTimeSlot);

export default router;