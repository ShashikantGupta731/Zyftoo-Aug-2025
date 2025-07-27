import React from 'react'

export default function SubcategoriesList({
  selectedMainCategory,
  selectedCategorySubcategories,
  mainCategories,
  categoryConfig,
  handleCategoryToggle,
  MAX_SUBCATEGORIES_PER_CATEGORY
}) {
  // Create default subcategory icon as data URL to avoid 404 errors
  const defaultSubcategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI4IiBmaWxsPSIjZGVlMmU2Ii8+CjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjMiIGZpbGw9IiM5NjliYTYiLz4KPC9zdmc+'

  // Bulk actions for subcategories
  const handleSelectAllSubcategoriesForCategory = () => {
    selectedCategorySubcategories.forEach(subcategory => {
      if (!categoryConfig.categoryIds.includes(subcategory.id)) {
        const parentId = subcategory.parent?._id || subcategory.parent
        handleCategoryToggle(subcategory.id, parentId)
      }
    })
  }

  const handleClearAllSubcategoriesForCategory = () => {
    selectedCategorySubcategories.forEach(subcategory => {
      if (categoryConfig.categoryIds.includes(subcategory.id)) {
        const parentId = subcategory.parent?._id || subcategory.parent
        handleCategoryToggle(subcategory.id, parentId)
      }
    })
  }

  return (
    <div className="col-md-6">
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
                {/* Subcategory Stats */}
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

                {/* Bulk Actions for Subcategories */}
                <div className="p-2 border-bottom">
                  <div className="d-flex gap-1">
                    <button 
                      type="button" 
                      className="btn btn-outline-success btn-sm"
                      onClick={handleSelectAllSubcategoriesForCategory}
                    >
                      <i className="bi bi-check-all me-1"></i>
                      Select All
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleClearAllSubcategoriesForCategory}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="list-group list-group-flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {selectedCategorySubcategories.map((subcategory, index) => {
                    const isSelected = categoryConfig.categoryIds.includes(subcategory.id)
                    const parentId = subcategory.parent?._id || subcategory.parent
                    
                    return (
                      <div 
                        key={subcategory.id} 
                        className="list-group-item d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center flex-grow-1">
                          <img 
                            src={subcategory.image || defaultSubcategoryIcon}
                            alt={subcategory.name}
                            className="me-3"
                            style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.src = defaultSubcategoryIcon
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{subcategory.name}</div>
                            {subcategory.description && (
                              <small className="text-muted">{subcategory.description}</small>
                            )}
                            <div className="d-flex gap-2 mt-1">
                              <span className={`badge ${subcategory.status ? 'bg-success' : 'bg-danger'}`}>
                                {subcategory.status ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleCategoryToggle(subcategory.id, parentId)}
                          />
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
                    // Could navigate to subcategory creation page
                    console.log('Navigate to create subcategories for category:', selectedMainCategory)
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
    </div>
  )
}
