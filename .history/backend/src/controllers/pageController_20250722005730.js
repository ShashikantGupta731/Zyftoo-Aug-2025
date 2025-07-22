const PageConfig = require('../models/PageConfig');
const Category = require('../models/Category');

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
