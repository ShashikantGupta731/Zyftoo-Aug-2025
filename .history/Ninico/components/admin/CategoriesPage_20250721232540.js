'use client'
import React, { useState, useEffect } from 'react'
import { get, post, put, del, uploadFile } from '@/util/apiService'
import { CATEGORY, SUBCATEGORY } from '@/util/apiEndpoints'

export default function CategoriesPage({ onNavigate }) {
  const [activeView, setActiveView] = useState('list') // 'list', 'add', 'subcategories', 'addSubcategory'
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubcategory, setEditingSubcategory] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '', // For subcategories (using 'parent' to match backend schema)
    status: true,
    image: null // File object for upload
  })

  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    description: '',
    parent: '', // Required for subcategories
    status: true,
    image: null
  })

  // Hardcoded admin token for testing
  const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYwNzMyMCwiZXhwIjoxNzUzMjEyMTIwfQ.ugFuaDCq_ewqIE-dZaql3BB91kaXBIxE0TQmqdYnagI'

  // Utility function to format hierarchical category names
  const formatCategoryHierarchy = (category) => {
    if (!category.parent || !category.parent.name) {
      return category.name
    }
    return `${category.parent.name} > ${category.name}`
  }

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true)
      
      // Temporarily store admin token
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(CATEGORY.GET_ALL)
      console.log('Fetched categories response:', response)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch categories')
      }
      
      console.log('Fetched categories:', response.data)
      
      // Sort categories to show main categories first, then subcategories
      const sortedCategories = response.data.sort((a, b) => {
        // Main categories first
        if (!a.parent && b.parent) return -1
        if (a.parent && !b.parent) return 1
        
        // Within same level, sort alphabetically
        if (!a.parent && !b.parent) {
          return a.name.localeCompare(b.name)
        }
        
        // For subcategories, sort by parent name first, then by subcategory name
        if (a.parent && b.parent) {
          const parentCompare = (a.parent.name || '').localeCompare(b.parent.name || '')
          if (parentCompare !== 0) return parentCompare
          return a.name.localeCompare(b.name)
        }
        
        return 0
      })
      
      console.log('Sorted categories:', sortedCategories)
      setCategories(sortedCategories)
      setError('')
    } catch (err) {
      console.error('Fetch categories error:', err)
      setError('Failed to load categories: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch subcategories from backend
  const fetchSubcategories = async () => {
    try {
      setLoading(true)
      
      // Temporarily store admin token
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await get(SUBCATEGORY.GET_ALL)
      console.log('Fetched subcategories response:', response)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subcategories')
      }
      
      console.log('Fetched subcategories:', response.data)
      setSubcategories(response.data)
      setError('')
    } catch (err) {
      console.error('Fetch subcategories error:', err)
      setError('Failed to load subcategories: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create or update subcategory
  const saveSubcategory = async (subcategoryData) => {
    try {
      console.log('Saving subcategory data:', subcategoryData)
      console.log('Editing subcategory:', editingSubcategory)
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', subcategoryData.name)
      formDataToSend.append('description', subcategoryData.description || '')
      formDataToSend.append('parent', subcategoryData.parent)
      formDataToSend.append('status', subcategoryData.status)
      
      // Add image file if selected
      if (subcategoryData.image) {
        formDataToSend.append('image', subcategoryData.image)
      }
      
      // For updates, add the subcategory ID
      if (editingSubcategory) {
        formDataToSend.append('subcategoryId', editingSubcategory._id)
      }
      
      // Log all FormData key-value pairs
      console.log('Subcategory FormData contents:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
      
      // Use appropriate endpoint and method
      const endpoint = editingSubcategory 
        ? `${SUBCATEGORY.UPDATE}/${editingSubcategory._id}`
        : SUBCATEGORY.CREATE
      
      const method = editingSubcategory ? 'PUT' : 'POST'
      
      console.log('Using subcategory endpoint:', endpoint, 'with method:', method)
      
      // Use uploadFile with the correct method
      const response = await uploadFile(endpoint, formDataToSend, method)
      console.log('Save subcategory response:', response)

      // Check for success based on HTTP status and response format
      if (response.success || (response.status >= 200 && response.status < 300)) {
        // Show success message
        console.log(editingSubcategory ? 'Subcategory updated successfully!' : 'Subcategory created successfully!');
        alert(editingSubcategory ? 'Subcategory updated successfully!' : 'Subcategory created successfully!');
        
        // Reset form and go back to subcategories list
        setActiveView('subcategories')
        setEditingSubcategory(null)
        setSubcategoryFormData({ name: '', description: '', parent: '', status: true, image: null })
        setError('')
        
        // Refresh subcategories list
        await fetchSubcategories()
        
        return response.data
      } else {
        throw new Error(response.message || response.data?.error || 'Failed to save subcategory')
      }
    } catch (err) {
      console.error('Save subcategory error:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      });
      
      const errorMessage = err.message || 'Failed to save subcategory'
      setError(errorMessage)
      alert(errorMessage)
      throw err
    }
  }

  // Delete subcategory
  const deleteSubcategory = async (subcategoryId) => {
    const subcategoryToDelete = subcategories.find(subcat => subcat._id === subcategoryId)
    
    const confirmMessage = `Are you sure you want to delete the subcategory "${subcategoryToDelete?.name}"?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      console.log('Deleting subcategory with ID:', subcategoryId)
      console.log('Subcategory details:', subcategoryToDelete)
      
      // Temporarily store admin token to ensure it's available
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await del(`${SUBCATEGORY.DELETE}/${subcategoryId}`)
      console.log('Delete subcategory response:', response)

      // Check for different response formats
      if (response.success || (response.status >= 200 && response.status < 300) || response.data?.message) {
        console.log('Subcategory deleted successfully')
        
        // Refresh subcategories list
        await fetchSubcategories()
        
        // Show success message
        alert('Subcategory deleted successfully!')
      } else {
        throw new Error(response.message || response.data?.error || 'Failed to delete subcategory')
      }
      
    } catch (err) {
      console.error('Delete subcategory error:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      })
      
      let errorMessage = 'Failed to delete subcategory'
      
      if (err.status === 404) {
        errorMessage = 'Subcategory not found'
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'Unauthorized to delete subcategory'
      } else {
        errorMessage = err.message || 'An unexpected error occurred'
      }
      
      setError(errorMessage)
      alert(errorMessage)
    }
  }

  // Create or update category
  const saveCategory = async (categoryData) => {
    try {
      console.log('Saving category data:', categoryData); // Debug log
      console.log('Editing category:', editingCategory); // Debug log
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', categoryData.name)
      formDataToSend.append('description', categoryData.description || '')
      formDataToSend.append('status', categoryData.status)
      
      if (categoryData.parent) {
        formDataToSend.append('parent', categoryData.parent)
        formDataToSend.append('isSubcategory', 'true')
        
        // Find parent category name for proper folder structure
        const parentCategory = categories.find(cat => cat._id === categoryData.parent)
        if (parentCategory) {
          formDataToSend.append('parentCategoryName', parentCategory.name)
        }
      } else {
        formDataToSend.append('isSubcategory', 'false')
      }
      
      // Add category name for folder creation
      formDataToSend.append('categoryName', categoryData.name)
      
      // Add image file if selected
      if (categoryData.image) {
        formDataToSend.append('image', categoryData.image)
      }
      
      // For updates, add the category ID
      if (editingCategory) {
        formDataToSend.append('categoryId', editingCategory._id)
      }
      
      // Log all FormData key-value pairs
      console.log('FormData contents:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
      
      // Use appropriate endpoint and method
      const endpoint = editingCategory 
        ? `${CATEGORY.UPDATE}/${editingCategory._id}`
        : CATEGORY.CREATE
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      console.log('Using endpoint:', endpoint, 'with method:', method); // Debug log
      
      // Use uploadFile with the correct method
      const response = await uploadFile(endpoint, formDataToSend, method)
      console.log('Save response:', response); // Debug log

      // Check for success based on HTTP status and response format
      if (response.success || (response.status >= 200 && response.status < 300)) {
        // Show success message
        console.log(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        
        // Reset form and go back to list
        setActiveView('list')
        setEditingCategory(null)
        setFormData({ name: '', description: '', parent: '', status: true, image: null })
        setError('')
        
        // Refresh categories list
        await fetchCategories()
        
        return response.data
      } else {
        throw new Error(response.message || response.data?.error || 'Failed to save category')
      }
    } catch (err) {
      console.error('Save category error:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      });
      
      const errorMessage = err.message || 'Failed to save category'
      setError(errorMessage)
      alert(errorMessage)
      throw err
    }
  }

  // Delete category
  const deleteCategory = async (categoryId) => {
    // Find the category to check if it has subcategories
    const categoryToDelete = categories.find(cat => cat._id === categoryId)
    const hasSubcategories = categories.some(cat => cat.parent && cat.parent._id === categoryId)
    
    let confirmMessage = 'Are you sure you want to delete this category?'
    if (hasSubcategories) {
      confirmMessage = `This category "${categoryToDelete?.name}" has subcategories. All subcategories will also need to be deleted first. Are you sure you want to continue?`
    }
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      console.log('Deleting category with ID:', categoryId); // Debug log
      console.log('Category details:', categoryToDelete); // Debug log
      console.log('Has subcategories:', hasSubcategories); // Debug log
      
      // Temporarily store admin token to ensure it's available
      localStorage.setItem('authToken', ADMIN_TOKEN)
      
      const response = await del(`${CATEGORY.DELETE}/${categoryId}`)
      console.log('Delete response:', response); // Debug log

      // Check for different response formats
      if (response.success || (response.status >= 200 && response.status < 300) || response.data?.message) {
        console.log('Category deleted successfully'); // Debug log
        
        // Refresh categories list
        await fetchCategories()
        
        // Show success message
        alert('Category deleted successfully!')
      } else {
        throw new Error(response.message || response.data?.error || 'Failed to delete category')
      }
      
    } catch (err) {
      console.error('Delete category error:', err); // Debug log
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      }); // Debug log
      
      let errorMessage = 'Failed to delete category'
      
      if (err.status === 400) {
        errorMessage = err.message || err.data?.error || 'Cannot delete category with subcategories. Delete subcategories first.'
      } else if (err.status === 404) {
        errorMessage = 'Category not found'
      } else if (err.status === 401 || err.status === 403) {
        errorMessage = 'Unauthorized to delete category'
      } else {
        errorMessage = err.message || 'An unexpected error occurred'
      }
      
      setError(errorMessage)
      alert(errorMessage)
    }
  }

  // Load categories on component mount
  useEffect(() => {
    fetchCategories()
    if (activeView === 'subcategories' || activeView === 'addSubcategory') {
      fetchSubcategories()
    }
  }, [activeView])

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  const handleSubcategoryInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setSubcategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.image && formData.image.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      // Ensure parent is empty for main categories
      const categoryDataToSave = {
        ...formData,
        parent: '' // Always set parent to empty for main categories
      }
      await saveCategory(categoryDataToSave)
    } catch (err) {
      // Error is already handled in saveCategory
    }
  }

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (!subcategoryFormData.parent) {
        alert('Please select a parent category');
        return;
      }
      if (subcategoryFormData.image && subcategoryFormData.image.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      await saveSubcategory(subcategoryFormData)
    } catch (err) {
      // Error is already handled in saveSubcategory
    }
  }

  const handleEdit = (category) => {
    console.log('Editing category:', category); // Debug log
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      parent: category.parent ? (category.parent._id || category.parent) : '',
      status: category.status,
      image: null // Reset image field for editing (user can upload new image if needed)
    })
    setActiveView('add')
    setError('') // Clear any previous errors
  }

  const handleEditSubcategory = (subcategory) => {
    console.log('Editing subcategory:', subcategory); // Debug log
    setEditingSubcategory(subcategory)
    setSubcategoryFormData({
      name: subcategory.name,
      description: subcategory.description || '',
      parent: subcategory.parent ? (subcategory.parent._id || subcategory.parent) : '',
      status: subcategory.status,
      image: null // Reset image field for editing (user can upload new image if needed)
    })
    setActiveView('addSubcategory')
    setError('') // Clear any previous errors
  }

  const renderCategoryList = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading categories...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
          <button 
            className="btn btn-outline-danger btn-sm ms-auto"
            onClick={fetchCategories}
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div>
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-grid text-primary" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-2 mb-0">{categories.filter(cat => !cat.parent).length}</h4>
                <small className="text-muted">Main Categories</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-diagram-3 text-success" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-2 mb-0">{categories.filter(cat => cat.parent).length}</h4>
                <small className="text-muted">Sub Categories</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-check-circle text-info" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-2 mb-0">{categories.filter(cat => cat.status).length}</h4>
                <small className="text-muted">Active Categories</small>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 fw-semibold">All Categories</h5>
          </div>
          <div className="card-body p-0">
            {categories.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-grid" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <p className="mt-2 text-muted">No categories found. Create your first category!</p>
                <button
                  className="btn btn-success"
                  onClick={() => setActiveView('add')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Category
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Category Name</th>
                      <th>Image</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category._id} className={category.parent ? 'table-light' : ''}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            {category.parent ? (
                              <>
                                <i className="bi bi-arrow-return-right text-muted me-2"></i>
                                <i className="bi bi-tag text-secondary me-2"></i>
                                <span>{formatCategoryHierarchy(category)}</span>
                              </>
                            ) : (
                              <>
                                <i className="bi bi-grid text-primary me-2"></i>
                                <strong>{category.name}</strong>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          {category.image?.url ? (
                            <img 
                              src={category.image.url} 
                              alt={category.name}
                              className="rounded"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}
                            >
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>{category.description || '-'}</td>
                        <td>
                          <span className={`badge ${category.parent ? 'bg-secondary' : 'bg-primary'}`}>
                            {category.parent ? 'Sub Category' : 'Main Category'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${category.status ? 'bg-success' : 'bg-danger'}`}>
                            {category.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEdit(category)}
                            title="Edit Category"
                          >
                            <i className="bi bi-pencil"></i>
                            <span className="d-none">Edit</span>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCategory(category._id)}
                            title="Delete Category"
                          >
                            <i className="bi bi-trash"></i>
                            <span className="d-none">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderAddCategoryForm = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0 fw-semibold">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Category Type</label>
                <input
                  type="text"
                  className="form-control"
                  value="Main Category"
                  disabled
                  readOnly
                />
                <div className="form-text">All categories created here will be main categories. Use Subcategories section to create subcategories.</div>
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Category Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                />
                <div className="form-text">
                  Upload an image for this category. Recommended size: 300x300px. 
                  {formData.parent ? ' Will be saved in subcategories folder.' : ' Will be saved in main category folder.'}
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Selected: {formData.image.name}
                    </small>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">Active Status</label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setActiveView('list')
                setEditingCategory(null)
                setFormData({ name: '', description: '', parent: '', status: true })
                setError('')
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to List
            </button>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-circle me-2"></i>
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderSubcategoriesList = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading subcategories...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
          <button 
            className="btn btn-outline-danger btn-sm ms-auto"
            onClick={fetchSubcategories}
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div>
        {/* Back to Categories Button */}
        <div className="mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setActiveView('list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Categories
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-diagram-3 text-success" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-2 mb-0">{subcategories.length}</h4>
                <small className="text-muted">Total Subcategories</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-check-circle text-info" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-2 mb-0">{subcategories.filter(subcat => subcat.status).length}</h4>
                <small className="text-muted">Active Subcategories</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-grid text-primary" style={{ fontSize: '2rem' }}></i>
                <h4 className="mt-2 mb-0">{categories.filter(cat => !cat.parent).length}</h4>
                <small className="text-muted">Parent Categories</small>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 fw-semibold">All Subcategories</h5>
          </div>
          <div className="card-body p-0">
            {subcategories.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-diagram-3" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <p className="mt-2 text-muted">No subcategories found. Create your first subcategory!</p>
                <button
                  className="btn btn-success"
                  onClick={() => setActiveView('addSubcategory')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Subcategory
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Subcategory Name</th>
                      <th>Parent Category</th>
                      <th>Image</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map(subcategory => (
                      <tr key={subcategory._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-tag text-secondary me-2"></i>
                            <strong>{subcategory.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {subcategory.parent?.name || 'Unknown'}
                          </span>
                        </td>
                        <td>
                          {subcategory.image?.url ? (
                            <img 
                              src={subcategory.image.url} 
                              alt={subcategory.name}
                              className="rounded"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}
                            >
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>{subcategory.description || '-'}</td>
                        <td>
                          <span className={`badge ${subcategory.status ? 'bg-success' : 'bg-danger'}`}>
                            {subcategory.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEditSubcategory(subcategory)}
                            title="Edit Subcategory"
                          >
                            <i className="bi bi-pencil"></i>
                            <span className="d-none">Edit</span>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteSubcategory(subcategory._id)}
                            title="Delete Subcategory"
                          >
                            <i className="bi bi-trash"></i>
                            <span className="d-none">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderAddSubcategoryForm = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0 fw-semibold">
          {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
        </h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}
        
        <form onSubmit={handleSubcategorySubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Sub-Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={subcategoryFormData.name}
                  onChange={handleSubcategoryInputChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Parent Category *</label>
                <select
                  className="form-select"
                  name="parent"
                  value={subcategoryFormData.parent}
                  onChange={handleSubcategoryInputChange}
                  required
                >
                  <option value="">Select Parent Category</option>
                  {categories.filter(cat => !cat.parent).map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="form-text">Select the parent category for this subcategory</div>
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={subcategoryFormData.description}
                  onChange={handleSubcategoryInputChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Sub-Category Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleSubcategoryInputChange}
                  accept="image/*"
                />
                <div className="form-text">
                  Upload an image for this subcategory. Recommended size: 300x300px.
                </div>
                {subcategoryFormData.image && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Selected: {subcategoryFormData.image.name}
                    </small>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="status"
                    checked={subcategoryFormData.status}
                    onChange={handleSubcategoryInputChange}
                  />
                  <label className="form-check-label">Active Status</label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setActiveView('subcategories')
                setEditingSubcategory(null)
                setSubcategoryFormData({ name: '', description: '', parent: '', status: true, image: null })
                setError('')
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to List
            </button>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-circle me-2"></i>
              {editingSubcategory ? 'Update Subcategory' : 'Save Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <>
      <style jsx>{`
        /* Fallback for when Bootstrap icons don't load */
        .btn i.bi-pencil:before {
          content: "✏️";
        }
        .btn i.bi-trash:before {
          content: "🗑️";
        }
        .btn i.bi-pencil:empty:before {
          content: "Edit";
          font-style: normal;
        }
        .btn i.bi-trash:empty:before {
          content: "Delete";
          font-style: normal;
        }
      `}</style>
      <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Categories Management</h2>
              <p className="text-muted mb-0">Manage product categories and subcategories</p>
            </div>
            <div className="d-flex gap-2">
              {activeView === 'list' ? (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => setActiveView('add')}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Category
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => setActiveView('subcategories')}
                  >
                    <i className="bi bi-diagram-3 me-2"></i>
                    Subcategories
                  </button>
                </>
              ) : activeView === 'subcategories' ? (
                <button
                  className="btn btn-success"
                  onClick={() => setActiveView('addSubcategory')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Subcategory
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {activeView === 'list' && renderCategoryList()}
      {activeView === 'add' && renderAddCategoryForm()}
      {activeView === 'subcategories' && renderSubcategoriesList()}
      {activeView === 'addSubcategory' && renderAddSubcategoryForm()}
    </div>
    </>
  )
}
