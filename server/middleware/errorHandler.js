/**
 * Central Error Handler Middleware
 * Returns consistent JSON: { success: false, message: string, errors: array | null }
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    path: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || (err.status && !isNaN(err.status) ? Number(err.status) : 500);
  const message = err.message || 'An unexpected internal server error occurred.';
  const errors = err.errors || null;

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

export default errorHandler;
