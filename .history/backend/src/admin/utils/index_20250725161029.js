/**
 * Admin Utilities Index
 * 
 * Centralized export for all admin utilities
 */

const { ApiResponse, ApiError } = require('./responseHelpers');
const { validateImageFile, sanitizeString, generateSlug } = require('./validationHelpers');
const migrationHelper = require('./migrationHelper');

// Image fallback utility
const generateImageFallback = (name, type = 'category') => {
  const cleanName = name ? name.charAt(0).toUpperCase() : '?';
  const color = type === 'category' ? '#6366f1' : '#8b5cf6';
  
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <text x="100" y="110" font-family="Arial, sans-serif" font-size="72" 
            fill="white" text-anchor="middle" dominant-baseline="middle">
        ${cleanName}
      </text>
    </svg>
  `).toString('base64')}`;
};

module.exports = {
  // Response helpers
  ApiResponse,
  ApiError,
  
  // Validation helpers
  validateImageFile,
  sanitizeString,
  generateSlug,
  
  // Image utilities
  generateImageFallback,
  
  // Migration helper
  migrationHelper,
  
  // Legacy exports for compatibility
  responseHelpers: require('./responseHelpers'),
  validationHelpers: require('./validationHelpers')
};
