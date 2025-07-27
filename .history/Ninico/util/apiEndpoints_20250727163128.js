/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions for the application
 */

// Base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Authentication endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  CHECK_USER: '/auth/check-user',
  CHECK_USER_EMAIL: '/auth/check-user-email',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token'
};

// OTP endpoints
export const OTP = {
  SEND: '/otp/sendotp',
  VERIFY: '/otp/verifyotp',
  RESEND: '/otp/resend'
};

// User endpoints
export const USER = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update',
  DELETE_ACCOUNT: '/user/delete',
  CHANGE_PASSWORD: '/user/change-password',
  GET_ALL: '/users'
};

// Product endpoints
export const PRODUCT = {
  GET_ALL: '/products',
  GET_BY_ID: '/products',
  CREATE: '/products',
  UPDATE: '/products',
  DELETE: '/products',
  SEARCH: '/products/search',
  BY_CATEGORY: '/products/category'
};

// Category endpoints
export const CATEGORY = {
  GET_ALL: '/categories',
  GET_BY_ID: '/categories',
  CREATE: '/categories',
  UPDATE: '/categories',
  DELETE: '/categories'
};

// Subcategory endpoints
export const SUBCATEGORY = {
  GET_ALL: '/subcategories',
  GET_BY_ID: '/subcategories',
  GET_BY_PARENT: '/subcategories/parent',
  CREATE: '/subcategories',
  UPDATE: '/subcategories',
  DELETE: '/subcategories'
};

// Page Management endpoints
export const PAGE_MANAGEMENT = {
  GET_PAGE_SECTIONS: '/pages', // GET /pages/:pageKey/sections
  UPDATE_PAGE_SECTIONS: '/pages', // PUT /pages/:pageKey/sections
  REORDER_SECTIONS: '/pages', // POST /pages/:pageKey/reorder
};

// Cart endpoints
export const CART = {
  GET: '/cart',
  ADD_ITEM: '/cart/add',
  UPDATE_ITEM: '/cart/update',
  REMOVE_ITEM: '/cart/remove',
  CLEAR: '/cart/clear'
};

// Order endpoints
export const ORDER = {
  CREATE: '/orders',
  GET_ALL: '/orders',
  GET_BY_ID: '/orders',
  UPDATE_STATUS: '/orders/status',
  CANCEL: '/orders/cancel'
};

// Wishlist endpoints
export const WISHLIST = {
  GET: '/wishlist',
  ADD_ITEM: '/wishlist/add',
  REMOVE_ITEM: '/wishlist/remove',
  CLEAR: '/wishlist/clear'
};

// Address endpoints
export const ADDRESS = {
  GET_ALL: '/addresses',
  GET_BY_ID: '/addresses',
  CREATE: '/addresses',
  UPDATE: '/addresses',
  DELETE: '/addresses',
  SET_DEFAULT: '/addresses/default'
};

// Corporate endpoints
export const CORPORATE = {
  GET_ALL: '/corporate',
  GET_BY_ID: '/corporate',
  CREATE: '/corporate',
  UPDATE: '/corporate',
  DELETE: '/corporate'
};

// Upload endpoints
export const UPLOAD = {
  IMAGE: '/upload/image',
  MULTIPLE_IMAGES: '/upload/images',
  FILE: '/upload/file'
};

// Track order endpoints
export const TRACK = {
  ORDER: '/track/order'
};

// Helper function to build full URL
export const buildUrl = (endpoint, params) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// Helper function to build endpoint with ID
export const withId = (endpoint, id) => {
  return `${endpoint}/${id}`;
};
