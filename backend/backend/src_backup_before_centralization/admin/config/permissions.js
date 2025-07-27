/**
 * Role-based Permissions Configuration
 * 
 * Defines what actions each role can perform
 */

const PERMISSIONS = {
  // Category Management
  CATEGORIES: {
    CREATE: 'categories:create',
    READ: 'categories:read',
    UPDATE: 'categories:update',
    DELETE: 'categories:delete',
    BULK_OPERATIONS: 'categories:bulk'
  },

  // Product Management
  PRODUCTS: {
    CREATE: 'products:create',
    READ: 'products:read',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
    BULK_OPERATIONS: 'products:bulk'
  },

  // User Management
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    MANAGE_ROLES: 'users:manage_roles'
  },

  // Order Management
  ORDERS: {
    READ: 'orders:read',
    UPDATE: 'orders:update',
    DELETE: 'orders:delete',
    EXPORT: 'orders:export'
  },

  // Content Management
  CONTENT: {
    PAGES: 'content:pages',
    STATIC_FILES: 'content:static_files',
    CONFIGURATIONS: 'content:configurations'
  },

  // System Administration
  SYSTEM: {
    SETTINGS: 'system:settings',
    LOGS: 'system:logs',
    BACKUPS: 'system:backups',
    MAINTENANCE: 'system:maintenance'
  }
};

const ROLE_PERMISSIONS = {
  // Super Admin - Full access
  superadmin: Object.values(PERMISSIONS).flatMap(module => Object.values(module)),
  SuperAdmin: Object.values(PERMISSIONS).flatMap(module => Object.values(module)),

  // Admin - Most permissions except critical system operations
  admin: [
    ...Object.values(PERMISSIONS.CATEGORIES),
    ...Object.values(PERMISSIONS.PRODUCTS),
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.UPDATE,
    ...Object.values(PERMISSIONS.ORDERS),
    ...Object.values(PERMISSIONS.CONTENT)
  ],
  Admin: [
    ...Object.values(PERMISSIONS.CATEGORIES),
    ...Object.values(PERMISSIONS.PRODUCTS),
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.UPDATE,
    ...Object.values(PERMISSIONS.ORDERS),
    ...Object.values(PERMISSIONS.CONTENT)
  ],

  // Manager - Limited permissions
  manager: [
    PERMISSIONS.CATEGORIES.READ,
    PERMISSIONS.CATEGORIES.UPDATE,
    PERMISSIONS.PRODUCTS.READ,
    PERMISSIONS.PRODUCTS.UPDATE,
    PERMISSIONS.ORDERS.READ,
    PERMISSIONS.ORDERS.UPDATE,
    PERMISSIONS.USERS.READ
  ],

  // Editor - Content management only
  editor: [
    PERMISSIONS.CATEGORIES.READ,
    PERMISSIONS.PRODUCTS.READ,
    PERMISSIONS.PRODUCTS.UPDATE,
    PERMISSIONS.CONTENT.PAGES,
    PERMISSIONS.CONTENT.STATIC_FILES
  ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Required permission
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {string[]}
 */
const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if role can perform bulk operations
 * @param {string} role - User role
 * @param {string} module - Module name (categories, products, etc.)
 * @returns {boolean}
 */
const canPerformBulkOperations = (role, module) => {
  const bulkPermission = PERMISSIONS[module.toUpperCase()]?.BULK_OPERATIONS;
  return bulkPermission && hasPermission(role, bulkPermission);
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  canPerformBulkOperations
};
