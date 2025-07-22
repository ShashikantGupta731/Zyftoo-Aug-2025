const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const PageConfig = require('./src/models/PageConfig');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ninico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedCategories = async () => {
  try {
    console.log('🌱 Seeding categories...');
    
    // Clear existing categories
    await Category.deleteMany({});
    await PageConfig.deleteMany({});
    
    // Sample categories
    const categories = [
      {
        name: 'Fashion & Clothing',
        description: 'Trendy clothes and fashion accessories',
        image: {
          url: '/assets/img/product/category/fashion.jpg',
          filename: 'fashion.jpg'
        },
        status: true
      },
      {
        name: 'Electronics',
        description: 'Latest gadgets and electronic devices',
        image: {
          url: '/assets/img/product/category/electronics.jpg',
          filename: 'electronics.jpg'
        },
        status: true
      },
      {
        name: 'Home & Living',
        description: 'Home decor and living essentials',
        image: {
          url: '/assets/img/product/category/home.jpg',
          filename: 'home.jpg'
        },
        status: true
      },
      {
        name: 'Health & Beauty',
        description: 'Beauty products and health supplements',
        image: {
          url: '/assets/img/product/category/beauty.jpg',
          filename: 'beauty.jpg'
        },
        status: true
      },
      {
        name: 'Sports & Outdoor',
        description: 'Sports equipment and outdoor gear',
        image: {
          url: '/assets/img/product/category/sports.jpg',
          filename: 'sports.jpg'
        },
        status: true
      },
      {
        name: 'Books & Media',
        description: 'Books, magazines, and digital media',
        image: {
          url: '/assets/img/product/category/books.jpg',
          filename: 'books.jpg'
        },
        status: true
      },
      {
        name: 'Toys & Games',
        description: 'Fun toys and games for all ages',
        image: {
          url: '/assets/img/product/category/toys.jpg',
          filename: 'toys.jpg'
        },
        status: true
      },
      {
        name: 'Food & Beverages',
        description: 'Delicious food and refreshing drinks',
        image: {
          url: '/assets/img/product/category/food.jpg',
          filename: 'food.jpg'
        },
        status: true
      }
    ];
    
    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);
    
    // Create default page configuration for home page
    const homePageConfig = {
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
            layout: 'grid',
            showSubcategories: true,
            categories: insertedCategories.slice(0, 6).map((cat, index) => ({
              categoryId: cat._id.toString(),
              enabled: true,
              order: index
            }))
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
    
    const homeConfig = new PageConfig(homePageConfig);
    await homeConfig.save();
    console.log('✅ Created home page configuration');
    
    // Create corporate page configuration
    const corporatePageConfig = {
      _id: 'corporate',
      name: 'Corporate Page',
      slug: '/corporate',
      sections: [
        {
          sectionType: 'categorySection',
          enabled: true,
          order: 1,
          config: {
            maxCategories: 4,
            layout: 'grid',
            showSubcategories: false,
            categories: insertedCategories.slice(0, 4).map((cat, index) => ({
              categoryId: cat._id.toString(),
              enabled: true,
              order: index
            }))
          }
        }
      ]
    };
    
    const corporateConfig = new PageConfig(corporatePageConfig);
    await corporateConfig.save();
    console.log('✅ Created corporate page configuration');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log(`📦 Categories: ${insertedCategories.length}`);
    console.log('📄 Pages: home, corporate');
    
    // Log sample category IDs for reference
    console.log('\n📋 Sample Category IDs:');
    insertedCategories.forEach(cat => {
      console.log(`  ${cat.name}: ${cat._id}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedCategories();
