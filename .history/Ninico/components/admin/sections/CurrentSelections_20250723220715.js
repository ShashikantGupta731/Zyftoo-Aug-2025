import React from 'react'

export default function CurrentSelections({
  categoryConfig,
  availableCategories,
  subcategories
}) {
  // Create default category icon as data URL to avoid 404 errors
  const defaultCategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Zm9sZGVyIGZpbGw9IiM5NjliYTYiLz4KPHN2ZyB4PSI2IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yIDJoOGwyIDJoMTB2MTJIMlYyeiIgZmlsbD0iIzk2OWJhNiIvPgo8L3N2Zz4KPC9zdmc+'
  
  // Create default subcategory icon as data URL to avoid 404 errors
  const defaultSubcategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI4IiBmaWxsPSIjZGVlMmU2Ii8+CjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjMiIGZpbGw9IiM5NjliYTYiLz4KPC9zdmc+'

  const mainCategories = availableCategories.filter(cat => !cat.parent)
  const subCategories = subcategories

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-success">
          <div className="card-header bg-success bg-opacity-10">
            <h6 className="mb-0 text-success">
              <i className="bi bi-check-circle me-2"></i>
              Current Selections
            </h6>
          </div>
          <div className="card-body">
            {categoryConfig.categoryIds.length > 0 ? (
              <div className="row">
                {/* Selected Main Categories */}
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-grid me-1"></i>
                    Selected Main Categories ({categoryConfig.categoryIds.filter(id => mainCategories.some(cat => cat.id === id)).length})
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {categoryConfig.categoryIds
                      .filter(id => mainCategories.some(cat => cat.id === id))
                      .map(categoryId => {
                        const category = mainCategories.find(cat => cat.id === categoryId)
                        return category ? (
                          <div key={categoryId} className="d-flex align-items-center bg-primary bg-opacity-10 rounded px-3 py-2">
                            <img 
                              src={category.image || defaultCategoryIcon}
                              alt={category.name}
                              className="me-2"
                              style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = defaultCategoryIcon
                              }}
                            />
                            <span className="text-primary fw-medium">{category.name}</span>
                          </div>
                        ) : null
                      })}
                  </div>
                  {categoryConfig.categoryIds.filter(id => mainCategories.some(cat => cat.id === id)).length === 0 && (
                    <p className="text-muted mb-0">
                      <i className="bi bi-info-circle me-1"></i>
                      No main categories selected
                    </p>
                  )}
                </div>

                {/* Selected Subcategories */}
                <div className="col-md-6">
                  <h6 className="text-secondary mb-3">
                    <i className="bi bi-tags me-1"></i>
                    Selected Subcategories ({categoryConfig.categoryIds.filter(id => subCategories.some(cat => cat.id === id)).length})
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {categoryConfig.categoryIds
                      .filter(id => subCategories.some(cat => cat.id === id))
                      .map(subcategoryId => {
                        const subcategory = subCategories.find(cat => cat.id === subcategoryId)
                        const parentCategory = mainCategories.find(cat => cat.id === (subcategory?.parent?._id || subcategory?.parent))
                        return subcategory ? (
                          <div key={subcategoryId} className="d-flex align-items-center bg-secondary bg-opacity-10 rounded px-3 py-2">
                            <img 
                              src={subcategory.image || defaultSubcategoryIcon}
                              alt={subcategory.name}
                              className="me-2"
                              style={{ width: '18px', height: '18px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = defaultSubcategoryIcon
                              }}
                            />
                            <div className="d-flex flex-column">
                              <span className="text-secondary fw-medium" style={{ fontSize: '0.875rem' }}>
                                {subcategory.name}
                              </span>
                              {parentCategory && (
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  under {parentCategory.name}
                                </small>
                              )}
                            </div>
                          </div>
                        ) : null
                      })}
                  </div>
                  {categoryConfig.categoryIds.filter(id => subCategories.some(cat => cat.id === id)).length === 0 && (
                    <p className="text-muted mb-0">
                      <i className="bi bi-info-circle me-1"></i>
                      No subcategories selected
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2 mb-0">No categories selected yet</p>
                <small className="text-muted">Select categories from the interface below to see them here</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
