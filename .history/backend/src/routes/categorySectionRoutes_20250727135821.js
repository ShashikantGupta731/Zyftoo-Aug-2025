const express = require('express');
const router = express.Router();
const categorySectionController = require('../controllers/AdminController/PageSectionController/categorySectionConfiguration');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// Apply authentication middleware to admin routes
router.use('/config', protect, adminOnly); // Use protect and adminOnly
router.use('/available-categories', protect, adminOnly);

// Admin routes for category section management
router.get('/config/:pageId', categorySectionController.getCategorySectionConfig);
router.put('/config/:pageId', categorySectionController.updateCategorySectionConfig);
router.get('/available-categories', categorySectionController.getAvailableCategories);

// Public route for frontend display (no auth required)
router.get('/display/:pageId', categorySectionController.getCategorySectionForDisplay);

module.exports = router;