/**
 * Page Controller - Admin Content Management
 * 
 * Controller for handling page configurations and content management
 * in the new admin structure
 */

const { PageConfigService } = require('../../services');
const { ApiResponse, ApiError } = require('../../utils');

class PageController {
  /**
   * Get all page configurations
   */
  static async getPages(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      // For now, just get all configs
      const configs = await PageConfigService.getAllPageConfigs();
      
      const response = ApiResponse.success({
        pages: configs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: configs.length,
          totalPages: Math.ceil(configs.length / limit)
        }
      }, 'Page configurations retrieved successfully');
      
      res.status(200).json(response);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(500, error.message);
      res.status(apiError.statusCode).json(ApiResponse.error(apiError.message, apiError.statusCode));
    }
  }

  /**
   * Get specific page configuration
   */
  static async getPageConfig(req, res) {
    try {
      const { pageId } = req.params;
      
      const config = await PageConfigService.getPageConfig(pageId);
      
      if (!config) {
        throw new ApiError(404, `Page configuration not found: ${pageId}`);
      }
      
      const response = ApiResponse.success(config, 'Page configuration retrieved successfully');
      res.status(200).json(response);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(500, error.message);
      res.status(apiError.statusCode).json(ApiResponse.error(apiError.message, apiError.statusCode));
    }
  }

  /**
   * Save page configuration
   */
  static async savePageConfig(req, res) {
    try {
      console.log('💾 === SAVE PAGE CONFIGURATION START ===');
      
      const { pageId } = req.params;
      const configData = req.body;
      
      console.log('Saving config for page:', pageId);
      console.log('Config data:', JSON.stringify(configData, null, 2));
      
      // Save configuration using the service
      const updatedConfig = await PageConfigService.savePageConfig(pageId, configData);
      
      console.log('✅ Page configuration saved and static file updated');
      
      const response = ApiResponse.success({
        config: updatedConfig,
        message: 'Configuration saved and static file updated successfully'
      }, 'Page configuration saved successfully');
      
      res.status(200).json(response);
    } catch (error) {
      console.error('❌ Error saving page configuration:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, error.message);
      res.status(apiError.statusCode).json(ApiResponse.error(apiError.message, apiError.statusCode));
    }
  }

  /**
   * Manually refresh static data for a page
   */
  static async refreshStaticData(req, res) {
    try {
      console.log('🔄 === REFRESH STATIC DATA START ===');
      
      const { pageId } = req.params;
      
      console.log('Refreshing static data for page:', pageId);
      
      // Generate static file
      const outputPath = await PageConfigService.generateStaticFile(pageId);
      
      console.log('✅ Static data refreshed successfully');
      
      const response = ApiResponse.success({
        pageId,
        outputPath,
        timestamp: new Date().toISOString()
      }, 'Static data refreshed successfully');
      
      res.status(200).json(response);
    } catch (error) {
      console.error('❌ Error refreshing static data:', error);
      const apiError = error instanceof ApiError ? error : new ApiError(500, error.message);
      res.status(apiError.statusCode).json(ApiResponse.error(apiError.message, apiError.statusCode));
    }
  }

  /**
   * Delete page configuration
   */
  static async deletePageConfig(req, res) {
    try {
      const { pageId } = req.params;
      
      const deletedConfig = await PageConfigService.deletePageConfig(pageId);
      
      const response = ApiResponse.success({
        deletedConfig,
        message: 'Page configuration and static file deleted successfully'
      }, 'Page configuration deleted successfully');
      
      res.status(200).json(response);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(500, error.message);
      res.status(apiError.statusCode).json(ApiResponse.error(apiError.message, apiError.statusCode));
    }
  }

  /**
   * Get page statistics
   */
  static async getPageStats(req, res) {
    try {
      const configs = await PageConfigService.getAllPageConfigs();
      
      const stats = {
        totalPages: configs.length,
        enabledPages: configs.filter(c => c.isEnabled !== false).length,
        disabledPages: configs.filter(c => c.isEnabled === false).length,
        lastUpdated: configs.reduce((latest, config) => {
          const configDate = new Date(config.updatedAt || config.createdAt);
          return configDate > latest ? configDate : latest;
        }, new Date(0))
      };
      
      const response = ApiResponse.success(stats, 'Page statistics retrieved successfully');
      res.status(200).json(response);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(500, error.message);
      res.status(apiError.statusCode).json(ApiResponse.error(apiError.message, apiError.statusCode));
    }
  }
}

module.exports = PageController;
