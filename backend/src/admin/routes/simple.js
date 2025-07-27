/**
 * Temporary Simple Admin Routes
 * 
 * Basic working routes to get the admin module running
 */

const express = require('express');
const router = express.Router();

// Simple health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Admin API is running',
    timestamp: new Date().toISOString()
  });
});

// Placeholder routes for now
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Admin module test endpoint working'
  });
});

module.exports = router;
