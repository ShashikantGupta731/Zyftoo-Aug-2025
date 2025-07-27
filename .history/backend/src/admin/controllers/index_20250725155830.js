/**
 * Admin Controllers Index
 * 
 * Centralized export for all admin controllers
 */

// Catalog controllers
const CategoryController = require('./catalog/CategoryController');

// Note: Other controllers will be added as they are created
// const ProductController = require('./catalog/ProductController');
// const UserController = require('./users/UserController');
// const AdminController = require('./users/AdminController');
// const AuthController = require('./auth/AuthController');
// const PageController = require('./content/PageController');

module.exports = {
  // Catalog
  CategoryController,
  
  // Placeholders for future controllers
  // ProductController,
  // UserController,
  // AdminController,
  // AuthController,
  // PageController
};
