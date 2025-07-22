const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { getCorsOptions } = require('./src/config/corsOptions');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { cryptoMiddleware } = require('./src/middleware/cryptoMiddleware');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const enhancedAuthRoutes = require('./src/routes/enhancedAuthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const corporateRoutes = require('./src/routes/corporateRoutes');
const trackOrderRoutes = require('./src/routes/trackOrderRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors(getCorsOptions()));

// Rate limiting
app.use('/api/', apiLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Crypto middleware for encryption/decryption
app.use('/api/', cryptoMiddleware);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint (no encryption required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes with versioning (Enhanced with encryption)
// app.use('/api/v1/auth', enhancedAuthRoutes); // Temporarily disabled for debugging
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/otp', otpRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/corporate', corporateRoutes);
app.use('/api/v1', trackOrderRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Legacy API routes (backward compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api', trackOrderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/', (req, res) => {
  res.json({ 
    message: 'Ninico E-commerce API is running...',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test route for debugging (encrypted response)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test successful', 
    timestamp: new Date().toISOString(),
    encrypted: true
  });
});

// Test encrypted endpoint
app.post('/api/test-encryption', (req, res) => {
  res.json({
    message: 'Encryption test successful',
    receivedData: req.decryptedBody,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Don't expose error details in production
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
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
  console.log(`🔒 Encryption: Enabled`);
  console.log(`🛡️  Security: Rate limiting, CORS, Helmet enabled`);
});
