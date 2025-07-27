'use client'
import React from 'react'
import MainCategoriesList from '../MainCategoriesList'
import SubcategoriesList from '../SubcategoriesList'
import QuickActions from '../QuickActions'

export default function CategorySelection({
  availableCategories,
  subcategories,
  categoryConfig,
  setCategoryConfig,
  selectedMainCategory,
  setSelectedMainCategory,
  handleCategoryToggle,
  getCurrentCounts,
  MAX_MAIN_CATEGORIES,
  MAX_SUBCATEGORIES_PER_CATEGORY,
  setError
}) {
  console.log('🎨 === RENDERING CATEGORY SELECTION ===')
  console.log('1. Available categories:', availableCategories.length)
  console.log('2. Available subcategories:', subcategories.length)
  
  const mainCategories = availableCategories.filter(cat => !cat.parent)
  const subCategories = subcategories
  
  console.log('3. Main categories:', mainCategories.length)
  console.log('4. Sub categories:', subCategories.length)
  
  // Get subcategories for selected main category
  const getSubcategoriesForCategory = (categoryId) => {
    console.log('🔍 Getting subcategories for category ID:', categoryId)
    const filtered = subCategories.filter(subCat => {
      const parentId = subCat.parent?._id || subCat.parent
      return parentId === categoryId
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

  return (
    <>
      {/* Category Selection Interface */}
      <div className="row mb-4">
        <div className="col-12">
          <label className="form-label fw-semibold mb-3">Select Categories and Subcategories</label>
          
          {mainCategories.length > 0 ? (
            <div className="row">
              {/* Left Side - Main Categories */}
              <div className="col-md-6">
                <MainCategoriesList 
                  mainCategories={mainCategories}
                  categoryConfig={categoryConfig}
                  selectedMainCategory={selectedMainCategory}
                  setSelectedMainCategory={setSelectedMainCategory}
                  handleCategoryToggle={handleCategoryToggle}
                  getSubcategoriesForCategory={getSubcategoriesForCategory}
                  getCurrentCounts={getCurrentCounts}
                />
              </div>

              {/* Right Side - Subcategories */}
              <div className="col-md-6">
                <SubcategoriesList 
                  mainCategories={mainCategories}
                  selectedMainCategory={selectedMainCategory}
                  selectedCategorySubcategories={selectedCategorySubcategories}
                  categoryConfig={categoryConfig}
                  setCategoryConfig={setCategoryConfig}
                  handleCategoryToggle={handleCategoryToggle}
                />
              </div>
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

      {/* Quick Actions */}
      {mainCategories.length > 0 && (
        <QuickActions 
          mainCategories={mainCategories}
          selectedMainCategory={selectedMainCategory}
          getSubcategoriesForCategory={getSubcategoriesForCategory}
          categoryConfig={categoryConfig}
          setCategoryConfig={setCategoryConfig}
          getCurrentCounts={getCurrentCounts}
          MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
          MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
          setError={setError}
          setSelectedMainCategory={setSelectedMainCategory}
        />
      )}
    </>
  )
}
