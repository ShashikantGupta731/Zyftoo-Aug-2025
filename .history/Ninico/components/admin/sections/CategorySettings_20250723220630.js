import React from 'react'

export default function CategorySettings({
  categoryConfig,
  setCategoryConfig,
  handleMaxCategoriesChange
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

      {/* Configuration Options */}
      {categoryConfig.enabled && (
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
      )}
    </>
  )
}
