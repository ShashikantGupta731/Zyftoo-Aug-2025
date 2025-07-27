const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protected admin routes for user management
router.use(protect, authorizeRoles('admin', 'superadmin'));

// User CRUD API (no OTP/email required)
router.post('/', userController.createUser); // Create user
router.get('/', userController.getUsers); // List users
router.get('/:id', userController.getUserById); // Get user by ID
router.put('/:id', userController.updateUser); // Update user
router.delete('/:id', userController.deleteUser); // Soft delete
router.patch('/:id/status', userController.toggleUserStatus); // Toggle status

// ✅ Export at the end
module.exports = router;
