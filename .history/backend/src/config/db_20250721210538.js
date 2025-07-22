const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Set mongoose options globally to avoid deprecation warnings
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Remove deprecated options - they're no longer needed in modern versions
      serverSelectionTimeoutMS: 30000, // Wait up to 30 seconds for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
