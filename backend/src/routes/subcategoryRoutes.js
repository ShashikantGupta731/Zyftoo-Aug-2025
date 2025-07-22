const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { uploadCategoryImage } = require('../utils/fileUpload');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Get all subcategories (public)
router.get('/', subcategoryController.getSubcategories);

// Get subcategories by parent category (public)
router.get('/parent/:parentId', subcategoryController.getSubcategoriesByParent);

// Get single subcategory (public)
router.get('/:id', subcategoryController.getSubcategory);

// Protected admin routes
router.use(protect, authorizeRoles('admin', 'superadmin'));

// Create subcategory (with optional image upload)
router.post('/', uploadCategoryImage.single('image'), subcategoryController.createSubcategory);

// Update subcategory (with optional image upload)
router.put('/:id', uploadCategoryImage.single('image'), subcategoryController.updateSubcategory);

// Delete subcategory
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router;
