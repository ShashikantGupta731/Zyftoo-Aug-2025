/**
 * Admin Configuration Constants
 * 
 * Centralized configuration for admin module
 */

module.exports = {
  // Authentication
  AUTH: {
    TOKEN_EXPIRY: '7d',
    REFRESH_TOKEN_EXPIRY: '30d',
    ALLOWED_ROLES: ['admin', 'superadmin', 'SuperAdmin', 'Admin'],
    SUPER_ADMIN_ROLES: ['superadmin', 'SuperAdmin']
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    UPLOAD_PATHS: {
      CATEGORIES: 'uploads/categories',
      PRODUCTS: 'uploads/products',
      USERS: 'uploads/users'
    }
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Cache
  CACHE: {
    CATEGORIES_TTL: 3600, // 1 hour
    PAGES_TTL: 1800, // 30 minutes
    PRODUCTS_TTL: 1800 // 30 minutes
  },

  // Business Rules
  BUSINESS_RULES: {
    CATEGORY: {
      MIN_MAIN_CATEGORIES: 1,
      MAX_MAIN_CATEGORIES: 10,
      MAX_SUBCATEGORIES_PER_CATEGORY: 10,
      MAX_NESTING_LEVEL: 2
    },
    PAGE_CONFIG: {
      MAX_SECTIONS: 20,
      DEFAULT_SECTIONS: ['giftCategories', 'slider', 'services', 'products']
    }
  },

  // Response Messages
  MESSAGES: {
    SUCCESS: {
      CREATED: 'Resource created successfully',
      UPDATED: 'Resource updated successfully',
      DELETED: 'Resource deleted successfully',
      FETCHED: 'Resource fetched successfully'
    },
    ERRORS: {
      NOT_FOUND: 'Resource not found',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Insufficient permissions',
      VALIDATION_FAILED: 'Validation failed',
      INTERNAL_ERROR: 'Internal server error'
    }
  }
};
