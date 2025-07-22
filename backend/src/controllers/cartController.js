const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ➕ Add to Cart
const addToCart = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: 1 }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// ✏️ Update Quantity
const updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const { quantity } = req.body;
  const productId = req.params.productId;

  if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.equals(productId));
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// ❌ Remove from Cart
const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// 📦 Get Full Cart
const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.status(200).json({ message: 'Cart is empty', items: [] });

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// 🗑️ Clear Cart
const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart
};
