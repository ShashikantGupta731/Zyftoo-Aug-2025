'use client'
import React from 'react'
import { put, get } from '@/util/apiService'
import CategoryConfigHeader from './CategoryConfigHeader'
import CategoryConfigSettings from './CategoryConfigSettings'
import CategorySelection from './CategorySelection'
import CategoryConfigFooter from './CategoryConfigFooter'
import { useCategoryHelpers } from './hooks/useCategoryHelpers'

export default function CategoryConfigModal({
  show,
  onClose,
  categoryConfig,
  setCategoryConfig,
  availableCategories,
  subcategories,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedPage,
  loadPageConfig,
  setError,
  setSuccess,
  setLoading,
  loading,
  ADMIN_TOKEN
}) {
  // Business rule constants
  const MAX_MAIN_CATEGORIES = 10
  const MIN_MAIN_CATEGORIES = 1
  const MAX_SUBCATEGORIES_PER_CATEGORY = 10

  // Use custom hook for category helpers
  const {
    getCurrentCounts,
    transformForSave,
    handleCategoryToggle,
    handleMaxCategoriesChange
  } = useCategoryHelpers({
    categoryConfig,
    setCategoryConfig,
    availableCategories,
    subcategories,
    selectedMainCategory,
    MAX_MAIN_CATEGORIES,
    MIN_MAIN_CATEGORIES,
    MAX_SUBCATEGORIES_PER_CATEGORY,
    setError
  })

  // Save category section configuration
  const saveCategoryConfig = async () => {
    console.log('🚀 === SAVE CATEGORY CONFIG START ===')
    console.log('1. Save function triggered')
    
    try {
      console.log('2. Setting loading state to true')
      setLoading(true)
      
      console.log('3. Setting auth token in localStorage')
      localStorage.setItem('authToken', ADMIN_TOKEN)
      console.log('   - Auth token set:', ADMIN_TOKEN.substring(0, 20) + '...')
      
      console.log('4. Getting current counts for validation')
      const { mainCategoriesCount } = getCurrentCounts()
      console.log('   - Main categories count:', mainCategoriesCount)
      console.log('   - MIN_MAIN_CATEGORIES:', MIN_MAIN_CATEGORIES)
      console.log('   - MAX_MAIN_CATEGORIES:', MAX_MAIN_CATEGORIES)
      
      if (mainCategoriesCount < MIN_MAIN_CATEGORIES) {
        console.log('❌ Validation failed: Too few main categories')
        setError(`Please select at least ${MIN_MAIN_CATEGORIES} main category before saving.`)
        return
      }
      
      if (mainCategoriesCount > MAX_MAIN_CATEGORIES) {
        console.log('❌ Validation failed: Too many main categories')
        setError(`Too many main categories selected. Maximum ${MAX_MAIN_CATEGORIES} allowed.`)
        return
      }
      
      console.log('✅ Validation passed')
      
      console.log('5. Current categoryConfig state before transform:')
      console.log('   - categoryConfig.enabled:', categoryConfig.enabled)
      console.log('   - categoryConfig.maxCategories:', categoryConfig.maxCategories)
      console.log('   - categoryConfig.layout:', categoryConfig.layout)
      console.log('   - categoryConfig.showSubcategories:', categoryConfig.showSubcategories)
      console.log('   - categoryConfig.categories:', categoryConfig.categories)
      console.log('   - categoryConfig.categoryIds:', categoryConfig.categoryIds)
      
      // Transform hierarchical data for save
      console.log('6. Transforming data for save...')
      const configData = transformForSave()
      console.log('7. Transformed config data:')
      console.log('   - Full configData object:', JSON.stringify(configData, null, 2))
      console.log('   - configData.enabled:', configData.enabled)
      console.log('   - configData.categories length:', configData.categories?.length || 0)
      
      console.log('8. Preparing API request')
      const apiEndpoint = '/api/pages/home/sections/category'
      console.log('   - API endpoint:', apiEndpoint)
      console.log('   - Request method: PUT')
      console.log('   - Request data:', configData)
      console.log('   - Request headers will include auth token')
      
      console.log('9. Making API request...')
      const response = await put(apiEndpoint, configData)
      console.log('10. API response received:')
      console.log('    - Raw response:', response)
      console.log('    - Response type:', typeof response)
      console.log('    - Response keys:', Object.keys(response || {}))
      console.log('    - Response.data:', response?.data)
      console.log('    - Response.status:', response?.status)
      console.log('    - Response.success:', response?.success)
      
      // Handle the double-wrapped response from apiService
      console.log('11. Processing response data...')
      const actualData = response.data // This contains the backend response
      console.log('    - actualData:', actualData)
      console.log('    - actualData type:', typeof actualData)
      console.log('    - actualData.success:', actualData?.success)
      console.log('    - actualData.message:', actualData?.message)
      
      if (actualData && actualData.success) {
        console.log('✅ Save successful!')
        setSuccess('Category section configuration saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
        onClose()
        
        // Trigger refresh notification (optional)
        try {
          console.log('12. Triggering homepage refresh...')
          await get('/api/pages/home/refresh/categorySection')
          console.log('    - Homepage refresh successful')
        } catch (refreshError) {
          console.log('⚠️ Refresh notification failed, but save was successful:', refreshError)
        }
        
        console.log('13. Reloading page config...')
        await loadPageConfig(selectedPage) // Reload to get updated config
        console.log('14. Page config reloaded')
      } else {
        console.log('❌ Save failed - API returned unsuccessful response')
        console.log('    - actualData:', actualData)
        const errorMessage = actualData?.message || 'Unknown error'
        console.log('    - Error message:', errorMessage)
        setError('Failed to save configuration: ' + errorMessage)
      }
      
    } catch (err) {
      console.error('❌ === SAVE CATEGORY CONFIG ERROR ===')
      console.error('Error caught in try-catch:')
      console.error('   - Error object:', err)
      console.error('   - Error message:', err.message)
      console.error('   - Error name:', err.name)
      console.error('   - Error stack:', err.stack)
      
      if (err.response) {
        console.error('   - HTTP Response Error Details:')
        console.error('     - Status:', err.response.status)
        console.error('     - Status text:', err.response.statusText)
        console.error('     - Response data:', err.response.data)
        console.error('     - Response headers:', err.response.headers)
      }
      
      if (err.request) {
        console.error('   - Request Error Details:')
        console.error('     - Request object:', err.request)
      }
      
      setError('Failed to save category configuration: ' + err.message)
    } finally {
      console.log('15. Setting loading state to false')
      setLoading(false)
      console.log('🔚 === SAVE CATEGORY CONFIG END ===')
    }
  }

  if (!show) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <CategoryConfigHeader onClose={onClose} />
          
          <div className="modal-body">
            <CategoryConfigSettings 
              categoryConfig={categoryConfig}
              setCategoryConfig={setCategoryConfig}
              getCurrentCounts={getCurrentCounts}
              handleMaxCategoriesChange={handleMaxCategoriesChange}
              MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
              MIN_MAIN_CATEGORIES={MIN_MAIN_CATEGORIES}
              MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
              selectedMainCategory={selectedMainCategory}
            />

            {categoryConfig.enabled && (
              <CategorySelection 
                availableCategories={availableCategories}
                subcategories={subcategories}
                categoryConfig={categoryConfig}
                setCategoryConfig={setCategoryConfig}
                selectedMainCategory={selectedMainCategory}
                setSelectedMainCategory={setSelectedMainCategory}
                handleCategoryToggle={handleCategoryToggle}
                getCurrentCounts={getCurrentCounts}
                MAX_MAIN_CATEGORIES={MAX_MAIN_CATEGORIES}
                MAX_SUBCATEGORIES_PER_CATEGORY={MAX_SUBCATEGORIES_PER_CATEGORY}
                setError={setError}
              />
            )}
          </div>

          <CategoryConfigFooter 
            onClose={onClose}
            onSave={saveCategoryConfig}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
