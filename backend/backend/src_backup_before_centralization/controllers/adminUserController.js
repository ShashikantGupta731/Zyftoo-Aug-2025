const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcrypt');

// Create admin user (no OTP, no email verification)
exports.createAdminUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new AdminUser({ ...rest, password: hashedPassword });
    await adminUser.save();
    res.status(201).json({ message: 'Admin user created successfully', adminUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all admin users
exports.getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find({ deleted: { $ne: true } });
    res.status(200).json(adminUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single admin user by ID
exports.getAdminUserById = async (req, res) => {
  try {
    const adminUser = await AdminUser.findById(req.params.id);
    if (!adminUser) return res.status(404).json({ error: 'Admin user not found' });
    res.status(200).json(adminUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update admin user
exports.updateAdminUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let updateData = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const adminUser = await AdminUser.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!adminUser) return res.status(404).json({ error: 'Admin user not found' });
    res.status(200).json({ message: 'Admin user updated', adminUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete admin user (soft delete)
exports.deleteAdminUser = async (req, res) => {
  try {
    const adminUser = await AdminUser.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!adminUser) return res.status(404).json({ error: 'Admin user not found' });
    res.status(200).json({ message: 'Admin user deleted', adminUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
