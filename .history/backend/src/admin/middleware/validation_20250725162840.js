/**
 * Validation Middleware
 * 
 * Request validation middleware for admin operations
 */

const { validationHelpers } = require('../utils');
const { ApiResponse } = require('../utils');

/**
 * Validate category creation/update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validateCategory = (req, res, next) => {
  console.log('🔍 [Validation] Validating category data...');
  
  const errors = [];
  
  // Validate name
  const nameValidation = validationHelpers.validateCategoryName(req.body.name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  // Validate parent ID if provided
  if (req.body.parent && !validationHelpers.isValidObjectId(req.body.parent)) {
    errors.push('Invalid parent category ID');
  }
  
  // Validate image file if uploaded
  if (req.file) {
    const imageValidation = validationHelpers.validateImageFile(req.file);
    if (!imageValidation.isValid) {
      errors.push(...imageValidation.errors);
    }
  }
  
  if (errors.length > 0) {
    console.log('❌ [Validation] Category validation failed:', errors);
    return validationErrorResponse(res, errors);
  }
  
  console.log('✅ [Validation] Category validation passed');
  next();
};

/**
 * Validate MongoDB ObjectId parameter
 * @param {string} paramName - Parameter name to validate
 * @returns {Function} Middleware function
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    console.log(`🔍 [Validation] Validating ObjectId parameter: ${paramName}`);
    
    const id = req.params[paramName];
    
    if (!validationHelpers.isValidObjectId(id)) {
      console.log(`❌ [Validation] Invalid ObjectId: ${id}`);
      return validationErrorResponse(res, `Invalid ${paramName} format`);
    }
    
    console.log(`✅ [Validation] ObjectId validation passed: ${id}`);
    next();
  };
};

/**
 * Validate pagination parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validatePagination = (req, res, next) => {
  console.log('🔍 [Validation] Validating pagination parameters...');
  
  const validated = validationHelpers.validatePaginationParams(req.query);
  
  // Replace query parameters with validated values
  req.query.page = validated.page;
  req.query.limit = validated.limit;
  
  console.log('✅ [Validation] Pagination validation passed:', validated);
  next();
};

/**
 * Validate bulk operation request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validateBulkOperation = (req, res, next) => {
  console.log('🔍 [Validation] Validating bulk operation...');
  
  const validation = validationHelpers.validateBulkOperation(req.body);
  
  if (!validation.isValid) {
    console.log('❌ [Validation] Bulk operation validation failed:', validation.errors);
    return validationErrorResponse(res, validation.errors);
  }
  
  console.log('✅ [Validation] Bulk operation validation passed');
  next();
};

/**
 * Validate admin user creation/update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validateAdminUser = (req, res, next) => {
  console.log('🔍 [Validation] Validating admin user data...');
  
  const errors = [];
  const { email, password, name, role } = req.body;
  
  // Validate email
  if (!email || !validationHelpers.isValidEmail(email)) {
    errors.push('Valid email is required');
  }
  
  // Validate password (only for creation or when password is being updated)
  if (req.method === 'POST' || password) {
    const passwordValidation = validationHelpers.validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }
  
  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  // Validate role
  const allowedRoles = ['admin', 'superadmin', 'manager', 'editor'];
  if (!role || !allowedRoles.includes(role)) {
    errors.push(`Role must be one of: ${allowedRoles.join(', ')}`);
  }
  
  if (errors.length > 0) {
    console.log('❌ [Validation] Admin user validation failed:', errors);
    return validationErrorResponse(res, errors);
  }
  
  console.log('✅ [Validation] Admin user validation passed');
  next();
};

/**
 * Sanitize request body
 * @param {Array} fields - Fields to sanitize
 * @returns {Function} Middleware function
 */
const sanitizeBody = (fields = []) => {
  return (req, res, next) => {
    console.log('🧹 [Validation] Sanitizing request body...');
    
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = validationHelpers.sanitizeString(req.body[field]);
      }
    });
    
    console.log('✅ [Validation] Request body sanitized');
    next();
  };
};

/**
 * Validate page ID parameter
 */
const validatePageId = (req, res, next) => {
  const { pageId } = req.params;
  
  if (!pageId) {
    return validationErrorResponse(res, [{ field: 'pageId', message: 'Page ID is required' }]);
  }
  
  // Check if pageId is a valid string (not just any string)
  const validPageIds = ['home', 'shop', 'about', 'contact', 'corporate'];
  if (!validPageIds.includes(pageId)) {
    return validationErrorResponse(res, [{ field: 'pageId', message: 'Invalid page ID' }]);
  }
  
  console.log('✅ [Validation] Page ID validation passed:', pageId);
  next();
};

/**
 * Validate login credentials
 */
const validateLogin = (req, res, next) => {
  console.log('🔍 [Validation] Validating login credentials...');
  
  const errors = [];
  const { username, password } = req.body;
  
  if (!username || username.trim().length < 3) {
    errors.push({ field: 'username', message: 'Username must be at least 3 characters long' });
  }
  
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }
  
  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }
  
  console.log('✅ [Validation] Login validation passed');
  next();
};

/**
 * Validate password change
 */
const validatePasswordChange = (req, res, next) => {
  console.log('🔍 [Validation] Validating password change...');
  
  const errors = [];
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }
  
  if (!newPassword || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }
  
  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }
  
  console.log('✅ [Validation] Password change validation passed');
  next();
};

/**
 * Validate refresh token
 */
const validateRefreshToken = (req, res, next) => {
  console.log('🔍 [Validation] Validating refresh token...');
  
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return validationErrorResponse(res, [{ field: 'refreshToken', message: 'Refresh token is required' }]);
  }
  
  console.log('✅ [Validation] Refresh token validation passed');
  next();
};

module.exports = {
  validateCategory,
  validateObjectId,
  validatePagination,
  validateBulkOperation,
  validateAdminUser,
  validatePageId,
  validateLogin,
  validatePasswordChange,
  validateRefreshToken,
  sanitizeBody
};
