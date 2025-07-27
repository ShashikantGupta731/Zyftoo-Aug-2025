const mongoose = require('mongoose');
const PageConfig = require('../models/PageConfig');
const Category = require('../models/Category');
const connectDB = require('../config/db');

async function initializeHomePageConfig() {
  try {
    await connectDB();
    
    console.log('🏠 Checking home page configuration...');
    
    // Check if home page config already exists
    let homePageConfig = await PageConfig.findById('home');
    
    if (homePageConfig) {
      console.log('✅ Home page configuration already exists');
      return;
    }
    
    console.log('🔧 Creating default home page configuration...');
    
    // Get first 6 categories for default setup
    const categories = await Category.find({ status: true }).limit(6).select('_id');
    const categoryIds = categories.map(cat => cat._id.toString());
    
    // Create default home page configuration
    const defaultHomeConfig = {
      _id: 'home',
      name: 'Home Page',
      slug: '/',
      sections: [
        {
          sectionType: 'categorySection',
          enabled: true,
          order: 1,
          config: {
            maxCategories: 6,
            categories: categoryIds.map((id, index) => ({
              categoryId: id,
              enabled: true,
              order: index
            })),
            layout: 'grid',
            showSubcategories: true
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
        },
        {
          sectionType: 'bannerSection',
          enabled: true,
          order: 4,
          config: {
            banners: []
          }
        },
        {
          sectionType: 'dealSection',
          enabled: true,
          order: 5,
          config: {
            title: 'Deal Products',
            maxProducts: 6,
            showTimer: true
          }
        }
      ]
    };
    
    homePageConfig = new PageConfig(defaultHomeConfig);
    await homePageConfig.save();
    
    console.log('✅ Home page configuration created successfully!');
    console.log(`📊 Configured with ${categoryIds.length} categories`);
    
  } catch (error) {
    console.error('❌ Error initializing home page configuration:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script if called directly
if (require.main === module) {
  initializeHomePageConfig();
}

module.exports = initializeHomePageConfig;
