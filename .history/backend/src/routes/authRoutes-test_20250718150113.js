const express = require('express');
const router = express.Router();

// Simple test routes without any imports
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route test successful' });
});

router.post('/test-post', (req, res) => {
  res.json({ message: 'Auth POST test successful', body: req.body });
});

// Test route with parameter
router.get('/test-param/:id', (req, res) => {
  res.json({ message: 'Param test successful', id: req.params.id });
});

module.exports = router;
