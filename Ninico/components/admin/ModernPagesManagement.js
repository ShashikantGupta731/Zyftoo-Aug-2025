/**
 * Modern Admin Pages Management Component
 * 
 * A sleek, minimalistic admin interface with curved edges
 * and elegant design patterns
 */

'use client'
import React, { useState, useEffect } from 'react'
import { get, post, put } from '@/util/apiService'
import { CATEGORY, SUBCATEGORY } from '@/util/apiEndpoints'
import { 
  ModernCard, 
  ModernButton, 
  ModernInput, 
  ModernBadge,
  ModernLoadingOverlay,
  ModernSpinner
} from '@/components/ui'

const PAGES = [
  { 
    key: "home", 
    label: "Home Page",
    description: "Manage sections displayed on the homepage",
    icon: "🏠"
  },
  { 
    key: "corporate", 
    label: "Corporate Page",
    description: "Manage sections for corporate customers",
    icon: "🏢"
  }
]

export default function ModernPagesManagement({ onNavigate }) {
  const [selectedPage, setSelectedPage] = useState("home")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCategoryConfig, setShowCategoryConfig] = useState(false)
  const [availableCategories, setAvailableCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [pageConfig, setPageConfig] = useState(null)
  const [saving, setSaving] = useState(false)

  // Category section configuration state
  const [categoryConfig, setCategoryConfig] = useState({
    enabled: true,
    maxCategories: 10,
    layout: 'grid',
    showSubcategories: true,
    categories: [],
    categoryIds: []
  })

  // Business rule constants
  const MAX_MAIN_CATEGORIES = 10
  const MIN_MAIN_CATEGORIES = 1
  const MAX_SUBCATEGORIES_PER_CATEGORY = 10

  useEffect(() => {
    loadPageConfiguration()
    loadAvailableCategories()
  }, [selectedPage])

  const loadPageConfiguration = async () => {
    try {
      setLoading(true)
      const response = await get(`/pages/${selectedPage}`)
      
      if (response?.data?.sections) {
        const categorySection = response.data.sections.find(s => s.sectionType === 'categorySection')
        if (categorySection) {
          setCategoryConfig({
            enabled: categorySection.enabled || true,
            maxCategories: categorySection.config?.maxCategories || 10,
            layout: categorySection.config?.layout || 'grid',
            showSubcategories: categorySection.config?.showSubcategories !== false,
            categories: categorySection.categories || [],
            categoryIds: categorySection.categories?.map(c => c.categoryId) || []
          })
        }
        setPageConfig(response.data)
      }
    } catch (error) {
      console.error('Failed to load page configuration:', error)
      setError('Failed to load page configuration')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableCategories = async () => {
    try {
      const [categoriesResponse, subcategoriesResponse] = await Promise.all([
        get(CATEGORY.LIST),
        get(SUBCATEGORY.LIST)
      ])
      
      setAvailableCategories(categoriesResponse?.data || [])
      setSubcategories(subcategoriesResponse?.data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const saveConfiguration = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const configToSave = {
        ...pageConfig,
        sections: [{
          sectionType: 'categorySection',
          enabled: categoryConfig.enabled,
          order: 1,
          config: {
            maxCategories: categoryConfig.maxCategories,
            layout: categoryConfig.layout,
            showSubcategories: categoryConfig.showSubcategories
          },
          categories: categoryConfig.categories
        }]
      }

      const response = await post(`/pages/${selectedPage}/save-config`, configToSave)
      
      if (response?.success) {
        setSuccess('Configuration saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('Save failed:', error)
      setError('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const toggleCategorySelection = (categoryId) => {
    setCategoryConfig(prev => {
      const isSelected = prev.categories.some(c => c.categoryId === categoryId)
      
      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c.categoryId !== categoryId),
          categoryIds: prev.categoryIds.filter(id => id !== categoryId)
        }
      } else {
        if (prev.categories.length >= MAX_MAIN_CATEGORIES) {
          setError(`Maximum ${MAX_MAIN_CATEGORIES} categories allowed`)
          return prev
        }
        
        const newCategory = {
          categoryId,
          enabled: true,
          order: prev.categories.length + 1,
          subcategories: []
        }
        
        return {
          ...prev,
          categories: [...prev.categories, newCategory],
          categoryIds: [...prev.categoryIds, categoryId]
        }
      }
    })
  }

  const selectedCategoriesCount = categoryConfig.categories.length
  const selectedSubcategoriesCount = categoryConfig.categories.reduce(
    (total, cat) => total + (cat.subcategories?.length || 0), 
    0
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page Management
          </h1>
          <p className="text-gray-600">
            Configure content sections for your website pages
          </p>
        </div>
        
        <ModernButton
          variant="ghost"
          onClick={() => onNavigate?.('dashboard')}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          }
        >
          Back to Dashboard
        </ModernButton>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-modern-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-modern-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Page Selection */}
      <ModernCard>
        <ModernCard.Header>
          <h2 className="text-xl font-semibold text-gray-900">Select Page</h2>
          <p className="text-gray-600 mt-1">Choose which page to configure</p>
        </ModernCard.Header>
        
        <ModernCard.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAGES.map((page) => (
              <div
                key={page.key}
                className={`p-4 border rounded-modern-lg cursor-pointer transition-all ${
                  selectedPage === page.key
                    ? 'border-blue-500 bg-blue-50 shadow-modern-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-modern-sm'
                }`}
                onClick={() => setSelectedPage(page.key)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{page.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{page.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                    {selectedPage === page.key && (
                      <ModernBadge variant="primary" size="sm" className="mt-2">
                        Selected
                      </ModernBadge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ModernCard.Body>
      </ModernCard>

      {/* Category Configuration */}
      <ModernLoadingOverlay isLoading={loading}>
        <ModernCard>
          <ModernCard.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Category Section</h2>
                <p className="text-gray-600 mt-1">Configure category display for {PAGES.find(p => p.key === selectedPage)?.label}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <ModernBadge variant={categoryConfig.enabled ? 'success' : 'neutral'}>
                  {categoryConfig.enabled ? 'Enabled' : 'Disabled'}
                </ModernBadge>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryConfig.enabled}
                    onChange={(e) => setCategoryConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Section</span>
                </label>
              </div>
            </div>
          </ModernCard.Header>

          <ModernCard.Body>
            {categoryConfig.enabled ? (
              <div className="space-y-6">
                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ModernInput
                    label="Max Categories"
                    type="number"
                    value={categoryConfig.maxCategories}
                    onChange={(e) => setCategoryConfig(prev => ({ 
                      ...prev, 
                      maxCategories: Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                    }))}
                    min="1"
                    max="20"
                  />
                  
                  <div className="form-group-modern">
                    <label className="form-label-modern">Layout</label>
                    <select
                      value={categoryConfig.layout}
                      onChange={(e) => setCategoryConfig(prev => ({ ...prev, layout: e.target.value }))}
                      className="form-input-modern"
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                      <option value="carousel">Carousel</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center h-full">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryConfig.showSubcategories}
                        onChange={(e) => setCategoryConfig(prev => ({ ...prev, showSubcategories: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Show Subcategories</span>
                    </label>
                  </div>
                </div>

                {/* Statistics */}
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-modern-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedCategoriesCount}</div>
                    <div className="text-sm text-gray-600">Selected Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedSubcategoriesCount}</div>
                    <div className="text-sm text-gray-600">Selected Subcategories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{availableCategories.length}</div>
                    <div className="text-sm text-gray-600">Available Categories</div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Available Categories</h3>
                    <ModernButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowCategoryConfig(!showCategoryConfig)}
                    >
                      {showCategoryConfig ? 'Hide' : 'Show'} Details
                    </ModernButton>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {availableCategories.map((category) => {
                      const isSelected = categoryConfig.categoryIds.includes(category._id)
                      return (
                        <div
                          key={category._id}
                          className={`p-3 border rounded-modern-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleCategorySelection(category._id)}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-900">{category.name}</span>
                          </div>
                          {category.subcategories && (
                            <p className="text-xs text-gray-500 mt-1">
                              {category.subcategories.length} subcategories
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Section Disabled</h3>
                <p className="text-gray-500">Enable the section to configure category display options</p>
              </div>
            )}
          </ModernCard.Body>

          <ModernCard.Footer>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last saved: {pageConfig?.updatedAt ? new Date(pageConfig.updatedAt).toLocaleString() : 'Never'}
              </div>
              
              <div className="flex items-center gap-3">
                <ModernButton
                  variant="secondary"
                  onClick={loadPageConfiguration}
                  disabled={loading || saving}
                >
                  Reset
                </ModernButton>
                
                <ModernButton
                  variant="primary"
                  loading={saving}
                  onClick={saveConfiguration}
                  disabled={loading}
                >
                  Save Configuration
                </ModernButton>
              </div>
            </div>
          </ModernCard.Footer>
        </ModernCard>
      </ModernLoadingOverlay>
    </div>
  )
}
