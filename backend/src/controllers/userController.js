const User = require('../models/User');
const bcrypt = require('bcrypt');

// Create user (no OTP, no email verification)
exports.createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...rest, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: { $ne: true } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let update = { ...rest };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = user.status === 'Active' ? 'Blocked' : 'Active';
    await user.save();
    res.status(200).json({ message: 'User status updated', status: user.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
