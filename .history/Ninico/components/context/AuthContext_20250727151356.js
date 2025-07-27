'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../../util/apiService';

// Auth Action Types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial Auth State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  userType: null,
  role: null,
  permissions: []
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        userType: action.payload.user.userType,
        role: action.payload.user.role,
        permissions: action.payload.permissions || []
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        userType: null,
        role: null,
        permissions: []
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        userType: action.payload?.userType || null,
        role: action.payload?.role || null
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  user: [
    'profile.read',
    'profile.update',
    'orders.read',
    'orders.create',
    'cart.manage',
    'wishlist.manage'
  ],
  corporate: [
    'profile.read',
    'profile.update',
    'orders.read',
    'orders.create',
    'orders.bulk',
    'cart.manage',
    'company.manage'
  ],
  admin: [
    'admin.dashboard',
    'users.read',
    'users.write',
    'products.read',
    'products.write',
    'orders.read',
    'orders.write',
    'categories.manage',
    'content.manage'
  ],
  superadmin: ['*'] // All permissions
};

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔄 [AuthContext] Initializing authentication...');
      
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);
        const permissions = ROLE_PERMISSIONS[user.role] || [];
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token, permissions }
        });
        
        console.log('✅ [AuthContext] Auth initialized from localStorage');
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        console.log('🔍 [AuthContext] No stored auth found');
      }
    } catch (error) {
      console.error('❌ [AuthContext] Auth initialization error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      console.log('🔄 [AuthContext] Starting login process...');
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await apiService.post('/auth/login', credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        const permissions = ROLE_PERMISSIONS[user.role] || [];

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token, permissions }
        });

        console.log('✅ [AuthContext] Login successful:', user.userType);
        return { success: true, user };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ [AuthContext] Login error:', error.message);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    console.log('🔄 [AuthContext] Logging out...');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    
    console.log('✅ [AuthContext] Logout successful');
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('🔄 [AuthContext] Starting registration...');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await apiService.post('/auth/signup', userData);
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      if (response.success) {
        console.log('✅ [AuthContext] Registration successful');
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ [AuthContext] Registration error:', error.message);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: error.message };
    }
  };

  // Permission check function
  const hasPermission = (permission) => {
    if (!state.isAuthenticated || !state.permissions) return false;
    
    // SuperAdmin has all permissions
    if (state.permissions.includes('*')) return true;
    
    // Check specific permission
    return state.permissions.includes(permission);
  };

  // Role check function
  const hasRole = (roles) => {
    if (!state.isAuthenticated || !state.role) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(state.role);
  };

  // Check if user is admin (admin or superadmin)
  const isAdmin = () => {
    return hasRole(['admin', 'superadmin']);
  };

  // Check if user is corporate
  const isCorporate = () => {
    return state.userType === 'Corporate' || hasRole('corporate');
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    ...state,
    loading: state.isLoading, // Backward compatibility
    
    // Actions
    login,
    logout,
    register,
    clearError,
    
    // Utility functions
    hasPermission,
    hasRole,
    isAdmin,
    isCorporate,
    
    // User type checks
    isCustomer: () => state.userType === 'Customer',
    isIndividual: () => state.userType === 'Customer',
    
    // Quick access to user info
    userName: state.user?.name || '',
    userEmail: state.user?.email || '',
    userPhone: state.user?.phone || ''
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
