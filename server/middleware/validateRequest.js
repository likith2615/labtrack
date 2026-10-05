import { validationResult } from 'express-validator';

/**
 * express-validator request validation middleware wrapper
 * Checks validation results and formats structured 400 Bad Request responses
 */
export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const formattedErrors = result.array().map((err) => ({
      field: err.path || err.param || 'unknown',
      value: err.value !== undefined ? err.value : null,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Request validation failed. Please correct input parameters.',
      errors: formattedErrors
    });
  }

  next();
};

export default validateRequest;
