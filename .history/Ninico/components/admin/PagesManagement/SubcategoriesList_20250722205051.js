'use client'
import React from 'react'

export default function SubcategoriesList({
  mainCategories,
  selectedMainCategory,
  selectedCategorySubcategories,
  categoryConfig,
  setCategoryConfig,
  handleCategoryToggle
}) {
  return (
    <div className="card">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-tag text-secondary me-2"></i>
          Subcategories
          {selectedMainCategory && (
            <span className="text-muted ms-2">
              for "{mainCategories.find(cat => cat.id === selectedMainCategory)?.name}"
            </span>
          )}
        </h6>
        {selectedCategorySubcategories.length > 0 && (
          <span className="badge bg-secondary">
            {selectedCategorySubcategories.length} subcategories
          </span>
        )}
      </div>
      <div className="card-body p-0">
        {selectedMainCategory ? (
          selectedCategorySubcategories.length > 0 ? (
            <>
              {/* Subcategories Stats */}
              <div className="p-3 bg-light border-bottom">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="small">
                      <strong>{selectedCategorySubcategories.filter(sub => categoryConfig.categoryIds.includes(sub.id)).length}</strong>
                      <br />
                      <span className="text-muted">Selected</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="small">
                      <strong>{selectedCategorySubcategories.filter(sub => sub.status).length}</strong>
                      <br />
                      <span className="text-muted">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Subcategories */}
              <div className="p-2 border-bottom">
                <div className="d-flex gap-1">
                  <button 
                    type="button" 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => {
                      const currentSubIds = selectedCategorySubcategories.map(cat => cat.id)
                      setCategoryConfig(prev => ({
                        ...prev,
                        categoryIds: [...new Set([...prev.categoryIds, ...currentSubIds])]
                      }))
                    }}
                  >
                    <i className="bi bi-check-all me-1"></i>
                    Select All
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      const currentSubIds = selectedCategorySubcategories.map(cat => cat.id)
                      setCategoryConfig(prev => ({
                        ...prev,
                        categoryIds: prev.categoryIds.filter(id => !currentSubIds.includes(id))
                      }))
                    }}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Clear All
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="list-group list-group-flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {selectedCategorySubcategories.map((subcategory, index) => {
                  // Use the flat categoryIds array for now since categories is still an array
                  const isSelected = categoryConfig.categoryIds.includes(subcategory.id)
                  
                  return (
                    <div 
                      key={subcategory.id} 
                      className={`list-group-item list-group-item-action border-0 ${isSelected ? 'bg-success bg-opacity-10 border-start border-success border-3' : ''}`}
                    >
                      <div className="d-flex align-items-center">
                        <div className="form-check me-3">
                          <input 
                            className="form-check-input form-check-input-success" 
                            type="checkbox" 
                            id={`sub-category-${subcategory.id}`}
                            checked={isSelected}
                            onChange={() => handleCategoryToggle(subcategory.id, selectedMainCategory)}
                          />
                        </div>
                        
                        {subcategory.image && (
                          <img 
                            src={subcategory.image} 
                            alt={subcategory.name}
                            className="me-3 flex-shrink-0 border"
                            style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                        )}
                        
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1 text-dark fw-semibold">
                                <i className="bi bi-tag text-success me-1" style={{ fontSize: '12px' }}></i>
                                {subcategory.name}
                              </h6>
                              {subcategory.description && (
                                <p className="mb-1 text-muted small">{subcategory.description}</p>
                              )}
                              <div className="d-flex gap-1 align-items-center">
                                <span className="badge bg-secondary" style={{ fontSize: '9px' }}>
                                  Subcategory
                                </span>
                                <span className={`badge ${subcategory.status ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '9px' }}>
                                  {subcategory.status ? 'Active' : 'Inactive'}
                                </span>
                                {isSelected && (
                                  <span className="badge bg-primary" style={{ fontSize: '9px' }}>
                                    <i className="bi bi-check-circle me-1"></i>
                                    Selected
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-end">
                              <small className="text-muted">#{index + 1}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer Info */}
              <div className="p-2 bg-light border-top text-center">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Click checkboxes to select subcategories for homepage display
                </small>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-folder2-open text-muted" style={{ fontSize: '2.5rem' }}></i>
              <h6 className="mt-3 text-muted">No subcategories found</h6>
              <p className="text-muted mb-3">
                The category "{mainCategories.find(cat => cat.id === selectedMainCategory)?.name}" doesn't have any subcategories yet.
              </p>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  // You can add navigation to create subcategory here
                  alert('Navigate to Categories > Subcategories to create subcategories for this category')
                }}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Create Subcategories
              </button>
            </div>
          )
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-arrow-left text-primary" style={{ fontSize: '2.5rem' }}></i>
            <h6 className="mt-3 text-muted">Select a main category</h6>
            <p className="text-muted mb-0">
              Click on a main category from the left panel to view and select its subcategories.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
