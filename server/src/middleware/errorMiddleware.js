// Catches requests to routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error handler - keep this as the last middleware in server.js
export const errorHandler = (err, req, res, next) => {
  // Sometimes an error comes through with a 200 status by mistake - fix that
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
