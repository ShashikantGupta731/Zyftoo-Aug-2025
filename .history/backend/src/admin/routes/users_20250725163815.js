/**
 * Admin User Management Routes
 * 
 * Routes for user and admin management
 */

const express = require('express');
const router = express.Router();

// Middleware
const { adminAuth, rolePermissions, validation } = require('../middleware');

// We'll create these controllers later
// const UserController = require('../../controllers/users/UserController');
// const AdminController = require('../../controllers/users/AdminController');

// ============= USER MANAGEMENT ROUTES =============

// Get users with filtering and pagination
router.get('/users', 
  validation.validatePagination,
  // UserController.getUsers
  (req, res) => res.json({ message: 'Users route - to be implemented' })
);

// Get single user
router.get('/users/:id', 
  validation.validateObjectId('id'),
  rolePermissions.requirePermission('users:read'),
  // UserController.getUser
  (req, res) => res.json({ message: 'Get user route - to be implemented' })
);

// Update user
router.put('/users/:id',
  validation.validateObjectId('id'),
  validation.sanitizeBody(['name', 'email']),
  rolePermissions.requirePermission('users:update'),
  // UserController.updateUser
  (req, res) => res.json({ message: 'Update user route - to be implemented' })
);

// Delete user
router.delete('/users/:id',
  validation.validateObjectId('id'),
  rolePermissions.requirePermission('users:delete'),
  // UserController.deleteUser
  (req, res) => res.json({ message: 'Delete user route - to be implemented' })
);

// ============= ADMIN MANAGEMENT ROUTES =============

// Get admin users
router.get('/admins', 
  validation.validatePagination,
  rolePermissions.requirePermission('admins:read'),
  // AdminController.getAdmins
  (req, res) => res.json({ message: 'Admins route - to be implemented' })
);

// Create admin user
router.post('/admins',
  validation.sanitizeBody(['username', 'email', 'password']),
  rolePermissions.requirePermission('admins:create'),
  // AdminController.createAdmin
  (req, res) => res.json({ message: 'Create admin route - to be implemented' })
);

// Update admin user
router.put('/admins/:id',
  validation.validateObjectId('id'),
  validation.sanitizeBody(['username', 'email']),
  rolePermissions.requirePermission('admins:update'),
  // AdminController.updateAdmin
  (req, res) => res.json({ message: 'Update admin route - to be implemented' })
);

module.exports = router;
