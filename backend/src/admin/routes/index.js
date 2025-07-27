/**
 * Admin Routes Index
 * 
 * Main router for all admin routes
 */

const express = require('express');
const router = express.Router();

// Import simple routes for testing
const simpleRoutes = require('./simple');

// Import category section routes
const categorySectionRoutes = require('../../routes/categorySectionRoutes');

// Import route modules (commented out while fixing issues)
// const authRoutes = require('./auth');
// const catalogRoutes = require('./catalog');
// const contentRoutes = require('./content');
// const userRoutes = require('./users');

// Middleware (commented out while fixing issues)
// const { adminAuth } = require('../middleware');

// ============= PUBLIC ROUTES (NO AUTH) =============
// router.use('/auth', authRoutes);

// Simple routes for testing
router.use('/', simpleRoutes);

// Category section management routes
router.use('/category-section', categorySectionRoutes);

// ============= PROTECTED ROUTES (REQUIRE AUTH) =============
// Apply admin authentication to all routes below
// router.use(adminAuth);

// Catalog management (categories, products)
// router.use('/catalog', catalogRoutes);

// Content management (pages, media)
// router.use('/content', contentRoutes);

// User management
// router.use('/users', userRoutes);

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
