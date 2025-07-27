/**
 * Admin Module Entry Point
 * 
 * This is the main entry point for the admin sub-project.
 * It provides a clean interface to access all admin functionality.
 * 
 * @module Admin
 * @version 1.0.0
 */

const express = require('express');
const adminRoutes = require('./routes');
const { adminAuth, rolePermissions } = require('./middleware');
const config = require('./config');

/**
 * Initialize Admin Module
 * @param {Object} app - Express app instance
 */
const initializeAdmin = (app) => {
  console.log('🔧 Initializing Admin Module...');
  
  // Mount admin routes at /api/admin
  app.use('/api/admin', adminRoutes);
  
  console.log('✅ Admin Module initialized successfully');
  console.log('📁 Admin routes available at: /api/admin/*');
};

module.exports = {
  initializeAdmin,
  config,
  routes: require('./routes'),
  controllers: require('./controllers'),
  services: require('./services'),
  middleware: require('./middleware'),
  // Lazy load utils to avoid startup issues
  get utils() {
    return require('./utils');
  }
};
