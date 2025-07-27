const Address = require('../models/Address');

// ➕ Add new address
const addAddress = async (req, res) => {
  const userId = req.user._id;
  const { fullName, address, city, state, postalCode, phone, country } = req.body;

  if (!fullName || !address || !city || !state || !postalCode || !phone) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  try {
    const isFirst = await Address.countDocuments({ user: userId }) === 0;

    const newAddress = new Address({
      user: userId,
      fullName,
      address,
      city,
      state,
      postalCode,
      phone,
      country,
      isDefault: isFirst
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address added', address: newAddress });
  } catch (err) {
    console.error('Add address error:', err);
    res.status(500).json({ message: 'Failed to add address' });
  }
};

// 📦 Get all addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (err) {
    console.error('Get addresses error:', err);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

// ✏️ Update address
const updateAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    Object.assign(address, req.body);
    await address.save();

    res.status(200).json({ message: 'Address updated', address });
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// ❌ Delete address
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findOneAndDelete({ _id: id, user: req.user._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    // Optional: Auto-set another address as default if deleted one was default
    if (address.isDefault) {
      const another = await Address.findOne({ user: req.user._id });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    res.status(200).json({ message: 'Address deleted' });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ message: 'Failed to delete address' });
  }
};

// ✅ Set default address
const setDefaultAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const target = await Address.findOne({ _id: id, user: req.user._id });
    if (!target) return res.status(404).json({ message: 'Address not found' });

    await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
    target.isDefault = true;
    await target.save();

    res.status(200).json({ message: 'Default address updated' });
  } catch (err) {
    console.error('Set default error:', err);
    res.status(500).json({ message: 'Failed to update default address' });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
