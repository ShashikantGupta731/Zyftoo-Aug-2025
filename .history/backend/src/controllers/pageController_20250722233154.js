const PageConfig = require('../models/PageConfig');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// Initialize default page configuration if not exists
const initializePageConfig = async (pageId) => {
  let pageConfig = await PageConfig.findById(pageId);
  
  if (!pageConfig) {
    // Create default configuration for home page
    const defaultConfig = {
      _id: pageId,
      name: pageId === 'home' ? 'Home Page' : 'Corporate Page',
      slug: pageId === 'home' ? '/' : '/corporate',
      sections: [
        {
          sectionType: 'categorySection',
          enabled: true,
          order: 1,
          config: {
            maxCategories: 6,
            categoryIds: [], // Array of selected category IDs
            showSubcategories: true,
            layout: 'grid'
          }
        },
        {
          sectionType: 'sliderSection',
          enabled: true,
          order: 2,
          config: {
            autoplay: true,
            duration: 5000,
            slides: []
          }
        },
        {
          sectionType: 'productSection',
          enabled: true,
          order: 3,
          config: {
            title: 'Featured Products',
            maxProducts: 8,
            category: null
          }
        }
      ]
    };
    
    pageConfig = new PageConfig(defaultConfig);
    await pageConfig.save();
  }
  
  return pageConfig;
};

// Get page configuration
exports.getPageConfig = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const pageConfig = await initializePageConfig(pageKey);
    
    // For each category section, populate with actual categories
    for (let section of pageConfig.sections) {
      if (section.sectionType === 'categorySection') {
        const categories = await Category.find({ status: true })
          .select('name image description')
          .lean();
        section.config.availableCategories = categories;
      }
    }
    
    res.json({
      success: true,
      data: pageConfig
    });
  } catch (error) {
    console.error('Error fetching page config:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch page configuration' 
    });
  }
};

// Get specific section configuration
exports.getSectionConfig = async (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    
    const pageConfig = await initializePageConfig(pageKey);
    const section = pageConfig.sections.find(s => s.sectionType === `${sectionKey}Section`);
    
    if (!section) {
      return res.status(404).json({ 
        success: false,
        error: 'Section not found'
      });
    }

    // For category section, also fetch actual categories
    if (sectionKey === 'category' || sectionKey === 'giftCategories') {
      const categories = await Category.find({ status: true })
        .select('name image description')
        .lean();
      section.config.availableCategories = categories;
    }

    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error fetching section config:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch section configuration' 
    });
  }
};

// Update section configuration
exports.updateSectionConfig = async (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    const updateData = req.body;
    
    let pageConfig = await PageConfig.findById(pageKey);
    if (!pageConfig) {
      pageConfig = await initializePageConfig(pageKey);
    }
    
    // Find and update the specific section
    const sectionIndex = pageConfig.sections.findIndex(s => s.sectionType === `${sectionKey}Section`);
    
    if (sectionIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Section not found' 
      });
    }
    
    // Update the section configuration
    pageConfig.sections[sectionIndex] = {
      ...pageConfig.sections[sectionIndex].toObject(),
      ...updateData,
      sectionType: `${sectionKey}Section` // Ensure sectionType doesn't change
    };

    pageConfig.lastModified = new Date();
    await pageConfig.save();

    console.log(`Updated ${pageKey}.${sectionKey}:`, updateData);
    
    res.json({ 
      success: true, 
      message: 'Section updated successfully',
      data: pageConfig.sections[sectionIndex]
    });
  } catch (error) {
    console.error('Error updating section config:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update section configuration' 
    });
  }
};

// Get categories for frontend display (filtered by page configuration)
exports.getCategoriesForDisplay = async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    // Get page configuration
    const pageConfig = await PageConfig.findById(pageKey);
    if (!pageConfig) {
      return res.status(404).json({ 
        success: false,
        error: 'Page configuration not found' 
      });
    }
    
    // Find category section
    const categorySection = pageConfig.sections.find(s => s.sectionType === 'categorySection');
    if (!categorySection || !categorySection.enabled) {
      return res.json({
        success: true,
        data: {
          enabled: false,
          categories: []
        }
      });
    }
    
    // Get categories based on configuration
    let query = { status: true };
    if (categorySection.config.categoryIds && categorySection.config.categoryIds.length > 0) {
      query._id = { $in: categorySection.config.categoryIds };
    }
    
    let categories = await Category.find(query)
      .select('name image description')
      .lean();
    
    // Apply maxCategories limit
    if (categorySection.config.maxCategories && categorySection.config.maxCategories > 0) {
      categories = categories.slice(0, categorySection.config.maxCategories);
    }
    
    // Transform for frontend
    const transformedCategories = categories.map(cat => ({
      id: cat._id,
      name: cat.name,
      image: cat.image?.url || '/assets/img/product/category/default-category.svg',
      icon: cat.image?.url || '/assets/img/product/category/default-category.svg',
      description: cat.description || '',
      enabled: true
    }));
    
    res.json({
      success: true,
      data: {
        enabled: categorySection.enabled,
        categories: transformedCategories,
        config: categorySection.config
      }
    });
  } catch (error) {
    console.error('Error fetching categories for display:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories' 
    });
  }
};

// Get all categories (for admin selection)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true })
      .select('name image description')
      .sort({ name: 1 })
      .lean();
    
    const transformedCategories = categories.map(cat => ({
      id: cat._id,
      value: cat._id,
      label: cat.name,
      name: cat.name,
      image: cat.image?.url || '/assets/img/product/category/default-category.svg',
      description: cat.description || ''
    }));
    
    res.json({
      success: true,
      data: transformedCategories
    });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories' 
    });
  }
};

// Update entire page configuration
exports.updatePageConfig = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { sections } = req.body;
    
    let pageConfig = await PageConfig.findById(pageKey);
    if (!pageConfig) {
      pageConfig = await initializePageConfig(pageKey);
    }
    
    // Update sections
    if (sections) {
      pageConfig.sections = sections;
    }
    
    pageConfig.lastModified = new Date();
    await pageConfig.save();
    
    res.json({
      success: true,
      message: 'Page configuration updated successfully',
      data: pageConfig
    });
  } catch (error) {
    console.error('Error updating page config:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update page configuration' 
    });
  }
};

// Enhanced method to get categories for homepage display
exports.getHomePageCategories = async (req, res) => {
  try {
    console.log('🏠 === GET HOME PAGE CATEGORIES START ===')
    
    // Get pageId from params (default to 'home')
    const pageId = req.params.pageId || 'home'
    console.log('1. Requested pageId:', pageId)
    
    // Find the page configuration
    const pageConfig = await PageConfig.findById(pageId)
    if (!pageConfig) {
      console.log('❌ PageConfig not found for pageId:', pageId)
      return res.status(404).json({
        success: false,
        message: `Page configuration not found for ${pageId}`
      })
    }
    
    console.log('2. Found PageConfig:', pageConfig.name)
    
    // Find the category section
    const categorySection = pageConfig.sections.find(section => 
      section.sectionType === 'categorySection'
    )
    
    if (!categorySection) {
      console.log('3. No category section found, returning disabled state')
      return res.status(200).json({
        success: true,
        data: {
          enabled: false,
          config: {},
          categories: []
        }
      })
    }
    
    console.log('3. Found category section - enabled:', categorySection.enabled)
    console.log('4. Section config:', categorySection.config)
    
    // If section is disabled, return early
    if (!categorySection.enabled) {
      return res.status(200).json({
        success: true,
        data: {
          enabled: false,
          config: categorySection.config || {},
          categories: []
        }
      })
    }
    
    // Extract category IDs from the config
    const configuredCategories = categorySection.config?.categories || []
    const categoryIds = configuredCategories.map(cat => cat.categoryId).filter(Boolean)
    
    console.log('5. Configured categories count:', configuredCategories.length)
    console.log('6. Category IDs to fetch:', categoryIds)
    
    if (categoryIds.length === 0) {
      console.log('7. No categories configured, returning empty array')
      return res.status(200).json({
        success: true,
        data: {
          enabled: true,
          config: categorySection.config || {},
          categories: []
        }
      })
    }
    
    // Use MongoDB aggregation to fetch categories with subcategories
    const mongoose = require('mongoose')
    
    console.log('8. Fetching category data from database...')
    
    const categoriesData = await Category.aggregate([
      // Match main categories by IDs
      {
        $match: {
          _id: { $in: categoryIds.map(id => new mongoose.Types.ObjectId(id)) },
          status: true
        }
      },
      // Lookup subcategories
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parent',
          as: 'subcategories'
        }
      },
      // Filter active subcategories only
      {
        $addFields: {
          subcategories: {
            $filter: {
              input: '$subcategories',
              cond: { $eq: ['$$this.status', true] }
            }
          }
        }
      },
      // Project required fields
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          subcategories: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1
          }
        }
      }
    ])
    
    console.log('9. Fetched categories from database:', categoriesData.length)
    
    // Transform data to match frontend expectations and maintain order
    const transformedCategories = []
    
    // Maintain the order from PageConfig
    for (const configCat of configuredCategories) {
      const categoryData = categoriesData.find(cat => 
        cat._id.toString() === configCat.categoryId
      )
      
      if (categoryData && configCat.enabled !== false) {
        const transformedCategory = {
          id: categoryData._id.toString(),
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.image?.url || categoryData.image?.filename || '/assets/img/product/category/default-category.svg',
          image: categoryData.image?.url || categoryData.image?.filename || '/assets/img/product/category/default-category.svg',
          order: configCat.order || 0,
          subcategories: []
        }
        
        // Add subcategories if enabled in config
        if (categorySection.config?.showSubcategories && categoryData.subcategories) {
          transformedCategory.subcategories = categoryData.subcategories.map(sub => ({
            id: sub._id.toString(),
            name: sub.name,
            description: sub.description,
            icon: sub.image?.url || sub.image?.filename || '/assets/img/product/category/default-category.svg',
            image: sub.image?.url || sub.image?.filename || '/assets/img/product/category/default-category.svg'
          }))
        }
        
        transformedCategories.push(transformedCategory)
      }
    }
    
    // Sort by order
    transformedCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // Apply maxCategories limit if set
    const maxCategories = categorySection.config?.maxCategories
    const finalCategories = maxCategories && maxCategories > 0 
      ? transformedCategories.slice(0, maxCategories)
      : transformedCategories
    
    console.log('10. Final categories to return:', finalCategories.length)
    console.log('11. Category names:', finalCategories.map(c => c.name))
    
    const responseData = {
      enabled: true,
      config: {
        maxCategories: categorySection.config?.maxCategories || 0,
        layout: categorySection.config?.layout || 'grid',
        showSubcategories: categorySection.config?.showSubcategories || false
      },
      categories: finalCategories
    }
    
    console.log('✅ === GET HOME PAGE CATEGORIES SUCCESS ===')
    
    res.status(200).json({
      success: true,
      data: responseData
    })
    
  } catch (error) {
    console.error('❌ === GET HOME PAGE CATEGORIES ERROR ===')
    console.error('Error fetching home page categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    })
  }
};

// Update category section configuration
exports.updateCategorySection = async (req, res) => {
  try {
    const { enabled, maxCategories, categories, layout, showSubcategories } = req.body;
    
    let pageConfig = await PageConfig.findById('home');
    if (!pageConfig) {
      // Create default config if not exists
      pageConfig = await initializePageConfig('home');
    }
    
    // Find category section
    const sectionIndex = pageConfig.sections.findIndex(s => s.sectionType === 'categorySection');
    
    if (sectionIndex === -1) {
      // Add category section if not exists
      pageConfig.sections.push({
        sectionType: 'categorySection',
        enabled: enabled ?? true,
        order: 1,
        config: {
          maxCategories: maxCategories || 6,
          categories: categories || [],
          layout: layout || 'grid',
          showSubcategories: showSubcategories ?? true
        }
      });
    } else {
      // Update existing section
      pageConfig.sections[sectionIndex].enabled = enabled ?? pageConfig.sections[sectionIndex].enabled;
      pageConfig.sections[sectionIndex].config = {
        ...pageConfig.sections[sectionIndex].config,
        maxCategories: maxCategories ?? pageConfig.sections[sectionIndex].config.maxCategories,
        categories: categories ?? pageConfig.sections[sectionIndex].config.categories,
        layout: layout ?? pageConfig.sections[sectionIndex].config.layout,
        showSubcategories: showSubcategories ?? pageConfig.sections[sectionIndex].config.showSubcategories
      };
    }
    
    pageConfig.lastModified = new Date();
    await pageConfig.save();
    
    res.json({
      success: true,
      message: 'Category section updated successfully',
      data: pageConfig.sections[sectionIndex]
    });
    
  } catch (error) {
    console.error('Error updating category section:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update category section' 
    });
  }
};

// Add refresh endpoint for real-time updates
exports.refreshPageSection = async (req, res) => {
  try {
    const { pageId, sectionType } = req.params;
    
    // You can use WebSocket or Server-Sent Events here
    // For now, just return a timestamp for polling
    res.json({
      success: true,
      data: {
        lastUpdate: new Date().toISOString(),
        pageId,
        sectionType
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to refresh section' 
    });
  }
};

// Generic method for any page
exports.getPageCategories = async (req, res) => {
  try {
    console.log('📄 === GET PAGE CATEGORIES START ===')
    
    const { pageId } = req.params
    console.log('1. Requested pageId:', pageId)
    
    // Reuse the logic from getHomePageCategories
    req.params.pageId = pageId
    return await exports.getHomePageCategories(req, res)
    
  } catch (error) {
    console.error('❌ === GET PAGE CATEGORIES ERROR ===')
    console.error('Error fetching page categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page categories',
      error: error.message
    })
  }
}

// Fallback method to get all categories when PageConfig is not available
exports.getAllCategoriesAsFallback = async (req, res) => {
  try {
    console.log('🔄 === FALLBACK CATEGORIES START ===')
    
    // Get main categories with subcategories
    const categories = await Category.aggregate([
      // Get only main categories (no parent)
      {
        $match: {
          parent: null,
          status: true
        }
      },
      // Lookup subcategories
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parent',
          as: 'subcategories'
        }
      },
      // Filter active subcategories
      {
        $addFields: {
          subcategories: {
            $filter: {
              input: '$subcategories',
              cond: { $eq: ['$$this.status', true] }
            }
          }
        }
      },
      // Limit to first 6 categories
      { $limit: 6 },
      // Project required fields
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          subcategories: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1
          }
        }
      }
    ])
    
    // Transform to frontend format
    const transformedCategories = categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description,
      icon: cat.image?.url || cat.image?.filename || '/assets/img/product/category/default-category.svg',
      image: cat.image?.url || cat.image?.filename || '/assets/img/product/category/default-category.svg',
      subcategories: cat.subcategories.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        description: sub.description,
        icon: sub.image?.url || sub.image?.filename || '/assets/img/product/category/default-category.svg',
        image: sub.image?.url || sub.image?.filename || '/assets/img/product/category/default-category.svg'
      }))
    }))
    
    console.log('✅ Fallback categories count:', transformedCategories.length)
    
    res.status(200).json({
      success: true,
      data: {
        enabled: true,
        config: {
          maxCategories: 6,
          layout: 'grid',
          showSubcategories: true
        },
        categories: transformedCategories
      }
    })
    
  } catch (error) {
    console.error('❌ Fallback categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fallback categories',
      error: error.message
    })
  }
}
