/**
 * Validation Helper Utilities
 * 
 * Common validation functions for admin operations
 */

const { constants } = require('../config');

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate category name
 * @param {string} name - Category name
 * @returns {Object} Validation result
 */
const validateCategoryName = (name) => {
  const errors = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Category name is required');
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.push('Category name must be at least 2 characters long');
    }
    if (trimmedName.length > 100) {
      errors.push('Category name must not exceed 100 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_&]+$/.test(trimmedName)) {
      errors.push('Category name contains invalid characters');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate image file
 * @param {Object} file - Uploaded file
 * @returns {Object} Validation result
 */
const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) {
    return { isValid: true, errors: [] }; // Image is optional
  }
  
  // Check file size
  if (file.size > constants.UPLOAD.MAX_FILE_SIZE) {
    errors.push(`File size must not exceed ${constants.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Check file type
  if (!constants.UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    errors.push(`File type must be one of: ${constants.UPLOAD.ALLOWED_IMAGE_TYPES.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validated parameters
 */
const validatePaginationParams = (params) => {
  const {
    page = constants.PAGINATION.DEFAULT_PAGE,
    limit = constants.PAGINATION.DEFAULT_LIMIT
  } = params;
  
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(
    constants.PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT)
  );
  
  return {
    page: validatedPage,
    limit: validatedLimit
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str.trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^\w\s\-_.,!?@#$%^&*()+=]/g, ''); // Remove special characters except common ones
};

/**
 * Validate bulk operation request
 * @param {Object} requestBody - Request body
 * @returns {Object} Validation result
 */
const validateBulkOperation = (requestBody) => {
  const { operation, categoryIds, data } = requestBody;
  const errors = [];
  
  if (!operation || typeof operation !== 'string') {
    errors.push('Operation is required');
  } else if (!['delete', 'updateStatus', 'updateCategory'].includes(operation)) {
    errors.push('Invalid operation type');
  }
  
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    errors.push('Category IDs array is required and must not be empty');
  } else {
    const invalidIds = categoryIds.filter(id => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      errors.push('Some category IDs are invalid');
    }
  }
  
  if (operation === 'updateStatus' && (!data || typeof data.status !== 'boolean')) {
    errors.push('Status data is required for updateStatus operation');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidObjectId,
  validateCategoryName,
  validateImageFile,
  validatePaginationParams,
  isValidEmail,
  validatePassword,
  sanitizeString,
  validateBulkOperation
};
