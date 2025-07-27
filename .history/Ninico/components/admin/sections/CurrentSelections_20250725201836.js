import React from 'react';
import useCategorySectionData from '@/hooks/useCategorySectionData';

export default function CurrentSelections({ pageId, token }) {
  const {
    mainCategories,
    subcategories,
    loading,
    error,
    selectedMainCategory,
    setSelectedMainCategory,
    getSubcategoriesForCategory
  } = useCategorySectionData(pageId, token);

  // Create default category icon as data URL to avoid 404 errors
  const defaultCategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Zm9sZGVyIGZpbGw9IiM5NjliYTYiLz4KPHN2ZyB4PSI2IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yIDJoOGwyIDJoMTB2MTJIMlYyeiIgZmlsbD0iIzk2OWJhNiIvPgo8L3N2Zz4KPC9zdmc+';
  
  // Create default subcategory icon as data URL to avoid 404 errors
  const defaultSubcategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI4IiBmaWxsPSIjZGVlMmU2Ii8+CjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjMiIGZpbGw9IiM5NjliYTYiLz4KPC9zdmc+';

  // Loading state
  if (loading) {
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
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading current selections...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-danger">
            <div className="card-header bg-danger bg-opacity-10">
              <h6 className="mb-0 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error Loading Selections
              </h6>
            </div>
            <div className="card-body">
              <div className="text-center py-4">
                <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
                <p className="mt-2 text-danger mb-1">Failed to load current selections</p>
                <small className="text-muted">Error: {error}</small>
                <div className="mt-3">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate subcategories for selected main category
  const selectedCategorySubcategories = selectedMainCategory ? 
    getSubcategoriesForCategory(selectedMainCategory) : [];

  // Main render
  return (
    <>
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
              {mainCategories.length > 0 || subcategories.length > 0 ? (
                <div className="row">
                  {/* Main Categories List */}
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-grid me-1"></i>
                      Selected Main Categories ({mainCategories.length})
                    </h6>
                    <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {mainCategories.map((category) => (
                        <div
                          key={category.id}
                          className={`d-flex align-items-center p-2 rounded mb-2 cursor-pointer ${
                            selectedMainCategory === category.id 
                              ? 'bg-primary bg-opacity-20 border border-primary' 
                              : 'bg-light border border-light'
                          }`}
                          onClick={() => setSelectedMainCategory(category.id)}
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <img 
                            src={category.image || defaultCategoryIcon}
                            alt={category.name}
                            className="me-3 rounded"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = defaultCategoryIcon;
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium text-dark">{category.name}</div>
                            {category.description && (
                              <small className="text-muted">{category.description}</small>
                            )}
                          </div>
                          {selectedMainCategory === category.id && (
                            <i className="bi bi-check-circle text-primary"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories List */}
                  <div className="col-md-6">
                    <h6 className="text-secondary mb-3">
                      <i className="bi bi-tags me-1"></i>
                      Selected Subcategories ({selectedCategorySubcategories.length})
                    </h6>
                    <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedMainCategory ? (
                        selectedCategorySubcategories.length > 0 ? (
                          selectedCategorySubcategories.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className="d-flex align-items-center p-2 rounded mb-2 bg-light border border-light"
                            >
                              <img 
                                src={subcategory.image || defaultSubcategoryIcon}
                                alt={subcategory.name}
                                className="me-3 rounded"
                                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = defaultSubcategoryIcon;
                                }}
                              />
                              <div className="flex-grow-1">
                                <div className="fw-medium text-dark">{subcategory.name}</div>
                                {subcategory.description && (
                                  <small className="text-muted">{subcategory.description}</small>
                                )}
                                <small className="text-info d-block">
                                  under {subcategory.parentName}
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <i className="bi bi-info-circle text-muted" style={{ fontSize: '2rem' }}></i>
                            <p className="text-muted mt-2 mb-0">No subcategories found</p>
                            <small className="text-muted">This category has no subcategories</small>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-hand-index text-muted" style={{ fontSize: '2rem' }}></i>
                          <p className="text-muted mt-2 mb-0">Select a main category</p>
                          <small className="text-muted">Click on a main category to view its subcategories</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="text-muted mt-2 mb-0">No categories configured</p>
                  <small className="text-muted">Configure the category section to see selections here</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      {(mainCategories.length > 0 || subcategories.length > 0) && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center bg-light rounded p-3">
              <div className="d-flex gap-4">
                <div className="text-center">
                  <div className="fw-bold text-primary fs-4">{mainCategories.length}</div>
                  <small className="text-muted">Main Categories</small>
                </div>
                <div className="text-center">
                  <div className="fw-bold text-secondary fs-4">{subcategories.length}</div>
                  <small className="text-muted">Total Subcategories</small>
                </div>
                <div className="text-center">
                  <div className="fw-bold text-success fs-4">{selectedCategorySubcategories.length}</div>
                  <small className="text-muted">Current Category Subs</small>
                </div>
              </div>
              <div className="text-end">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Data from: API Database
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}