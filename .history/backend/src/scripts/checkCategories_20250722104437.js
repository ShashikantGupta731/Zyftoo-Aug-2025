const mongoose = require('mongoose');
const Category = require('../models/Category');
const connectDB = require('../config/db');

async function checkCategories() {
  try {
    await connectDB();
    
    console.log('🔍 Checking categories in database...');
    
    const categories = await Category.find();
    console.log(`📊 Found ${categories.length} categories in database:`);
    
    if (categories.length === 0) {
      console.log('❌ No categories found in database!');
      console.log('💡 You need to add some categories first.');
    } else {
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`);
        console.log(`   - Status: ${cat.status}`);
        console.log(`   - Parent: ${cat.parent || 'None (Main Category)'}`);
        console.log(`   - Image: ${cat.image?.url || 'No image'}`);
        console.log('   ---');
      });
    }
    
    // Also check with the same query as the controller
    const categoriesWithParent = await Category.find().populate('parent', 'name _id');
    console.log('🔍 Categories with populated parent data:');
    console.log(JSON.stringify(categoriesWithParent, null, 2));
    
  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script if called directly
if (require.main === module) {
  checkCategories();
}

module.exports = checkCategories;
