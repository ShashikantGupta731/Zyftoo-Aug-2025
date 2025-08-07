const Order = require('../models/Order');
const User = require('../models/User'); 
const sendEmail = require('../utils/sendEmail'); 
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Address = require('../models/Address'); 

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

// Helper function to validate and update stock
const validateAndUpdateStock = async (product, requestedQuantity) => {
  // Check if product is published
  if (!product.status) {
    return { valid: false, message: `Product ${product.name} is not available` };
  }
  
  // Handle different stock statuses
  switch (product.stock_status) {
    case 'out_of_stock':
      return { valid: false, message: `Product ${product.name} is out of stock` };
    
    case 'in_stock':
      if (product.quantity < requestedQuantity) {
        return { valid: false, message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${requestedQuantity}` };
      }
      // Reduce stock for in_stock items
      product.quantity -= requestedQuantity;
      break;
    
    case 'pre_order':
    case 'back_order':
      // For pre-order and back-order, we don't reduce physical stock
      // but we can track orders
      break;
    
    default:
      return { valid: false, message: `Invalid stock status for ${product.name}` };
  }
  
  // Update sales count and analytics
  product.sales_count = (product.sales_count || 0) + requestedQuantity;
  
  // Update analytics if they exist
  if (product.analytics) {
    // You could add order analytics here if needed
  }
  
  await product.save();
  return { valid: true };
}; 


const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }

    const userType = getUserType(req.user);
    let calculatedTotal = 0;
    const processedItems = [];

    // ✅ Step 1: Validate products, check stock, and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // Check if user can access this product (corporate-only restriction)
      if (product.is_corporate_only && userType !== 'corporate') {
        return res.status(403).json({ 
          message: `Product ${product.name} is only available to corporate customers` 
        });
      }

      // Check corporate minimum order quantity
      if (userType === 'corporate' && product.corporatePricing?.enabled) {
        const minOrderQty = product.corporatePricing.minimumOrderQuantity || 1;
        if (item.quantity < minOrderQty) {
          return res.status(400).json({
            message: `Minimum order quantity for ${product.name} is ${minOrderQty} for corporate customers`,
            minimumQuantity: minOrderQty,
            requestedQuantity: item.quantity
          });
        }
      }

      // Calculate effective price for this user and quantity
      const effectivePrice = getEffectivePrice(product, req.user, item.quantity);
      const itemTotal = effectivePrice * item.quantity;
      calculatedTotal += itemTotal;

      // Prepare processed item for order
      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        priceAtTime: effectivePrice,
        itemTotal: itemTotal,
        productName: product.name,
        productSku: product.sku,
        stockStatus: product.stock_status,
        corporatePricing: userType === 'corporate' && product.corporatePricing?.enabled ? {
          tierApplied: product.corporatePricing.priceTiers?.find(tier => 
            item.quantity >= tier.minQuantity && (!tier.maxQuantity || item.quantity <= tier.maxQuantity)
          )
        } : null
      });
    }

    // Validate total amount (allow small rounding differences)
    if (Math.abs(calculatedTotal - totalAmount) > 0.1) {
      return res.status(400).json({ 
        message: 'Total amount mismatch', 
        calculated: calculatedTotal, 
        provided: totalAmount 
      });
    }

    // ✅ Step 2: Update stock for all products (do this after all validations pass)
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = await Product.findById(item.product);
      
      const stockUpdate = await validateAndUpdateStock(product, item.quantity);
      if (!stockUpdate.valid) {
        // If stock update fails, we need to rollback any previous stock changes
        // For now, we'll return an error. In production, you might want to implement proper rollback
        return res.status(400).json({ message: stockUpdate.message });
      }
    }

    // ✅ Step 3: Create enhanced order
    const newOrder = new Order({
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      paymentMethod,
      totalAmount: calculatedTotal,
      userType,
      orderMetadata: {
        hasCorporatePricing: processedItems.some(item => item.corporatePricing),
        stockStatuses: processedItems.map(item => ({
          product: item.product,
          stockStatus: item.stockStatus
        }))
      }
    });

    const savedOrder = await newOrder.save();

    // ✅ Step 4: Clear user's cart after successful order
    try {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );
    } catch (cartError) {
      console.warn('Failed to clear cart after order:', cartError);
      // Don't fail the order if cart clearing fails
    }

    // ✅ Step 5: Populate order for response
    await savedOrder.populate([
      { path: 'user', select: 'name email accountType userType' },
      { path: 'items.product', select: 'name images sku' }
    ]);

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
      calculatedTotal,
      userType
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ 
      message: 'Failed to place order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate([
        { 
          path: 'items.product', 
          select: 'name images price retailPrice corporatePricing is_corporate_only stock_status rating numReviews' 
        }
      ])
      .sort({ createdAt: -1 });

    // Enhanced orders with additional info for frontend
    const enhancedOrders = orders.map(order => {
      const orderObj = order.toObject();
      
      // Add summary information
      orderObj.summary = {
        totalItems: orderObj.items.reduce((sum, item) => sum + item.quantity, 0),
        userType: orderObj.userType || getUserType(req.user),
        hasCorporatePricing: orderObj.items.some(item => item.corporatePricing),
        hasPreOrders: orderObj.items.some(item => item.stockStatus === 'pre_order'),
        hasBackOrders: orderObj.items.some(item => item.stockStatus === 'back_order')
      };

      return orderObj;
    });

    res.status(200).json({
      orders: enhancedOrders,
      totalOrders: orders.length
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // only return name & email from user
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  const allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = newStatus;
    await order.save();
    order.statusHistory.push({ status: newStatus });


    const subject = `Your Order #${order._id} is now ${newStatus}`;
        const html = `
        <p>Hi ${order.user.name},</p>
        <p>Your order status has been updated to <strong>${newStatus}</strong>.</p>
        <p>Thank you for shopping with us!</p>
        `;

        await sendEmail({
        to: order.user.email,
        subject,
        html
        });

        res.status(200).json({ message: 'Order status updated & email sent', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
    };

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus !== 'Processing') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    
    // ✅ Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    order.isCancelled = true;
    await order.save();

    // ✅ Send cancellation email
    const subject = `Order #${order._id} Cancelled`;
    const html = `
      <p>Hi ${order.user.name || 'Customer'},</p>
      <p>Your order <strong>#${order._id}</strong> has been successfully <strong>cancelled</strong>.</p>
      <p>If you have already made payment, please allow 5–7 business days for a refund.</p>
      <p>Thank you for using Zyftoo!</p>
    `;

    if (order.user.email) {
      await sendEmail({ to: order.user.email, subject, html });
    } else {
      console.warn(`⚠️ User ${order.user._id} has no email`);
    }

    res.status(200).json({ message: 'Order cancelled successfully & email sent', order });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};


const getSingleOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name price brand images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Ensure the logged-in user owns the order OR is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

const placeOrderFromCart = async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod, addressId } = req.body;

let finalAddress = shippingAddress;

if (!finalAddress && addressId) {
  const savedAddress = await Address.findOne({ _id: addressId, user: userId });
  if (!savedAddress) {
    return res.status(400).json({ message: 'Address not found or unauthorized' });
  }
  finalAddress = savedAddress.toObject();
}

if (!finalAddress) {
  const defaultAddress = await Address.findOne({ user: userId, isDefault: true });
  if (!defaultAddress) {
    return res.status(400).json({ message: 'No shipping address provided and no default found' });
  }
  finalAddress = defaultAddress.toObject();
}


  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 1. Validate stock & prepare order items
    for (const item of cart.items) {
      const product = item.product;
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product?.name}` });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity
      });
    }

    // 2. Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    await order.save();

    // 3. Clear cart
    cart.items = [];
    await cart.save();

    const user = await User.findById(userId);
    const productListHTML = orderItems.map(item => {
      const prod = cart.items.find(p => p.product._id.toString() === item.product.toString());
      return `<li>${prod?.product.name} × ${item.quantity}</li>`;
    }).join('');

    const emailHTML = `
      <p>Hi ${user.name},</p>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      <p><strong>Shipping Address:</strong></p>
      <p>${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.postalCode}</p>
      <p><strong>Products:</strong></p>
      <ul>${productListHTML}</ul>
      <p>We'll notify you once it's shipped.</p>
      <p>Thanks for shopping with <strong>Zyftoo</strong>!</p>
    `;

    await sendEmail({
      to: user.email,
      subject: `Order Confirmation - Zyftoo #${order._id}`,
      html: emailHTML
    });


    res.status(201).json({
      message: 'Order placed and confirmation email sent ✅',
      order
    });

  } catch (error) {
    console.error('Order from cart error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};


module.exports={placeOrder, 
                getMyOrders, 
                getAllOrders, 
                updateOrderStatus, 
                cancelOrder, 
                getSingleOrder, 
                placeOrderFromCart
                };
