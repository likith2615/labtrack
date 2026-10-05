/**
 * Request logging middleware for telemetry and API performance monitoring
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const status = res.statusCode;
    const isError = status >= 400;

    console.log(
      `[HTTP] ${req.method.padEnd(6)} ${req.originalUrl} -> ${status} (${elapsed}ms)`
    );
  });

  next();
};

export default requestLogger;
