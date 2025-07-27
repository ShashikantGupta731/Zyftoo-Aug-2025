const express = require('express');
const router = express.Router();
const categorySectionController = require('../controllers/categorySectionController');
const authMiddleware = require('../../middleware/authMiddleware');

// Apply authentication middleware to admin routes
router.use('/config', authMiddleware);
router.use('/available-categories', authMiddleware);

// Admin routes for category section management
router.get('/config/:pageId', categorySectionController.getCategorySectionConfig);
router.put('/config/:pageId', categorySectionController.updateCategorySectionConfig);
router.get('/available-categories', categorySectionController.getAvailableCategories);

// Public route for frontend display (no auth required)
router.get('/display/:pageId', categorySectionController.getCategorySectionForDisplay);

module.exports = router;
