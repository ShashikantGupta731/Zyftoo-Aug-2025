/**
 * Modern Card Component
 * 
 * A clean, minimalistic card component with subtle shadows
 * and smooth hover effects
 */

import React from 'react';

const ModernCard = ({
  children,
  className = '',
  hover = true,
  padding = 'default',
  shadow = 'sm',
  ...props
}) => {
  const baseClasses = 'card-modern';
  
  const paddingClasses = {
    none: '',
    sm: 'p-modern-4',
    default: 'p-modern-6',
    lg: 'p-modern-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-modern-sm',
    md: 'shadow-modern-md',
    lg: 'shadow-modern-lg'
  };
  
  const classes = [
    baseClasses,
    hover ? 'hover:shadow-modern-lg hover:-translate-y-1' : '',
    paddingClasses[padding],
    shadowClasses[shadow],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-modern__header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-modern__body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-modern__footer ${className}`} {...props}>
    {children}
  </div>
);

ModernCard.Header = CardHeader;
ModernCard.Body = CardBody;
ModernCard.Footer = CardFooter;

export default ModernCard;
