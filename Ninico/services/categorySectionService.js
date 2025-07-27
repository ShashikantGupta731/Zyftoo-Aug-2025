/**
 * Category Section API Service
 * 
 * Service for handling category section configuration API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class CategorySectionService {
  
  /**
   * Get category section configuration for admin panel
   * @param {string} pageId - Page ID (e.g., 'home', 'corporate')
   * @param {string} token - Admin auth token
   * @returns {Promise<Object>} API response
   */
  async getCategorySectionConfig(pageId, token) {
    try {
      console.log(`🔄 [CategorySectionService] Fetching config for page: ${pageId}`);
      
      const response = await fetch(`${API_BASE_URL}/admin/category-section/config/${pageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ [CategorySectionService] API Error:`, data);
        throw new Error(data.message || `HTTP ${response.status}: Failed to fetch category section config`);
      }

      console.log(`✅ [CategorySectionService] Successfully fetched config`);
      return data;

    } catch (error) {
      console.error(`❌ [CategorySectionService] Error in getCategorySectionConfig:`, error);
      throw new Error(`Failed to fetch category section config: ${error.message}`);
    }
  }

  /**
   * Update category section configuration
   * @param {string} pageId - Page ID
   * @param {Object} configData - Configuration data
   * @param {string} token - Admin auth token
   * @returns {Promise<Object>} API response
   */
  async updateCategorySectionConfig(pageId, configData, token) {
    try {
      console.log(`🔄 [CategorySectionService] Updating config for page: ${pageId}`, configData);
      
      const response = await fetch(`${API_BASE_URL}/admin/category-section/config/${pageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ [CategorySectionService] Update Error:`, data);
        throw new Error(data.message || `HTTP ${response.status}: Failed to update category section config`);
      }

      console.log(`✅ [CategorySectionService] Successfully updated config`);
      return data;

    } catch (error) {
      console.error(`❌ [CategorySectionService] Error in updateCategorySectionConfig:`, error);
      throw new Error(`Failed to update category section config: ${error.message}`);
    }
  }

  /**
   * Get all available categories for selection
   * @param {string} token - Admin auth token
   * @returns {Promise<Object>} API response
   */
  async getAvailableCategories(token) {
    try {
      console.log(`🔄 [CategorySectionService] Fetching available categories`);
      
      const response = await fetch(`${API_BASE_URL}/admin/category-section/available-categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ [CategorySectionService] Available Categories Error:`, data);
        throw new Error(data.message || `HTTP ${response.status}: Failed to fetch available categories`);
      }

      console.log(`✅ [CategorySectionService] Successfully fetched available categories`);
      return data;

    } catch (error) {
      console.error(`❌ [CategorySectionService] Error in getAvailableCategories:`, error);
      throw new Error(`Failed to fetch available categories: ${error.message}`);
    }
  }

  /**
   * Get categories for frontend display (public endpoint)
   * @param {string} pageId - Page ID
   * @returns {Promise<Object>} API response
   */
  async getCategoriesForDisplay(pageId) {
    try {
      console.log(`🔄 [CategorySectionService] Fetching categories for display - Page: ${pageId}`);
      
      const response = await fetch(`${API_BASE_URL}/admin/category-section/display/${pageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ [CategorySectionService] Display Categories Error:`, data);
        throw new Error(data.message || `HTTP ${response.status}: Failed to fetch categories for display`);
      }

      console.log(`✅ [CategorySectionService] Successfully fetched categories for display`);
      return data;

    } catch (error) {
      console.error(`❌ [CategorySectionService] Error in getCategoriesForDisplay:`, error);
      
      // For display purposes, we can return a fallback response
      console.log(`⚠️ [CategorySectionService] Returning fallback data for display`);
      return {
        success: false,
        data: {
          categories: [],
          metadata: {
            enabled: false,
            message: `API Error: ${error.message}`,
            source: 'fallback'
          }
        },
        error: error.message
      };
    }
  }
}

export default new CategorySectionService();
