/**
 * Admin Content Management Routes
 * 
 * Routes for pages, configurations, and content management
 */

const express = require('express');
const router = express.Router();

// Middleware
const { adminAuth, rolePermissions, validation } = require('../../middleware');

// Controllers
const PageController = require('../../controllers/content/PageController');

// ============= PAGE CONFIGURATION ROUTES =============

// Get page configurations
router.get('/pages', 
  validation.validatePagination,
  PageController.getPages
);

// Get specific page configuration
router.get('/pages/:pageId',
  validation.validatePageId,
  PageController.getPageConfig
);

// Save page configuration
router.post('/pages/:pageId/save-config',
  validation.validatePageId,
  rolePermissions.requirePermission('pages:update'),
  PageController.savePageConfig
);

// Refresh static data for a page
router.post('/pages/:pageId/refresh-static',
  validation.validatePageId,
  rolePermissions.requirePermission('pages:update'),
  PageController.refreshStaticData
);

// ============= CONTENT MANAGEMENT ROUTES =============

// Get media files
router.get('/media', 
  validation.validatePagination,
  // MediaController.getMedia
  (req, res) => res.json({ message: 'Media route - to be implemented' })
);

// Upload media
router.post('/media',
  // Upload middleware will be added later
  rolePermissions.requirePermission('media:create'),
  // MediaController.uploadMedia
  (req, res) => res.json({ message: 'Upload media route - to be implemented' })
);

module.exports = router;
