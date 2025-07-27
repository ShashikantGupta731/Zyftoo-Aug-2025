'use client'
import React from 'react'

export default function CategoryConfigSettings({ 
  categoryConfig, 
  setCategoryConfig, 
  getCurrentCounts,
  handleMaxCategoriesChange,
  MAX_MAIN_CATEGORIES,
  MIN_MAIN_CATEGORIES,
  MAX_SUBCATEGORIES_PER_CATEGORY,
  selectedMainCategory,
  availableCategories = [],
  subcategories = []
}) {
  return (
    <>
      {/* Enable/Disable Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="enableCategorySection"
              checked={categoryConfig.enabled}
              onChange={(e) => setCategoryConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            />
            <label className="form-check-label fw-semibold" htmlFor="enableCategorySection">
              Enable Category Section
            </label>
          </div>
          <small className="text-muted">Turn on/off the category section on the homepage</small>
        </div>
      </div>

      {categoryConfig.enabled && (
        <>
          {/* Selection Summary and Validation */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-info">
                <div className="card-header bg-info bg-opacity-10">
                  <h6 className="mb-0 text-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Selection Summary
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className={`d-flex justify-content-between align-items-center p-2 rounded ${getCurrentCounts().mainCategoriesCount >= MIN_MAIN_CATEGORIES && getCurrentCounts().mainCategoriesCount <= MAX_MAIN_CATEGORIES ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                        <span className="fw-semibold">
                          <i className="bi bi-grid me-1"></i>
                          Main Categories:
                        </span>
                        <span className="badge bg-primary">
                          {getCurrentCounts().mainCategoriesCount} / {MAX_MAIN_CATEGORIES}
                        </span>
                      </div>
                      {getCurrentCounts().mainCategoriesCount < MIN_MAIN_CATEGORIES && (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Minimum {MIN_MAIN_CATEGORIES} main category required
                        </small>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center p-2 rounded bg-info bg-opacity-10 text-info">
                        <span className="fw-semibold">
                          <i className="bi bi-tags me-1"></i>
                          Total Subcategories:
                        </span>
                        <span className="badge bg-info">
                          {getCurrentCounts().totalSubcategoriesCount}
                        </span>
                      </div>
                      {selectedMainCategory && (
                        <small className="text-muted">
                          <i className="bi bi-arrow-right me-1"></i>
                          Selected category: {getCurrentCounts().selectedCategorySubCount} / {MAX_SUBCATEGORIES_PER_CATEGORY}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Maximum Categories to Show</label>
              <input 
                type="number" 
                className="form-control"
                min="1"
                max="20"
                value={categoryConfig.maxCategories}
                onChange={(e) => handleMaxCategoriesChange(e.target.value)}
              />
              <small className="text-muted">Limit how many categories appear (0 = no limit)</small>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Layout Style</label>
              <select 
                className="form-select"
                value={categoryConfig.layout}
                onChange={(e) => setCategoryConfig(prev => ({ ...prev, layout: e.target.value }))}
              >
                <option value="grid">Grid Layout</option>
                <option value="carousel">Carousel</option>
                <option value="list">List View</option>
              </select>
            </div>
            <div className="col-md-4">
              <div className="form-check mt-4">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="showSubcategories"
                  checked={categoryConfig.showSubcategories}
                  onChange={(e) => setCategoryConfig(prev => ({ ...prev, showSubcategories: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="showSubcategories">
                  Show subcategories on hover
                </label>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info d-flex align-items-center">
                <i className="bi bi-info-circle me-2"></i>
                <div>
                  <strong>Selection Summary:</strong> {categoryConfig.categoryIds.length} categories selected 
                  ({categoryConfig.categoryIds.filter(id => {
                    // Count main categories
                    return availableCategories?.some(cat => cat.id === id && !cat.parent) || false
                  }).length} main categories, {categoryConfig.categoryIds.filter(id => {
                    // Count subcategories  
                    return subcategories?.some(cat => cat.id === id) || false
                  }).length} subcategories)
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
