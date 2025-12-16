import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';


const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      throw new ApiError(400, firstError.msg);
    }

    next();
  };
};

export default validate;
