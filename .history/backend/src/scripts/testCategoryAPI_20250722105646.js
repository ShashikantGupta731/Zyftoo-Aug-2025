/**
 * Test Category API Response
 * This script directly tests the category API endpoint to see what data is being returned
 */

const axios = require('axios');

const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYwNzMyMCwiZXhwIjoxNzUzMjEyMTIwfQ.ugFuaDCq_ewqIE-dZaql3BB91kaXBIxE0TQmqdYnagI';
const API_BASE = 'http://localhost:5000/api';

async function testCategoryAPI() {
  console.log('🧪 === TESTING CATEGORY API ===');
  console.log('Backend URL:', API_BASE);
  console.log('Endpoint:', '/categories');
  console.log('Auth Token:', ADMIN_TOKEN ? 'Present' : 'Missing');
  
  try {
    console.log('\n1. Making direct HTTP request to backend...');
    const response = await axios.get(`${API_BASE}/categories`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n2. Raw HTTP Response Details:');
    console.log('   - Status:', response.status);
    console.log('   - Status Text:', response.statusText);
    console.log('   - Headers:', Object.keys(response.headers || {}));
    
    console.log('\n3. Response Data Analysis:');
    console.log('   - Data Type:', typeof response.data);
    console.log('   - Data Keys:', Object.keys(response.data || {}));
    console.log('   - Full Response Data:', JSON.stringify(response.data, null, 2));
    
    // Check if response has success property
    if (response.data && typeof response.data === 'object') {
      console.log('\n4. Response Structure:');
      console.log('   - Has success property:', 'success' in response.data);
      console.log('   - Success value:', response.data.success);
      console.log('   - Has data property:', 'data' in response.data);
      console.log('   - Data property type:', typeof response.data.data);
      console.log('   - Data is array:', Array.isArray(response.data.data));
      
      if (Array.isArray(response.data.data)) {
        console.log('   - Data array length:', response.data.data.length);
        console.log('\n5. Category Data Analysis:');
        response.data.data.forEach((category, index) => {
          console.log(`   Category ${index + 1}:`);
          console.log(`     - ID: ${category._id || category.id}`);
          console.log(`     - Name: ${category.name}`);
          console.log(`     - Has Parent: ${!!category.parent}`);
          console.log(`     - Parent: ${category.parent}`);
          console.log(`     - Status: ${category.status}`);
          console.log(`     - Full Object:`, category);
        });
        
        // Summary
        const mainCategories = response.data.data.filter(cat => !cat.parent);
        const subCategories = response.data.data.filter(cat => cat.parent);
        console.log('\n6. Summary:');
        console.log(`   - Total Categories: ${response.data.data.length}`);
        console.log(`   - Main Categories: ${mainCategories.length}`);
        console.log(`   - Sub Categories: ${subCategories.length}`);
        
      } else if (response.data.data) {
        console.log('   - Data is not an array, type:', typeof response.data.data);
        console.log('   - Data content:', response.data.data);
      }
    }
    
    console.log('\n✅ API Test Completed Successfully');
    
  } catch (error) {
    console.error('\n❌ API Test Failed:');
    console.error('Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response) {
      console.error('Response Error Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Also test the database directly
async function testDirectDB() {
  console.log('\n🗄️ === TESTING DATABASE DIRECTLY ===');
  
  try {
    // Import the database connection and models
    const mongoose = require('mongoose');
    require('../config/db');
    const Category = require('../models/Category');
    
    console.log('\n1. Database Connection Status:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to database...');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nic-gifting');
    }
    
    console.log('\n2. Querying categories directly from database...');
    const dbCategories = await Category.find({}).populate('parent', 'name');
    
    console.log('\n3. Database Results:');
    console.log('   - Total documents found:', dbCategories.length);
    
    dbCategories.forEach((cat, index) => {
      console.log(`   Category ${index + 1}:`);
      console.log(`     - ID: ${cat._id}`);
      console.log(`     - Name: ${cat.name}`);
      console.log(`     - Parent: ${cat.parent ? cat.parent.name || cat.parent : 'None'}`);
      console.log(`     - Status: ${cat.status}`);
      console.log(`     - Created: ${cat.createdAt}`);
    });
    
    const mainCats = dbCategories.filter(cat => !cat.parent);
    const subCats = dbCategories.filter(cat => cat.parent);
    
    console.log('\n4. Database Summary:');
    console.log(`   - Total in DB: ${dbCategories.length}`);
    console.log(`   - Main Categories: ${mainCats.length}`);
    console.log(`   - Sub Categories: ${subCats.length}`);
    
  } catch (error) {
    console.error('\n❌ Database Test Failed:', error.message);
  }
}

// Run both tests
async function runAllTests() {
  await testCategoryAPI();
  await testDirectDB();
  console.log('\n🏁 All tests completed');
  process.exit(0);
}

runAllTests();
