const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const adminAuthRoutes = require('./src/routes/adminAuthRoutes'); // Add admin auth routes
const userRoutes = require('./src/routes/userRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const cors = require('cors');
const { decryptBody } = require('./src/middleware/authMiddleware'); // Import your middleware


const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const corporateRoutes = require('./src/routes/corporateRoutes');
const trackOrderRoutes = require('./src/routes/trackOrderRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const subcategoryRoutes = require('./src/routes/subcategoryRoutes'); // ADD THIS LINE
const uploadRoutes = require('./src/routes/uploadRoutes');


dotenv.config();
const app = express();
connectDB();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'], 
  credentials: true
}));


app.use(express.json())
app.use(decryptBody);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes);
app.use('/api/auth', adminAuthRoutes); // Admin routes: /api/auth/login (for admin)
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
app.use('/api/subcategories', subcategoryRoutes); // ADD THIS LINE
app.use('/api/upload', uploadRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});