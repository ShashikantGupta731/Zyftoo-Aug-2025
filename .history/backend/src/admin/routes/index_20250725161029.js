/**
 * Admin Routes Index
 * 
 * Main router for all admin routes
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const catalogRoutes = require('./catalog');
const contentRoutes = require('./content');
const userRoutes = require('./users');

// Middleware
const { adminAuth } = require('../middleware');

// ============= PUBLIC ROUTES (NO AUTH) =============
router.use('/auth', authRoutes);

// ============= PROTECTED ROUTES (REQUIRE AUTH) =============
// Apply admin authentication to all routes below
router.use(adminAuth);

// Catalog management (categories, products)
router.use('/catalog', catalogRoutes);

// Content management (pages, media)
router.use('/content', contentRoutes);

// User management
router.use('/users', userRoutes);

// Health check for admin panel
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Admin API is running',
    timestamp: new Date().toISOString(),
    admin: req.admin ? {
      id: req.admin._id,
      username: req.admin.username,
      role: req.admin.role
    } : null
  });
});

module.exports = router;
