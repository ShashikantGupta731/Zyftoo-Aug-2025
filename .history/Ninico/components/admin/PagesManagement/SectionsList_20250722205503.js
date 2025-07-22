'use client'
import React from 'react'

export default function SectionsList({ 
  sections, 
  visibleSections, 
  selectedPage, 
  onToggleSection, 
  onConfigureCategory, 
  loading 
}) {
  const getSectionIcon = (sectionKey) => {
    const iconMap = {
      giftCategories: 'bi-grid-3x3-gap',
      slider: 'bi-images',
      services: 'bi-tools',
      products: 'bi-box-seam',
      banner: 'bi-image',
      dealProduct: 'bi-percent',
      corporateBanner: 'bi-building',
      corporateServices: 'bi-briefcase',
      corporateTestimonials: 'bi-chat-quote',
      corporatePartners: 'bi-people'
    }
    return iconMap[sectionKey] || 'bi-square'
  }

  const getSectionColor = (sectionKey) => {
    const colorMap = {
      giftCategories: 'primary',
      slider: 'info',
      services: 'success',
      products: 'warning',
      banner: 'secondary',
      dealProduct: 'danger',
      corporateBanner: 'primary',
      corporateServices: 'success',
      corporateTestimonials: 'info',
      corporatePartners: 'secondary'
    }
    return colorMap[sectionKey] || 'secondary'
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <i className="bi bi-layout-text-window me-2"></i>
              Page Sections
            </h5>
            <span className="badge bg-info">
              {sections.filter(section => visibleSections[section.key]).length} / {sections.length} Active
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              {sections.map((section, index) => {
                const isVisible = visibleSections[section.key]
                const isCategorySection = section.key === 'giftCategories'
                const color = getSectionColor(section.key)
                
                return (
                  <div key={section.key} className="col-lg-6 col-xl-4 mb-4">
                    <div className={`card h-100 border ${isVisible ? `border-${color}` : 'border-secondary'} ${isVisible ? `bg-${color} bg-opacity-10` : ''}`}>
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <i className={`bi ${getSectionIcon(section.key)} me-2 text-${color}`}></i>
                          <h6 className="mb-0">{section.label}</h6>
                        </div>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={`section-${section.key}`}
                            checked={isVisible}
                            onChange={() => onToggleSection(selectedPage, section.key)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="text-muted mb-3 small">{section.description}</p>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className={`badge ${isVisible ? `bg-${color}` : 'bg-secondary'}`}>
                              <i className={`bi ${isVisible ? 'bi-eye' : 'bi-eye-slash'} me-1`}></i>
                              {isVisible ? 'Visible' : 'Hidden'}
                            </span>
                            <small className="text-muted ms-2">Order: {section.order}</small>
                          </div>
                          
                          {section.hasConfig && (
                            <button 
                              className={`btn btn-sm btn-outline-${color}`}
                              onClick={onConfigureCategory}
                              disabled={loading}
                              title="Configure this section"
                            >
                              <i className="bi bi-gear"></i>
                            </button>
                          )}
                        </div>
                        
                        {isCategorySection && (
                          <div className="mt-3 pt-3 border-top">
                            <small className="text-muted d-block mb-2">
                              <i className="bi bi-info-circle me-1"></i>
                              This section displays product categories on the homepage
                            </small>
                            <div className="d-flex gap-2">
                              <span className="badge bg-light text-dark">
                                <i className="bi bi-grid me-1"></i>
                                Categories
                              </span>
                              <span className="badge bg-light text-dark">
                                <i className="bi bi-tags me-1"></i>
                                Subcategories
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {sections.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-layout-text-window text-muted" style={{ fontSize: '3rem' }}></i>
                <h6 className="mt-3 text-muted">No sections available</h6>
                <p className="text-muted mb-0">Sections will appear here when available for this page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
