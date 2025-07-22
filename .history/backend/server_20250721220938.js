const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const cors = require('cors');

const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const corporateRoutes = require('./src/routes/corporateRoutes');
const trackOrderRoutes = require('./src/routes/trackOrderRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const subcategoryRoutes = require('./src/routes/subcategoryRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const testRoutes = require('./src/routes/testRoutes');
const pageRoutes = require('./src/routes/pageRoutes');


dotenv.config();

// Test crypto utility at startup
console.log('🧪 Testing crypto utility at startup...');
try {
  const { encryptData, decryptData } = require('./src/utils/cryptoUtil');
  const testData = { test: 'startup' };
  const encrypted = encryptData(testData);
  const decrypted = decryptData(encrypted);
  console.log('✅ Crypto utility working at startup');
  console.log('🔑 Environment key available:', !!process.env.ENCRYPTION_KEY);
  console.log('🔑 Environment key length:', process.env.ENCRYPTION_KEY?.length || 0);
} catch (startupError) {
  console.error('❌ Crypto utility failed at startup:', startupError.message);
}

const app = express();
connectDB();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'], 
  credentials: true
}));


app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`🌐 REQUEST: ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  console.log(`🌐 Body size:`, req.body ? JSON.stringify(req.body).length : 0);
  if (req.path.includes('/auth/')) {
    console.log('🔐 AUTH REQUEST DETECTED:', req.body);
  }
  next();
});


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
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/test', testRoutes);
app.use('/api', pageRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test successful', timestamp: new Date().toISOString() });
});

// Routes (added later)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
