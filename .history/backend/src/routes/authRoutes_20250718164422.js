const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  resetPassword,
  verifyEmail,
  checkUser
} = require('../controllers/authController'); // ✅ This must point to your controller file

// Debug middleware for all auth routes
router.use((req, res, next) => {
  console.log('🔥 AUTH ROUTE HIT:', req.method, req.path);
  console.log('🔥 Request body keys:', Object.keys(req.body));
  console.log('🔥 Content-Type:', req.get('Content-Type'));
  next();
});

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);
console.log('checkUser is:', typeof checkUser); 
router.get('/check-user/:phone', checkUser);  // ✅ Now checkUser is defined

module.exports = router;
