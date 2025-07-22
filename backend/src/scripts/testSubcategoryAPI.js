/**
 * Test Subcategory API
 * This script directly tests the subcategory API endpoint
 */

const axios = require('axios');

const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYwNzMyMCwiZXhwIjoxNzUzMjEyMTIwfQ.ugFuaDCq_ewqIE-dZaql3BB91kaXBIxE0TQmqdYnagI';
const API_BASE = 'http://localhost:5000/api';

async function testSubcategoryAPI() {
  console.log('🧪 === TESTING SUBCATEGORY API ===');
  console.log('Backend URL:', API_BASE);
  console.log('Endpoint:', '/subcategories');
  
  try {
    console.log('\n1. Making direct HTTP request to subcategories endpoint...');
    const response = await axios.get(`${API_BASE}/subcategories`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n2. Raw HTTP Response Details:');
    console.log('   - Status:', response.status);
    console.log('   - Status Text:', response.statusText);
    
    console.log('\n3. Response Data Analysis:');
    console.log('   - Data Type:', typeof response.data);
    console.log('   - Data Keys:', Object.keys(response.data || {}));
    console.log('   - Full Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && typeof response.data === 'object') {
      console.log('\n4. Response Structure:');
      console.log('   - Has success property:', 'success' in response.data);
      console.log('   - Success value:', response.data.success);
      console.log('   - Has data property:', 'data' in response.data);
      console.log('   - Data property type:', typeof response.data.data);
      console.log('   - Data is array:', Array.isArray(response.data.data));
      
      if (Array.isArray(response.data.data)) {
        console.log('   - Data array length:', response.data.data.length);
        console.log('\n5. Subcategory Data Analysis:');
        response.data.data.forEach((subcategory, index) => {
          console.log(`   Subcategory ${index + 1}:`);
          console.log(`     - ID: ${subcategory._id || subcategory.id}`);
          console.log(`     - Name: ${subcategory.name}`);
          console.log(`     - Parent ID: ${subcategory.parent?._id || subcategory.parent}`);
          console.log(`     - Parent Name: ${subcategory.parent?.name || 'Unknown'}`);
          console.log(`     - Status: ${subcategory.status}`);
          console.log(`     - Full Object:`, subcategory);
        });
        
        console.log('\n6. Summary:');
        console.log(`   - Total Subcategories: ${response.data.data.length}`);
        console.log(`   - Active Subcategories: ${response.data.data.filter(sub => sub.status).length}`);
        
        // Group by parent
        const byParent = {};
        response.data.data.forEach(sub => {
          const parentId = sub.parent?._id || sub.parent;
          const parentName = sub.parent?.name || 'Unknown';
          if (!byParent[parentId]) {
            byParent[parentId] = { name: parentName, subcategories: [] };
          }
          byParent[parentId].subcategories.push(sub.name);
        });
        
        console.log('\n7. Grouped by Parent Category:');
        Object.entries(byParent).forEach(([parentId, data]) => {
          console.log(`   Parent: ${data.name} (${parentId})`);
          console.log(`     Subcategories: ${data.subcategories.join(', ')}`);
        });
        
      } else if (response.data.data) {
        console.log('   - Data is not an array, type:', typeof response.data.data);
        console.log('   - Data content:', response.data.data);
      }
    }
    
    console.log('\n✅ Subcategory API Test Completed Successfully');
    
  } catch (error) {
    console.error('\n❌ Subcategory API Test Failed:');
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

// Also test categories for comparison
async function testCategoriesAPI() {
  console.log('\n📋 === TESTING CATEGORIES API FOR COMPARISON ===');
  
  try {
    const response = await axios.get(`${API_BASE}/categories`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Categories Response:', {
      success: response.data.success,
      count: response.data.count,
      dataLength: response.data.data?.length
    });
    
    if (Array.isArray(response.data.data)) {
      const mainCategories = response.data.data.filter(cat => !cat.parent);
      const subCategories = response.data.data.filter(cat => cat.parent);
      
      console.log('Categories Breakdown:');
      console.log(`   - Main Categories: ${mainCategories.length}`);
      console.log(`   - Sub Categories: ${subCategories.length} (embedded in categories)`);
      
      console.log('Main Categories:');
      mainCategories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat._id})`);
      });
    }
    
  } catch (error) {
    console.error('Categories API Error:', error.message);
  }
}

// Run both tests
async function runAllTests() {
  await testSubcategoryAPI();
  await testCategoriesAPI();
  console.log('\n🏁 All API tests completed');
  process.exit(0);
}

runAllTests();
