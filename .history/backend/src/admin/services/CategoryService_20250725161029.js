/**
 * Category Service
 * 
 * Business logic for category operations
 * Handles data processing, validation, and database operations
 * 
 * @module CategoryService
 */

const Category = require('../../../models/Category');
const Media = require('../../../models/Media');
const { getImageUrl, deleteImageFile } = require('../../../utils/fileUpload');
const { constants } = require('../../config');

class CategoryService {
  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    console.log('🔧 [CategoryService] Creating category:', categoryData.name);
    
    // Validate business rules
    if (categoryData.parent) {
      await this.validateSubcategoryLimits(categoryData.parent);
    } else {
      await this.validateMainCategoryLimits();
    }

    const category = new Category(categoryData);
    await category.save();
    
    // Transform for frontend compatibility
    return this.transformCategory(category);
  }

  /**
   * Get categories with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Categories with pagination info
   */
  async getCategories(options = {}) {
    console.log('🔧 [CategoryService] Fetching categories with options:', options);
    
    const { page, limit, parent, status, search } = options;
    
    // Build query
    const query = {};
    
    if (parent !== undefined) {
      query.parent = parent === 'null' || parent === '' ? null : parent;
    }
    
    if (status !== undefined) {
      query.status = status === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      Category.find(query)
        .populate('parent', 'name _id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments(query)
    ]);

    // Transform categories
    const transformedCategories = categories.map(cat => this.transformCategory(cat));

    return {
      data: transformedCategories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object|null>} Category or null
   */
  async getCategoryById(categoryId) {
    console.log('🔧 [CategoryService] Fetching category by ID:', categoryId);
    
    const category = await Category.findById(categoryId).populate('parent', 'name _id');
    return category ? this.transformCategory(category) : null;
  }

  /**
   * Update category
   * @param {string} categoryId - Category ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(categoryId, updateData) {
    console.log('🔧 [CategoryService] Updating category:', categoryId);
    
    // Validate business rules if parent is being changed
    if (updateData.parent) {
      await this.validateSubcategoryLimits(updateData.parent);
    }

    const category = await Category.findByIdAndUpdate(
      categoryId, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('parent', 'name _id');
    
    return this.transformCategory(category);
  }

  /**
   * Delete category
   * @param {string} categoryId - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(categoryId) {
    console.log('🔧 [CategoryService] Deleting category:', categoryId);
    
    const category = await Category.findById(categoryId);
    
    // Delete image if exists
    if (category.image?.path) {
      await this.deleteImage(category.image.path);
    }

    await Category.findByIdAndDelete(categoryId);
    return true;
  }

  /**
   * Check if category has subcategories
   * @param {string} categoryId - Category ID
   * @returns {Promise<boolean>} Has subcategories
   */
  async hasSubcategories(categoryId) {
    const count = await Category.countDocuments({ parent: categoryId });
    return count > 0;
  }

  /**
   * Build category hierarchy
   * @returns {Promise<Array>} Category tree
   */
  async buildCategoryHierarchy() {
    console.log('🔧 [CategoryService] Building category hierarchy...');
    
    const categories = await Category.find({ status: true })
      .populate('parent', 'name _id')
      .sort({ name: 1 });

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map
    categories.forEach(cat => {
      const transformed = this.transformCategory(cat);
      transformed.children = [];
      categoryMap.set(cat._id.toString(), transformed);
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
      const transformed = categoryMap.get(cat._id.toString());
      
      if (cat.parent) {
        const parent = categoryMap.get(cat.parent._id.toString());
        if (parent) {
          parent.children.push(transformed);
        }
      } else {
        rootCategories.push(transformed);
      }
    });

    return rootCategories;
  }

  /**
   * Process image upload
   * @param {Object} file - Uploaded file
   * @param {string} categoryName - Category name for alt text
   * @returns {Promise<Object>} Image data
   */
  async processImageUpload(file, categoryName) {
    console.log('🔧 [CategoryService] Processing image upload...');
    
    const imageUrl = getImageUrl(file.path, { protocol: 'http', get: () => 'localhost:5000' });
    
    // Create media record
    const media = new Media({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: imageUrl,
      category: 'category',
      alt: `${categoryName} image`
    });
    
    await media.save();
    
    return {
      url: imageUrl,
      path: file.path,
      filename: file.filename,
      mediaId: media._id
    };
  }

  /**
   * Delete image file
   * @param {string} imagePath - Image path
   * @returns {Promise<boolean>} Success status
   */
  async deleteImage(imagePath) {
    console.log('🔧 [CategoryService] Deleting image:', imagePath);
    
    try {
      deleteImageFile(imagePath);
      return true;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      return false;
    }
  }

  /**
   * Perform bulk operations
   * @param {string} operation - Operation type
   * @param {Array} categoryIds - Category IDs
   * @param {Object} data - Operation data
   * @returns {Promise<Object>} Operation result
   */
  async performBulkOperation(operation, categoryIds, data = {}) {
    console.log(`🔧 [CategoryService] Performing bulk ${operation} on ${categoryIds.length} categories`);
    
    let result = { success: 0, failed: 0, errors: [] };

    switch (operation) {
      case 'delete':
        for (const id of categoryIds) {
          try {
            const hasSubcats = await this.hasSubcategories(id);
            if (!hasSubcats) {
              await this.deleteCategory(id);
              result.success++;
            } else {
              result.failed++;
              result.errors.push(`Category ${id} has subcategories`);
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`Failed to delete ${id}: ${error.message}`);
          }
        }
        break;

      case 'updateStatus':
        try {
          await Category.updateMany(
            { _id: { $in: categoryIds } },
            { status: data.status }
          );
          result.success = categoryIds.length;
        } catch (error) {
          result.failed = categoryIds.length;
          result.errors.push(error.message);
        }
        break;

      default:
        throw new Error(`Unsupported bulk operation: ${operation}`);
    }

    return result;
  }

  /**
   * Validate main category limits
   */
  async validateMainCategoryLimits() {
    const mainCategoryCount = await Category.countDocuments({ parent: null });
    
    if (mainCategoryCount >= constants.BUSINESS_RULES.CATEGORY.MAX_MAIN_CATEGORIES) {
      throw new Error(`Maximum ${constants.BUSINESS_RULES.CATEGORY.MAX_MAIN_CATEGORIES} main categories allowed`);
    }
  }

  /**
   * Validate subcategory limits
   * @param {string} parentId - Parent category ID
   */
  async validateSubcategoryLimits(parentId) {
    const subcategoryCount = await Category.countDocuments({ parent: parentId });
    
    if (subcategoryCount >= constants.BUSINESS_RULES.CATEGORY.MAX_SUBCATEGORIES_PER_CATEGORY) {
      throw new Error(`Maximum ${constants.BUSINESS_RULES.CATEGORY.MAX_SUBCATEGORIES_PER_CATEGORY} subcategories per category allowed`);
    }
  }

  /**
   * Transform category for frontend compatibility
   * @param {Object} category - Category document
   * @returns {Object} Transformed category
   */
  transformCategory(category) {
    return {
      ...category.toObject(),
      id: category._id.toString() // Add id field for frontend compatibility
    };
  }
}

module.exports = new CategoryService();
