import Service from '../models/service.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';


const createService = catchAsync(async (req, res) => {
  const service = await Service.create(req.body);
  
  res.status(201).json({
    message: 'Service created successfully',
    data: service
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const services = await Service.find({});
  
  res.status(200).json({
    message: 'Services retrieved successfully',
    data: services
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  
  res.status(200).json({
    message: 'Service retrieved successfully',
    data: service
  });
});

const updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  
  res.status(200).json({
    message: 'Service updated successfully',
    data: service
  });
});

const deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }
  
  res.status(204).send();
});

export {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};