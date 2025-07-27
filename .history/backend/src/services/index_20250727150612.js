// Centralized service exports
// This file will grow as we add more services

const AuthService = require('./AuthService');
const AdminService = require('./AdminService');

module.exports = {
  AuthService,
  AdminService,
  // Other services will be added as needed
};
