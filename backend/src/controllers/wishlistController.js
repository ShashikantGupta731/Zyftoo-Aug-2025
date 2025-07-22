const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// ➕ Add to wishlist
const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    return res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Server error while adding to wishlist' });
  }
};

// ➖ Remove from wishlist
const removeFromWishlist = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (id) => !id.equals(productId)
    );

    await wishlist.save();
    return res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Server error while removing from wishlist' });
  }
};

// 📄 Get user's wishlist
const getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist) {
      return res.status(200).json({ message: 'Empty wishlist', products: [] });
    }

    return res.status(200).json({ products: wishlist.products });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Server error while fetching wishlist' });
  }
};

// 🗑️ Clear wishlist
const clearWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    return res.status(200).json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Server error while clearing wishlist' });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist
};
