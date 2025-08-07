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
  getProductPricing,
  getCategories
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/meta', getProductMeta);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Corporate routes (require authentication)
router.use('/corporate', protect); // Apply auth to all corporate routes
router.get('/corporate', getCorporateProducts); // Only for corporate users
router.get('/:id/pricing', protect, getProductPricing); // For getting dynamic pricing

// Protected admin routes
router.use(protect, authorizeRoles('admin', 'superadmin'));
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
