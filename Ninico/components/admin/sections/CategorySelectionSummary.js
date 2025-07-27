import React from 'react'

export default function CategorySelectionSummary({
  getCurrentCounts,
  selectedMainCategory,
  MAX_MAIN_CATEGORIES,
  MIN_MAIN_CATEGORIES,
  MAX_SUBCATEGORIES_PER_CATEGORY
}) {
  const counts = getCurrentCounts()

  return (
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
                <div className={`d-flex justify-content-between align-items-center p-2 rounded ${counts.mainCategoriesCount >= MIN_MAIN_CATEGORIES && counts.mainCategoriesCount <= MAX_MAIN_CATEGORIES ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                  <span className="fw-semibold">
                    <i className="bi bi-grid me-1"></i>
                    Main Categories:
                  </span>
                  <span className="badge bg-primary">
                    {counts.mainCategoriesCount} / {MAX_MAIN_CATEGORIES}
                  </span>
                </div>
                {counts.mainCategoriesCount < MIN_MAIN_CATEGORIES && (
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
                    {counts.totalSubcategoriesCount}
                  </span>
                </div>
                {selectedMainCategory && (
                  <small className="text-muted">
                    <i className="bi bi-arrow-right me-1"></i>
                    Selected category: {counts.selectedCategorySubCount} / {MAX_SUBCATEGORIES_PER_CATEGORY}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
