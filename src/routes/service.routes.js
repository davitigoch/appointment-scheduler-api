import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service.controller.js';
import validate from '../middleware/validate.js';
import { 
  createService as createServiceValidation, 
  updateService as updateServiceValidation 
} from '../validators/service.validator.js';

const router = express.Router();

router
  .route('/')
  .post(validate(createServiceValidation), createService)
  .get(getAllServices);

router
  .route('/:id')
  .get(getServiceById)
  .put(validate(updateServiceValidation), updateService)
  .delete(deleteService);

export default router;
