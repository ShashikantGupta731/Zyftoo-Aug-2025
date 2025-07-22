const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart
} = require('../controllers/cartController');

router.post('/add/:productId', protect, addToCart);
router.patch('/update/:productId', protect, updateCartItem);
router.delete('/remove/:productId', protect, removeFromCart);
router.get('/', protect, getCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
