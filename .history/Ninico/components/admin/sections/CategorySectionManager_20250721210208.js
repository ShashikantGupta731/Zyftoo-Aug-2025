'use client'
import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { get, put } from '@/util/apiService'

export default function CategorySectionManager({ pageKey, sectionKey, sectionData, onUpdate, onClose }) {
  const [categories, setCategories] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [sectionVisible, setSectionVisible] = useState(sectionData?.enabled ?? true)
  const [maxCategories, setMaxCategories] = useState(sectionData?.config?.maxCategories ?? 6)
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch section configuration and available categories
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        setLoading(true)
        
        // Fetch current section configuration
        const sectionResponse = await get(`/api/pages/${pageKey}/sections/${sectionKey}`)
        
        if (sectionResponse) {
          setSectionVisible(sectionResponse.enabled ?? true)
          setMaxCategories(sectionResponse.config?.maxCategories ?? 6)
          
          // Get available categories from database
          const categoriesResponse = await get('/api/categories')
          setAvailableCategories(categoriesResponse || [])
          
          // Map configured categories with actual category data
          if (sectionResponse.config?.categories && categoriesResponse) {
            const configuredCategories = sectionResponse.config.categories.map(configCat => {
              const actualCategory = categoriesResponse.find(cat => cat.id === configCat.categoryId)
              return {
                id: configCat.categoryId,
                name: actualCategory?.name || 'Unknown Category',
                enabled: configCat.enabled ?? true,
                image: actualCategory?.image || actualCategory?.icon || '/assets/img/product/category/default-category.svg',
                order: configCat.order ?? 0,
                subcategories: actualCategory?.subcategories || []
              }
            }).sort((a, b) => a.order - b.order)
            
            setCategories(configuredCategories)
          } else {
            // If no configuration exists, use all available categories
            const defaultCategories = (categoriesResponse || []).map((cat, index) => ({
              id: cat.id,
              name: cat.name,
              enabled: true,
              image: cat.image || cat.icon || '/assets/img/product/category/default-category.svg',
              order: index,
              subcategories: cat.subcategories || []
            }))
            setCategories(defaultCategories)
          }
        }
      } catch (error) {
        console.error('Failed to fetch section data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSectionData()
  }, [pageKey, sectionKey])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setCategories(reorderedItems)
    setHasChanges(true)
  }

  const toggleCategory = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, enabled: !cat.enabled }
        : cat
    ))
    setHasChanges(true)
  }

  const toggleSectionVisibility = () => {
    setSectionVisible(prev => !prev)
    setHasChanges(true)
  }

  const handleMaxCategoriesChange = (value) => {
    setMaxCategories(parseInt(value))
    setHasChanges(true)
  }

  const addNewCategory = () => {
    // Show modal to select from available categories not already in the list
    const usedCategoryIds = categories.map(cat => cat.id)
    const unusedCategories = availableCategories.filter(cat => !usedCategoryIds.includes(cat.id))
    
    if (unusedCategories.length > 0) {
      const newCategory = unusedCategories[0]
      const categoryToAdd = {
        id: newCategory.id,
        name: newCategory.name,
        enabled: true,
        image: newCategory.image || newCategory.icon || '/assets/img/product/category/default-category.svg',
        order: categories.length,
        subcategories: newCategory.subcategories || []
      }
      setCategories(prev => [...prev, categoryToAdd])
      setHasChanges(true)
    }
  }

  const removeCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    setHasChanges(true)
  }

  const saveChanges = async () => {
    try {
      const updatedSectionData = {
        enabled: sectionVisible,
        config: {
          maxCategories: maxCategories,
          categories: categories.map(cat => ({
            categoryId: cat.id,
            enabled: cat.enabled,
            order: cat.order
          }))
        }
      }
      
      const response = await put(`/api/pages/${pageKey}/sections/${sectionKey}`, updatedSectionData)
      
      if (response.success) {
        onUpdate(pageKey, sectionKey, updatedSectionData)
        setHasChanges(false)
        
        // Show success message
        const toast = document.createElement('div')
        toast.className = 'position-fixed top-0 end-0 p-3'
        toast.style.zIndex = '9999'
        toast.innerHTML = `
          <div class="toast show bg-success text-white">
            <div class="toast-body">
              <i class="bi bi-check-circle me-2"></i>
              Category section updated successfully!
            </div>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => document.body.removeChild(toast), 3000)
      }
    } catch (error) {
      console.error('Failed to save changes:', error)
      
      // Show error message
      const toast = document.createElement('div')
      toast.className = 'position-fixed top-0 end-0 p-3'
      toast.style.zIndex = '9999'
      toast.innerHTML = `
        <div class="toast show bg-danger text-white">
          <div class="toast-body">
            <i class="bi bi-x-circle me-2"></i>
            Failed to save changes. Please try again.
          </div>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 3000)
    }
  }

  const resetChanges = () => {
    // Reload from server
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      {/* Header Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="bi bi-eye me-2"></i>
                Section Visibility
              </h6>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="sectionVisibility"
                  checked={sectionVisible}
                  onChange={toggleSectionVisibility}
                />
                <label className="form-check-label" htmlFor="sectionVisibility">
                  {sectionVisible ? 'Section is visible on homepage' : 'Section is hidden from homepage'}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="bi bi-plus-circle me-2"></i>
                Quick Actions
              </h6>
              <button 
                className="btn btn-success btn-sm me-2"
                onClick={addNewCategory}
              >
                <i className="bi bi-plus me-1"></i>
                Add Category
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setCategories(prev => prev.map(cat => ({ ...cat, enabled: !cat.enabled })))}
              >
                <i className="bi bi-arrow-repeat me-1"></i>
                Toggle All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Management */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Categories Management
          </h5>
          <small className="text-muted">Drag and drop to reorder categories</small>
        </div>
        <div className="card-body p-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`list-group list-group-flush ${snapshot.isDraggingOver ? 'bg-light' : ''}`}
                  style={{ minHeight: '200px' }}
                >
                  {categories.map((category, index) => (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`list-group-item ${snapshot.isDragging ? 'shadow-lg' : ''} ${!category.enabled ? 'opacity-50' : ''}`}
                        >
                          <div className="d-flex align-items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="me-3 text-muted"
                              style={{ cursor: 'grab' }}
                            >
                              <i className="bi bi-grip-vertical"></i>
                            </div>
                            
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="rounded me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            
                            <div className="flex-grow-1">
                              <input
                                type="text"
                                className="form-control border-0 fw-bold"
                                value={category.name}
                                onChange={(e) => editCategoryName(category.id, e.target.value)}
                                style={{ backgroundColor: 'transparent' }}
                              />
                              <small className="text-muted">ID: {category.id}</small>
                            </div>
                            
                            <div className="d-flex align-items-center gap-2">
                              <div className="form-check form-switch">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id={`cat-${category.id}`}
                                  checked={category.enabled}
                                  onChange={() => toggleCategory(category.id)}
                                />
                                <label className="form-check-label" htmlFor={`cat-${category.id}`}>
                                  <small>{category.enabled ? 'Visible' : 'Hidden'}</small>
                                </label>
                              </div>
                              
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeCategory(category.id)}
                                title="Remove category"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{categories.length}</h4>
              <small>Total Categories</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{categories.filter(cat => cat.enabled).length}</h4>
              <small>Visible Categories</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{categories.filter(cat => !cat.enabled).length}</h4>
              <small>Hidden Categories</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{sectionVisible ? 'ON' : 'OFF'}</h4>
              <small>Section Status</small>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
            <div>
              {hasChanges && (
                <span className="badge bg-warning me-2">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Unsaved Changes
                </span>
              )}
              <small className="text-muted">
                Last updated: {new Date().toLocaleString()}
              </small>
            </div>
            <div>
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={resetChanges}
                disabled={!hasChanges}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Reset
              </button>
              <button 
                className="btn btn-success me-2"
                onClick={saveChanges}
                disabled={!hasChanges}
              >
                <i className="bi bi-check-lg me-1"></i>
                Save Changes
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onClose}
              >
                <i className="bi bi-x-lg me-1"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
