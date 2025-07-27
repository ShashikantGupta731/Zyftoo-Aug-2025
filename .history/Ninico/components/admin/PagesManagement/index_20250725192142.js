'use client'
import React, { useState, useEffect } from 'react'
import { get } from '@/util/apiService'
import { CATEGORY, SUBCATEGORY } from '@/util/apiEndpoints'
import CategoryConfigModal from './CategoryConfigSection/CategoryConfigModal/CategoryConfigModal'
import PageSelector from './PageSelector'
import SectionsList from './SectionsList'

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
  const [subcategories, setSubcategories] = useState([])
  const [pageConfig, setPageConfig] = useState(null)

  // Category section configuration state - NEW HIERARCHICAL STRUCTURE
  const [categoryConfig, setCategoryConfig] = useState({
    enabled: true,
    maxCategories: 10,
    layout: 'grid',
    showSubcategories: true,
    categories: [],
    categoryIds: []
  })

  // UI state for category selection
  const [selectedMainCategory, setSelectedMainCategory] = useState(null)

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
  const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MzI4MTMyMCwiZXhwIjoxNzUzODg2MTIwfQ.3wEx7ZCDvYtUQppFM9CcXjhG1zTQX9_RYY_dy3Y6MZs'

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

  // Load page configuration
  const loadPageConfig = async (pageKey) => {
    try {
      setLoading(true)
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(`/pages/${pageKey}`)
      console.log('Page config response:', response)
      
      // Handle the double-wrapped response from apiService
      const actualData = response.data
      
      if (actualData && actualData.success) {
        setPageConfig(actualData.data)
        
        // Extract category section config
        const categorySection = actualData.data.sections.find(s => s.sectionType === 'categorySection')
        if (categorySection && categorySection.config) {
          // Convert the saved flat structure back to hierarchical state
          const hierarchicalConfig = {
            enabled: categorySection.enabled || false,
            maxCategories: categorySection.config.maxCategories || 10,
            layout: categorySection.config.layout || 'grid',
            showSubcategories: categorySection.config.showSubcategories || true,
            categories: {},
            categoryIds: []
          }
          
          // Rebuild hierarchical structure from saved config
          if (categorySection.config.categories && Array.isArray(categorySection.config.categories)) {
            const categoryIds = []
            categorySection.config.categories.forEach(cat => {
              if (cat.categoryId) {
                categoryIds.push(cat.categoryId)
                hierarchicalConfig.categories[cat.categoryId] = {
                  selected: cat.enabled || false,
                  order: cat.order || 0,
                  subcategories: {}
                }
                
                // Add subcategories if they exist
                if (cat.subcategories && Array.isArray(cat.subcategories)) {
                  cat.subcategories.forEach(sub => {
                    if (sub.categoryId) {
                      categoryIds.push(sub.categoryId)
                      hierarchicalConfig.categories[cat.categoryId].subcategories[sub.categoryId] = {
                        selected: sub.enabled || false,
                        order: sub.order || 0,
                        parentId: cat.categoryId
                      }
                    }
                  })
                }
              }
            })
            hierarchicalConfig.categoryIds = categoryIds
          }
          
          setCategoryConfig(hierarchicalConfig)
          console.log('📂 Loaded hierarchical config:', hierarchicalConfig)
          
          // Update visibility state
          setVisibleSections(prev => ({
            ...prev,
            [pageKey]: {
              ...prev[pageKey],
              giftCategories: categorySection.enabled
            }
          }))
        } else {
          // Initialize with default hierarchical structure if no config exists
          setCategoryConfig({
            enabled: false,
            maxCategories: 10,
            layout: 'grid',
            showSubcategories: true,
            categories: {},
            categoryIds: []
          })
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

  // Load available categories
  const loadCategories = async () => {
    try {
      console.log('🔄 === LOADING CATEGORIES DEBUG ===')
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(CATEGORY.GET_ALL)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories')
      }
      
      // Ensure response.data is an array
      let categoriesData = []
      if (Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories
        } else if (Array.isArray(response.data.data)) {
          categoriesData = response.data.data
        }
      }
      
      // Transform categories for display in the admin panel
      const transformedCategories = categoriesData.map((cat) => ({
        id: cat.id || cat._id,
        value: cat.id || cat._id,
        label: cat.name,
        name: cat.name,
        image: cat.image?.url || '/assets/img/product/category/default-category.svg',
        description: cat.description || '',
        parent: cat.parent
      }))
      
      setAvailableCategories(transformedCategories)
      setError('')
      
    } catch (err) {
      console.error('Load categories error:', err)
      setError('Failed to load categories: ' + err.message)
      setAvailableCategories([])
    }
  }

  // Load subcategories from separate subcategories collection
  const loadSubcategories = async () => {
    try {
      console.log('🔄 === LOADING SUBCATEGORIES DEBUG ===')
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(SUBCATEGORY.GET_ALL)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch subcategories')
      }
      
      let subcategoriesData = []
      if (Array.isArray(response.data)) {
        subcategoriesData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        subcategoriesData = response.data.data
      }
      
      // Transform subcategories for display
      const transformedSubcategories = subcategoriesData.map((subcat) => ({
        id: subcat.id || subcat._id,
        value: subcat.id || subcat._id,
        label: subcat.name,
        name: subcat.name,
        image: subcat.image?.url || '/assets/img/product/category/default-subcategory.svg',
        description: subcat.description || '',
        parent: subcat.parent,
        status: subcat.status
      }))
      
      setSubcategories(transformedSubcategories)
      
    } catch (err) {
      console.error('Load subcategories error:', err)
      setSubcategories([])
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
    // Reset to first main category when opening modal
    const mainCategories = availableCategories.filter(cat => !cat.parent)
    if (mainCategories.length > 0) {
      setSelectedMainCategory(mainCategories[0].id)
    }
  }

  // Load data when page changes
  useEffect(() => {
    const loadData = async () => {
      await loadPageConfig(selectedPage)
      await loadCategories()
      await loadSubcategories()
    }
    loadData()
  }, [selectedPage])

  // Get sections for current page
  const getCurrentSections = () => {
    return selectedPage === "home" ? homeSections : corporateSections
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-2">Pages Management</h1>
              <p className="text-muted mb-0">Configure and manage sections for different pages</p>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Dashboard
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Page Selector */}
          <PageSelector 
            pages={PAGES}
            selectedPage={selectedPage}
            onPageChange={setSelectedPage}
            loading={loading}
          />

          {/* Sections List */}
          <SectionsList 
            sections={getCurrentSections()}
            visibleSections={visibleSections[selectedPage]}
            selectedPage={selectedPage}
            onToggleSection={handleToggleSection}
            onConfigureCategory={openCategoryConfig}
            loading={loading}
          />

          {/* Category Configuration Modal */}
          {showCategoryConfig && (
            <CategoryConfigModal
              show={showCategoryConfig}
              onClose={() => setShowCategoryConfig(false)}
              categoryConfig={categoryConfig}
              setCategoryConfig={setCategoryConfig}
              availableCategories={availableCategories}
              subcategories={subcategories}
              selectedMainCategory={selectedMainCategory}
              setSelectedMainCategory={setSelectedMainCategory}
              selectedPage={selectedPage}
              loadPageConfig={loadPageConfig}
              setError={setError}
              setSuccess={setSuccess}
              setLoading={setLoading}
              loading={loading}
              ADMIN_TOKEN={ADMIN_TOKEN}
            />
          )}
        </div>
      </div>
    </div>
  )
}
