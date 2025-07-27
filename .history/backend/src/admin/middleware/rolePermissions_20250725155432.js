/**
 * Role-based Permissions Middleware
 * 
 * Checks if user has required permissions for specific operations
 */

const { permissions } = require('../../config');
const { forbiddenResponse } = require('../../utils/responseHelpers');

/**
 * Create permission check middleware
 * @param {string} permission - Required permission
 * @returns {Function} Middleware function
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    console.log(`🔒 [Permissions] Checking permission: ${permission} for role: ${req.userRole}`);
    
    if (!permissions.hasPermission(req.userRole, permission)) {
      console.log(`❌ [Permissions] Permission denied: ${permission}`);
      return forbiddenResponse(res, `Permission required: ${permission}`);
    }
    
    console.log(`✅ [Permissions] Permission granted: ${permission}`);
    next();
  };
};

/**
 * Check bulk operation permissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const checkBulkPermissions = (req, res, next) => {
  const { operation } = req.body;
  const module = req.route.path.includes('categories') ? 'categories' : 'products';
  
  console.log(`🔒 [Permissions] Checking bulk permission for ${module}:${operation}`);
  
  if (!permissions.canPerformBulkOperations(req.userRole, module)) {
    console.log(`❌ [Permissions] Bulk operation denied for ${module}`);
    return forbiddenResponse(res, 'Bulk operations not permitted');
  }
  
  console.log(`✅ [Permissions] Bulk operation permitted for ${module}`);
  next();
};

/**
 * Resource ownership check (for user management)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const checkResourceOwnership = (req, res, next) => {
  const resourceUserId = req.params.userId || req.params.id;
  const currentUserId = req.user._id.toString();
  
  console.log(`🔒 [Permissions] Checking resource ownership: ${resourceUserId} vs ${currentUserId}`);
  
  // Super admins can access any resource
  if (permissions.ROLE_PERMISSIONS.superadmin.includes('*') || 
      req.userRole === 'superadmin' || req.userRole === 'SuperAdmin') {
    console.log('✅ [Permissions] Super admin access granted');
    return next();
  }
  
  // Users can only access their own resources
  if (resourceUserId === currentUserId) {
    console.log('✅ [Permissions] Resource ownership verified');
    return next();
  }
  
  console.log('❌ [Permissions] Resource ownership denied');
  return forbiddenResponse(res, 'Access denied - insufficient permissions');
};

/**
 * Dynamic permission check based on route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const dynamicPermissionCheck = (req, res, next) => {
  const method = req.method.toLowerCase();
  const path = req.route.path;
  
  // Map HTTP methods to permission actions
  const actionMap = {
    'get': 'read',
    'post': 'create',
    'put': 'update',
    'patch': 'update',
    'delete': 'delete'
  };
  
  // Determine resource type from path
  let resource = '';
  if (path.includes('categories')) resource = 'categories';
  else if (path.includes('products')) resource = 'products';
  else if (path.includes('users')) resource = 'users';
  else if (path.includes('orders')) resource = 'orders';
  else if (path.includes('pages')) resource = 'content';
  
  if (resource && actionMap[method]) {
    const permission = `${resource}:${actionMap[method]}`;
    return requirePermission(permission)(req, res, next);
  }
  
  // If we can't determine permission, allow access (fallback)
  console.log('⚠️ [Permissions] Could not determine permission, allowing access');
  next();
};

module.exports = {
  requirePermission,
  checkBulkPermissions,
  checkResourceOwnership,
  dynamicPermissionCheck
};
