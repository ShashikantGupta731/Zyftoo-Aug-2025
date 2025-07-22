const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ✅ NEW tracking fields
  employeeEmail: String,
  employeeName: String,
  trackingToken: String,
  trackingExpiresAt: Date,
  createdByCorporate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' }, // Paid, Failed, etc.
  orderStatus: { type: String, default: 'Processing' }, // Shipped, Delivered, Cancelled
  statusHistory: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  totalAmount: { type: Number, required: true },
  isCancelled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
