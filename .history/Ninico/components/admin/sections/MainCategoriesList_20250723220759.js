import React from 'react'

export default function MainCategoriesList({
  mainCategories,
  categoryConfig,
  selectedMainCategory,
  setSelectedMainCategory,
  handleCategoryToggle,
  getCurrentCounts
}) {
  // Create default category icon as data URL to avoid 404 errors
  const defaultCategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Zm9sZGVyIGZpbGw9IiM5NjliYTYiLz4KPHN2ZyB4PSI2IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yIDJoOGwyIDJoMTB2MTJIMlYyeiIgZmlsbD0iIzk2OWJhNiIvPgo8L3N2Zz4KPC9zdmc+'

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-grid text-primary me-2"></i>
            Main Categories ({mainCategories.length})
          </h6>
          <span className="badge bg-primary">
            {getCurrentCounts().mainCategoriesCount} selected
          </span>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {mainCategories.map((category, index) => {
              const isSelected = categoryConfig.categoryIds.includes(category.id)
              const isCurrentlyViewed = selectedMainCategory === category.id
              
              return (
                <div 
                  key={category.id} 
                  className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${isCurrentlyViewed ? 'active' : ''}`}
                  onClick={() => setSelectedMainCategory(category.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <img 
                      src={category.image || defaultCategoryIcon}
                      alt={category.name}
                      className="me-3"
                      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => {
                        e.target.src = defaultCategoryIcon
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-medium">{category.name}</div>
                      {category.description && (
                        <small className="text-muted">{category.description}</small>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {isCurrentlyViewed && (
                      <span className="badge bg-info">Viewing</span>
                    )}
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleCategoryToggle(category.id)
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
