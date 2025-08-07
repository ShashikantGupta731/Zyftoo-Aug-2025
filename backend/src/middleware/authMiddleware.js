// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { decryptData } = require('../utils/cryptoUtil');

const protect = async (req, res, next) => {
  console.log(' PROTECT MIDDLEWARE HIT')
  console.log('🔐 Request path:', req.path)
  console.log('🔐 Authorization header:', req.headers.authorization)
  console.log(' All headers:', req.headers)
  
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log(' Token extracted:', token ? token.substring(0, 20) + '...' : 'null')
      console.log('🔐 JWT_SECRET exists:', !!process.env.JWT_SECRET)
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔐 Token decoded successfully:', decoded)
      
      req.user = await User.findById(decoded.id).select('-password');
      console.log('🔐 User found:', req.user ? req.user._id : 'null')
      console.log('🔐 User role:', req.user ? req.user.role : 'null')
      
      next();
    } else {
      console.log('❌ No Bearer token found')
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.log('❌ Token verification failed:', error.message)
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ✅ Role check
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};

// ✅ FIXED: Admin-only middleware (now checks correct field)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

// ✅ Enhanced role-based middleware with better error handling
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'NO_USER'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
        error: 'INSUFFICIENT_ROLE'
      });
    }
    
    next();
  };
};

// ✅ Unified admin access (admin + superadmin)
const adminAccess = (req, res, next) => {
  if (req.user && ['Admin', 'Superadmin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Admin access required',
      current: req.user?.role || 'none',
      error: 'NOT_ADMIN'
    });
  }
};



const decryptBody = (req, res, next) => {
  if (req.body && req.body.encryptedData) {
    try {
      const decrypted = decryptData(req.body.encryptedData);
      if (!decrypted || typeof decrypted !== 'object') {
        throw new Error('Invalid encrypted data');
      }
      req.body = decrypted;
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid encrypted data' });
    }
  }
  next();
};

module.exports = { protect, authorizeRoles, adminOnly, requireRoles, adminAccess, decryptBody };
