/**
 * Admin Catalog Routes
 * 
 * Routes for category and product management
 */

const express = require('express');
const router = express.Router();

// Middleware
const { adminAuth, rolePermissions, validation } = require('../middleware');
const { uploadCategoryImage } = require('../../utils/fileUpload');

// Controllers
const CategoryController = require('../controllers/catalog/CategoryController');

// ============= CATEGORY ROUTES =============

// Get categories with filtering and pagination
router.get('/categories', 
  validation.validatePagination,
  CategoryController.getCategories
);

// Get category hierarchy
router.get('/categories/hierarchy', 
  CategoryController.getCategoryHierarchy
);

// Get single category
router.get('/categories/:id', 
  validation.validateObjectId('id'),
  CategoryController.getCategory
);

// Create category
router.post('/categories',
  uploadCategoryImage.single('image'),
  validation.validateCategory,
  validation.sanitizeBody(['name', 'description']),
  rolePermissions.requirePermission('categories:create'),
  CategoryController.createCategory
);

// Update category
router.put('/categories/:id',
  validation.validateObjectId('id'),
  uploadCategoryImage.single('image'),
  validation.validateCategory,
  validation.sanitizeBody(['name', 'description']),
  rolePermissions.requirePermission('categories:update'),
  CategoryController.updateCategory
);

// Delete category
router.delete('/categories/:id',
  validation.validateObjectId('id'),
  rolePermissions.requirePermission('categories:delete'),
  CategoryController.deleteCategory
);

// Bulk operations on categories
router.post('/categories/bulk',
  validation.validateBulkOperation,
  rolePermissions.checkBulkPermissions,
  CategoryController.bulkOperations
);

// ============= SUBCATEGORY ROUTES =============
// Note: Subcategories are just categories with a parent

// Get subcategories for a specific category
router.get('/categories/:parentId/subcategories',
  validation.validateObjectId('parentId'),
  validation.validatePagination,
  (req, res, next) => {
    req.query.parent = req.params.parentId;
    next();
  },
  CategoryController.getCategories
);

module.exports = router;
