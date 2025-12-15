import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { validate, serviceSchemas } from '../utils/validation.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', validate(serviceSchemas.create), createService);
router.put('/:id', validate(serviceSchemas.update), updateService);
router.delete('/:id', deleteService);

export default router;