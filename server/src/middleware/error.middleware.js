// src/middleware/error.middleware.js

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error caught by middleware:', err);

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = err.details || err.message;
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Database validation error';
    details = err.errors?.map(e => e.message) || err.message;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Resource already exists';
  } else if (err.status) {
    // Custom status from controllers
    status = err.status;
    message = err.message;
  } else if (err.response?.data?.error_code) {
    // Plaid API errors
    status = err.response.status || 500;
    message = 'Banking service error';
    details = {
      plaidError: err.response.data.error_code,
      plaidMessage: err.response.data.error_message
    };
  }

  res.status(status).json({
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString()
  });
};

/**
 * 404 Not Found middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
};