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
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token'
} as const;

// OTP endpoints
export const OTP = {
  SEND: '/otp/sendotp',
  VERIFY: '/otp/verifyotp',
  RESEND: '/otp/resend'
} as const;

// User endpoints
export const USER = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update',
  DELETE_ACCOUNT: '/user/delete',
  CHANGE_PASSWORD: '/user/change-password',
  GET_ALL: '/users'
} as const;

// Product endpoints
export const PRODUCT = {
  GET_ALL: '/products',
  GET_BY_ID: '/products',
  CREATE: '/products',
  UPDATE: '/products',
  DELETE: '/products',
  SEARCH: '/products/search',
  BY_CATEGORY: '/products/category'
} as const;

// Category endpoints
export const CATEGORY = {
  GET_ALL: '/categories',
  GET_BY_ID: '/categories',
  CREATE: '/categories',
  UPDATE: '/categories',
  DELETE: '/categories'
} as const;

// Cart endpoints
export const CART = {
  GET: '/cart',
  ADD_ITEM: '/cart/add',
  UPDATE_ITEM: '/cart/update',
  REMOVE_ITEM: '/cart/remove',
  CLEAR: '/cart/clear'
} as const;

// Order endpoints
export const ORDER = {
  CREATE: '/orders',
  GET_ALL: '/orders',
  GET_BY_ID: '/orders',
  UPDATE_STATUS: '/orders/status',
  CANCEL: '/orders/cancel'
} as const;

// Wishlist endpoints
export const WISHLIST = {
  GET: '/wishlist',
  ADD_ITEM: '/wishlist/add',
  REMOVE_ITEM: '/wishlist/remove',
  CLEAR: '/wishlist/clear'
} as const;

// Address endpoints
export const ADDRESS = {
  GET_ALL: '/addresses',
  GET_BY_ID: '/addresses',
  CREATE: '/addresses',
  UPDATE: '/addresses',
  DELETE: '/addresses',
  SET_DEFAULT: '/addresses/default'
} as const;

// Corporate endpoints
export const CORPORATE = {
  GET_ALL: '/corporate',
  GET_BY_ID: '/corporate',
  CREATE: '/corporate',
  UPDATE: '/corporate',
  DELETE: '/corporate'
} as const;

// Upload endpoints
export const UPLOAD = {
  IMAGE: '/upload/image',
  MULTIPLE_IMAGES: '/upload/images',
  FILE: '/upload/file'
} as const;

// Track order endpoints
export const TRACK = {
  ORDER: '/track/order'
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string, params?: Record<string, string | number>): string => {
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
export const withId = (endpoint: string, id: string | number): string => {
  return `${endpoint}/${id}`;
};
