'use client'
import React from 'react'

/**
 * Configuration Validation Component
 * Handles validation logic and error display
 */
export default function ConfigurationValidator({ 
  categoryConfig, 
  getCurrentCounts, 
  MIN_MAIN_CATEGORIES, 
  MAX_MAIN_CATEGORIES 
}) {
  const { mainCategoriesCount } = getCurrentCounts()
  
  const getValidationStatus = () => {
    if (!categoryConfig.enabled) {
      return { isValid: true, message: 'Category section is disabled' }
    }
    
    if (mainCategoriesCount < MIN_MAIN_CATEGORIES) {
      return { 
        isValid: false, 
        message: `Please select at least ${MIN_MAIN_CATEGORIES} main category` 
      }
    }
    
    if (mainCategoriesCount > MAX_MAIN_CATEGORIES) {
      return { 
        isValid: false, 
        message: `Too many main categories selected. Maximum ${MAX_MAIN_CATEGORIES} allowed` 
      }
    }
    
    return { isValid: true, message: 'Configuration is valid' }
  }

  const validation = getValidationStatus()

  if (!categoryConfig.enabled) {
    return null
  }

  return (
    <div className="mb-3">
      <div className={`alert ${validation.isValid ? 'alert-success' : 'alert-warning'} py-2`}>
        <i className={`bi ${validation.isValid ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
        <small>{validation.message}</small>
        {validation.isValid && (
          <span className="ms-2">
            ({mainCategoriesCount} of {MAX_MAIN_CATEGORIES} categories selected)
          </span>
        )}
      </div>
    </div>
  )
}
