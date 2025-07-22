'use client'
import React, { useState, useEffect } from 'react'
import { get, post, put } from '@/util/apiService'
import { CATEGORY, SUBCATEGORY } from '@/util/apiEndpoints'

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
    maxCategories: 10, // Keep for UI display
    layout: 'grid',
    showSubcategories: true,
    // New hierarchical structure
    categories: [
      // Structure: { categoryId, enabled, order, type: 'main', subcategories: [...] }
    ],
    // Keep for backward compatibility and quick lookups
    categoryIds: []
  })

  // Business rule constants
  const MAX_MAIN_CATEGORIES = 10
  const MIN_MAIN_CATEGORIES = 1
  const MAX_SUBCATEGORIES_PER_CATEGORY = 10

  // UI state for category selection
  const [selectedMainCategory, setSelectedMainCategory] = useState(null)

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

  // ========== HIERARCHICAL DATA MANAGEMENT HELPERS ==========
  
  // Get current counts for validation
  const getCurrentCounts = () => {
    const mainCategoriesCount = categoryConfig.categories.filter(cat => cat.enabled).length
    const subcategoryCounts = {}
    let totalSubcategoriesCount = 0
    let selectedCategorySubCount = 0
    
    categoryConfig.categories.forEach(category => {
      const subCount = category.subcategories.filter(sub => sub.enabled).length
      subcategoryCounts[category.categoryId] = subCount
      totalSubcategoriesCount += subCount
      
      // Get subcategory count for currently selected main category
      if (selectedMainCategory && category.categoryId === selectedMainCategory) {
        selectedCategorySubCount = subCount
      }
    })
    
    return { 
      mainCategoriesCount, 
      subcategoryCounts, 
      totalSubcategoriesCount,
      selectedCategorySubCount 
    }
  }

  // Check if we can select more main categories
  const canSelectMoreMainCategories = () => {
    const { mainCategoriesCount } = getCurrentCounts()
    return mainCategoriesCount < MAX_MAIN_CATEGORIES
  }

  // Check if we can select more subcategories for a specific category
  const canSelectMoreSubcategories = (categoryId) => {
    const { subcategoryCounts } = getCurrentCounts()
    const currentCount = subcategoryCounts[categoryId] || 0
    return currentCount < MAX_SUBCATEGORIES_PER_CATEGORY
  }

  // Check if a main category is selected
  const isMainCategorySelected = (categoryId) => {
    const category = categoryConfig.categories.find(cat => cat.categoryId === categoryId)
    return category ? category.enabled : false
  }

  // Check if a subcategory is selected
  const isSubcategorySelected = (subcategoryId) => {
    return categoryConfig.categories.some(category => 
      category.subcategories.some(sub => sub.categoryId === subcategoryId && sub.enabled)
    )
  }

  // Find which main category a subcategory belongs to
  const findParentCategory = (subcategoryId) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId)
    return subcategory?.parent?._id || subcategory?.parent
  }

  // Update hierarchical category selection
  const updateCategorySelection = (categoryId, isSelected, isMainCategory) => {
    console.log('🔄 Updating category selection:', { categoryId, isSelected, isMainCategory })
    
    setCategoryConfig(prev => {
      const newCategories = [...prev.categories]
      let newCategoryIds = [...prev.categoryIds]
      
      if (isMainCategory) {
        // Handle main category selection
        const existingIndex = newCategories.findIndex(cat => cat.categoryId === categoryId)
        
        if (existingIndex >= 0) {
          // Category exists, update it
          newCategories[existingIndex] = {
            ...newCategories[existingIndex],
            enabled: isSelected
          }
          
          if (isSelected) {
            if (!newCategoryIds.includes(categoryId)) {
              newCategoryIds.push(categoryId)
            }
          } else {
            newCategoryIds = newCategoryIds.filter(id => id !== categoryId)
            // Also remove all subcategories when deselecting main category
            newCategories[existingIndex].subcategories.forEach(sub => {
              if (sub.enabled) {
                newCategoryIds = newCategoryIds.filter(id => id !== sub.categoryId)
              }
              sub.enabled = false
            })
          }
        } else if (isSelected) {
          // Add new main category
          newCategories.push({
            categoryId: categoryId,
            enabled: true,
            order: newCategories.length,
            type: 'main',
            subcategories: []
          })
          newCategoryIds.push(categoryId)
        }
      } else {
        // Handle subcategory selection
        const parentId = findParentCategory(categoryId)
        
        if (parentId) {
          let parentCategoryIndex = newCategories.findIndex(cat => cat.categoryId === parentId)
          
          // Create parent category if it doesn't exist
          if (parentCategoryIndex < 0 && isSelected) {
            newCategories.push({
              categoryId: parentId,
              enabled: false, // Parent not directly selected
              order: newCategories.length,
              type: 'main',
              subcategories: []
            })
            parentCategoryIndex = newCategories.length - 1
          }
          
          if (parentCategoryIndex >= 0) {
            const parentCategory = newCategories[parentCategoryIndex]
            const existingSubIndex = parentCategory.subcategories.findIndex(sub => sub.categoryId === categoryId)
            
            if (existingSubIndex >= 0) {
              // Update existing subcategory
              parentCategory.subcategories[existingSubIndex].enabled = isSelected
            } else if (isSelected) {
              // Add new subcategory
              parentCategory.subcategories.push({
                categoryId: categoryId,
                enabled: true,
                order: parentCategory.subcategories.length,
                parentId: parentId
              })
            }
            
            // Update flat categoryIds array
            if (isSelected) {
              if (!newCategoryIds.includes(categoryId)) {
                newCategoryIds.push(categoryId)
              }
            } else {
              newCategoryIds = newCategoryIds.filter(id => id !== categoryId)
            }
          }
        }
      }
      
      console.log('📊 Updated categories:', newCategories)
      console.log('📋 Updated categoryIds:', newCategoryIds)
      
      return {
        ...prev,
        categories: newCategories,
        categoryIds: newCategoryIds
      }
    })
  }

  // Transform hierarchical data for backend save
  const transformForSave = () => {
    const saveData = {
      enabled: categoryConfig.enabled,
      maxCategories: categoryConfig.maxCategories,
      layout: categoryConfig.layout,
      showSubcategories: categoryConfig.showSubcategories,
      categories: []
    }
    
    // Flatten hierarchical structure for backend
    categoryConfig.categories.forEach(category => {
      if (category.enabled) {
        saveData.categories.push({
          categoryId: category.categoryId,
          enabled: true,
          order: category.order,
          type: 'main'
        })
      }
      
      category.subcategories.forEach(subcategory => {
        if (subcategory.enabled) {
          saveData.categories.push({
            categoryId: subcategory.categoryId,
            enabled: true,
            order: subcategory.order,
            type: 'subcategory',
            parentId: category.categoryId
          })
        }
      })
    })
    
    // Sort by order
    saveData.categories.sort((a, b) => a.order - b.order)
    
    console.log('💾 Data prepared for save:', saveData)
    return saveData
  }

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
        if (categorySection && categorySection.config) {
          // Convert the saved flat structure back to hierarchical state
          const hierarchicalConfig = {
            enabled: categorySection.enabled || false,
            maxCategories: categorySection.config.maxCategories || 10,
            layout: categorySection.config.layout || 'grid',
            showSubcategories: categorySection.config.showSubcategories || true,
            categories: {}
          }
          
          // Rebuild hierarchical structure from saved config
          if (categorySection.config.categories && Array.isArray(categorySection.config.categories)) {
            categorySection.config.categories.forEach(cat => {
              if (cat.categoryId) {
                hierarchicalConfig.categories[cat.categoryId] = {
                  selected: cat.enabled || false,
                  order: cat.order || 0,
                  subcategories: {}
                }
                
                // Add subcategories if they exist
                if (cat.subcategories && Array.isArray(cat.subcategories)) {
                  cat.subcategories.forEach(sub => {
                    if (sub.subcategoryId) {
                      hierarchicalConfig.categories[cat.categoryId].subcategories[sub.subcategoryId] = {
                        selected: sub.enabled || false,
                        order: sub.order || 0
                      }
                    }
                  })
                }
              }
            })
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
            categories: {}
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

  // Load available categories (same approach as CategoriesPage.js)
  const loadCategories = async () => {
    try {
      console.log('🔄 === LOADING CATEGORIES DEBUG ===')
      console.log('1. Setting auth token...')
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      console.log('2. Making API call to:', CATEGORY.GET_ALL)
      const response = await get(CATEGORY.GET_ALL)
      
      console.log('3. Raw API response received:')
      console.log('   - Response object:', response)
      console.log('   - Response type:', typeof response)
      console.log('   - Response keys:', Object.keys(response || {}))
      console.log('   - Response.success:', response?.success)
      console.log('   - Response.data:', response?.data)
      console.log('   - Response.data type:', typeof response?.data)
      console.log('   - Response.data is array:', Array.isArray(response?.data))
      
      if (!response.success) {
        console.error('4. ❌ API response failed:', response.error)
        throw new Error(response.error || 'Failed to fetch categories')
      }
      
      console.log('4. ✅ API response successful')
      console.log('5. Processing response.data...')
      console.log('   - Raw response.data:', JSON.stringify(response.data, null, 2))
      
      // Ensure response.data is an array
      let categoriesData = []
      if (Array.isArray(response.data)) {
        console.log('   - Response.data is direct array with', response.data.length, 'items')
        categoriesData = response.data
      } else if (response.data && typeof response.data === 'object') {
        console.log('   - Response.data is object, checking for nested arrays...')
        if (Array.isArray(response.data.categories)) {
          console.log('   - Found response.data.categories array with', response.data.categories.length, 'items')
          categoriesData = response.data.categories
        } else if (Array.isArray(response.data.data)) {
          console.log('   - Found response.data.data array with', response.data.data.length, 'items')
          categoriesData = response.data.data
        } else {
          console.log('   - No recognizable array found in response.data')
          categoriesData = []
        }
      }
      
      console.log('6. Categories data to process:')
      console.log('   - Array length:', categoriesData.length)
      console.log('   - Sample items (first 3):')
      categoriesData.slice(0, 3).forEach((cat, index) => {
        console.log(`     ${index + 1}.`, cat)
      })
      
      // Transform categories for display in the admin panel
      console.log('7. Transforming categories...')
      const transformedCategories = categoriesData.map((cat, index) => {
        console.log(`   - Transforming category ${index + 1}:`, {
          originalId: cat._id,
          originalName: cat.name,
          hasParent: !!cat.parent,
          parentInfo: cat.parent
        })
        
        return {
          id: cat.id || cat._id,
          value: cat.id || cat._id,
          label: cat.name,
          name: cat.name,
          image: cat.image?.url || '/assets/img/product/category/default-category.svg',
          description: cat.description || '',
          parent: cat.parent
        }
      })
      
      console.log('8. Final transformed categories:')
      console.log('   - Total transformed:', transformedCategories.length)
      console.log('   - Main categories:', transformedCategories.filter(cat => !cat.parent).length)
      console.log('   - Sub categories:', transformedCategories.filter(cat => cat.parent).length)
      console.log('   - Full transformed data:', transformedCategories)
      
      console.log('9. Setting availableCategories state...')
      setAvailableCategories(transformedCategories)
      setError('')
      
      console.log('10. ✅ Categories loaded successfully!')
      console.log('🔚 === END LOADING CATEGORIES DEBUG ===')
      
    } catch (err) {
      console.error('❌ === LOAD CATEGORIES ERROR ===')
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      console.error('Raw error object:', err)
      setError('Failed to load categories: ' + err.message)
      setAvailableCategories([])
    }
  }

  // Load subcategories from separate subcategories collection
  const loadSubcategories = async () => {
    try {
      console.log('🔄 === LOADING SUBCATEGORIES DEBUG ===')
      console.log('1. Setting auth token...')
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      console.log('2. Making API call to:', SUBCATEGORY.GET_ALL)
      const response = await get(SUBCATEGORY.GET_ALL)
      
      console.log('3. Raw subcategories response:')
      console.log('   - Response object:', response)
      console.log('   - Response.success:', response?.success)
      console.log('   - Response.data:', response?.data)
      console.log('   - Response.data is array:', Array.isArray(response?.data))
      
      if (!response.success) {
        console.error('4. ❌ Subcategories API response failed:', response.error)
        throw new Error(response.error || 'Failed to fetch subcategories')
      }
      
      console.log('4. ✅ Subcategories API response successful')
      console.log('5. Processing subcategories data...')
      
      let subcategoriesData = []
      if (Array.isArray(response.data)) {
        subcategoriesData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        subcategoriesData = response.data.data
      }
      
      console.log('6. Subcategories data to process:')
      console.log('   - Array length:', subcategoriesData.length)
      console.log('   - Sample items (first 3):')
      subcategoriesData.slice(0, 3).forEach((subcat, index) => {
        console.log(`     ${index + 1}.`, {
          id: subcat._id,
          name: subcat.name,
          parent: subcat.parent,
          status: subcat.status
        })
      })
      
      // Transform subcategories for display
      const transformedSubcategories = subcategoriesData.map((subcat, index) => {
        console.log(`   - Transforming subcategory ${index + 1}:`, {
          originalId: subcat._id,
          originalName: subcat.name,
          parentId: subcat.parent?._id || subcat.parent,
          parentName: subcat.parent?.name
        })
        
        return {
          id: subcat.id || subcat._id,
          value: subcat.id || subcat._id,
          label: subcat.name,
          name: subcat.name,
          image: subcat.image?.url || '/assets/img/product/category/default-subcategory.svg',
          description: subcat.description || '',
          parent: subcat.parent,
          status: subcat.status
        }
      })
      
      console.log('7. Final transformed subcategories:')
      console.log('   - Total transformed:', transformedSubcategories.length)
      console.log('   - Full transformed data:', transformedSubcategories)
      
      console.log('8. Setting subcategories state...')
      setSubcategories(transformedSubcategories)
      
      console.log('9. ✅ Subcategories loaded successfully!')
      console.log('🔚 === END LOADING SUBCATEGORIES DEBUG ===')
      
    } catch (err) {
      console.error('❌ === LOAD SUBCATEGORIES ERROR ===')
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      setSubcategories([])
    }
  }

  // Save category section configuration
  const saveCategoryConfig = async () => {
    try {
      setLoading(true)
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      // Validate before save
      const { mainCategoriesCount } = getCurrentCounts()
      if (mainCategoriesCount < MIN_MAIN_CATEGORIES) {
        setError(`Please select at least ${MIN_MAIN_CATEGORIES} main category before saving.`)
        return
      }
      
      if (mainCategoriesCount > MAX_MAIN_CATEGORIES) {
        setError(`Too many main categories selected. Maximum ${MAX_MAIN_CATEGORIES} allowed.`)
        return
      }
      
      // Transform hierarchical data for save
      const configData = transformForSave()
      
      console.log('💾 Saving category configuration:', configData)
      
      const response = await put('/api/pages/home/sections/category', configData)
      console.log('📡 Save response:', response)
      
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
    // Reset to first main category when opening modal
    const mainCategories = availableCategories.filter(cat => !cat.parent)
    if (mainCategories.length > 0) {
      setSelectedMainCategory(mainCategories[0].id)
    }
  }

  // Handle category selection with validation
  const handleCategoryToggle = (categoryId) => {
    const isMainCategory = availableCategories.some(cat => cat.id === categoryId && !cat.parent)
    
    console.log('🎯 Category toggle triggered:', { categoryId, isMainCategory })
    
    if (isMainCategory) {
      const isCurrentlySelected = isMainCategorySelected(categoryId)
      const { mainCategoriesCount } = getCurrentCounts()
      
      console.log('📊 Main category status:', { isCurrentlySelected, currentCount: mainCategoriesCount })
      
      // Validation for main categories
      if (!isCurrentlySelected) {
        // Trying to select
        if (!canSelectMoreMainCategories()) {
          setError(`Cannot select more main categories. Maximum ${MAX_MAIN_CATEGORIES} allowed.`)
          return
        }
      } else {
        // Trying to deselect
        if (mainCategoriesCount <= MIN_MAIN_CATEGORIES) {
          setError(`Cannot deselect this category. At least ${MIN_MAIN_CATEGORIES} main category must be selected.`)
          return
        }
      }
      
      // Clear any existing errors
      setError('')
      updateCategorySelection(categoryId, !isCurrentlySelected, true)
      
    } else {
      // Subcategory logic
      const isCurrentlySelected = isSubcategorySelected(categoryId)
      const parentId = findParentCategory(categoryId)
      
      console.log('📊 Subcategory status:', { isCurrentlySelected, parentId })
      
      if (!isCurrentlySelected && parentId) {
        // Trying to select subcategory
        if (!canSelectMoreSubcategories(parentId)) {
          const parentName = availableCategories.find(cat => cat.id === parentId)?.name || 'this category'
          setError(`Cannot select more subcategories for ${parentName}. Maximum ${MAX_SUBCATEGORIES_PER_CATEGORY} per category allowed.`)
          return
        }
      }
      
      // Clear any existing errors
      setError('')
      updateCategorySelection(categoryId, !isCurrentlySelected, false)
    }
  }

  // Handle max categories change
  const handleMaxCategoriesChange = (value) => {
    const numValue = parseInt(value) || 0
    setCategoryConfig(prev => ({ ...prev, maxCategories: numValue }))
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

  // Render category configuration modal
  const renderCategoryConfigModal = () => {
    if (!showCategoryConfig) return null

    console.log('🎨 === RENDERING CATEGORY MODAL DEBUG ===')
    console.log('1. Modal render triggered')
    console.log('2. availableCategories state:')
    console.log('   - Length:', availableCategories.length)
    console.log('   - Is array:', Array.isArray(availableCategories))
    console.log('   - Full data:', availableCategories)
    
    const mainCategories = availableCategories.filter(cat => !cat.parent)
    const subCategories = subcategories // Use the separate subcategories state
    
    console.log('3. Category breakdown:')
    console.log('   - Main categories:', mainCategories.length, mainCategories)
    console.log('   - Sub categories:', subCategories.length, subCategories)
    
    // Get subcategories for selected main category
    const getSubcategoriesForCategory = (categoryId) => {
      console.log('🔍 Getting subcategories for category ID:', categoryId)
      const filtered = subCategories.filter(subCat => {
        const parentId = subCat.parent?._id || subCat.parent
        console.log(`   - Checking subcategory "${subCat.name}": parent=${parentId}, matches=${parentId === categoryId}`)
        return parentId === categoryId
      })
      console.log(`   - Found ${filtered.length} subcategories for category ${categoryId}:`, filtered)
      return filtered
    }

    // Auto-select first main category if none selected
    if (!selectedMainCategory && mainCategories.length > 0) {
      setSelectedMainCategory(mainCategories[0].id)
    }

    const selectedCategorySubcategories = selectedMainCategory ? 
      getSubcategoriesForCategory(selectedMainCategory) : []

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl">
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
                  {/* Selection Summary and Validation */}
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
                              <div className={`d-flex justify-content-between align-items-center p-2 rounded ${getCurrentCounts().mainCategoriesCount >= MIN_MAIN_CATEGORIES && getCurrentCounts().mainCategoriesCount <= MAX_MAIN_CATEGORIES ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                <span className="fw-semibold">
                                  <i className="bi bi-grid me-1"></i>
                                  Main Categories:
                                </span>
                                <span className="badge bg-primary">
                                  {getCurrentCounts().mainCategoriesCount} / {MAX_MAIN_CATEGORIES}
                                </span>
                              </div>
                              {getCurrentCounts().mainCategoriesCount < MIN_MAIN_CATEGORIES && (
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
                                  {getCurrentCounts().totalSubcategoriesCount}
                                </span>
                              </div>
                              {selectedMainCategory && (
                                <small className="text-muted">
                                  <i className="bi bi-arrow-right me-1"></i>
                                  Selected category: {getCurrentCounts().selectedCategorySubCount} / {MAX_SUBCATEGORIES_PER_CATEGORY}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {categoryConfig.enabled && (
                <>
                  {/* Configuration Options */}
                  <div className="row mb-4">
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                      <div className="form-check mt-4">
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

                  {/* Selection Summary */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="alert alert-info d-flex align-items-center">
                        <i className="bi bi-info-circle me-2"></i>
                        <div>
                          <strong>Selection Summary:</strong> {categoryConfig.categoryIds.length} categories selected 
                          ({categoryConfig.categoryIds.filter(id => mainCategories.some(cat => cat.id === id)).length} main categories, {categoryConfig.categoryIds.filter(id => subCategories.some(cat => cat.id === id)).length} subcategories)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Selection Interface */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold mb-3">Select Categories and Subcategories</label>
                      
                      {mainCategories.length > 0 ? (
                        <div className="row">
                          {/* Left Side - Main Categories */}
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
                                    const categoryData = categoryConfig.categories[category.id]
                                    const isSelected = categoryData?.selected || false
                                    const isActiveTab = selectedMainCategory === category.id
                                    const subcategoryCount = getSubcategoriesForCategory(category.id).length
                                    const selectedSubcategoryCount = getSubcategoriesForCategory(category.id)
                                      .filter(sub => categoryData?.subcategories?.[sub.id]?.selected).length
                                    
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
                          </div>

                          {/* Right Side - Subcategories */}
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
                                      {/* Subcategories Stats */}
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

                                      {/* Quick Actions for Subcategories */}
                                      <div className="p-2 border-bottom">
                                        <div className="d-flex gap-1">
                                          <button 
                                            type="button" 
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => {
                                              const currentSubIds = selectedCategorySubcategories.map(cat => cat.id)
                                              setCategoryConfig(prev => ({
                                                ...prev,
                                                categoryIds: [...new Set([...prev.categoryIds, ...currentSubIds])]
                                              }))
                                            }}
                                          >
                                            <i className="bi bi-check-all me-1"></i>
                                            Select All
                                          </button>
                                          
                                          <button 
                                            type="button" 
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => {
                                              const currentSubIds = selectedCategorySubcategories.map(cat => cat.id)
                                              setCategoryConfig(prev => ({
                                                ...prev,
                                                categoryIds: prev.categoryIds.filter(id => !currentSubIds.includes(id))
                                              }))
                                            }}
                                          >
                                            <i className="bi bi-x-circle me-1"></i>
                                            Clear All
                                          </button>
                                        </div>
                                      </div>

                                      {/* Subcategories List */}
                                      <div className="list-group list-group-flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {selectedCategorySubcategories.map((subcategory, index) => {
                                          const parentCategoryData = categoryConfig.categories[selectedMainCategory]
                                          const isSelected = parentCategoryData?.subcategories?.[subcategory.id]?.selected || false
                                          
                                          return (
                                            <div 
                                              key={subcategory.id} 
                                              className={`list-group-item list-group-item-action border-0 ${isSelected ? 'bg-success bg-opacity-10 border-start border-success border-3' : ''}`}
                                            >
                                              <div className="d-flex align-items-center">
                                                <div className="form-check me-3">
                                                  <input 
                                                    className="form-check-input form-check-input-success" 
                                                    type="checkbox" 
                                                    id={`sub-category-${subcategory.id}`}
                                                    checked={isSelected}
                                                    onChange={() => handleCategoryToggle(subcategory.id, selectedMainCategory)}
                                                  />
                                                </div>
                                                
                                                {subcategory.image && (
                                                  <img 
                                                    src={subcategory.image} 
                                                    alt={subcategory.name}
                                                    className="me-3 flex-shrink-0 border"
                                                    style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }}
                                                  />
                                                )}
                                                
                                                <div className="flex-grow-1">
                                                  <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                      <h6 className="mb-1 text-dark fw-semibold">
                                                        <i className="bi bi-tag text-success me-1" style={{ fontSize: '12px' }}></i>
                                                        {subcategory.name}
                                                      </h6>
                                                      {subcategory.description && (
                                                        <p className="mb-1 text-muted small">{subcategory.description}</p>
                                                      )}
                                                      <div className="d-flex gap-1 align-items-center">
                                                        <span className="badge bg-secondary" style={{ fontSize: '9px' }}>
                                                          Subcategory
                                                        </span>
                                                        <span className={`badge ${subcategory.status ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '9px' }}>
                                                          {subcategory.status ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {isSelected && (
                                                          <span className="badge bg-primary" style={{ fontSize: '9px' }}>
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Selected
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="text-end">
                                                      <small className="text-muted">#{index + 1}</small>
                                                    </div>
                                                  </div>
                                                </div>
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
                                          // You can add navigation to create subcategory here
                                          alert('Navigate to Categories > Subcategories to create subcategories for this category')
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
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-folder2-open text-muted" style={{ fontSize: '3rem' }}></i>
                          <p className="mt-2 text-muted">No categories available</p>
                          <small className="text-muted">Create categories first to configure this section.</small>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {mainCategories.length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex gap-2 flex-wrap">
                          <button 
                            type="button" 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              const { mainCategoriesCount } = getCurrentCounts()
                              const availableSlots = MAX_MAIN_CATEGORIES - mainCategoriesCount
                              
                              if (availableSlots <= 0) {
                                setError(`Cannot select more categories. Maximum ${MAX_MAIN_CATEGORIES} main categories allowed.`)
                                return
                              }
                              
                              setCategoryConfig(prev => {
                                const newConfig = { ...prev, categories: { ...prev.categories } }
                                let added = 0
                                
                                mainCategories.forEach(cat => {
                                  if (added < availableSlots && !newConfig.categories[cat.id]?.selected) {
                                    newConfig.categories[cat.id] = {
                                      selected: true,
                                      order: Object.keys(newConfig.categories).filter(id => newConfig.categories[id]?.selected).length,
                                      subcategories: newConfig.categories[cat.id]?.subcategories || {}
                                    }
                                    added++
                                  }
                                })
                                
                                if (added < mainCategories.length - mainCategoriesCount) {
                                  setError(`Only selected ${added} more categories due to limit.`)
                                }
                                
                                return newConfig
                              })
                            }}
                          >
                            <i className="bi bi-check-all me-1"></i>
                            Select All Main Categories
                          </button>
                          
                          <button 
                            type="button" 
                            className="btn btn-outline-success btn-sm"
                            onClick={() => {
                              if (!selectedMainCategory) {
                                setError('Please select a main category first to add subcategories.')
                                return
                              }
                              
                              const subcategoriesForMain = getSubcategoriesForCategory(selectedMainCategory)
                              const currentSubCount = subcategoriesForMain.filter(sub => 
                                categoryConfig.categories[selectedMainCategory]?.subcategories?.[sub.id]?.selected
                              ).length
                              const availableSlots = MAX_SUBCATEGORIES_PER_CATEGORY - currentSubCount
                              
                              if (availableSlots <= 0) {
                                setError(`Cannot select more subcategories. Maximum ${MAX_SUBCATEGORIES_PER_CATEGORY} subcategories per main category allowed.`)
                                return
                              }
                              
                              setCategoryConfig(prev => {
                                const newConfig = { ...prev, categories: { ...prev.categories } }
                                
                                // Ensure main category is selected and has structure
                                if (!newConfig.categories[selectedMainCategory]) {
                                  newConfig.categories[selectedMainCategory] = {
                                    selected: true,
                                    order: Object.keys(newConfig.categories).filter(id => newConfig.categories[id]?.selected).length,
                                    subcategories: {}
                                  }
                                }
                                
                                let added = 0
                                subcategoriesForMain.forEach(sub => {
                                  if (added < availableSlots && !newConfig.categories[selectedMainCategory].subcategories[sub.id]?.selected) {
                                    newConfig.categories[selectedMainCategory].subcategories[sub.id] = {
                                      selected: true,
                                      order: Object.keys(newConfig.categories[selectedMainCategory].subcategories).filter(id => 
                                        newConfig.categories[selectedMainCategory].subcategories[id]?.selected
                                      ).length
                                    }
                                    added++
                                  }
                                })
                                
                                if (added < subcategoriesForMain.length - currentSubCount) {
                                  setError(`Only selected ${added} more subcategories due to limit.`)
                                }
                                
                                return newConfig
                              })
                            }}
                          >
                            <i className="bi bi-tags me-1"></i>
                            Select All Subcategories
                          </button>
                          
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setCategoryConfig(prev => ({
                                ...prev,
                                categories: {}
                              }))
                              setSelectedMainCategory(null)
                            }}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Clear All Selections
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
