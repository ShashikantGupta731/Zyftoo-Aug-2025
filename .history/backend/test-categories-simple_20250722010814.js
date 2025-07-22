const mongoose = require('mongoose');
const Category = require('./src/models/Category');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

async function testCategories() {
  try {
    console.log('Testing category retrieval...');
    
    // Get all categories
    const categories = await Category.find().lean();
    console.log(`Found ${categories.length} categories:`);
    
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ID: ${cat._id}, Name: ${cat.name}, Status: ${cat.status}`);
      if (cat.image) {
        console.log(`   Image URL: ${cat.image.url}`);
      }
    });
    
    // Test the specific query used in the controller
    const activeCategories = await Category.find({ status: true }).lean();
    console.log(`\nActive categories: ${activeCategories.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testCategories();
