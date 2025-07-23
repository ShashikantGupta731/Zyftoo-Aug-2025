const fs = require('fs').promises;
const path = require('path');

/**
 * Updates the static giftPageCategories.js file with latest data
 */
async function updateGiftCategoriesFile(categories, config = {}) {
  try {
    console.log('📝 === UPDATING STATIC FILE ===');
    console.log('Categories to write:', categories.length);
    
    // Path to the frontend data file
    const filePath = path.join(__dirname, '../../../Ninico/data/giftPageCategories.js');
    console.log('File path:', filePath);
    
    // Generate the file content
    const fileContent = generateGiftCategoriesContent(categories, config);
    
    // Write to file
    await fs.writeFile(filePath, fileContent, 'utf8');
    console.log('✅ Static file updated successfully');
    
    return { success: true, path: filePath };
  } catch (error) {
    console.error('❌ Error updating static file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generates the content for giftPageCategories.js
 */
function generateGiftCategoriesContent(categories, config) {
  // Transform categories to match frontend structure
  const transformedCategories = categories.map((cat, index) => ({
    id: cat.id || cat._id?.toString(),
    name: cat.name,
    description: cat.description || `${cat.name} products and accessories`,
    icon: cat.icon || cat.image || `assets/img/features/feature-icon-${String(index + 1).padStart(2, '0')}.png`,
    image: cat.image || cat.icon || `assets/img/features/feature-icon-${String(index + 1).padStart(2, '0')}.png`,
    order: cat.order !== undefined ? cat.order : index,
    subcategories: cat.subcategories ? cat.subcategories.map(sub => ({
      id: sub.id || sub._id?.toString(),
      name: sub.name,
      description: sub.description || `${sub.name} items`,
      icon: sub.icon || sub.image || cat.icon,
      image: sub.image || sub.icon || cat.image,
      children: sub.children || []
    })) : []
  }));

  const timestamp = new Date().toISOString();
  
  return `// Auto-generated file - Updated from admin panel
// Last updated: ${timestamp}
// Configuration: ${JSON.stringify(config, null, 2)}

export const giftPageCategories = ${JSON.stringify(transformedCategories, null, 2)};

// Metadata
export const giftCategoriesMetadata = {
  lastUpdated: "${timestamp}",
  totalCategories: ${transformedCategories.length},
  source: "admin_panel",
  config: ${JSON.stringify(config, null, 2)}
};
`;
}

module.exports = {
  updateGiftCategoriesFile,
  generateGiftCategoriesContent
};
