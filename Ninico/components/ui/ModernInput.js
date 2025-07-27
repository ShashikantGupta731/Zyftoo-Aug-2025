/**
 * Modern Input Component
 * 
 * A clean, accessible input component with smooth focus states
 * and elegant styling
 */

import React, { forwardRef } from 'react';

const ModernInput = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'text',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = [
    'form-input-modern',
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : '',
    disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '',
    icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group-modern">
      {label && (
        <label 
          htmlFor={inputId} 
          className="form-label-modern"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 h-5 w-5">
              {icon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400 h-5 w-5">
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="text-modern-sm text-modern-gray-500 mt-1">
          {hint}
        </p>
      )}
      
      {error && (
        <p className="text-modern-sm text-modern-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

ModernInput.displayName = 'ModernInput';

export default ModernInput;
