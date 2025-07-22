const express = require('express');
const router = express.Router();
const { trackOrder } = require('../controllers/trackOrderController');

// Public route, no auth
router.get('/track-order/:token', trackOrder);

module.exports = router;
