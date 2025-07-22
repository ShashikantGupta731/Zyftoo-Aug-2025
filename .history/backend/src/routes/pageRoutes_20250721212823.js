const express = require('express');
const router = express.Router();
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
            layout: 'grid',
            showSubcategories: true,
            categories: [] // Will be populated from actual categories
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

// Get page section configuration
router.get('/pages/:pageKey/sections/:sectionKey', async (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    
    const pageConfig = await initializePageConfig(pageKey);
    const section = pageConfig.sections.find(s => s.sectionType === `${sectionKey}Section`);
    
    if (!section) {
      return res.status(404).json({ 
        error: 'Section not found',
        page: pageKey,
        section: sectionKey 
      });
    }

    // For category section, also fetch actual categories
    if (sectionKey === 'giftCategories' || sectionKey === 'category') {
      const categories = await Category.find({ status: true }).lean();
      section.config.availableCategories = categories;
    }

    res.json(section);
  } catch (error) {
    console.error('Error fetching section config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update page section configuration
router.put('/pages/:pageKey/sections/:sectionKey', async (req, res) => {
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
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Update the section configuration
    pageConfig.sections[sectionIndex] = {
      ...pageConfig.sections[sectionIndex].toObject(),
      ...updateData,
      sectionType: `${sectionKey}Section` // Ensure sectionType doesn't change
    };

    await pageConfig.save();

    console.log(`Updated ${pageKey}.${sectionKey}:`, updateData);
    
    res.json({ 
      success: true, 
      message: 'Section updated successfully',
      data: pageConfig.sections[sectionIndex]
    });
  } catch (error) {
    console.error('Error updating section config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories for the category section
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ status: true })
      .select('name image parent')
      .lean();
    
    // Transform to match frontend expectations
    const transformedCategories = categories.map(cat => ({
      id: cat._id,
      name: cat.name,
      icon: cat.image?.url || '/assets/img/product/category/default-category.svg',
      image: cat.image?.url || '/assets/img/product/category/default-category.svg',
      enabled: true, // All fetched categories are enabled by default
      subcategories: [] // TODO: Populate subcategories if needed
    }));
    
    res.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get complete page configuration
router.get('/pages/:pageKey', async (req, res) => {
  try {
    const { pageKey } = req.params;
    const pageConfig = await initializePageConfig(pageKey);
    
    // For each category section, populate with actual categories
    for (let section of pageConfig.sections) {
      if (section.sectionType === 'categorySection') {
        const categories = await Category.find({ status: true }).lean();
        section.config.availableCategories = categories;
        
        // If no categories are configured, use all available categories
        if (!section.config.categories || section.config.categories.length === 0) {
          section.config.categories = categories.map(cat => ({
            categoryId: cat._id,
            enabled: true,
            order: 0
          }));
        }
      }
    }
    
    res.json(pageConfig);
  } catch (error) {
    console.error('Error fetching page config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
