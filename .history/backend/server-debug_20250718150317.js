const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables first
dotenv.config();

// Initialize Express app
const app = express();

// Basic middleware setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'], 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Ninico E-commerce API is running...',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test successful', 
    timestamp: new Date().toISOString()
  });
});

console.log('Setting up database connection...');
// Connect to database
try {
  const connectDB = require('./src/config/db');
  connectDB();
  console.log('✅ Database connection setup complete');
} catch (error) {
  console.error('❌ Database connection error:', error.message);
}

// Import and setup routes one by one with error handling
console.log('Setting up routes...');

// Auth Routes
try {
  const authRoutes = require('./src/routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Auth routes error:', error.message);
}

// User Routes
try {
  const userRoutes = require('./src/routes/userRoutes');
  app.use('/api/user', userRoutes);
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ User routes error:', error.message);
}

// OTP Routes
try {
  const otpRoutes = require('./src/routes/otpRoutes');
  app.use('/api/otp', otpRoutes);
  console.log('✅ OTP routes loaded');
} catch (error) {
  console.error('❌ OTP routes error:', error.message);
}

// Product Routes
try {
  const productRoutes = require('./src/routes/productRoutes');
  app.use('/api/products', productRoutes);
  console.log('✅ Product routes loaded');
} catch (error) {
  console.error('❌ Product routes error:', error.message);
}

// Category Routes
try {
  const categoryRoutes = require('./src/routes/categoryRoutes');
  app.use('/api/categories', categoryRoutes);
  console.log('✅ Category routes loaded');
} catch (error) {
  console.error('❌ Category routes error:', error.message);
}

// Order Routes
try {
  const orderRoutes = require('./src/routes/orderRoutes');
  app.use('/api/orders', orderRoutes);
  console.log('✅ Order routes loaded');
} catch (error) {
  console.error('❌ Order routes error:', error.message);
}

// Cart Routes
try {
  const cartRoutes = require('./src/routes/cartRoutes');
  app.use('/api/cart', cartRoutes);
  console.log('✅ Cart routes loaded');
} catch (error) {
  console.error('❌ Cart routes error:', error.message);
}

// Wishlist Routes
try {
  const wishlistRoutes = require('./src/routes/wishlistRoutes');
  app.use('/api/wishlist', wishlistRoutes);
  console.log('✅ Wishlist routes loaded');
} catch (error) {
  console.error('❌ Wishlist routes error:', error.message);
}

// Address Routes
try {
  const addressRoutes = require('./src/routes/addressRoutes');
  app.use('/api/address', addressRoutes);
  console.log('✅ Address routes loaded');
} catch (error) {
  console.error('❌ Address routes error:', error.message);
}

// Corporate Routes
try {
  const corporateRoutes = require('./src/routes/corporateRoutes');
  app.use('/api/corporate', corporateRoutes);
  console.log('✅ Corporate routes loaded');
} catch (error) {
  console.error('❌ Corporate routes error:', error.message);
}

// Track Order Routes
try {
  const trackOrderRoutes = require('./src/routes/trackOrderRoutes');
  app.use('/api/track', trackOrderRoutes);
  console.log('✅ Track order routes loaded');
} catch (error) {
  console.error('❌ Track order routes error:', error.message);
}

// Upload Routes
try {
  const uploadRoutes = require('./src/routes/uploadRoutes');
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Upload routes loaded');
} catch (error) {
  console.error('❌ Upload routes error:', error.message);
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📋 Routes setup complete');
});
