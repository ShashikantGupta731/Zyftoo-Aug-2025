const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Page configuration routes
router.get('/pages/:pageKey', pageController.getPageConfig);
router.put('/pages/:pageKey', pageController.updatePageConfig);

// Section configuration routes
router.get('/pages/:pageKey/sections/:sectionKey', pageController.getSectionConfig);
router.put('/pages/:pageKey/sections/:sectionKey', pageController.updateSectionConfig);

// Category routes for admin and frontend
router.get('/categories', pageController.getAllCategories);
router.get('/pages/:pageKey/categories', pageController.getCategoriesForDisplay);

module.exports = router;
