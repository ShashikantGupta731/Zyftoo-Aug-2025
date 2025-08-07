/**
 * Admin Authentication Routes
 * Separate routing module for admin-specific authentication
 * This is completely isolated from other auth routes
 */

const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/AdminController/adminController');

// Debug middleware for admin routes only
router.use((req, res, next) => {
  console.log('🔥 [ADMIN AUTH ROUTE] Hit:', req.method, req.path);
  console.log('🔥 [ADMIN AUTH ROUTE] Body keys:', req.body ? Object.keys(req.body) : 'No body');
  console.log('🔥 [ADMIN AUTH ROUTE] Content-Type:', req.get('Content-Type'));
  next();
});

// Admin login route - completely separate from regular auth
router.post('/adminlogin', adminLogin);

module.exports = router;
