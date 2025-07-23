const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Enhanced category routes for dynamic display
router.get('/pages/home/categories', pageController.getHomePageCategories);
router.get('/pages/:pageId/categories', pageController.getPageCategories);
router.get('/categories/fallback', pageController.getAllCategoriesAsFallback);

// Backward compatibility routes
router.get('/api/pages/home/categories', pageController.getHomePageCategories);

// Page refresh routes
router.get('/pages/:pageId/refresh/:sectionType', pageController.refreshPageSection);

// Page configuration routes
router.get('/pages/:pageKey', pageController.getPageConfig);
router.put('/pages/:pageKey', protect, authorizeRoles('admin'), pageController.updatePageConfig);

// Section configuration routes
router.get('/pages/:pageKey/sections/:sectionKey', pageController.getSectionConfig);
router.put('/pages/:pageKey/sections/:sectionKey', protect, authorizeRoles('admin'), pageController.updateSectionConfig);

// Category section specific routes (for PagesManagement admin)
router.put('/pages/home/sections/category', protect, authorizeRoles('admin'), pageController.updateSectionConfig);

module.exports = router;
