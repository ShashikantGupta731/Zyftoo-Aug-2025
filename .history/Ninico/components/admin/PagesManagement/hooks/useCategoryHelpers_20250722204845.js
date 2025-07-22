import { useCallback } from 'react'

export function useCategoryHelpers({
  categoryConfig,
  setCategoryConfig,
  availableCategories,
  subcategories,
  selectedMainCategory,
  MAX_MAIN_CATEGORIES,
  MIN_MAIN_CATEGORIES,
  MAX_SUBCATEGORIES_PER_CATEGORY,
  setError
}) {
  
  // Get current counts for validation
  const getCurrentCounts = useCallback(() => {
    // Handle both old array structure and new object structure
    let mainCategoriesCount = 0
    let totalSubcategoriesCount = 0
    let selectedCategorySubCount = 0
    const subcategoryCounts = {}
    
    if (Array.isArray(categoryConfig.categories)) {
      // Old structure: array of category objects
      mainCategoriesCount = categoryConfig.categories.filter(cat => cat.enabled).length
      
      categoryConfig.categories.forEach(category => {
        const subCount = category.subcategories ? category.subcategories.filter(sub => sub.enabled).length : 0
        subcategoryCounts[category.categoryId] = subCount
        totalSubcategoriesCount += subCount
        
        // Get subcategory count for currently selected main category
        if (selectedMainCategory && category.categoryId === selectedMainCategory) {
          selectedCategorySubCount = subCount
        }
      })
    } else if (typeof categoryConfig.categories === 'object' && categoryConfig.categories !== null) {
      // New structure: object with category IDs as keys
      mainCategoriesCount = Object.keys(categoryConfig.categories).filter(
        categoryId => categoryConfig.categories[categoryId]?.selected
      ).length
      
      Object.keys(categoryConfig.categories).forEach(categoryId => {
        const categoryData = categoryConfig.categories[categoryId]
        let subCount = 0
        
        if (categoryData && categoryData.subcategories) {
          subCount = Object.keys(categoryData.subcategories).filter(
            subId => categoryData.subcategories[subId]?.selected
          ).length
        }
        
        subcategoryCounts[categoryId] = subCount
        totalSubcategoriesCount += subCount
        
        // Get subcategory count for currently selected main category
        if (selectedMainCategory && categoryId === selectedMainCategory) {
          selectedCategorySubCount = subCount
        }
      })
    } else {
      // Fallback: use categoryIds for backward compatibility
      if (availableCategories.length > 0) {
        mainCategoriesCount = categoryConfig.categoryIds ? 
          categoryConfig.categoryIds.filter(id => 
            availableCategories.some(cat => cat.id === id && !cat.parent)
          ).length : 0
        
        totalSubcategoriesCount = categoryConfig.categoryIds ? 
          categoryConfig.categoryIds.filter(id => 
            subcategories.some(sub => sub.id === id)
          ).length : 0
          
        selectedCategorySubCount = selectedMainCategory && categoryConfig.categoryIds ? 
          categoryConfig.categoryIds.filter(id => 
            subcategories.some(sub => sub.id === id && 
              (sub.parent?._id === selectedMainCategory || sub.parent === selectedMainCategory)
            )
          ).length : 0
      }
    }
    
    return { 
      mainCategoriesCount, 
      subcategoryCounts, 
      totalSubcategoriesCount,
      selectedCategorySubCount 
    }
  }, [categoryConfig, availableCategories, subcategories, selectedMainCategory])

  // Find which main category a subcategory belongs to
  const findParentCategory = useCallback((subcategoryId) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId)
    return subcategory?.parent?._id || subcategory?.parent
  }, [subcategories])

  // Transform hierarchical data for backend save
  const transformForSave = useCallback(() => {
    console.log('🔄 === TRANSFORM FOR SAVE START ===')
    console.log('1. Input categoryConfig:', categoryConfig)
    console.log('   - categoryConfig.enabled:', categoryConfig.enabled)
    console.log('   - categoryConfig.maxCategories:', categoryConfig.maxCategories)
    console.log('   - categoryConfig.layout:', categoryConfig.layout)
    console.log('   - categoryConfig.showSubcategories:', categoryConfig.showSubcategories)
    console.log('   - categoryConfig.categories:', categoryConfig.categories)
    console.log('   - categoryConfig.categoryIds:', categoryConfig.categoryIds)
    
    const saveData = {
      enabled: categoryConfig.enabled,
      maxCategories: categoryConfig.maxCategories,
      layout: categoryConfig.layout,
      showSubcategories: categoryConfig.showSubcategories,
      categories: []
    }
    
    console.log('2. Base saveData structure:', saveData)
    
    // Since we're using the flat categoryIds array, we need to build categories from that
    console.log('3. Processing categoryIds array...')
    console.log('   - Available categories:', availableCategories.length)
    console.log('   - Available subcategories:', subcategories.length)
    
    if (categoryConfig.categoryIds && categoryConfig.categoryIds.length > 0) {
      categoryConfig.categoryIds.forEach((categoryId, index) => {
        console.log(`   - Processing categoryId ${index + 1}:`, categoryId)
        
        // Check if it's a main category
        const mainCategory = availableCategories.find(cat => cat.id === categoryId && !cat.parent)
        if (mainCategory) {
          console.log(`     ✅ Found main category:`, mainCategory.name)
          saveData.categories.push({
            categoryId: categoryId,
            enabled: true,
            order: index,
            type: 'main'
          })
        }
        
        // Check if it's a subcategory
        const subcategory = subcategories.find(sub => sub.id === categoryId)
        if (subcategory) {
          const parentId = subcategory.parent?._id || subcategory.parent
          console.log(`     ✅ Found subcategory:`, subcategory.name, 'parent:', parentId)
          saveData.categories.push({
            categoryId: categoryId,
            enabled: true,
            order: index,
            type: 'subcategory',
            parentId: parentId
          })
        }
        
        if (!mainCategory && !subcategory) {
          console.log(`     ❌ Category ID not found:`, categoryId)
        }
      })
    } else {
      console.log('   - No categoryIds to process')
    }
    
    // Sort by order
    console.log('4. Sorting categories by order...')
    saveData.categories.sort((a, b) => a.order - b.order)
    
    console.log('5. Final saveData:')
    console.log('   - enabled:', saveData.enabled)
    console.log('   - maxCategories:', saveData.maxCategories)
    console.log('   - layout:', saveData.layout)
    console.log('   - showSubcategories:', saveData.showSubcategories)
    console.log('   - categories count:', saveData.categories.length)
    console.log('   - categories details:', saveData.categories)
    console.log('🔚 === TRANSFORM FOR SAVE END ===')
    
    return saveData
  }, [categoryConfig, availableCategories, subcategories])

  // Handle category selection with validation - SIMPLIFIED for current structure
  const handleCategoryToggle = useCallback((categoryId, parentCategoryId = null) => {
    const isMainCategory = !parentCategoryId && availableCategories.some(cat => cat.id === categoryId && !cat.parent)
    
    console.log('🎯 Category toggle triggered:', { categoryId, parentCategoryId, isMainCategory })
    
    if (isMainCategory) {
      const isCurrentlySelected = categoryConfig.categoryIds.includes(categoryId)
      const currentMainCount = categoryConfig.categoryIds.filter(id => 
        availableCategories.some(cat => cat.id === id && !cat.parent)
      ).length
      
      console.log('📊 Main category status:', { isCurrentlySelected, currentCount: currentMainCount })
      
      // Validation for main categories
      if (!isCurrentlySelected) {
        // Trying to select
        if (currentMainCount >= MAX_MAIN_CATEGORIES) {
          setError(`Cannot select more main categories. Maximum ${MAX_MAIN_CATEGORIES} allowed.`)
          return
        }
      } else {
        // Trying to deselect
        if (currentMainCount <= MIN_MAIN_CATEGORIES) {
          setError(`Cannot deselect this category. At least ${MIN_MAIN_CATEGORIES} main category must be selected.`)
          return
        }
      }
      
      // Clear any existing errors
      setError('')
      
      // Update categoryIds array
      setCategoryConfig(prev => {
        if (!isCurrentlySelected) {
          // Add to selection
          return {
            ...prev,
            categoryIds: [...prev.categoryIds, categoryId]
          }
        } else {
          // Remove from selection (and remove all its subcategories too)
          const subcategoriesOfThisCategory = subcategories
            .filter(sub => (sub.parent?._id || sub.parent) === categoryId)
            .map(sub => sub.id)
          
          return {
            ...prev,
            categoryIds: prev.categoryIds.filter(id => 
              id !== categoryId && !subcategoriesOfThisCategory.includes(id)
            )
          }
        }
      })
      
    } else {
      // Subcategory logic
      const isCurrentlySelected = categoryConfig.categoryIds.includes(categoryId)
      const parentId = parentCategoryId || findParentCategory(categoryId)
      
      console.log('📊 Subcategory status:', { isCurrentlySelected, parentId })
      
      if (!isCurrentlySelected && parentId) {
        // Check subcategory limit for this parent
        const currentSubCount = categoryConfig.categoryIds.filter(id => 
          subcategories.some(sub => sub.id === id && (sub.parent?._id || sub.parent) === parentId)
        ).length
        
        if (currentSubCount >= MAX_SUBCATEGORIES_PER_CATEGORY) {
          const parentName = availableCategories.find(cat => cat.id === parentId)?.name || 'this category'
          setError(`Cannot select more subcategories for ${parentName}. Maximum ${MAX_SUBCATEGORIES_PER_CATEGORY} per category allowed.`)
          return
        }
      }
      
      // Clear any existing errors
      setError('')
      
      // Update categoryIds array
      setCategoryConfig(prev => {
        if (!isCurrentlySelected) {
          // Add to selection
          let newIds = [...prev.categoryIds, categoryId]
          
          // Also ensure parent is selected
          if (parentId && !prev.categoryIds.includes(parentId)) {
            newIds.push(parentId)
          }
          
          return {
            ...prev,
            categoryIds: newIds
          }
        } else {
          // Remove from selection
          return {
            ...prev,
            categoryIds: prev.categoryIds.filter(id => id !== categoryId)
          }
        }
      })
    }
  }, [categoryConfig, setCategoryConfig, availableCategories, subcategories, findParentCategory, MAX_MAIN_CATEGORIES, MIN_MAIN_CATEGORIES, MAX_SUBCATEGORIES_PER_CATEGORY, setError])

  // Handle max categories change
  const handleMaxCategoriesChange = useCallback((value) => {
    const numValue = parseInt(value) || 0
    setCategoryConfig(prev => ({ ...prev, maxCategories: numValue }))
  }, [setCategoryConfig])

  return {
    getCurrentCounts,
    transformForSave,
    handleCategoryToggle,
    handleMaxCategoriesChange,
    findParentCategory
  }
}
