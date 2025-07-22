'use client'
import React from 'react'

export default function MainCategoriesList({
  mainCategories,
  categoryConfig,
  selectedMainCategory,
  setSelectedMainCategory,
  handleCategoryToggle,
  getSubcategoriesForCategory,
  getCurrentCounts
}) {
  return (
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
            // Use the flat categoryIds array for now since categories is still an array
            const isSelected = categoryConfig.categoryIds.includes(category.id)
            const isActiveTab = selectedMainCategory === category.id
            const subcategoryCount = getSubcategoriesForCategory(category.id).length
            const selectedSubcategoryCount = getSubcategoriesForCategory(category.id)
              .filter(sub => categoryConfig.categoryIds.includes(sub.id)).length
            
            return (
              <div 
                key={category.id} 
                className={`list-group-item list-group-item-action border-0 ${isActiveTab ? 'active' : ''} ${isSelected ? 'bg-primary bg-opacity-10 border-start border-primary border-3' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedMainCategory(category.id)}
              >
                <div className="d-flex align-items-center">
                  <div className="form-check me-3" onClick={(e) => e.stopPropagation()}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id={`main-category-${category.id}`}
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.id)}
                    />
                  </div>
                  
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="me-3 flex-shrink-0 border"
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className={`mb-1 fw-semibold ${isActiveTab ? 'text-white' : 'text-dark'}`}>
                          <i className="bi bi-grid text-primary me-1" style={{ fontSize: '14px' }}></i>
                          {category.name}
                        </h6>
                        {category.description && (
                          <p className={`mb-1 small ${isActiveTab ? 'text-white-50' : 'text-muted'}`}>
                            {category.description}
                          </p>
                        )}
                        <div className="d-flex gap-1 align-items-center">
                          <span className={`badge ${isActiveTab ? 'bg-white text-primary' : 'bg-primary'}`} style={{ fontSize: '9px' }}>
                            Main Category
                          </span>
                          {isSelected && (
                            <span className={`badge ${isActiveTab ? 'bg-success text-white' : 'bg-success'}`} style={{ fontSize: '9px' }}>
                              <i className="bi bi-check-circle me-1"></i>
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-end">
                        {subcategoryCount > 0 && (
                          <div className="mb-1">
                            <span className={`badge ${isActiveTab ? 'bg-white text-primary' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                              {subcategoryCount} subs
                            </span>
                          </div>
                        )}
                        {selectedSubcategoryCount > 0 && (
                          <div className="mb-1">
                            <span className={`badge ${isActiveTab ? 'bg-success text-white' : 'bg-success'}`} style={{ fontSize: '10px' }}>
                              {selectedSubcategoryCount} selected
                            </span>
                          </div>
                        )}
                        <i className={`bi bi-chevron-right ${isActiveTab ? 'text-white' : 'text-muted'}`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
