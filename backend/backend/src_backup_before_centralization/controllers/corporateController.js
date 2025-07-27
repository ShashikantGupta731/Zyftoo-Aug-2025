const XLSX = require('xlsx');
const crypto = require('crypto');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const CorporateEmployeeList = require('../models/CorporateEmployeeList');
const sendEmail = require('../utils/sendEmail');

// 🔍 Helper: Parse file buffer
const parseFileToEmployees = (file) => {
  const ext = file.originalname.split('.').pop().toLowerCase();

  if (ext === 'json') {
    return JSON.parse(file.buffer.toString());
  }

  if (ext === 'csv' || ext === 'xlsx') {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  }

  throw new Error('Unsupported file format. Only CSV, XLSX, and JSON allowed.');
};

// ✅ Upload Employees (CSV, XLSX, JSON)
const uploadEmployees = async (req, res) => {
  const user = req.user;

  if (user.userType !== 'corporate') {
    return res.status(403).json({ message: 'Only corporate users can upload employee data' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const employees = parseFileToEmployees(req.file);

    const validEmployees = employees.filter(emp =>
      emp.fullName && emp.email && emp.address && emp.city && emp.state && emp.postalCode
    );

    if (validEmployees.length === 0) {
      return res.status(400).json({ message: 'No valid employee records found in the file' });
    }

    await CorporateEmployeeList.deleteMany({ corporateUser: user._id });

    const list = new CorporateEmployeeList({
      corporateUser: user._id,
      deliveryMode: req.body.deliveryMode || 'employee',
      employees: validEmployees
    });

    await list.save();

    res.status(200).json({
      message: 'Employee list uploaded successfully',
      count: validEmployees.length
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Failed to upload employees', error: err.message });
  }
};

// ✅ Place Bulk Order per Employee
const placeCorporateOrder = async (req, res) => {
  const user = req.user;

  try {
    const list = await CorporateEmployeeList.findOne({ corporateUser: user._id });

    if (!list || list.employees.length === 0) {
      return res.status(400).json({ message: 'No employee list found. Please upload first.' });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let createdOrders = [];

    for (const employee of list.employees) {
      let totalAmount = 0;
      const orderItems = [];

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

      const token = crypto.randomBytes(16).toString('hex');

      const order = new Order({
        user: user._id,
        items: orderItems,
        shippingAddress: {
          fullName: employee.fullName,
          address: employee.address,
          city: employee.city,
          state: employee.state,
          country: employee.country,
          postalCode: employee.postalCode,
          phone: employee.phone
        },
        employeeEmail: employee.email,
        employeeName: employee.fullName,
        trackingToken: token,
        trackingExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        paymentMethod: req.body.paymentMethod || 'invoice',
        totalAmount,
        createdByCorporate: user._id
      });

      await order.save();

      const trackingURL = `https://yourdomain.com/track-order/${token}?email=${employee.email}`;

      const emailHTML = `
        <p>Hi ${employee.fullName},</p>
        <p>Your gift from <strong>${user.companyDetails?.companyName || 'your company'}</strong> is on the way!</p>
        <p><a href="${trackingURL}">Click here to track your gift</a></p>
        <p>This link is valid for 7 days.</p>
      `;

      await sendEmail({
        to: employee.email,
        subject: `🎁 Your Gift from ${user.companyDetails?.companyName || 'Your Company'}`,
        html: emailHTML
      });

      createdOrders.push(order);
    }

    cart.items = [];
    await cart.save();
    await list.deleteOne();

    res.status(201).json({
      message: 'Corporate bulk order placed successfully',
      orderCount: createdOrders.length
    });

  } catch (err) {
    console.error('Bulk order error:', err);
    res.status(500).json({ message: 'Bulk order failed', error: err.message });
  }
};

module.exports = { uploadEmployees, placeCorporateOrder };
