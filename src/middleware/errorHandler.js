const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      message: `Validation Error: ${errors.join(', ')}`
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Resource already exists'
    });
  }
  
  // Default server error
  res.status(500).json({
    message: 'Internal server error'
  });
};

export default errorHandler;