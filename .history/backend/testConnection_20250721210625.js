const mongoose = require('mongoose');
require('dotenv').config();

// Set mongoose options to avoid deprecation warnings
mongoose.set('strictQuery', false);

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('📍 Using connection string:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@') : 'NOT FOUND');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      maxPoolSize: 10,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`🔗 Ready State: ${conn.connection.readyState}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Collections found: ${collections.length}`);
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
};

testConnection();
