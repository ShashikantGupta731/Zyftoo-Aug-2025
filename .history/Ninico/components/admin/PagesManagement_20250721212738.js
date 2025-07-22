'use client'
import React, { useState, useEffect } from 'react'
import { get, post, put } from '@/util/apiService'
import SectionManager from './sections/SectionManager'

const PAGES = [
  { 
    key: "home", 
    label: "Home Page",
    description: "Manage sections displayed on the homepage"
  },
  { 
    key: "corporate", 
    label: "Corporate Page",
    description: "Manage sections for corporate customers"
  }
]

export default function PagesManagement({ onNavigate }) {
  const [selectedPage, setSelectedPage] = useState("home")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [modalSectionKey, setModalSectionKey] = useState(null)
  const [modalSectionData, setModalSectionData] = useState(null)

  // Define sections for each page
  const homeSections = [
    { 
      key: "categorySection", 
      label: "Gift Categories", 
      description: "Display category grid with gifts",
      order: 1
    },
    { 
      key: "sliderSection", 
      label: "Main Slider", 
      description: "Hero banner with promotional slides",
      order: 2
    },
    { 
      key: "serviceSection", 
      label: "Services Section", 
      description: "Highlight key services and benefits",
      order: 3
    },
    { 
      key: "productSection", 
      label: "Featured Products", 
      description: "Showcase featured/trending products",
      order: 4
    },
    { 
      key: "bannerSection", 
      label: "Promotional Banner", 
      description: "Secondary promotional content",
      order: 5
    },
    { 
      key: "dealProductSection", 
      label: "Deal Products", 
      description: "Special offers and discounted items",
      order: 6
    }
  ]

  const corporateSections = [
    { 
      key: "corporateBanner", 
      label: "Corporate Banner", 
      description: "Hero section for corporate clients",
      order: 1
    },
    { 
      key: "corporateServices", 
      label: "Corporate Services", 
      description: "B2B services and solutions",
      order: 2
    },
    { 
      key: "corporateTestimonials", 
      label: "Client Testimonials", 
      description: "Corporate client reviews and case studies",
      order: 3
    },
    { 
      key: "corporatePartners", 
      label: "Partner Logos", 
      description: "Display trusted corporate partners",
      order: 4
    }
  ]

  // Section visibility state
  const [visibleSections, setVisibleSections] = useState({
    home: {
      categorySection: true,
      sliderSection: true,
      serviceSection: true,
      productSection: true,
      bannerSection: true,
      dealProductSection: true,
    },
    corporate: {
      corporateBanner: true,
      corporateServices: true,
      corporateTestimonials: false,
      corporatePartners: false,
    },
  })

  // Hardcoded admin token for testing
  const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYwNzMyMCwiZXhwIjoxNzUzMjEyMTIwfQ.ugFuaDCq_ewqIE-dZaql3BB91kaXBIxE0TQmqdYnagI'

  // Load page sections configuration
  const loadPageSections = async (pageKey) => {
    try {
      setLoading(true)
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await get(`/api/pages/${pageKey}/sections`)
      // For now, use default state
      console.log(`Loading sections for page: ${pageKey}`)
      
      setError('')
    } catch (err) {
      console.error('Load page sections error:', err)
      setError('Failed to load page sections: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Save page sections configuration
  const savePageSections = async (pageKey, sections) => {
    try {
      setLoading(true)
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await put(`/api/pages/${pageKey}/sections`, { sections })
      console.log(`Saving sections for page: ${pageKey}`, sections)
      
      setSuccess('Page sections updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      console.error('Save page sections error:', err)
      setError('Failed to save page sections: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Toggle section visibility
  const handleToggleSection = async (page, section) => {
    const newVisibility = {
      ...visibleSections,
      [page]: {
        ...visibleSections[page],
        [section]: !visibleSections[page][section],
      }
    }
    
    setVisibleSections(newVisibility)
    
    // Auto-save changes
    await savePageSections(page, newVisibility[page])
  }

  // Move section up/down
  const handleMoveSection = async (page, sectionKey, direction) => {
    const sections = page === "home" ? homeSections : corporateSections
    const currentIndex = sections.findIndex(s => s.key === sectionKey)
    
    if (direction === 'up' && currentIndex > 0) {
      // Move up logic - would need to update order
      console.log(`Moving ${sectionKey} up`)
    } else if (direction === 'down' && currentIndex < sections.length - 1) {
      // Move down logic - would need to update order
      console.log(`Moving ${sectionKey} down`)
    }
    
    // TODO: Implement actual reordering
    setSuccess('Section order updated!')
    setTimeout(() => setSuccess(''), 2000)
  }

  // Open section management modal
  const handleManageSection = (sectionKey) => {
    const sections = getCurrentSections()
    const sectionData = sections.find(s => s.key === sectionKey)
    
    if (sectionData) {
      setModalSectionKey(sectionKey)
      setModalSectionData(sectionData)
      setShowSectionModal(true)
    }
  }

  // Handle section updates from modal
  const handleSectionUpdate = (pageKey, sectionKey, updatedData) => {
    console.log('Updating section:', { pageKey, sectionKey, updatedData })
    
    // TODO: Send to backend API
    // await put(`/api/pages/${pageKey}/sections/${sectionKey}`, updatedData)
    
    setSuccess(`${updatedData.label} section updated successfully!`)
    setTimeout(() => setSuccess(''), 3000)
    setShowSectionModal(false)
  }

  // Close modal
  const closeSectionModal = () => {
    setShowSectionModal(false)
    setModalSectionKey(null)
    setModalSectionData(null)
  }

  // Load sections when page changes
  useEffect(() => {
    loadPageSections(selectedPage)
  }, [selectedPage])

  // Get sections for current page
  const getCurrentSections = () => {
    return selectedPage === "home" ? homeSections : corporateSections
  }

  // Render section controls
  const renderSections = () => {
    const sections = getCurrentSections()
    const currentPage = PAGES.find(p => p.key === selectedPage)
    
    return (
      <div className="col-md-9">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-semibold">{currentPage.label}</h5>
                <p className="text-muted mb-0 small">{currentPage.description}</p>
              </div>
              <span className="badge bg-primary">{sections.filter(s => visibleSections[selectedPage][s.key]).length} active</span>
            </div>
          </div>
          
          <div className="card-body p-0">
            {sections.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-grid" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <p className="mt-2 text-muted">No sections configured for this page.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Section</th>
                      <th>Description</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section, index) => {
                      const isVisible = visibleSections[selectedPage][section.key]
                      return (
                        <tr key={section.key} className={!isVisible ? 'table-secondary' : ''}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <i className={`bi ${isVisible ? 'bi-eye' : 'bi-eye-slash'} me-2 ${isVisible ? 'text-success' : 'text-muted'}`}></i>
                              <strong>{section.label}</strong>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">{section.description}</small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{section.order}</span>
                          </td>
                          <td>
                            <span className={`badge ${isVisible ? 'bg-success' : 'bg-secondary'}`}>
                              {isVisible ? 'Visible' : 'Hidden'}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm" role="group">
                              <button
                                className={`btn ${isVisible ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                onClick={() => handleToggleSection(selectedPage, section.key)}
                                title={isVisible ? 'Hide Section' : 'Show Section'}
                                disabled={loading}
                              >
                                <i className={`bi ${isVisible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleMoveSection(selectedPage, section.key, 'up')}
                                title="Move Up"
                                disabled={loading || index === 0}
                              >
                                <i className="bi bi-arrow-up"></i>
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleMoveSection(selectedPage, section.key, 'down')}
                                title="Move Down"
                                disabled={loading || index === sections.length - 1}
                              >
                                <i className="bi bi-arrow-down"></i>
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleManageSection(section.key)}
                                title="Section Settings"
                                disabled={loading}
                              >
                                <i className="bi bi-gear"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render page sidebar
  const renderPageSidebar = () => (
    <div className="col-md-3">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-file-earmark-text me-2"></i>
            Pages
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {PAGES.map((page) => {
              const isActive = selectedPage === page.key
              const activeCount = visibleSections[page.key] ? 
                Object.values(visibleSections[page.key]).filter(Boolean).length : 0
              
              return (
                <button
                  key={page.key}
                  className={`list-group-item list-group-item-action border-0 ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedPage(page.key)}
                  disabled={loading}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{page.label}</div>
                      <small className={isActive ? 'text-white-50' : 'text-muted'}>
                        {page.description}
                      </small>
                    </div>
                    <span className={`badge ${isActive ? 'bg-white text-primary' : 'bg-primary'}`}>
                      {activeCount}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Pages Management</h2>
              <p className="text-muted mb-0">Control which sections appear on each page</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => loadPageSections(selectedPage)}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
              <button
                type="button"
                className="btn-close ms-auto"
                onClick={() => setError('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div>{success}</div>
              <button
                type="button"
                className="btn-close ms-auto"
                onClick={() => setSuccess('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        {renderPageSidebar()}
        {renderSections()}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Section Management Modal */}
      {showSectionModal && modalSectionKey && modalSectionData && (
        <SectionManager
          pageKey={selectedPage}
          sectionKey={modalSectionKey}
          sectionData={modalSectionData}
          onClose={closeSectionModal}
          onUpdate={handleSectionUpdate}
        />
      )}
    </div>
  )
}
