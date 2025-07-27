/**
 * Modern Loading Component
 * 
 * A collection of elegant loading indicators and skeletons
 */

import React from 'react';

// Spinner Component
export const ModernSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={`inline-block animate-spin ${sizeClasses[size]} ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-full w-full"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Skeleton Component
export const ModernSkeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  rounded = 'rounded-modern-md'
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${width} ${height} ${rounded} ${className}`}
    />
  );
};

// Loading Overlay Component
export const ModernLoadingOverlay = ({ 
  isLoading, 
  children, 
  message = 'Loading...',
  blur = true 
}) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className={blur ? 'filter blur-sm pointer-events-none' : ''}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-modern-lg">
        <div className="flex flex-col items-center gap-3">
          <ModernSpinner size="lg" className="text-modern-primary" />
          <p className="text-modern-gray-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Card Skeleton Component
export const ModernCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`card-modern p-modern-6 ${className}`}>
      <div className="space-y-4">
        <ModernSkeleton height="h-6" width="w-3/4" />
        <div className="space-y-2">
          <ModernSkeleton height="h-4" />
          <ModernSkeleton height="h-4" width="w-5/6" />
          <ModernSkeleton height="h-4" width="w-4/6" />
        </div>
        <div className="flex justify-between items-center pt-4">
          <ModernSkeleton height="h-8" width="w-20" rounded="rounded-modern-full" />
          <ModernSkeleton height="h-10" width="w-24" rounded="rounded-modern-lg" />
        </div>
      </div>
    </div>
  );
};

// Button Loading State
export const ModernButtonLoading = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${props.className} ${loading ? 'cursor-not-allowed' : ''}`}
    >
      {loading && <ModernSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

export default {
  Spinner: ModernSpinner,
  Skeleton: ModernSkeleton,
  LoadingOverlay: ModernLoadingOverlay,
  CardSkeleton: ModernCardSkeleton,
  ButtonLoading: ModernButtonLoading
};
