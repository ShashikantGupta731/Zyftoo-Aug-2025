/**
 * Admin Services Index
 * 
 * Centralized export for all admin services
 */

const CategoryService = require('./CategoryService');
const FileService = require('./FileService');
const PageConfigService = require('./PageConfigService');

module.exports = {
  CategoryService,
  FileService,
  PageConfigService
};
