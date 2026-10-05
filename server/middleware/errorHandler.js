// Central error-handling middleware for LabTrack Express API

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} was not found on this server.`
    }
  });
};

export const centralErrorHandler = (err, req, res, next) => {
  console.error('[API Server Error]', err);

  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.message || 'An unexpected error occurred processing the request.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMessage,
      details: err.details || null,
      timestamp: new Date().toISOString()
    }
  });
};

export default { notFoundHandler, centralErrorHandler };
