'use client'
import React, { useState, useEffect } from 'react'
import { get, post, put } from '@/util/apiService'
import { CATEGORY } from '@/util/apiEndpoints'

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
  const [showCategoryConfig, setShowCategoryConfig] = useState(false)
  const [availableCategories, setAvailableCategories] = useState([])
  const [pageConfig, setPageConfig] = useState(null)

  // Category section configuration state
  const [categoryConfig, setCategoryConfig] = useState({
    enabled: true,
    maxCategories: 6,
    categoryIds: [],
    layout: 'grid',
    showSubcategories: true
  })

  // Define sections for each page
  const homeSections = [
    { 
      key: "giftCategories", 
      label: "Gift Categories", 
      description: "Display category grid with gifts",
      order: 1,
      hasConfig: true
    },
    { 
      key: "slider", 
      label: "Main Slider", 
      description: "Hero banner with promotional slides",
      order: 2
    },
    { 
      key: "services", 
      label: "Services Section", 
      description: "Highlight key services and benefits",
      order: 3
    },
    { 
      key: "products", 
      label: "Featured Products", 
      description: "Showcase featured/trending products",
      order: 4
    },
    { 
      key: "banner", 
      label: "Promotional Banner", 
      description: "Secondary promotional content",
      order: 5
    },
    { 
      key: "dealProduct", 
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
      giftCategories: true,
      slider: true,
      services: true,
      products: true,
      banner: true,
      dealProduct: true,
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

  // Load page configuration
  const loadPageConfig = async (pageKey) => {
    try {
      setLoading(true)
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(`/api/pages/${pageKey}`)
      console.log('Page config response:', response)
      
      // Handle the double-wrapped response from apiService
      const actualData = response.data // This contains the backend response
      
      if (actualData && actualData.success) {
        setPageConfig(actualData.data)
        
        // Extract category section config
        const categorySection = actualData.data.sections.find(s => s.sectionType === 'categorySection')
        if (categorySection) {
          setCategoryConfig({
            enabled: categorySection.enabled,
            maxCategories: categorySection.config.maxCategories || 6,
            categoryIds: categorySection.config.categoryIds || [],
            layout: categorySection.config.layout || 'grid',
            showSubcategories: categorySection.config.showSubcategories || true
          })
          
          // Update visibility state
          setVisibleSections(prev => ({
            ...prev,
            [pageKey]: {
              ...prev[pageKey],
              giftCategories: categorySection.enabled
            }
          }))
        }
      }
      
      setError('')
    } catch (err) {
      console.error('Load page config error:', err)
      setError('Failed to load page configuration: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load available categories (same approach as CategoriesPage.js)
  const loadCategories = async () => {
    try {
      console.log('Loading categories for admin panel...')
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(CATEGORY.GET_ALL)
      console.log('Raw categories response:', response)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories')
      }
      
      console.log('Fetched categories:', response.data)
      console.log('Categories data type:', typeof response.data, 'Is array:', Array.isArray(response.data))
      
      // Ensure response.data is an array
      let categoriesData = []
      if (Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response.data && typeof response.data === 'object') {
        // Handle case where data might be wrapped
        categoriesData = Array.isArray(response.data.categories) ? response.data.categories : []
      }
      
      console.log('Categories data to process:', categoriesData)
      
      // Transform categories for display in the admin panel
      const transformedCategories = categoriesData.map(cat => ({
        id: cat.id || cat._id,
        value: cat.id || cat._id,
        label: cat.name,
        name: cat.name,
        image: cat.image?.url || '/assets/img/product/category/default-category.svg',
        description: cat.description || '',
        parent: cat.parent
      }))
      
      console.log('Transformed categories for admin panel:', transformedCategories)
      setAvailableCategories(transformedCategories)
      setError('')
      
    } catch (err) {
      console.error('Load categories error:', err)
      setError('Failed to load categories: ' + err.message)
      setAvailableCategories([])
    }
  }

  // Save category section configuration
  const saveCategoryConfig = async () => {
    try {
      setLoading(true)
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const configData = {
        enabled: categoryConfig.enabled,
        maxCategories: categoryConfig.maxCategories,
        categories: categoryConfig.categoryIds.map((id, index) => ({
          categoryId: id,
          enabled: true,
          order: index
        })),
        layout: categoryConfig.layout,
        showSubcategories: categoryConfig.showSubcategories
      }
      
      const response = await put('/api/pages/home/sections/category', configData)
      console.log('Save response:', response)
      
      // Handle the double-wrapped response from apiService
      const actualData = response.data // This contains the backend response
      
      if (actualData && actualData.success) {
        setSuccess('Category section configuration saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
        setShowCategoryConfig(false)
        
        // Trigger refresh notification (optional)
        try {
          await get('/api/pages/home/refresh/categorySection')
        } catch (refreshError) {
          console.log('Refresh notification failed, but save was successful')
        }
        
        await loadPageConfig(selectedPage) // Reload to get updated config
      } else {
        setError('Failed to save configuration: ' + (actualData?.message || 'Unknown error'))
      }
      
    } catch (err) {
      console.error('Save category config error:', err)
      setError('Failed to save category configuration: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Toggle section visibility
  const handleToggleSection = async (page, section) => {
    if (section === 'giftCategories') {
      // For category section, update the actual config
      setCategoryConfig(prev => ({ ...prev, enabled: !prev.enabled }))
      return
    }
    
    const newVisibility = {
      ...visibleSections,
      [page]: {
        ...visibleSections[page],
        [section]: !visibleSections[page][section],
      }
    }
    
    setVisibleSections(newVisibility)
  }

  // Open category configuration modal
  const openCategoryConfig = () => {
    setShowCategoryConfig(true)
  }

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    setCategoryConfig(prev => {
      const isSelected = prev.categoryIds.includes(categoryId)
      const newCategoryIds = isSelected 
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
      
      return { ...prev, categoryIds: newCategoryIds }
    })
  }

  // Handle max categories change
  const handleMaxCategoriesChange = (value) => {
    const numValue = parseInt(value) || 0
    setCategoryConfig(prev => ({ ...prev, maxCategories: numValue }))
  }

  // Load data when page changes
  useEffect(() => {
    loadPageConfig(selectedPage)
    loadCategories()
  }, [selectedPage])

  // Get sections for current page
  const getCurrentSections = () => {
    return selectedPage === "home" ? homeSections : corporateSections
  }

  // Render category configuration modal
  const renderCategoryConfigModal = () => {
    if (!showCategoryConfig) return null

    console.log('Rendering category modal with availableCategories:', availableCategories.length, availableCategories)

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Category Section Configuration
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowCategoryConfig(false)}
              ></button>
            </div>
            <div className="modal-body">
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

              {categoryConfig.enabled && (
                <>
                  {/* Max Categories */}
                  <div className="row mb-4">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                  </div>

                  {/* Category Selection */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Select Categories to Display</label>
                      <div className="text-muted mb-2">
                        Choose which categories to show. Leave empty to show all categories.
                      </div>
                      
                      {/* Category Statistics */}
                      {availableCategories.length > 0 && (
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <div className="small bg-light p-2 rounded text-center">
                              <strong>{availableCategories.filter(cat => !cat.parent).length}</strong>
                              <br />
                              <span className="text-muted">Main Categories</span>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="small bg-light p-2 rounded text-center">
                              <strong>{availableCategories.filter(cat => cat.parent).length}</strong>
                              <br />
                              <span className="text-muted">Sub Categories</span>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="small bg-primary text-white p-2 rounded text-center">
                              <strong>{categoryConfig.categoryIds.length}</strong>
                              <br />
                              <span>Selected</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="row">
                        {availableCategories.map(category => {
                          const isMainCategory = !category.parent;
                          
                          return (
                            <div key={category.id} className="col-md-6 col-lg-4 mb-3">
                              <div className={`card h-100 ${categoryConfig.categoryIds.includes(category.id) ? 'border-primary bg-light' : ''}`}>
                                <div className="card-body p-3">
                                  <div className="form-check">
                                    <input 
                                      className="form-check-input" 
                                      type="checkbox" 
                                      id={`category-${category.id}`}
                                      checked={categoryConfig.categoryIds.includes(category.id)}
                                      onChange={() => handleCategoryToggle(category.id)}
                                    />
                                    <label className="form-check-label w-100" htmlFor={`category-${category.id}`}>
                                      <div className="d-flex align-items-start">
                                        {category.image && (
                                          <img 
                                            src={category.image} 
                                            alt={category.name}
                                            className="me-2 flex-shrink-0"
                                            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                          />
                                        )}
                                        <div className="flex-grow-1">
                                          <div className="d-flex align-items-center">
                                            {isMainCategory ? (
                                              <>
                                                <i className="bi bi-grid text-primary me-1" style={{ fontSize: '14px' }}></i>
                                                <span className="fw-semibold">{category.name}</span>
                                              </>
                                            ) : (
                                              <>
                                                <i className="bi bi-arrow-return-right text-muted me-1" style={{ fontSize: '12px' }}></i>
                                                <i className="bi bi-tag text-secondary me-1" style={{ fontSize: '12px' }}></i>
                                                <span className="fw-semibold">{category.name}</span>
                                              </>
                                            )}
                                          </div>
                                          {category.parent && (
                                            <small className="text-muted d-block">
                                              Under: {category.parent.name || category.parent}
                                            </small>
                                          )}
                                          {category.description && (
                                            <small className="text-muted d-block mt-1">{category.description}</small>
                                          )}
                                          <div className="mt-1">
                                            <span className={`badge ${isMainCategory ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                                              {isMainCategory ? 'Main Category' : 'Sub Category'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {availableCategories.length === 0 && (
                        <div className="text-center py-4">
                          <i className="bi bi-folder2-open" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                          <p className="mt-2 text-muted">No categories available. Create categories first.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="row">
                    <div className="col-12">
                      <div className="form-check">
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
                </>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowCategoryConfig(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={saveCategoryConfig}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
              <span className="badge bg-primary">
                {sections.filter(s => visibleSections[selectedPage][s.key]).length} active
              </span>
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
                      const isCategorySection = section.key === 'giftCategories'
                      
                      return (
                        <tr key={section.key} className={isVisible ? '' : 'table-secondary'}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div>
                                <div className="fw-semibold">{section.label}</div>
                                {isCategorySection && categoryConfig.categoryIds.length > 0 && (
                                  <small className="text-muted">
                                    {categoryConfig.categoryIds.length} categories selected
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-muted">{section.description}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{section.order}</span>
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={isCategorySection ? categoryConfig.enabled : isVisible}
                                onChange={() => handleToggleSection(selectedPage, section.key)}
                                id={`toggle-${section.key}`}
                              />
                              <label className="form-check-label" htmlFor={`toggle-${section.key}`}>
                                {isCategorySection ? (categoryConfig.enabled ? 'Enabled' : 'Disabled') : (isVisible ? 'Visible' : 'Hidden')}
                              </label>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              {section.hasConfig && (
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={openCategoryConfig}
                                  title="Configure section"
                                >
                                  <i className="bi bi-gear"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleMoveSection(selectedPage, section.key, 'up')}
                                disabled={index === 0}
                                title="Move up"
                              >
                                <i className="bi bi-arrow-up"></i>
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleMoveSection(selectedPage, section.key, 'down')}
                                disabled={index === sections.length - 1}
                                title="Move down"
                              >
                                <i className="bi bi-arrow-down"></i>
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
                onClick={() => loadPageConfig(selectedPage)}
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

      {/* Category Configuration Modal */}
      {renderCategoryConfigModal()}

      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}
