// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // attach user data to req
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      next();
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, token failed' 
    });
  }
};

/**
 * Enhanced middleware to verify JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
          });
        }

        next();
      } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// ✅ Role check
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Access denied' 
      });
    }
    next();
  };
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin==='admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Admin access only' 
    });
  }
};

/**
 * Middleware to verify admin role
 */
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin' && req.user.isAdmin !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization'
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        console.log('Optional auth failed, continuing without user');
        req.user = null;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = { 
  protect, 
  authorizeRoles, 
  adminOnly,
  authMiddleware,
  adminMiddleware,
  optionalAuth,
  generateToken
};
