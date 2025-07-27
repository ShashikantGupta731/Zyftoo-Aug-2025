/**
 * Admin Authentication Middleware
 * 
 * Handles authentication for admin routes
 */

const jwt = require('jsonwebtoken');
const AdminUser = require('../../../models/AdminUser');
const { constants } = require('../../config');
const { unauthorizedResponse, forbiddenResponse } = require('../../utils/responseHelpers');

/**
 * Admin Authentication Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const adminAuth = async (req, res, next) => {
  try {
    console.log('🔐 [AdminAuth] Checking admin authentication...');
    
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    if (!token) {
      console.log('❌ [AdminAuth] No token provided');
      return unauthorizedResponse(res, 'Access token required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 [AdminAuth] Token decoded:', { id: decoded.id, role: decoded.role });

    // Check if user exists and is admin
    const adminUser = await AdminUser.findById(decoded.id).select('-password');
    
    if (!adminUser) {
      console.log('❌ [AdminAuth] Admin user not found');
      return unauthorizedResponse(res, 'Invalid token - user not found');
    }

    if (!adminUser.status) {
      console.log('❌ [AdminAuth] Admin user is inactive');
      return forbiddenResponse(res, 'Account is inactive');
    }

    // Check if role is allowed
    if (!constants.AUTH.ALLOWED_ROLES.includes(adminUser.role)) {
      console.log('❌ [AdminAuth] Insufficient role:', adminUser.role);
      return forbiddenResponse(res, 'Insufficient permissions');
    }

    // Add user to request
    req.user = adminUser;
    req.userRole = adminUser.role;
    
    console.log('✅ [AdminAuth] Authentication successful:', {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role
    });
    
    next();

  } catch (error) {
    console.error('❌ [AdminAuth] Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return unauthorizedResponse(res, 'Invalid token');
    }
    
    if (error.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, 'Token expired');
    }
    
    return unauthorizedResponse(res, 'Authentication failed');
  }
};

/**
 * Check if user is super admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const requireSuperAdmin = (req, res, next) => {
  console.log('👑 [AdminAuth] Checking super admin access...');
  
  if (!constants.AUTH.SUPER_ADMIN_ROLES.includes(req.userRole)) {
    console.log('❌ [AdminAuth] Super admin access denied for role:', req.userRole);
    return forbiddenResponse(res, 'Super admin access required');
  }
  
  console.log('✅ [AdminAuth] Super admin access granted');
  next();
};

/**
 * Optional authentication (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const adminUser = await AdminUser.findById(decoded.id).select('-password');
      
      if (adminUser && adminUser.status && constants.AUTH.ALLOWED_ROLES.includes(adminUser.role)) {
        req.user = adminUser;
        req.userRole = adminUser.role;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  adminAuth,
  requireSuperAdmin,
  optionalAuth
};
