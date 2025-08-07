const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to determine user type
const getUserType = (user) => {
  return user.accountType === 'corporate' || user.userType === 'Corporate' ? 'corporate' : 'individual';
};

// Helper function to get effective price for a product
const getEffectivePrice = (product, user, quantity = 1) => {
  const userType = getUserType(user);
  
  // If corporate user and product has corporate pricing
  if (userType === 'corporate' && product.corporatePricing?.enabled && product.corporatePricing.priceTiers?.length > 0) {
    // Find the appropriate tier based on quantity
    const applicableTier = product.corporatePricing.priceTiers
      .filter(tier => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
      .sort((a, b) => b.minQuantity - a.minQuantity)[0]; // Get the highest minimum quantity tier that applies
    
    if (applicableTier) {
      return applicableTier.pricePerUnit;
    }
  }
  
  // Fallback to regular pricing
  return product.finalPrice || product.retailPrice?.sellingPrice || product.sale_price || product.price;
};

// Helper function to validate product access
const canUserAccessProduct = (product, user) => {
  const userType = getUserType(user);
  
  // Check if product is corporate-only but user is not corporate
  if (product.is_corporate_only && userType !== 'corporate') {
    return false;
  }
  
  return true;
};

// Helper function to validate stock and availability
const validateProductAvailability = (product, requestedQuantity) => {
  // Check if product is published
  if (!product.status) {
    return { valid: false, message: 'Product is not available' };
  }
  
  // Check stock status
  if (product.stock_status === 'out_of_stock') {
    return { valid: false, message: 'Product is out of stock' };
  }
  
  // Check quantity availability
  if (product.stock_status === 'in_stock' && product.quantity < requestedQuantity) {
    return { valid: false, message: `Only ${product.quantity} items available in stock` };
  }
  
  // Pre-order and back-order are allowed
  return { valid: true };
};

// ➕ Add to Cart
const addToCart = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  const { quantity = 1 } = req.body; // Allow specifying quantity

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user can access this product
    if (!canUserAccessProduct(product, req.user)) {
      return res.status(403).json({ 
        message: 'This product is only available to corporate customers',
        productAccess: 'corporate_only'
      });
    }

    let cart = await Cart.findOne({ user: userId });
    let existingQuantity = 0;

    // Check existing quantity in cart
    if (cart) {
      const existingItem = cart.items.find(item => item.product.equals(productId));
      existingQuantity = existingItem ? existingItem.quantity : 0;
    }

    const totalQuantity = existingQuantity + quantity;

    // Validate stock availability
    const stockValidation = validateProductAvailability(product, totalQuantity);
    if (!stockValidation.valid) {
      return res.status(400).json({ 
        message: stockValidation.message,
        availableQuantity: product.quantity,
        stockStatus: product.stock_status
      });
    }

    // Check corporate minimum order quantity
    const userType = getUserType(req.user);
    if (userType === 'corporate' && product.corporatePricing?.enabled) {
      const minOrderQty = product.corporatePricing.minimumOrderQuantity || 1;
      if (totalQuantity < minOrderQty) {
        return res.status(400).json({
          message: `Minimum order quantity for corporate customers is ${minOrderQty}`,
          minimumQuantity: minOrderQty,
          currentQuantity: totalQuantity
        });
      }
    }

    // Calculate effective price
    const effectivePrice = getEffectivePrice(product, req.user, totalQuantity);

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ 
          product: productId, 
          quantity: quantity,
          priceAtTime: effectivePrice,
          userType: userType
        }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = totalQuantity;
        cart.items[itemIndex].priceAtTime = effectivePrice; // Update price
      } else {
        cart.items.push({ 
          product: productId, 
          quantity: quantity,
          priceAtTime: effectivePrice,
          userType: userType
        });
      }
    }

    await cart.save();

    // Populate the cart for response
    await cart.populate('items.product');

    res.status(200).json({ 
      message: 'Product added to cart successfully', 
      cart,
      effectivePrice,
      stockStatus: product.stock_status,
      userType
    });
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

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.product.equals(productId));
    if (!item) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Get product details for validation
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate stock availability
    const stockValidation = validateProductAvailability(product, quantity);
    if (!stockValidation.valid) {
      return res.status(400).json({ 
        message: stockValidation.message,
        availableQuantity: product.quantity,
        stockStatus: product.stock_status
      });
    }

    // Check corporate minimum order quantity
    const userType = getUserType(req.user);
    if (userType === 'corporate' && product.corporatePricing?.enabled) {
      const minOrderQty = product.corporatePricing.minimumOrderQuantity || 1;
      if (quantity < minOrderQty) {
        return res.status(400).json({
          message: `Minimum order quantity for corporate customers is ${minOrderQty}`,
          minimumQuantity: minOrderQty,
          requestedQuantity: quantity
        });
      }
    }

    // Update quantity and recalculate price
    item.quantity = quantity;
    item.priceAtTime = getEffectivePrice(product, req.user, quantity);

    await cart.save();

    // Populate the cart for response
    await cart.populate('items.product');

    res.status(200).json({ 
      message: 'Cart item updated successfully', 
      cart,
      updatedPrice: item.priceAtTime
    });
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
