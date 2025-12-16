import express from 'express';
import {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
} from '../controllers/timeslot.controller.js';
import validate from '../middleware/validate.js';
import { createTimeSlot as createTimeSlotValidation } from '../validators/timeslot.validator.js';

const router = express.Router();

router
  .route('/')
  .post(validate(createTimeSlotValidation), createTimeSlot)
  .get(getAllTimeSlots);

router
  .route('/:id')
  .get(getTimeSlotById)
  .put(validate(createTimeSlotValidation), updateTimeSlot)
  .delete(deleteTimeSlot);

export default router;