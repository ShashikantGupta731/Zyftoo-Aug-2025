const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Centralized Admin Service
 * Handles all administrative operations with proper authorization
 */
class AdminService {
  
  /**
   * User Management Operations
   */
  async getAllUsers(filters = {}) {
    console.log('🔄 [AdminService] Fetching all users with filters:', filters);
    
    const query = {};
    if (filters.userType) query.userType = filters.userType;
    if (filters.role) query.role = filters.role;
    if (filters.isEmailVerified !== undefined) query.isEmailVerified = filters.isEmailVerified;
    
    const users = await User.find(query).select('-password');
    
    console.log('✅ [AdminService] Users fetched:', users.length);
    return users;
  }

  async createAdminUser(userData) {
    console.log('🔄 [AdminService] Creating admin user');
    
    // Admin-specific validation
    if (!userData.email || !userData.email.endsWith('@zyftoo.com')) {
      throw new Error('Only @zyftoo.com emails allowed for admin roles');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: userData.email }, { phone: userData.phone }]
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const adminUser = new User({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'admin',
      userType: 'Admin',
      isEmailVerified: true // Admins don't need email verification
    });
    
    await adminUser.save();
    
    console.log('✅ [AdminService] Admin user created:', adminUser.email);
    return adminUser;
  }

  async updateUser(userId, updates) {
    console.log('🔄 [AdminService] Updating user:', userId);
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password; // Use separate password reset flow
    delete updates._id;
    
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    console.log('✅ [AdminService] User updated:', user.email);
    return user;
  }

  async deleteUser(userId) {
    console.log('🔄 [AdminService] Deleting user:', userId);
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    console.log('✅ [AdminService] User deleted:', user.email);
    return { message: 'User deleted successfully' };
  }

  /**
   * Content Management Operations
   */
  async getAllCategories() {
    console.log('🔄 [AdminService] Fetching all categories');
    const categories = await Category.find().populate('subcategories');
    console.log('✅ [AdminService] Categories fetched:', categories.length);
    return categories;
  }

  async createCategory(categoryData) {
    console.log('🔄 [AdminService] Creating category:', categoryData.name);
    
    const category = new Category(categoryData);
    await category.save();
    
    console.log('✅ [AdminService] Category created:', category.name);
    return category;
  }

  async updateCategory(categoryId, updates) {
    console.log('🔄 [AdminService] Updating category:', categoryId);
    
    const category = await Category.findByIdAndUpdate(categoryId, updates, { new: true });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    console.log('✅ [AdminService] Category updated:', category.name);
    return category;
  }

  async deleteCategory(categoryId) {
    console.log('🔄 [AdminService] Deleting category:', categoryId);
    
    const category = await Category.findByIdAndDelete(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    console.log('✅ [AdminService] Category deleted:', category.name);
    return { message: 'Category deleted successfully' };
  }

  /**
   * Product Management Operations
   */
  async getAllProducts(filters = {}) {
    console.log('🔄 [AdminService] Fetching all products with filters:', filters);
    
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    
    const products = await Product.find(query).populate('category');
    
    console.log('✅ [AdminService] Products fetched:', products.length);
    return products;
  }

  async createProduct(productData) {
    console.log('🔄 [AdminService] Creating product:', productData.name);
    
    const product = new Product(productData);
    await product.save();
    
    console.log('✅ [AdminService] Product created:', product.name);
    return product;
  }

  async updateProduct(productId, updates) {
    console.log('🔄 [AdminService] Updating product:', productId);
    
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    console.log('✅ [AdminService] Product updated:', product.name);
    return product;
  }

  async deleteProduct(productId) {
    console.log('🔄 [AdminService] Deleting product:', productId);
    
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    console.log('✅ [AdminService] Product deleted:', product.name);
    return { message: 'Product deleted successfully' };
  }

  /**
   * Order Management Operations
   */
  async getAllOrders(filters = {}) {
    console.log('🔄 [AdminService] Fetching all orders with filters:', filters);
    
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.userId) query.userId = filters.userId;
    
    const orders = await Order.find(query).populate('userId', 'name email phone');
    
    console.log('✅ [AdminService] Orders fetched:', orders.length);
    return orders;
  }

  async updateOrderStatus(orderId, status) {
    console.log('🔄 [AdminService] Updating order status:', orderId, status);
    
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    console.log('✅ [AdminService] Order status updated:', order._id);
    return order;
  }

  /**
   * System Management Operations
   */
  async getDashboardStats() {
    console.log('🔄 [AdminService] Fetching dashboard statistics');
    
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments()
    ]);
    
    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      lastUpdated: new Date()
    };
    
    console.log('✅ [AdminService] Dashboard stats fetched:', stats);
    return stats;
  }

  async getRecentActivities(limit = 10) {
    console.log('🔄 [AdminService] Fetching recent activities');
    
    // Get recent users, orders, and products
    const [recentUsers, recentOrders, recentProducts] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(limit).select('name email createdAt'),
      Order.find().sort({ createdAt: -1 }).limit(limit).populate('userId', 'name'),
      Product.find().sort({ createdAt: -1 }).limit(limit).select('name createdAt')
    ]);
    
    const activities = {
      recentUsers,
      recentOrders,
      recentProducts
    };
    
    console.log('✅ [AdminService] Recent activities fetched');
    return activities;
  }

  /**
   * Permission Check Helper
   */
  async checkAdminPermission(user, requiredPermission) {
    console.log('🔐 [AdminService] Checking admin permission:', requiredPermission);
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (!['admin', 'superadmin'].includes(user.role)) {
      throw new Error('Admin access required');
    }
    
    // SuperAdmin has all permissions
    if (user.role === 'superadmin') {
      console.log('✅ [AdminService] SuperAdmin access granted');
      return true;
    }
    
    // Regular admin permission logic can be extended here
    console.log('✅ [AdminService] Admin permission granted');
    return true;
  }
}

// Export single instance (Singleton pattern)
module.exports = new AdminService();
