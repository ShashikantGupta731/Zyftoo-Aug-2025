const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  resetPassword,
  verifyEmail,
  checkUser,
  checkUserByEmail
} = require('../controllers/authController'); 

// Removed adminLogin import - now in separate adminAuthRoutes.js

// Debug middleware for all auth routes
router.use((req, res, next) => {
  console.log('🔥 AUTH ROUTE HIT:', req.method, req.path);
  console.log('🔥 Request body keys:', req.body ? Object.keys(req.body) : 'No body (GET request)');
  console.log('🔥 Content-Type:', req.get('Content-Type'));
  next();
});

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/check-user/:phone', checkUser);  // ✅ Now checkUser is defined
router.get('/check-user-email/:email', checkUserByEmail);  // ✅ New email-based user check

// Removed adminLogin route - now in separate adminAuthRoutes.js

module.exports = router;
