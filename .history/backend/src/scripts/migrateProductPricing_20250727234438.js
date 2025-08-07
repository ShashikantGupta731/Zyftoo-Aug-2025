/**
 * Migration Script: Add Corporate Pricing to Existing Products
 * This script safely migrates existing products to the new pricing structure
 * WITHOUT breaking existing functionality
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the updated Product model
const Product = require('../models/Product');

async function migrateProducts() {
  try {
    console.log('🚀 Starting Product Migration...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find products that need migration (don't have retailPrice structure)
    const productsToMigrate = await Product.find({
      $or: [
        { retailPrice: { $exists: false } },
        { retailPrice: null },
        { 'retailPrice.sellingPrice': { $exists: false } }
      ]
    });

    console.log(`📊 Found ${productsToMigrate.length} products to migrate`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of productsToMigrate) {
      try {
        // Only update if necessary
        const updateData = {};
        
        // Migrate retail pricing
        if (!product.retailPrice || !product.retailPrice.sellingPrice) {
          updateData.retailPrice = {
            mrp: product.price || 0,
            sellingPrice: product.price || 0,
            discount: 0,
            currency: 'INR'
          };
        }

        // Add empty corporate pricing structure if not present
        if (!product.corporatePricing) {
          updateData.corporatePricing = {
            enabled: false,
            minimumOrderQuantity: 1,
            priceTiers: []
          };
        }

        if (Object.keys(updateData).length > 0) {
          await Product.findByIdAndUpdate(product._id, updateData);
          migrated++;
          console.log(`✅ Migrated: ${product.name}`);
        } else {
          skipped++;
          console.log(`⏭️  Skipped: ${product.name} (already migrated)`);
        }

      } catch (error) {
        errors++;
        console.error(`❌ Error migrating ${product.name}:`, error.message);
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Migrated: ${migrated} products`);
    console.log(`   ⏭️  Skipped: ${skipped} products`);
    console.log(`   ❌ Errors: ${errors} products`);
    
    // Verify migration
    const totalProducts = await Product.countDocuments();
    const migratedProducts = await Product.countDocuments({
      'retailPrice.sellingPrice': { $exists: true }
    });
    
    console.log(`\n🔍 Verification:`);
    console.log(`   Total products: ${totalProducts}`);
    console.log(`   Products with new pricing: ${migratedProducts}`);
    console.log(`   Migration success rate: ${((migratedProducts / totalProducts) * 100).toFixed(2)}%`);

    if (migratedProducts === totalProducts) {
      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('⚠️  Some products may need manual review');
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from database');
  }
}

// Rollback function (if needed)
async function rollbackMigration() {
  try {
    console.log('🔄 Starting rollback...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Remove the new fields (keeping legacy price field)
    const result = await Product.updateMany(
      {},
      {
        $unset: {
          retailPrice: "",
          corporatePricing: ""
        }
      }
    );
    
    console.log(`✅ Rollback completed. ${result.modifiedCount} products updated.`);
    
  } catch (error) {
    console.error('❌ Rollback failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args[0] === 'rollback') {
  rollbackMigration();
} else {
  migrateProducts();
}

module.exports = { migrateProducts, rollbackMigration };
