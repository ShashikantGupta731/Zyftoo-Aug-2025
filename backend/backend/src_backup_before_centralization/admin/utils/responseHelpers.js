/**
 * Response Helper Utilities
 * 
 * Standardized response formats for admin API
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} details - Additional error details
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details,
      statusCode
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {string|Array} errors - Validation errors
 */
const validationErrorResponse = (res, errors) => {
  const errorMessage = Array.isArray(errors) ? errors : [errors];
  
  return res.status(422).json({
    success: false,
    error: {
      message: 'Validation failed',
      details: errorMessage,
      statusCode: 422
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    error: {
      message: `${resource} not found`,
      statusCode: 404
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message
 */
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    error: {
      message,
      statusCode: 401
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message
 */
const forbiddenResponse = (res, message = 'Insufficient permissions') => {
  return res.status(403).json({
    success: false,
    error: {
      message,
      statusCode: 403
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Object} data - Paginated data with pagination info
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, message = 'Data fetched successfully') => {
  return res.status(200).json({
    success: true,
    message,
    data: data.data,
    pagination: data.pagination,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  paginatedResponse
};
