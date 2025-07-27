/**
 * Modern Badge Component
 * 
 * A sleek badge component for status indicators, labels,
 * and notifications
 */

import React from 'react';

const ModernBadge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge-modern';
  
  const variantClasses = {
    primary: 'badge-modern--primary',
    success: 'badge-modern--success',
    warning: 'badge-modern--warning',
    error: 'badge-modern--error',
    neutral: 'bg-gray-100 text-gray-700'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {icon && (
        <span className="mr-1 inline-flex items-center">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default ModernBadge;
