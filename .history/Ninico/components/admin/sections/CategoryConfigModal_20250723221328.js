import React from 'react'
import CategorySettings from './CategorySettings'
import CategorySelectionSummary from './CategorySelectionSummary'
import CurrentSelections from './CurrentSelections'
import CategorySelector from './CategorySelector'

export default function CategoryConfigModal({
  showModal,
  onClose,
  categoryConfig,
  setCategoryConfig,
  availableCategories,
  subcategories,
  selectedMainCategory,
  setSelectedMainCategory,
  getCurrentCounts,
  handleCategoryToggle,
  handleMaxCategoriesChange,
  saveCategoryConfig,
  loading,
  error,
  setError
}) {
  if (!showModal) return null

  const MAX_MAIN_CATEGORIES = 10
  const MIN_MAIN_CATEGORIES = 1
  const MAX_SUBCATEGORIES_PER_CATEGORY = 10

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Category Section Configuration
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Error Display */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <div>{error}</div>
                <button 
                  type="button" 
                  className="btn-close ms-auto" 
                  onClick={() => setError('')}
                ></button>
              </div>
            )}

            {/* Basic Settings */}
            <CategorySettings
              categoryConfig={categoryConfig}
              setCategoryConfig={setCategoryConfig}
              handleMaxCategoriesChange={handleMaxCategoriesChange}
            />

            {categoryConfig.enabled && (
              <>
                {/* Selection Summary */}
                <CategorySelectionSummary
                  getCurrentCounts={getCurrentCounts}
                  selectedMainCategory={selectedMainCategory}
                  MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
                  MIN_MAIN_CATEGORIES={MIN_MAIN_CATEGORIES}
                  MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
                />

                {/* Current Selections Display */}
                <CurrentSelections
                  categoryConfig={categoryConfig}
                  availableCategories={availableCategories}
                  subcategories={subcategories}
                />

                {/* Selection Summary Info */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle me-2"></i>
                      <div>
                        <strong>Selection Summary:</strong> {categoryConfig.categoryIds.length} categories selected 
                        ({categoryConfig.categoryIds.filter(id => availableCategories.some(cat => cat.id === id && !cat.parent)).length} main categories, {categoryConfig.categoryIds.filter(id => subcategories.some(cat => cat.id === id)).length} subcategories)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Selection Interface */}
                <CategorySelector
                  availableCategories={availableCategories}
                  subcategories={subcategories}
                  categoryConfig={categoryConfig}
                  selectedMainCategory={selectedMainCategory}
                  setSelectedMainCategory={setSelectedMainCategory}
                  handleCategoryToggle={handleCategoryToggle}
                  getCurrentCounts={getCurrentCounts}
                  MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
                />
              </>
            )}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={saveCategoryConfig}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
