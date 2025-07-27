'use client'
import React from 'react'
import CategoryConfigHeader from '../CategoryConfigHeader'
import CategoryConfigSettings from '../CategoryConfigSettings'
import CategorySelection from '../CategorySelection'
import CategoryConfigFooter from '../CategoryConfigFooter'
import { useCategoryHelpers } from '../../hooks/useCategoryHelpers'
import { useCategoryConfigLogic } from './CategoryConfigLogic'
import ModalContainer from './ModalContainer'
import ModalBody from './ModalBody'
import ConfigurationValidator from './ConfigurationValidator'

export default function CategoryConfigModal({
  show,
  onClose,
  categoryConfig,
  setCategoryConfig,
  availableCategories,
  subcategories,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedPage,
  loadPageConfig,
  setError,
  setSuccess,
  setLoading,
  loading,
  ADMIN_TOKEN
}) {
  // Use custom hook for category helpers
  const {
    getCurrentCounts,
    transformForSave,
    handleCategoryToggle,
    handleMaxCategoriesChange
  } = useCategoryHelpers({
    categoryConfig,
    setCategoryConfig,
    availableCategories,
    subcategories,
    selectedMainCategory,
    MAX_MAIN_CATEGORIES: 10,
    MIN_MAIN_CATEGORIES: 1,
    MAX_SUBCATEGORIES_PER_CATEGORY: 10,
    setError
  })

  // Use custom hook for configuration logic
  const {
    saveCategoryConfig,
    MAX_MAIN_CATEGORIES,
    MIN_MAIN_CATEGORIES,
    MAX_SUBCATEGORIES_PER_CATEGORY
  } = useCategoryConfigLogic({
    categoryConfig,
    setCategoryConfig,
    selectedPage,
    loadPageConfig,
    setError,
    setSuccess,
    setLoading,
    ADMIN_TOKEN,
    getCurrentCounts,
    transformForSave,
    onClose
  })

  return (
    <ModalContainer show={show} size="modal-xl">
      <CategoryConfigHeader onClose={onClose} />
      
      <ModalBody 
        categoryConfig={categoryConfig}
        setCategoryConfig={setCategoryConfig}
        availableCategories={availableCategories}
        subcategories={subcategories}
        selectedMainCategory={selectedMainCategory}
        setSelectedMainCategory={setSelectedMainCategory}
        getCurrentCounts={getCurrentCounts}
        handleCategoryToggle={handleCategoryToggle}
        handleMaxCategoriesChange={handleMaxCategoriesChange}
        MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
        MIN_MAIN_CATEGORIES={MIN_MAIN_CATEGORIES}
        MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
        setError={setError}
        CategoryConfigSettings={CategoryConfigSettings}
        CategorySelection={CategorySelection}
      />

      <ConfigurationValidator 
        categoryConfig={categoryConfig}
        getCurrentCounts={getCurrentCounts}
        MIN_MAIN_CATEGORIES={MIN_MAIN_CATEGORIES}
        MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
      />

      <CategoryConfigFooter 
        onClose={onClose}
        onSave={saveCategoryConfig}
        loading={loading}
      />
    </ModalContainer>
  )
}
