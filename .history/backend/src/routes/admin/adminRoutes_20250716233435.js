const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');


// Allow SuperAdmin and Admin to add users without authentication/OTP/validation
const adminUserController = require('../../controllers/adminUserController');
router.post('/users', adminUserController.createAdminUser);

// Protect all other admin routes
router.use(protect, authorizeRoles('admin', 'superadmin', 'SuperAdmin', 'Admin'));

// Example admin-only route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route access granted', user: req.user });
});


// Category admin routes
const categoryController = require('../../controllers/categoryController');
const { uploadCategoryImage } = require('../../utils/fileUpload');
router.post('/categories', uploadCategoryImage.single('image'), categoryController.createCategory);
router.put('/categories/:id', uploadCategoryImage.single('image'), categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Product admin routes
const productController = require('../../controllers/productController');
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// AdminUser routes
router.get('/users', adminUserController.getAdminUsers);
router.get('/users/:id', adminUserController.getAdminUserById);
router.put('/users/:id', adminUserController.updateAdminUser);
router.delete('/users/:id', adminUserController.deleteAdminUser);

module.exports = router;
