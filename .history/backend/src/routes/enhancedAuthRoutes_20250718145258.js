const express = require('express');
const router = express.Router();

// Import controllers
const {
  signupUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile
} = require('../controllers/enhancedAuthController');

// Import legacy controller for backward compatibility
const {
  checkUser
} = require('../controllers/authController');

// Import middleware
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { requireEncryption, optionalEncryption } = require('../middleware/cryptoMiddleware');
const { validate, authSchemas } = require('../utils/validation');

// ✅ ENHANCED ROUTES WITH ENCRYPTION, VALIDATION & RATE LIMITING

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user (encrypted)
 * @access  Public
 */
router.post('/register', 
  authLimiter,
  requireEncryption,
  validate(authSchemas.register),
  signupUser
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user (encrypted)
 * @access  Public
 */
router.post('/login', 
  authLimiter,
  requireEncryption,
  validate(authSchemas.login),
  loginUser
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset (encrypted)
 * @access  Public
 */
router.post('/forgot-password', 
  passwordResetLimiter,
  requireEncryption,
  validate(authSchemas.forgotPassword),
  forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password with token (encrypted)
 * @access  Public
 */
router.post('/reset-password/:token', 
  passwordResetLimiter,
  requireEncryption,
  validate(authSchemas.resetPassword),
  resetPassword
);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get user profile (encrypted response)
 * @access  Private
 */
router.get('/profile', authMiddleware, getUserProfile);

/**
 * @route   GET /api/v1/auth/check-user/:phone
 * @desc    Check if user exists (legacy support)
 * @access  Public
 */
router.get('/check-user/:phone', checkUser);

// ✅ BACKWARD COMPATIBILITY ROUTES (legacy endpoints)

/**
 * Legacy routes for existing frontend compatibility
 * These can handle both encrypted and non-encrypted requests
 */

router.post('/signup', 
  authLimiter,
  optionalEncryption,
  signupUser
);

router.post('/login', 
  authLimiter,
  optionalEncryption,
  loginUser
);

router.post('/reset-password', 
  passwordResetLimiter,
  optionalEncryption,
  resetPassword
);

router.get('/verify-email/:token', verifyEmail);

// ✅ ADDITIONAL UTILITY ROUTES

/**
 * @route   GET /api/v1/auth/verify-token
 * @desc    Verify if JWT token is valid
 * @access  Private
 */
router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh-token', authMiddleware, (req, res) => {
  const { generateToken } = require('../middleware/authMiddleware');
  const newToken = generateToken(req.user._id);
  
  res.json({
    success: true,
    message: 'Token refreshed successfully',
    token: newToken
  });
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
