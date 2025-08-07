import axios from 'axios';

// Base API URL - adjust according to your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get admin token from localStorage
 * @returns {string|null} Admin token
 */
const getAdminToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

/**
 * Create axios instance with default config
 */
const createAxiosInstance = () => {
  const token = getAdminToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

/**
 * Fetch all categories from the backend
 * @returns {Promise<Array>} Array of category objects
 */
export const fetchCategories = async () => {
  try {
    console.log('📂 Fetching categories...');
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get('/categories');
    
    // Handle different response structures
    if (response.data.success && response.data.data) {
      console.log(`✅ Fetched ${response.data.data.length} categories`);
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      console.log(`✅ Fetched ${response.data.length} categories`);
      return response.data;
    } else {
      console.warn('⚠️ Unexpected response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    if (error.response) {
      console.error('Response error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch categories');
    }
    throw error;
  }
};

/**
 * Fetch all subcategories from the backend
 * @param {string|null} parentId - Optional parent category ID to filter subcategories
 * @returns {Promise<Array>} Array of subcategory objects
 */
export const fetchSubcategories = async (parentId = null) => {
  try {
    console.log('📂 Fetching subcategories...', parentId ? `for parent: ${parentId}` : 'all');
    const axiosInstance = createAxiosInstance();
    
    // Use different endpoint based on whether parentId is provided
    const endpoint = parentId 
      ? `/subcategories/parent/${parentId}`
      : '/subcategories';
    
    const response = await axiosInstance.get(endpoint);
    
    // Handle different response structures
    if (response.data.success && response.data.data) {
      console.log(`✅ Fetched ${response.data.data.length} subcategories`);
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      console.log(`✅ Fetched ${response.data.length} subcategories`);
      return response.data;
    } else {
      console.warn('⚠️ Unexpected response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching subcategories:', error.message);
    if (error.response) {
      console.error('Response error:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to fetch subcategories');
    }
    throw error;
  }
};

/**
 * Fetch categories with their subcategories in a hierarchical structure
 * @returns {Promise<Array>} Array of categories with subcategories nested
 */
export const fetchCategoriesWithSubcategories = async () => {
  try {
    console.log('📂 Fetching categories with subcategories...');
    
    // Fetch both in parallel for better performance
    const [categories, subcategories] = await Promise.all([
      fetchCategories(),
      fetchSubcategories()
    ]);
    
    // Create a map for quick subcategory lookup
    const subcategoryMap = new Map();
    subcategories.forEach(subcat => {
      const parentId = subcat.parent?._id || subcat.parent;
      if (!subcategoryMap.has(parentId)) {
        subcategoryMap.set(parentId, []);
      }
      subcategoryMap.get(parentId).push(subcat);
    });
    
    // Attach subcategories to their parent categories
    const categoriesWithSubs = categories.map(category => ({
      ...category,
      subcategories: subcategoryMap.get(category._id) || []
    }));
    
    console.log('✅ Categories with subcategories prepared');
    return categoriesWithSubs;
  } catch (error) {
    console.error('❌ Error fetching categories with subcategories:', error);
    throw error;
  }
};

/**
 * Utility function to format category hierarchy for display
 * @param {Object} category - Category object
 * @param {Object} subcategory - Optional subcategory object
 * @returns {string} Formatted hierarchy string
 */
export const formatCategoryHierarchy = (category, subcategory = null) => {
  if (!category) return '';
  
  let hierarchy = category.name;
  if (subcategory && subcategory.name) {
    hierarchy += ` > ${subcategory.name}`;
  }
  
  return hierarchy;
};

/**
 * Get main categories (categories without parent)
 * @param {Array} categories - Array of all categories
 * @returns {Array} Array of main categories only
 */
export const getMainCategories = (categories) => {
  return categories.filter(cat => !cat.parent);
};

/**
 * Get subcategories for a specific parent category
 * @param {Array} subcategories - Array of all subcategories
 * @param {string} parentId - Parent category ID
 * @returns {Array} Array of subcategories for the parent
 */
export const getSubcategoriesForParent = (subcategories, parentId) => {
  return subcategories.filter(subcat => {
    const parent = subcat.parent?._id || subcat.parent;
    return parent === parentId;
  });
};

// Export all functions as default export object
const adminHelper = {
  fetchCategories,
  fetchSubcategories,
  fetchCategoriesWithSubcategories,
  formatCategoryHierarchy,
  getMainCategories,
  getSubcategoriesForParent
};

export default adminHelper;
