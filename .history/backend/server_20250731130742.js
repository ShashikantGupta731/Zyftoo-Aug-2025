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
const uploadRoutes = require('./src/routes/uploadRoutes');


dotenv.config();
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
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
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
  res.send('API is running...');
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test successful', timestamp: new Date().toISOString() });
});

// Test route for token debugging
app.get('/api/test-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log('🧪 Testing token:', token ? token.substring(0, 20) + '...' : 'null')
  
  if (!token) {
    return res.json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ 
      success: true, 
      decoded,
      message: 'Token is valid'
    })
  } catch (error) {
    res.json({ 
      error: 'Token verification failed', 
      message: error.message 
    })
  }
})

// Routes (added later)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
