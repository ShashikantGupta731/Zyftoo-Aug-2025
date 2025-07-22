const express = require('express');
const router = express.Router();

// Mock data for demonstration - replace with actual database queries
const mockSectionConfig = {
  home: {
    giftCategories: {
      visible: true,
      order: 1,
      label: "Gift Categories",
      categories: [
        { id: 'cat1', name: 'Fashion & Clothing', enabled: true, image: '/assets/img/product/category/cat-1.jpg' },
        { id: 'cat2', name: 'Electronics', enabled: true, image: '/assets/img/product/category/cat-2.jpg' },
        { id: 'cat3', name: 'Home & Living', enabled: false, image: '/assets/img/product/category/cat-3.jpg' },
        { id: 'cat4', name: 'Health & Beauty', enabled: true, image: '/assets/img/product/category/cat-4.jpg' },
        { id: 'cat5', name: 'Sports & Outdoor', enabled: false, image: '/assets/img/product/category/cat-5.jpg' },
        { id: 'cat6', name: 'Books & Media', enabled: true, image: '/assets/img/product/category/cat-6.jpg' },
      ]
    }
  }
};

// Get page section configuration
router.get('/pages/:pageKey/sections/:sectionKey', (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    
    const sectionConfig = mockSectionConfig[pageKey]?.[sectionKey];
    
    if (!sectionConfig) {
      return res.status(404).json({ 
        error: 'Section not found',
        page: pageKey,
        section: sectionKey 
      });
    }

    res.json(sectionConfig);
  } catch (error) {
    console.error('Error fetching section config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update page section configuration
router.put('/pages/:pageKey/sections/:sectionKey', (req, res) => {
  try {
    const { pageKey, sectionKey } = req.params;
    const updateData = req.body;
    
    if (!mockSectionConfig[pageKey]) {
      mockSectionConfig[pageKey] = {};
    }
    
    // Update the section configuration
    mockSectionConfig[pageKey][sectionKey] = {
      ...mockSectionConfig[pageKey][sectionKey],
      ...updateData
    };

    console.log(`Updated ${pageKey}.${sectionKey}:`, updateData);
    
    res.json({ 
      success: true, 
      message: 'Section updated successfully',
      data: mockSectionConfig[pageKey][sectionKey]
    });
  } catch (error) {
    console.error('Error updating section config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories (filtered by enabled status)
router.get('/categories', (req, res) => {
  try {
    // Get categories from the gift categories section
    const giftCategoriesSection = mockSectionConfig.home?.giftCategories;
    
    if (!giftCategoriesSection || !giftCategoriesSection.categories) {
      return res.json([]);
    }
    
    // Return all categories (frontend will filter enabled ones)
    res.json(giftCategoriesSection.categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
