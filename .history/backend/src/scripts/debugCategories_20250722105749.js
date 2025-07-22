const mongoose = require('mongoose');
const Category = require('../models/Category');
const connectDB = require('../config/db');

async function debugCategories() {
  try {
    await connectDB();
    
    console.log('🔍 === DEBUGGING CATEGORIES ===');
    
    // 1. Check total categories in database
    const totalCategories = await Category.countDocuments();
    console.log(`📊 Total categories in database: ${totalCategories}`);
    
    // 2. Check active categories
    const activeCategories = await Category.countDocuments({ status: true });
    console.log(`✅ Active categories: ${activeCategories}`);
    
    // 3. Check inactive categories
    const inactiveCategories = await Category.countDocuments({ status: false });
    console.log(`❌ Inactive categories: ${inactiveCategories}`);
    
    // 4. Get all categories with details
    const allCategories = await Category.find().populate('parent', 'name _id');
    console.log('\n📋 All categories in database:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
      console.log(`   - ID: ${cat._id}`);
      console.log(`   - Status: ${cat.status}`);
      console.log(`   - Parent: ${cat.parent ? cat.parent.name : 'None (Main Category)'}`);
      console.log(`   - Image: ${cat.image?.url || 'No image'}`);
      console.log(`   - Description: ${cat.description || 'No description'}`);
      console.log('   ---');
    });
    
    // 5. Test the exact same query as the controller
    console.log('\n🔄 Testing controller query...');
    const controllerCategories = await Category.find().populate('parent', 'name _id');
    const transformedCategories = controllerCategories.map(cat => ({
      ...cat.toObject(),
      id: cat._id.toString(),
    }));
    
    console.log(`🎯 Controller would return ${transformedCategories.length} categories`);
    console.log('Sample transformed category:', JSON.stringify(transformedCategories[0], null, 2));
    
    // 6. Check only main categories
    const mainCategories = await Category.find({ parent: null }).populate('parent', 'name _id');
    console.log(`\n🏠 Main categories: ${mainCategories.length}`);
    mainCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`);
    });
    
    // 7. Check subcategories
    const subCategories = await Category.find({ parent: { $ne: null } }).populate('parent', 'name _id');
    console.log(`\n🔗 Subcategories: ${subCategories.length}`);
    subCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Parent: ${cat.parent?.name || 'Unknown'})`);
    });
    
  } catch (error) {
    console.error('❌ Error debugging categories:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script if called directly
if (require.main === module) {
  debugCategories();
}

module.exports = debugCategories;
