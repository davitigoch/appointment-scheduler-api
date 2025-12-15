import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle Mongoose CastError (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  // Handle other known errors
  else if (err.message) {
    message = err.message;
  }

  console.error('Error:', err);

  res.status(statusCode).json({ message });
};

export default errorMiddleware;
