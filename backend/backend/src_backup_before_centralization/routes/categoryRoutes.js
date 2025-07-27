const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { uploadCategoryImage } = require('../utils/fileUpload');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Get all categories (public)
router.get('/', categoryController.getCategories);

// Get single category (public)
router.get('/:id', categoryController.getCategory);

// Protected admin routes
router.use(protect, authorizeRoles('admin', 'superadmin'));

// Create category (with optional image upload)
router.post('/', uploadCategoryImage.single('image'), categoryController.createCategory);

// Update category (with optional image upload)
router.put('/:id', uploadCategoryImage.single('image'), categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
