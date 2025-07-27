/**
 * Admin Category Controller
 * 
 * Handles all category-related operations for admin panel
 * Optimized with proper error handling, validation, and response structure
 * 
 * @module AdminCategoryController
 */

const Category = require('../../../../models/Category');
const Media = require('../../../../models/Media');
const { getImageUrl, deleteImageFile } = require('../../../../utils/fileUpload');
const { constants } = require('../../config');
const { 
  successResponse, 
  errorResponse, 
  validationErrorResponse 
} = require('../../utils/responseHelpers');
const CategoryService = require('../../services/CategoryService');

class CategoryController {
  /**
   * Create a new category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCategory(req, res) {
    try {
      console.log('📝 [Admin] Creating category...');
      
      // Validate required fields
      const { name, description = '', parent = null, status = true } = req.body || {};
      
      if (!name || name.trim().length === 0) {
        return validationErrorResponse(res, 'Category name is required');
      }

      // Prepare category data
      const categoryData = {
        name: name.trim(),
        description: description.trim(),
        parent,
        status: Boolean(status)
      };

      // Handle image upload
      if (req.file) {
        const imageResult = await CategoryService.processImageUpload(req.file, name);
        categoryData.image = imageResult;
        console.log('🖼️ Image processed successfully');
      }

      // Create category
      const category = await CategoryService.createCategory(categoryData);
      
      console.log('✅ Category created successfully:', category._id);
      return successResponse(res, category, constants.MESSAGES.SUCCESS.CREATED, 201);

    } catch (error) {
      console.error('❌ Category creation error:', error);
      return errorResponse(res, error.message, 400);
    }
  }

  /**
   * Get all categories with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategories(req, res) {
    try {
      console.log('📋 [Admin] Fetching categories...');
      
      const {
        page = constants.PAGINATION.DEFAULT_PAGE,
        limit = constants.PAGINATION.DEFAULT_LIMIT,
        parent,
        status,
        search
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: Math.min(parseInt(limit), constants.PAGINATION.MAX_LIMIT),
        parent,
        status,
        search
      };

      const result = await CategoryService.getCategories(options);
      
      console.log(`✅ Fetched ${result.data.length} categories`);
      return successResponse(res, result);

    } catch (error) {
      console.error('❌ Get categories error:', error);
      return errorResponse(res, error.message);
    }
  }

  /**
   * Get single category by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategory(req, res) {
    try {
      console.log('🔍 [Admin] Fetching category:', req.params.id);
      
      const category = await CategoryService.getCategoryById(req.params.id);
      
      if (!category) {
        return errorResponse(res, constants.MESSAGES.ERRORS.NOT_FOUND, 404);
      }

      console.log('✅ Category fetched successfully');
      return successResponse(res, category);

    } catch (error) {
      console.error('❌ Get category error:', error);
      return errorResponse(res, error.message);
    }
  }

  /**
   * Update category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateCategory(req, res) {
    try {
      console.log('✏️ [Admin] Updating category:', req.params.id);
      
      const categoryId = req.params.id;
      const updateData = { ...req.body };

      // Validate category exists
      const existingCategory = await CategoryService.getCategoryById(categoryId);
      if (!existingCategory) {
        return errorResponse(res, constants.MESSAGES.ERRORS.NOT_FOUND, 404);
      }

      // Handle image upload
      if (req.file) {
        // Delete old image if exists
        if (existingCategory.image?.path) {
          await CategoryService.deleteImage(existingCategory.image.path);
        }
        
        const imageResult = await CategoryService.processImageUpload(
          req.file, 
          updateData.name || existingCategory.name
        );
        updateData.image = imageResult;
        console.log('🖼️ Image updated successfully');
      }

      // Update category
      const updatedCategory = await CategoryService.updateCategory(categoryId, updateData);
      
      console.log('✅ Category updated successfully');
      return successResponse(res, updatedCategory, constants.MESSAGES.SUCCESS.UPDATED);

    } catch (error) {
      console.error('❌ Category update error:', error);
      return errorResponse(res, error.message, 400);
    }
  }

  /**
   * Delete category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteCategory(req, res) {
    try {
      console.log('🗑️ [Admin] Deleting category:', req.params.id);
      
      const categoryId = req.params.id;
      
      // Check if category exists
      const category = await CategoryService.getCategoryById(categoryId);
      if (!category) {
        return errorResponse(res, constants.MESSAGES.ERRORS.NOT_FOUND, 404);
      }

      // Check for subcategories
      const hasSubcategories = await CategoryService.hasSubcategories(categoryId);
      if (hasSubcategories) {
        return errorResponse(res, 
          'Cannot delete category with subcategories. Delete subcategories first.', 
          400
        );
      }

      // Delete category and its image
      await CategoryService.deleteCategory(categoryId);
      
      console.log('✅ Category deleted successfully');
      return successResponse(res, null, constants.MESSAGES.SUCCESS.DELETED);

    } catch (error) {
      console.error('❌ Category deletion error:', error);
      return errorResponse(res, error.message);
    }
  }

  /**
   * Get category hierarchy (tree structure)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategoryHierarchy(req, res) {
    try {
      console.log('🌳 [Admin] Building category hierarchy...');
      
      const hierarchy = await CategoryService.buildCategoryHierarchy();
      
      console.log('✅ Category hierarchy built successfully');
      return successResponse(res, hierarchy);

    } catch (error) {
      console.error('❌ Category hierarchy error:', error);
      return errorResponse(res, error.message);
    }
  }

  /**
   * Bulk operations on categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkOperations(req, res) {
    try {
      console.log('📦 [Admin] Performing bulk operations...');
      
      const { operation, categoryIds, data } = req.body;
      
      if (!operation || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return validationErrorResponse(res, 'Invalid bulk operation parameters');
      }

      const result = await CategoryService.performBulkOperation(operation, categoryIds, data);
      
      console.log(`✅ Bulk operation '${operation}' completed on ${categoryIds.length} categories`);
      return successResponse(res, result, `Bulk ${operation} completed successfully`);

    } catch (error) {
      console.error('❌ Bulk operation error:', error);
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new CategoryController();
