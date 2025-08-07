const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductMeta,
  getCorporateProducts,
  getProductPricing
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes (specific routes first, then dynamic routes)
router.get('/categories', getCategories);
router.get('/meta', getProductMeta);
router.get('/corporate', getCorporateProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/:id/pricing', protect, getProductPricing);

// Protected admin routes
router.use(protect, authorizeRoles('admin', 'superadmin'));
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
