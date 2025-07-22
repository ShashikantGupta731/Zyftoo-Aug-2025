const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/pages/home/categories', pageController.getHomePageCategories);
router.get('/pages/:pageId/refresh/:sectionType', pageController.refreshPageSection);

// Page configuration routes
router.get('/pages/:pageKey', pageController.getPageConfig);
router.put('/pages/:pageKey', authenticate, authorize(['admin']), pageController.updatePageConfig);

// Section configuration routes
router.get('/pages/:pageKey/sections/:sectionKey', pageController.getSectionConfig);
router.put('/pages/:pageKey/sections/:sectionKey', authenticate, authorize(['admin']), pageController.updateSectionConfig);

// Category section specific routes
router.put('/pages/home/sections/category', authenticate, authorize(['admin']), pageController.updateCategorySection);

// Category routes for admin and frontend
router.get('/admin/categories', pageController.getAllCategories);
router.get('/pages/:pageKey/categories', pageController.getCategoriesForDisplay);

module.exports = router;
