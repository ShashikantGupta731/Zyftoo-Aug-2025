const PageConfig = require('../../../models/PageConfig');
const Category = require('../../../models/Category');
const Subcategory = require('../../../models/Subcategory');
const mongoose = require('mongoose');

class CategorySectionConfigurationController {
  
  /**
   * Get category section configuration for a specific page
   * Based on actual PageConfig structure from database
   */
  async getCategorySectionConfig(req, res) {
    try {
      const { pageId } = req.params;
      
      console.log(`🔍 [CategorySectionConfig] Fetching config for page: ${pageId}`);
      
      // Validate pageId
      if (!pageId) {
        console.log(`❌ [CategorySectionConfig] Missing pageId parameter`);
        return res.status(400).json({
          success: false,
          message: 'Page ID is required',
          errorCode: 'MISSING_PAGE_ID',
          errorLocation: 'getCategorySectionConfig - parameter validation'
        });
      }

      // Get page configuration
      const pageConfig = await PageConfig.findOne({ _id: pageId });
      if (!pageConfig) {
        console.log(`❌ [CategorySectionConfig] Page config not found for: ${pageId}`);
        return res.status(404).json({
          success: false,
          message: `Page configuration not found for pageId: ${pageId}`,
          errorCode: 'PAGE_CONFIG_NOT_FOUND',
          errorLocation: 'getCategorySectionConfig - PageConfig.findOne',
          pageId
        });
      }

      console.log(`✅ [CategorySectionConfig] Found page config with ${pageConfig.sections.length} sections`);

      // Find category section in the page config
      const categorySection = pageConfig.sections.find(
        section => section.sectionType === 'categorySection'
      );

      if (!categorySection) {
        console.log(`❌ [CategorySectionConfig] Category section not found in page: ${pageId}`);
        return res.status(404).json({
          success: false,
          message: 'Category section not found in page configuration',
          errorCode: 'CATEGORY_SECTION_NOT_FOUND',
          errorLocation: 'getCategorySectionConfig - section search',
          pageId,
          availableSections: pageConfig.sections.map(s => s.sectionType)
        });
      }

      console.log(`📋 [CategorySectionConfig] Found category section with ${categorySection.config.categories?.length || 0} categories`);

      // Extract category IDs from configuration
      const categoryIds = categorySection.config.categories
        ?.filter(cat => cat.enabled)
        ?.map(cat => cat.categoryId) || [];
      
      console.log(`🎯 [CategorySectionConfig] Extracting data for categoryIds:`, categoryIds);

      if (categoryIds.length === 0) {
        console.log(`⚠️ [CategorySectionConfig] No enabled categories found`);
        return res.status(200).json({
          success: true,
          data: {
            sectionConfig: categorySection,
            categoriesData: {
              mainCategories: [],
              subcategories: []
            },
            pageId,
            lastModified: pageConfig.lastModified
          },
          message: 'No enabled categories configured'
        });
      }

      // Fetch detailed category data
      const categoriesData = await this.fetchCategoryDetails(categoryIds);
      
      console.log(`✅ [CategorySectionConfig] Successfully fetched category data`);

      res.status(200).json({
        success: true,
        data: {
          sectionConfig: categorySection,
          categoriesData,
          pageId,
          lastModified: pageConfig.lastModified
        }
      });

    } catch (error) {
      console.error('❌ [CategorySectionConfig] Error in getCategorySectionConfig:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching category section configuration',
        errorCode: 'INTERNAL_SERVER_ERROR',
        errorLocation: 'getCategorySectionConfig - catch block',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Helper method to fetch category details with subcategories
   * Based on actual Category/Subcategory structure
   */
  async fetchCategoryDetails(categoryIds) {
    try {
      console.log(`🔄 [CategorySectionConfig] Fetching details for categories:`, categoryIds);

      // Validate categoryIds array
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        console.log(`⚠️ [CategorySectionConfig] Invalid or empty categoryIds array`);
        return {
          mainCategories: [],
          subcategories: []
        };
      }

      // Convert string IDs to ObjectIds for MongoDB query
      let objectIds;
      try {
        objectIds = categoryIds.map(id => {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
      } catch (idError) {
        console.error(`❌ [CategorySectionConfig] Invalid category ID format:`, idError.message);
        throw new Error(`Invalid category ID format: ${idError.message}`);
      }

      // Fetch main categories (parent: null)
      const mainCategories = await Category.find({
        _id: { $in: objectIds },
        parent: null,
        status: true
      }).lean();

      console.log(`📦 [CategorySectionConfig] Found ${mainCategories.length} main categories out of ${categoryIds.length} requested`);

      // Log missing categories for debugging
      const foundCategoryIds = mainCategories.map(cat => cat._id.toString());
      const missingCategoryIds = categoryIds.filter(id => !foundCategoryIds.includes(id));
      if (missingCategoryIds.length > 0) {
        console.log(`⚠️ [CategorySectionConfig] Missing or inactive categories:`, missingCategoryIds);
      }

      // Get all main category IDs to fetch their subcategories
      const mainCategoryIds = mainCategories.map(cat => cat._id);

      // Fetch subcategories for these main categories
      let subcategories = [];
      if (mainCategoryIds.length > 0) {
        subcategories = await Subcategory.find({
          parent: { $in: mainCategoryIds },
          status: true
        }).populate('parent', 'name').lean();

        console.log(`📦 [CategorySectionConfig] Found ${subcategories.length} subcategories`);
      }

      // Format the response data
      const formattedMainCategories = mainCategories.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        description: cat.description || '',
        image: cat.image?.url || null,
        status: cat.status
      }));

      const formattedSubcategories = subcategories.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        description: sub.description || '',
        image: sub.image?.url || null,
        parent: sub.parent._id.toString(),
        parentName: sub.parent.name,
        status: sub.status
      }));

      console.log(`✅ [CategorySectionConfig] Formatted data - Categories: ${formattedMainCategories.length}, Subcategories: ${formattedSubcategories.length}`);

      return {
        mainCategories: formattedMainCategories,
        subcategories: formattedSubcategories
      };

    } catch (error) {
      console.error('❌ [CategorySectionConfig] Error in fetchCategoryDetails:', error);
      throw new Error(`Failed to fetch category details: ${error.message}`);
    }
  }

  /**
   * Update category section configuration
   * Based on actual PageConfig structure
   */
  async updateCategorySectionConfig(req, res) {
    try {
      const { pageId } = req.params;
      const { categoryIds, enabled, maxCategories, layout, showSubcategories } = req.body;

      console.log(`🔄 [CategorySectionConfig] Updating config for page: ${pageId}`);
      console.log(`📝 [CategorySectionConfig] New config:`, { categoryIds, enabled, maxCategories, layout, showSubcategories });

      // Validate required parameters
      if (!pageId) {
        return res.status(400).json({
          success: false,
          message: 'Page ID is required',
          errorCode: 'MISSING_PAGE_ID',
          errorLocation: 'updateCategorySectionConfig - parameter validation'
        });
      }

      if (!Array.isArray(categoryIds)) {
        return res.status(400).json({
          success: false,
          message: 'Category IDs must be an array',
          errorCode: 'INVALID_CATEGORY_IDS',
          errorLocation: 'updateCategorySectionConfig - parameter validation'
        });
      }

      // Validate category IDs exist and are valid ObjectIds
      let objectIds;
      try {
        objectIds = categoryIds.map(id => {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
      } catch (idError) {
        return res.status(400).json({
          success: false,
          message: `Invalid category ID format: ${idError.message}`,
          errorCode: 'INVALID_OBJECT_ID',
          errorLocation: 'updateCategorySectionConfig - ObjectId validation'
        });
      }

      const validCategories = await Category.find({
        _id: { $in: objectIds },
        status: true
      });

      if (validCategories.length !== categoryIds.length) {
        const validIds = validCategories.map(cat => cat._id.toString());
        const invalidIds = categoryIds.filter(id => !validIds.includes(id));
        
        console.log(`❌ [CategorySectionConfig] Invalid categories found:`, invalidIds);
        
        return res.status(400).json({
          success: false,
          message: 'Some category IDs are invalid or inactive',
          errorCode: 'INVALID_CATEGORIES',
          errorLocation: 'updateCategorySectionConfig - category validation',
          validFound: validCategories.length,
          requested: categoryIds.length,
          invalidIds
        });
      }

      // Format categories array according to PageConfig structure
      const formattedCategories = categoryIds.map((categoryId, index) => ({
        categoryId,
        enabled: true,
        order: index
      }));

      // Update page configuration using actual structure
      const updateResult = await PageConfig.findOneAndUpdate(
        { _id: pageId, 'sections.sectionType': 'categorySection' },
        {
          $set: {
            'sections.$.enabled': enabled !== undefined ? enabled : true,
            'sections.$.config.categories': formattedCategories,
            'sections.$.config.maxCategories': maxCategories || 6,
            'sections.$.config.layout': layout || 'grid',
            'sections.$.config.showSubcategories': showSubcategories !== undefined ? showSubcategories : true,
            lastModified: new Date(),
            modifiedBy: req.user?.id || 'admin'
          }
        },
        { new: true }
      );

      if (!updateResult) {
        console.log(`❌ [CategorySectionConfig] Page or category section not found for update`);
        return res.status(404).json({
          success: false,
          message: 'Page configuration or category section not found',
          errorCode: 'UPDATE_TARGET_NOT_FOUND',
          errorLocation: 'updateCategorySectionConfig - PageConfig.findOneAndUpdate',
          pageId
        });
      }

      console.log(`✅ [CategorySectionConfig] Successfully updated category section config`);

      res.status(200).json({
        success: true,
        message: 'Category section configuration updated successfully',
        data: updateResult
      });

    } catch (error) {
      console.error('❌ [CategorySectionConfig] Error in updateCategorySectionConfig:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating category section configuration',
        errorCode: 'INTERNAL_SERVER_ERROR',
        errorLocation: 'updateCategorySectionConfig - catch block',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get all available categories for selection
   */
  async getAvailableCategories(req, res) {
    try {
      console.log(`🔄 [CategorySectionConfig] Fetching all available categories`);

      // Fetch main categories (parent: null)
      const mainCategories = await Category.find({
        parent: null,
        status: true
      }).sort({ name: 1 }).lean();

      // Fetch all subcategories with parent info
      const subcategories = await Subcategory.find({
        status: true
      }).populate('parent', 'name').sort({ name: 1 }).lean();

      console.log(`📦 [CategorySectionConfig] Found ${mainCategories.length} main categories and ${subcategories.length} subcategories`);

      const formattedMainCategories = mainCategories.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        description: cat.description || '',
        image: cat.image?.url || null
      }));

      const formattedSubcategories = subcategories.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        description: sub.description || '',
        image: sub.image?.url || null,
        parent: sub.parent._id.toString(),
        parentName: sub.parent.name
      }));

      res.status(200).json({
        success: true,
        data: {
          mainCategories: formattedMainCategories,
          subcategories: formattedSubcategories
        }
      });

    } catch (error) {
      console.error('❌ [CategorySectionConfig] Error in getAvailableCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching available categories',
        errorCode: 'INTERNAL_SERVER_ERROR',
        errorLocation: 'getAvailableCategories - catch block',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get category section configuration for frontend display
   * This endpoint will be used by ModernGiftCategories component
   */
  async getCategorySectionForDisplay(req, res) {
    try {
      const { pageId } = req.params;
      
      console.log(`🎯 [CategorySectionConfig] Fetching category section for display - Page: ${pageId}`);
      
      // Validate pageId
      if (!pageId) {
        return res.status(400).json({
          success: false,
          message: 'Page ID is required',
          errorCode: 'MISSING_PAGE_ID',
          errorLocation: 'getCategorySectionForDisplay - parameter validation'
        });
      }

      // Get page configuration
      const pageConfig = await PageConfig.findOne({ _id: pageId });
      if (!pageConfig) {
        console.log(`❌ [CategorySectionConfig] Page config not found for display: ${pageId}`);
        return res.status(404).json({
          success: false,
          message: 'Page configuration not found',
          errorCode: 'PAGE_CONFIG_NOT_FOUND',
          errorLocation: 'getCategorySectionForDisplay - PageConfig.findOne',
          pageId
        });
      }

      // Find category section
      const categorySection = pageConfig.sections.find(
        section => section.sectionType === 'categorySection'
      );

      if (!categorySection || !categorySection.enabled) {
        console.log(`⚠️ [CategorySectionConfig] Category section disabled or not found for: ${pageId}`);
        return res.status(200).json({
          success: true,
          data: {
            categories: [],
            metadata: {
              enabled: false,
              message: 'Category section is disabled or not configured'
            }
          }
        });
      }

      // Extract enabled category IDs in order
      const enabledCategories = categorySection.config.categories
        ?.filter(cat => cat.enabled)
        ?.sort((a, b) => a.order - b.order)
        ?.map(cat => cat.categoryId) || [];

      if (enabledCategories.length === 0) {
        console.log(`⚠️ [CategorySectionConfig] No enabled categories for display: ${pageId}`);
        return res.status(200).json({
          success: true,
          data: {
            categories: [],
            metadata: {
              enabled: true,
              message: 'No categories configured for display'
            }
          }
        });
      }

      // Fetch category details for display
      const categoriesData = await this.fetchCategoryDetailsForDisplay(enabledCategories);

      res.status(200).json({
        success: true,
        data: {
          categories: categoriesData,
          metadata: {
            enabled: true,
            layout: categorySection.config.layout || 'grid',
            showSubcategories: categorySection.config.showSubcategories !== false,
            maxCategories: categorySection.config.maxCategories || 6,
            source: 'api',
            lastUpdated: pageConfig.lastModified
          }
        }
      });

    } catch (error) {
      console.error('❌ [CategorySectionConfig] Error in getCategorySectionForDisplay:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching category section for display',
        errorCode: 'INTERNAL_SERVER_ERROR',
        errorLocation: 'getCategorySectionForDisplay - catch block',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Helper method to fetch categories for frontend display
   * Returns data in the format expected by ModernGiftCategories component
   */
  async fetchCategoryDetailsForDisplay(categoryIds) {
    try {
      // Validate and convert IDs
      const objectIds = categoryIds.map(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid ObjectId for display: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });

      // Fetch main categories
      const mainCategories = await Category.find({
        _id: { $in: objectIds },
        parent: null,
        status: true
      }).lean();

      // Create a map to maintain order
      const categoryMap = new Map();
      mainCategories.forEach(cat => {
        categoryMap.set(cat._id.toString(), cat);
      });

      // Get subcategories for these categories
      const subcategories = await Subcategory.find({
        parent: { $in: objectIds },
        status: true
      }).lean();

      // Group subcategories by parent
      const subcategoryMap = new Map();
      subcategories.forEach(sub => {
        const parentId = sub.parent.toString();
        if (!subcategoryMap.has(parentId)) {
          subcategoryMap.set(parentId, []);
        }
        subcategoryMap.get(parentId).push({
          id: sub._id.toString(),
          name: sub.name,
          link: `/shop/subcategory/${sub._id}`,
          isActive: sub.status
        });
      });

      // Format categories in the order specified
      const formattedCategories = categoryIds
        .map(id => categoryMap.get(id))
        .filter(Boolean)
        .map((cat, index) => ({
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          image: cat.image?.url || `/assets/img/features/feature-icon-0${(index % 6) + 1}.png`,
          description: cat.description || '',
          isActive: cat.status,
          sortOrder: index + 1,
          subcategories: subcategoryMap.get(cat._id.toString()) || []
        }));

      console.log(`✅ [CategorySectionConfig] Formatted ${formattedCategories.length} categories for display`);

      return formattedCategories;

    } catch (error) {
      console.error('❌ [CategorySectionConfig] Error in fetchCategoryDetailsForDisplay:', error);
      throw new Error(`Failed to fetch category details for display: ${error.message}`);
    }
  }
}

module.exports = new CategorySectionConfigurationController();
