/**
 * 404 Not Found handler middleware
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    errors: null
  });
};

export default notFound;
