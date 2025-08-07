import axios from 'axios';

// Base API URL - adjust according to your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get admin token from localStorage
 * @returns {string|null} Admin token
 */
const getAdminToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken') || localStorage.getItem('authToken');
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
 * Fetch category details by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<Object|null>} Category object or null if not found
 */
export const fetchCategoryById = async (categoryId) => {
  try {
    console.log('📂 Fetching category by ID:', categoryId);
    const axiosInstance = createAxiosInstance();
    
    // Extract the actual ID from the format "MainCategory-xxxxx"
    const actualId = categoryId.startsWith('MainCategory-') 
      ? categoryId.replace('MainCategory-', '') 
      : categoryId;
    
    console.log('🔍 Using actual ID:', actualId);
    
    const response = await axiosInstance.get(`/categories/${actualId}`);
    console.log('📥 Category response:', response.data);
    
    // Handle both response structures
    let categoryData = null;
    if (response.data.success && response.data.data) {
      categoryData = response.data.data;
    } else if (response.data && response.data._id) {
      categoryData = response.data;
    }
    
    if (categoryData) {
      console.log('✅ Fetched category:', categoryData.name);
      // Return with the original ID format to maintain consistency
      return {
        ...categoryData,
        originalId: categoryId // Keep track of the original ID with prefix
      };
    } else {
      console.warn('⚠️ Category not found or unexpected response');
      return null;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`⚠️ Category with ID ${categoryId} not found`);
      return null;
    }
    console.error('❌ Error fetching category by ID:', error.message);
    return null;
  }
};

/**
 * Fetch subcategory details by ID
 * @param {string} subcategoryId - Subcategory ID
 * @returns {Promise<Object|null>} Subcategory object or null if not found
 */
export const fetchSubcategoryById = async (subcategoryId) => {
  try {
    console.log('📂 Fetching subcategory by ID:', subcategoryId);
    const axiosInstance = createAxiosInstance();
    
    // Extract the actual ID from the format "subcategory-xxxxx"
    const actualId = subcategoryId.startsWith('subcategory-') 
      ? subcategoryId.replace('subcategory-', '') 
      : subcategoryId;
    
    console.log('🔍 Using actual ID:', actualId);
    
    const response = await axiosInstance.get(`/subcategories/${actualId}`);
    console.log('📥 Subcategory response:', response.data);
    
    // Handle both response structures
    let subcategoryData = null;
    if (response.data.success && response.data.data) {
      subcategoryData = response.data.data;
    } else if (response.data && response.data._id) {
      subcategoryData = response.data;
    }
    
    if (subcategoryData) {
      console.log('✅ Fetched subcategory:', subcategoryData.name);
      return {
        ...subcategoryData,
        originalId: subcategoryId // Keep track of the original ID with prefix
      };
    } else {
      console.warn('⚠️ Subcategory not found or unexpected response');
      return null;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`⚠️ Subcategory with ID ${subcategoryId} not found`);
      return null;
    }
    console.error('❌ Error fetching subcategory by ID:', error.message);
    return null;
  }
};

/**
 * Fetch multiple categories by IDs
 * @param {Array<string>} categoryIds - Array of category IDs
 * @returns {Promise<Map>} Map of category ID to category object
 */
export const fetchCategoriesByIds = async (categoryIds) => {
  try {
    if (!categoryIds || categoryIds.length === 0) {
      return new Map();
    }
    
    console.log('📂 Fetching multiple categories by IDs:', categoryIds.length, 'categories');
    
    const uniqueIds = [...new Set(categoryIds)];
    const categoryMap = new Map();
    
    // Fetch all categories in parallel with error handling
    const promises = uniqueIds.map(async (id) => {
      try {
        const category = await fetchCategoryById(id);
        if (category) {
          categoryMap.set(id, category);
        }
      } catch (error) {
        console.error(`Failed to fetch category ${id}:`, error);
      }
    });
    
    await Promise.all(promises);
    
    console.log(`✅ Fetched ${categoryMap.size} categories out of ${uniqueIds.length} requested`);
    return categoryMap;
  } catch (error) {
    console.error('❌ Error fetching categories by IDs:', error);
    return new Map();
  }
};

/**
 * Fetch multiple subcategories by IDs
 * @param {Array<string>} subcategoryIds - Array of subcategory IDs
 * @returns {Promise<Map>} Map of subcategory ID to subcategory object
 */
export const fetchSubcategoriesByIds = async (subcategoryIds) => {
  try {
    if (!subcategoryIds || subcategoryIds.length === 0) {
      return new Map();
    }
    
    console.log('📂 Fetching multiple subcategories by IDs:', subcategoryIds.length, 'subcategories');
    
    const uniqueIds = [...new Set(subcategoryIds)];
    const subcategoryMap = new Map();
    
    // Fetch all subcategories in parallel with error handling
    const promises = uniqueIds.map(async (id) => {
      try {
        const subcategory = await fetchSubcategoryById(id);
        if (subcategory) {
          subcategoryMap.set(id, subcategory);
        }
      } catch (error) {
        console.error(`Failed to fetch subcategory ${id}:`, error);
      }
    });
    
    await Promise.all(promises);
    
    console.log(`✅ Fetched ${subcategoryMap.size} subcategories out of ${uniqueIds.length} requested`);
    return subcategoryMap;
  } catch (error) {
    console.error('❌ Error fetching subcategories by IDs:', error);
    return new Map();
  }
};

/**
 * Fetch all categories and subcategories by IDs (combined)
 * @param {Array<string>} ids - Array of category/subcategory IDs
 * @returns {Promise<Map>} Map of ID to category/subcategory object
 */
export const fetchAllCategoriesByIds = async (ids) => {
  try {
    if (!ids || ids.length === 0) {
      return new Map();
    }
    
    console.log('📂 Fetching all categories/subcategories by IDs:', ids.length, 'items');
    
    const uniqueIds = [...new Set(ids)];
    
    // Separate main category IDs and subcategory IDs based on prefix
    const mainCategoryIds = uniqueIds.filter(id => 
      id.startsWith('MainCategory-') || !id.startsWith('subcategory-')
    );
    const subcategoryIds = uniqueIds.filter(id => 
      id.startsWith('subcategory-')
    );
    
    console.log(`Found ${mainCategoryIds.length} main categories and ${subcategoryIds.length} subcategories`);
    
    // Fetch both types in parallel
    const [mainCategories, subCategories] = await Promise.all([
      fetchCategoriesByIds(mainCategoryIds),
      fetchSubcategoriesByIds(subcategoryIds)
    ]);
    
    // Combine both maps
    const combinedMap = new Map([...mainCategories, ...subCategories]);
    
    console.log(`✅ Total fetched: ${combinedMap.size} out of ${uniqueIds.length} requested`);
    return combinedMap;
  } catch (error) {
    console.error('❌ Error fetching all categories by IDs:', error);
    return new Map();
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

/**
 * Save (create or update) a category
 * @param {Object} categoryData - Category data to save
 * @param {Object} options - Additional options for saving
 * @param {boolean} options.isEditing - Whether this is an edit operation
 * @param {string} options.editingCategoryId - ID of category being edited
 * @returns {Promise<Object>} Response from server
 */
export const saveCategory = async (categoryData, options = {}) => {
  try {
    console.log('📝 Saving category data:', categoryData)
    
    const axiosInstance = createAxiosInstance()
    
    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('name', categoryData.name)
    formDataToSend.append('description', categoryData.description || '')
    formDataToSend.append('status', categoryData.status)
    
    if (categoryData.parent) {
      formDataToSend.append('parent', categoryData.parent)
      formDataToSend.append('isSubcategory', 'true')
    } else {
      formDataToSend.append('isSubcategory', 'false')
    }
    
    // Add category name for folder creation
    formDataToSend.append('categoryName', categoryData.name)
    
    // Add image file if selected
    if (categoryData.image) {
      formDataToSend.append('image', categoryData.image)
    }
    
    // For updates, add the category ID
    if (options.isEditing && options.editingCategoryId) {
      formDataToSend.append('categoryId', options.editingCategoryId)
    }
    
    // Use appropriate endpoint and method
    const endpoint = options.isEditing && options.editingCategoryId
      ? `/categories/${options.editingCategoryId}`
      : '/categories'
    
    const method = options.isEditing ? 'PUT' : 'POST'
    
    console.log('🌐 Using endpoint:', endpoint, 'with method:', method)
    
    // Make request with FormData and appropriate headers
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      data: formDataToSend,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    
    const response = await axiosInstance(config)
    console.log('✅ Save response:', response.data)

    return response.data
  } catch (error) {
    console.error('❌ Save category error:', error)
    
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to save category')
    }
    throw error
  }
}

/**
 * Delete a category
 * @param {string} categoryId - ID of category to delete
 * @returns {Promise<Object>} Response from server
 */
export const deleteCategory = async (categoryId) => {
  try {
    console.log('🗑️ Deleting category with ID:', categoryId)
    
    const axiosInstance = createAxiosInstance()
    const response = await axiosInstance.delete(`/categories/${categoryId}`)
    
    console.log('✅ Delete response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Delete category error:', error)
    
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to delete category')
    }
    throw error
  }
}

/**
 * Save (create or update) a subcategory
 * @param {Object} subcategoryData - Subcategory data to save
 * @param {Object} options - Additional options for saving
 * @param {boolean} options.isEditing - Whether this is an edit operation
 * @param {string} options.editingSubcategoryId - ID of subcategory being edited
 * @returns {Promise<Object>} Response from server
 */
export const saveSubcategory = async (subcategoryData, options = {}) => {
  try {
    console.log('📝 Saving subcategory data:', subcategoryData)
    
    const axiosInstance = createAxiosInstance()
    
    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('name', subcategoryData.name)
    formDataToSend.append('description', subcategoryData.description || '')
    formDataToSend.append('parent', subcategoryData.parent)
    formDataToSend.append('status', subcategoryData.status)
    
    // Add image file if selected
    if (subcategoryData.image) {
      formDataToSend.append('image', subcategoryData.image)
    }
    
    // For updates, add the subcategory ID
    if (options.isEditing && options.editingSubcategoryId) {
      formDataToSend.append('subcategoryId', options.editingSubcategoryId)
    }
    
    // Use appropriate endpoint and method
    const endpoint = options.isEditing && options.editingSubcategoryId
      ? `/subcategories/${options.editingSubcategoryId}`
      : '/subcategories'
    
    const method = options.isEditing ? 'PUT' : 'POST'
    
    console.log('🌐 Using subcategory endpoint:', endpoint, 'with method:', method)
    
    // Make request with FormData and appropriate headers
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      data: formDataToSend,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    
    const response = await axiosInstance(config)
    console.log('✅ Save subcategory response:', response.data)

    return response.data
  } catch (error) {
    console.error('❌ Save subcategory error:', error)
    
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to save subcategory')
    }
    throw error
  }
}

/**
 * Delete a subcategory
 * @param {string} subcategoryId - ID of subcategory to delete
 * @returns {Promise<Object>} Response from server
 */
export const deleteSubcategory = async (subcategoryId) => {
  try {
    console.log('🗑️ Deleting subcategory with ID:', subcategoryId)
    
    const axiosInstance = createAxiosInstance()
    const response = await axiosInstance.delete(`/subcategories/${subcategoryId}`)
    
    console.log('✅ Delete subcategory response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Delete subcategory error:', error)
    
    if (error.response) {
      throw new Error(error.response.data.error || error.response.data.message || 'Failed to delete subcategory')
    }
    throw error
  }
}

// Export all functions as default export object
const categoryService = {
  fetchCategories,
  fetchSubcategories,
  fetchCategoriesWithSubcategories,
  fetchCategoryById,
  fetchSubcategoryById,
  fetchCategoriesByIds,
  fetchSubcategoriesByIds,
  fetchAllCategoriesByIds,
  formatCategoryHierarchy,
  getMainCategories,
  getSubcategoriesForParent,
  saveCategory,
  deleteCategory,
  saveSubcategory,
  deleteSubcategory
};

export default categoryService;
