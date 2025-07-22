'use client'
import React from 'react'

export default function QuickActions({
  mainCategories,
  selectedMainCategory,
  getSubcategoriesForCategory,
  categoryConfig,
  setCategoryConfig,
  getCurrentCounts,
  MAX_MAIN_CATEGORIES,
  MAX_SUBCATEGORIES_PER_CATEGORY,
  setError,
  setSelectedMainCategory
}) {
  const handleSelectAllMainCategories = () => {
    const { mainCategoriesCount } = getCurrentCounts()
    const availableSlots = MAX_MAIN_CATEGORIES - mainCategoriesCount
    
    if (availableSlots <= 0) {
      setError(`Cannot select more categories. Maximum ${MAX_MAIN_CATEGORIES} main categories allowed.`)
      return
    }
    
    // Add unselected main categories to categoryIds
    const unselectedMainCategories = mainCategories.filter(cat => 
      !categoryConfig.categoryIds.includes(cat.id)
    ).slice(0, availableSlots)
    
    if (unselectedMainCategories.length > 0) {
      setCategoryConfig(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, ...unselectedMainCategories.map(cat => cat.id)]
      }))
    }
    
    if (unselectedMainCategories.length < mainCategories.length - mainCategoriesCount) {
      setError(`Only selected ${unselectedMainCategories.length} more categories due to limit.`)
    }
  }

  const handleSelectAllSubcategories = () => {
    if (!selectedMainCategory) {
      setError('Please select a main category first to add subcategories.')
      return
    }
    
    const subcategoriesForMain = getSubcategoriesForCategory(selectedMainCategory)
    const currentSubCount = subcategoriesForMain.filter(sub => 
      categoryConfig.categoryIds.includes(sub.id)
    ).length
    const availableSlots = MAX_SUBCATEGORIES_PER_CATEGORY - currentSubCount
    
    if (availableSlots <= 0) {
      setError(`Cannot select more subcategories. Maximum ${MAX_SUBCATEGORIES_PER_CATEGORY} subcategories per main category allowed.`)
      return
    }
    
    // Add unselected subcategories to categoryIds
    const unselectedSubcategories = subcategoriesForMain.filter(sub => 
      !categoryConfig.categoryIds.includes(sub.id)
    ).slice(0, availableSlots)
    
    if (unselectedSubcategories.length > 0) {
      setCategoryConfig(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, ...unselectedSubcategories.map(sub => sub.id)]
      }))
    }
    
    if (unselectedSubcategories.length < subcategoriesForMain.length - currentSubCount) {
      setError(`Only selected ${unselectedSubcategories.length} more subcategories due to limit.`)
    }
  }

  const handleClearAllSelections = () => {
    setCategoryConfig(prev => ({
      ...prev,
      categoryIds: []
    }))
    setSelectedMainCategory(null)
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex gap-2 flex-wrap">
          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm"
            onClick={handleSelectAllMainCategories}
          >
            <i className="bi bi-check-all me-1"></i>
            Select All Main Categories
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline-success btn-sm"
            onClick={handleSelectAllSubcategories}
            disabled={!selectedMainCategory}
          >
            <i className="bi bi-tags me-1"></i>
            Select All Subcategories
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClearAllSelections}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear All Selections
          </button>
        </div>
      </div>
    </div>
  )
}
