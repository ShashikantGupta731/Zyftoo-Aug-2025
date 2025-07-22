// src/routes/corporateRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/fileUpload');
const { placeCorporateOrder, uploadEmployees } = require('../controllers/corporateController');


router.post('/upload-employees', protect, upload.single('file'), uploadEmployees);
router.post('/place-bulk-order', protect, placeCorporateOrder);

module.exports = router;
