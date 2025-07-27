const express = require('express');
const router = express.Router();
const categorySectionController = require('../controllers/AdminController/PageSectionController/categorySectionConfiguration');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin routes for category section management (with authentication)
router.get('/category-section/:pageId', protect, adminOnly, categorySectionController.getCategorySectionConfig);
router.put('/category-section/:pageId', protect, adminOnly, categorySectionController.updateCategorySectionConfig);
router.get('/categories/available', protect, adminOnly, categorySectionController.getAvailableCategories);

// Public route for frontend display (no auth required)
router.get('/category-section/:pageId/display', categorySectionController.getCategorySectionForDisplay);

module.exports = router;