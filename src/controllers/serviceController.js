import Service from '../models/Service.js';

// Get all services
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({});
    res.status(200).json({
      message: 'Services retrieved successfully',
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// Get service by ID
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      });
    }
    res.status(200).json({
      message: 'Service retrieved successfully',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Create new service
export const createService = async (req, res, next) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Update service
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      });
    }
    res.status(200).json({
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Delete service
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};