const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductMeta
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/meta', getProductMeta);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected admin routes
router.use(protect, authorizeRoles('admin', 'superadmin'));
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
