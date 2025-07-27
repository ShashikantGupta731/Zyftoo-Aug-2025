/**
 * Admin Authentication Routes
 * 
 * Routes for admin login, logout, and authentication
 */

const express = require('express');
const router = express.Router();

// Middleware
const { validation } = require('../middleware');

// We'll create this controller later
// const AuthController = require('../../controllers/auth/AuthController');

// ============= AUTHENTICATION ROUTES =============

// Admin login
router.post('/login',
  validation.sanitizeBody(['username', 'password']),
  validation.validateLogin,
  // AuthController.login
  (req, res) => res.json({ message: 'Admin login route - to be implemented' })
);

// Admin logout
router.post('/logout',
  // AuthController.logout
  (req, res) => res.json({ message: 'Admin logout route - to be implemented' })
);

// Refresh token
router.post('/refresh',
  validation.validateRefreshToken,
  // AuthController.refreshToken
  (req, res) => res.json({ message: 'Refresh token route - to be implemented' })
);

// Get current admin info
router.get('/me',
  // AuthController.getCurrentAdmin
  (req, res) => res.json({ message: 'Get current admin route - to be implemented' })
);

// Change password
router.put('/change-password',
  validation.sanitizeBody(['currentPassword', 'newPassword']),
  validation.validatePasswordChange,
  // AuthController.changePassword
  (req, res) => res.json({ message: 'Change password route - to be implemented' })
);

module.exports = router;
