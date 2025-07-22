const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

router.post('/add/:productId', protect, addToWishlist);
router.delete('/remove/:productId', protect, removeFromWishlist);
router.get('/', protect, getWishlist);
router.delete('/clear', protect, clearWishlist); // optional

module.exports = router;
