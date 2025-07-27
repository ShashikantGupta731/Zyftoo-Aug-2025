const Order = require('../models/Order');

const trackOrder = async (req, res) => {
  const { token } = req.params;
  const { email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ message: 'Missing token or email' });
  }

  try {
    const order = await Order.findOne({
      trackingToken: token,
      employeeEmail: email,
      trackingExpiresAt: { $gt: Date.now() } // Not expired
    }).populate('items.product', 'name price brand images');

    if (!order) {
      return res.status(404).json({ message: 'Tracking link invalid or expired' });
    }

    res.status(200).json({
      message: 'Order found',
      order: {
        orderId: order._id,
        employeeName: order.employeeName,
        status: order.orderStatus,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        items: order.items
      }
    });

  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { trackOrder };
