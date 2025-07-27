import React from 'react'
import MainCategoriesList from './MainCategoriesList'
import SubcategoriesList from './SubcategoriesList'

export default function CategorySelector({
  availableCategories,
  subcategories,
  categoryConfig,
  selectedMainCategory,
  setSelectedMainCategory,
  handleCategoryToggle,
  getCurrentCounts,
  MAX_SUBCATEGORIES_PER_CATEGORY
}) {
  const mainCategories = availableCategories.filter(cat => !cat.parent)

  // Get subcategories for selected main category
  const getSubcategoriesForCategory = (categoryId) => {
    console.log('🔍 Getting subcategories for category ID:', categoryId)
    const filtered = subcategories.filter(subCat => {
      const parentId = subCat.parent?._id || subCat.parent
      const match = parentId === categoryId
      console.log(`   - Subcategory "${subCat.name}" parent: ${parentId}, matches: ${match}`)
      return match
    })
    console.log(`   - Found ${filtered.length} subcategories for category ${categoryId}:`, filtered)
    return filtered
  }

  // Auto-select first main category if none selected
  if (!selectedMainCategory && mainCategories.length > 0) {
    setSelectedMainCategory(mainCategories[0].id)
  }

  const selectedCategorySubcategories = selectedMainCategory ? 
    getSubcategoriesForCategory(selectedMainCategory) : []

  // Bulk actions
  const handleSelectAllMainCategories = () => {
    mainCategories.forEach(category => {
      if (!categoryConfig.categoryIds.includes(category.id)) {
        handleCategoryToggle(category.id)
      }
    })
  }

  const handleSelectAllSubcategories = () => {
    subcategories.forEach(subcategory => {
      if (!categoryConfig.categoryIds.includes(subcategory.id)) {
        const parentId = subcategory.parent?._id || subcategory.parent
        handleCategoryToggle(subcategory.id, parentId)
      }
    })
  }

  const handleClearAllSelections = () => {
    // Clear all selections by setting empty array
    categoryConfig.categoryIds.forEach(categoryId => {
      if (mainCategories.some(cat => cat.id === categoryId)) {
        handleCategoryToggle(categoryId)
      } else if (subcategories.some(sub => sub.id === categoryId)) {
        const subcategory = subcategories.find(sub => sub.id === categoryId)
        const parentId = subcategory?.parent?._id || subcategory?.parent
        handleCategoryToggle(categoryId, parentId)
      }
    })
  }

  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <label className="form-label fw-semibold mb-3">Select Categories and Subcategories</label>
          
          {mainCategories.length > 0 ? (
            <div className="row">
              {/* Main Categories */}
              <MainCategoriesList
                mainCategories={mainCategories}
                categoryConfig={categoryConfig}
                selectedMainCategory={selectedMainCategory}
                setSelectedMainCategory={setSelectedMainCategory}
                handleCategoryToggle={handleCategoryToggle}
                getCurrentCounts={getCurrentCounts}
              />

              {/* Subcategories */}
              <SubcategoriesList
                selectedMainCategory={selectedMainCategory}
                selectedCategorySubcategories={selectedCategorySubcategories}
                mainCategories={mainCategories}
                categoryConfig={categoryConfig}
                handleCategoryToggle={handleCategoryToggle}
                MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
              />
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-folder2-open text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2 text-muted">No categories available</p>
              <small className="text-muted">Create categories first to configure this section.</small>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {mainCategories.length > 0 && (
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
      )}
    </>
  )
}
