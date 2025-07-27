/**
 * Page Configuration Service
 * 
 * Service for handling page configurations and static file generation
 */

const PageConfig = require('../../../models/PageConfig');
const Category = require('../../../models/Category');
const FileService = require('./FileService');
const path = require('path');
const { ApiError, generateImageFallback } = require('../utils');

class PageConfigService {
  /**
   * Get page configuration
   */
  static async getPageConfig(pageId) {
    try {
      const config = await PageConfig.findOne({ pageId }).populate([
        {
          path: 'categories.category',
          model: 'Category',
          populate: {
            path: 'subcategories',
            model: 'Category'
          }
        }
      ]);

      return config;
    } catch (error) {
      throw new ApiError(500, `Failed to get page config: ${error.message}`);
    }
  }

  /**
   * Save page configuration
   */
  static async savePageConfig(pageId, configData) {
    try {
      const config = await PageConfig.findOneAndUpdate(
        { pageId },
        {
          pageId,
          ...configData,
          updatedAt: new Date()
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true
        }
      );

      // After saving, update the static file
      await this.generateStaticFile(pageId);

      return config;
    } catch (error) {
      throw new ApiError(500, `Failed to save page config: ${error.message}`);
    }
  }

  /**
   * Generate static file for a page
   */
  static async generateStaticFile(pageId) {
    try {
      console.log(`🔄 Generating static file for page: ${pageId}`);

      // Get page configuration with populated data
      const config = await this.getPageConfig(pageId);
      
      if (!config) {
        throw new ApiError(404, `Page configuration not found: ${pageId}`);
      }

      // Transform the data for frontend
      const staticData = await this.transformConfigToStaticData(config);

      // Determine output file path based on page ID
      const outputPath = this.getStaticFilePath(pageId);

      // Create backup of existing file
      await FileService.createBackup(outputPath);

      // Generate the static file
      await FileService.generateStaticDataFile(
        staticData,
        outputPath,
        {
          varName: this.getVariableName(pageId),
          includeMetadata: true,
          prettify: true
        }
      );

      // Clean old backups
      await FileService.cleanOldBackups(
        path.dirname(outputPath),
        path.basename(outputPath, '.js')
      );

      console.log(`✅ Static file generated: ${outputPath}`);
      return outputPath;

    } catch (error) {
      console.error(`❌ Error generating static file:`, error);
      throw new ApiError(500, `Failed to generate static file: ${error.message}`);
    }
  }

  /**
   * Transform page config to static data format
   */
  static async transformConfigToStaticData(config) {
    const transformCategory = (category) => {
      if (!category) return null;

      const imageUrl = category.image || generateImageFallback(category.name, 'category');
      
      return {
        _id: category._id.toString(),
        name: category.name,
        description: category.description || '',
        image: imageUrl,
        slug: category.slug,
        isActive: category.isActive !== false,
        subcategories: category.subcategories?.map(transformCategory).filter(Boolean) || []
      };
    };

    const staticData = {
      pageId: config.pageId,
      isEnabled: config.isEnabled !== false,
      categories: [],
      metadata: {
        totalCategories: 0,
        totalSubcategories: 0,
        lastUpdated: config.updatedAt || new Date(),
        generatedAt: new Date(),
        version: '1.0'
      }
    };

    // Transform categories
    if (config.categories && config.categories.length > 0) {
      for (const configCategory of config.categories) {
        if (!configCategory.category) continue;

        const transformedCategory = transformCategory(configCategory.category);
        if (transformedCategory) {
          // Override with config-specific settings
          transformedCategory.order = configCategory.order || 0;
          transformedCategory.isVisible = configCategory.isVisible !== false;
          
          // Filter subcategories based on config
          if (configCategory.subcategories && configCategory.subcategories.length > 0) {
            const visibleSubcategories = transformedCategory.subcategories.filter(sub => 
              configCategory.subcategories.some(configSub => 
                configSub.subcategory?.toString() === sub._id && 
                configSub.isVisible !== false
              )
            );
            transformedCategory.subcategories = visibleSubcategories;
          }

          staticData.categories.push(transformedCategory);
        }
      }

      // Sort categories by order
      staticData.categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    // Update metadata
    staticData.metadata.totalCategories = staticData.categories.length;
    staticData.metadata.totalSubcategories = staticData.categories.reduce(
      (total, cat) => total + (cat.subcategories?.length || 0), 
      0
    );

    return staticData;
  }

  /**
   * Get static file path for a page
   */
  static getStaticFilePath(pageId) {
    const frontendDataPath = path.join(
      __dirname, 
      '../../../../Ninico/data'
    );

    switch (pageId) {
      case 'home':
        return path.join(frontendDataPath, 'giftPageCategories.js');
      case 'shop':
        return path.join(frontendDataPath, 'shopPageCategories.js');
      default:
        return path.join(frontendDataPath, `${pageId}PageCategories.js`);
    }
  }

  /**
   * Get JavaScript variable name for a page
   */
  static getVariableName(pageId) {
    switch (pageId) {
      case 'home':
        return 'giftCategories';
      case 'shop':
        return 'shopCategories';
      default:
        return `${pageId}Categories`;
    }
  }

  /**
   * Get all page configurations
   */
  static async getAllPageConfigs() {
    try {
      const configs = await PageConfig.find({}).populate([
        {
          path: 'categories.category',
          model: 'Category'
        }
      ]);

      return configs;
    } catch (error) {
      throw new ApiError(500, `Failed to get page configs: ${error.message}`);
    }
  }

  /**
   * Delete page configuration
   */
  static async deletePageConfig(pageId) {
    try {
      const result = await PageConfig.findOneAndDelete({ pageId });
      
      if (!result) {
        throw new ApiError(404, `Page configuration not found: ${pageId}`);
      }

      // Optionally delete the static file
      const staticFilePath = this.getStaticFilePath(pageId);
      await FileService.deleteFile(staticFilePath);

      return result;
    } catch (error) {
      throw new ApiError(500, `Failed to delete page config: ${error.message}`);
    }
  }
}

module.exports = PageConfigService;
