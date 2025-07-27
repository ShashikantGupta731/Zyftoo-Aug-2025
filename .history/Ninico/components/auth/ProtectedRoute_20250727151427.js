'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Access denied component
const AccessDenied = ({ message, requiredRole, currentRole }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div className="mb-6">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
      <p className="text-sm text-gray-500 mb-4">
        {message || 'You do not have permission to access this resource.'}
      </p>
      {requiredRole && currentRole && (
        <div className="text-xs text-gray-400 mb-4">
          <p>Required: {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}</p>
          <p>Current: {currentRole || 'none'}</p>
        </div>
      )}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Login required component
const LoginRequired = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
        <p className="text-sm text-gray-500 mb-6">
          You need to be logged in to access this page.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/sign-in')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ProtectedRoute component
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallback = null,
  redirectTo = null
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    hasRole, 
    hasPermission,
    role,
    userType 
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Handle redirect after auth check
    if (!isLoading && redirectTo) {
      if (!isAuthenticated && requireAuth) {
        router.push('/sign-in');
      } else if (isAuthenticated && !checkAccess()) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, redirectTo]);

  // Check if user has required access
  const checkAccess = () => {
    // Check roles
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role));
      if (!hasRequiredRole) return false;
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission => hasPermission(permission));
      if (!hasRequiredPermission) return false;
    }

    return true;
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // Show login required if auth is needed but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (redirectTo) return null; // Let useEffect handle redirect
    return <LoginRequired />;
  }

  // Check access permissions
  if (isAuthenticated && !checkAccess()) {
    if (redirectTo) return null; // Let useEffect handle redirect
    return (
      <AccessDenied 
        message="You do not have the required permissions to access this resource."
        requiredRole={requiredRoles}
        currentRole={role}
      />
    );
  }

  // User has access, render children
  return children;
};

// Specific role-based components for convenience
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles={['admin', 'superadmin']} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export const CorporateRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles={['corporate', 'admin', 'superadmin']} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Permission-based route
export const PermissionRoute = ({ permission, children, ...props }) => (
  <ProtectedRoute 
    requiredPermissions={[permission]} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
