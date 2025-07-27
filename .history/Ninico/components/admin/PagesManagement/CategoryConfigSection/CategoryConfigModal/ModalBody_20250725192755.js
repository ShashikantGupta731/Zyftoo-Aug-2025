'use client'
import React from 'react'

/**
 * Modal Body Component
 * Handles the main content area of the modal
 */
export default function ModalBody({ 
  categoryConfig, 
  setCategoryConfig,
  availableCategories,
  subcategories,
  selectedMainCategory,
  setSelectedMainCategory,
  getCurrentCounts,
  handleCategoryToggle,
  handleMaxCategoriesChange,
  MAX_MAIN_CATEGORIES,
  MIN_MAIN_CATEGORIES,
  MAX_SUBCATEGORIES_PER_CATEGORY,
  setError,
  CategoryConfigSettings,
  CategorySelection
}) {
  return (
    <div className="modal-body">
      {/* Category Configuration Settings */}
      <CategoryConfigSettings 
        categoryConfig={categoryConfig}
        setCategoryConfig={setCategoryConfig}
        getCurrentCounts={getCurrentCounts}
        handleMaxCategoriesChange={handleMaxCategoriesChange}
        MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
        MIN_MAIN_CATEGORIES={MIN_MAIN_CATEGORIES}
        MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
        selectedMainCategory={selectedMainCategory}
        availableCategories={availableCategories}
        subcategories={subcategories}
      />

      {/* Category Selection Interface */}
      {categoryConfig.enabled && (
        <CategorySelection 
          availableCategories={availableCategories}
          subcategories={subcategories}
          categoryConfig={categoryConfig}
          setCategoryConfig={setCategoryConfig}
          selectedMainCategory={selectedMainCategory}
          setSelectedMainCategory={setSelectedMainCategory}
          handleCategoryToggle={handleCategoryToggle}
          getCurrentCounts={getCurrentCounts}
          MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
          MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
          setError={setError}
        />
      )}
    </div>
  )
}
