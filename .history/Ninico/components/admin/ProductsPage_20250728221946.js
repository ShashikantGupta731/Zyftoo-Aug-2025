'use client'
import { useState, useEffect } from 'react'
import { get, del } from '@/util/apiService'
import { PRODUCT, CATEGORY } from '@/util/apiEndpoints'

export default function ProductsPage({ onNavigate }) {
  const [Products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([]) // Add categories state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    priceRange: ''
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        console.log('Fetching products and categories from API...')
        
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          get(PRODUCT.GET_ALL),
          get(CATEGORY.GET_ALL)
        ])
        
        console.log('Products Response:', productsResponse)
        console.log('Categories Response:', categoriesResponse)
        
        if (!productsResponse.success) throw new Error(productsResponse.message || 'Failed to fetch Products')
        
        // Handle products
        const productsArray = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.products || [])
        setProducts(productsArray)
        setFilteredProducts(productsArray)
        
        // Handle categories
        if (categoriesResponse.success) {
          const categoriesArray = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : (categoriesResponse.data.categories || [])
          setCategories(categoriesArray)
          console.log('Fetched categories:', categoriesArray)
        } else {
          console.warn('Failed to fetch categories:', categoriesResponse.message)
          setCategories([]) // Set empty array if categories fail to load
        }
        
        console.log('First product categories:', productsArray[0]?.categories)
        
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter products based on current filter state
  useEffect(() => {
    let filtered = [...Products]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.short_description?.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => {
        if (!product.categories || !Array.isArray(product.categories)) return false
        return product.categories.some(cat => {
          if (typeof cat === 'object' && cat.name) {
            // Handle populated category objects
            const hierarchicalName = getHierarchicalCategoryName(cat)
            return hierarchicalName === filters.category
          } else if (typeof cat === 'string') {
            // Handle ObjectId strings - map to full name
            const fullName = getFullCategoryName(cat)
            return fullName === filters.category
          } else if (typeof cat === 'object' && cat.$oid) {
            // Handle MongoDB ObjectId objects - map to full name
            const fullName = getFullCategoryName(cat)
            return fullName === filters.category
          }
          return false
        })
      })
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(product => {
        switch (filters.status) {
          case 'published':
            return product.status === true
          case 'draft':
            return product.status === false
          case 'out-of-stock':
            return (product.quantity || 0) === 0
          default:
            return true
        }
      })
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price) || 0
        switch (filters.priceRange) {
          case 'low':
            return price >= 0 && price <= 2000
          case 'medium':
            return price > 2000 && price <= 10000
          case 'high':
            return price > 10000
          default:
            return true
        }
      })
    }

    setFilteredProducts(filtered)
  }, [Products, filters])

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      priceRange: ''
    })
  }

  // Handle Edit Product
  const handleEdit = (product) => {
    // Store product data for editing
    localStorage.setItem('editProduct', JSON.stringify(product))
    onNavigate && onNavigate('edit-product')
  }

  // Handle View Product
  const handleView = (product) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  // Handle Delete Product
  const handleDelete = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  // Confirm Delete
  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      const response = await del(`${PRODUCT.DELETE}/${productToDelete._id}`)

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete product')
      }

      // Remove product from state
      setProducts(Products.filter(p => p._id !== productToDelete._id))
      setShowDeleteModal(false)
      setProductToDelete(null)
      
      // Show success message (you can add a toast notification here)
      alert('Product deleted successfully!')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete product: ' + err.message)
    }
  }

  // Helper function to extract ObjectId string from MongoDB ObjectId object
  const getObjectIdString = (obj) => {
    if (typeof obj === 'string') return obj
    if (typeof obj === 'object' && obj.$oid) return obj.$oid
    if (typeof obj === 'object' && obj._id) return obj._id
    return null
  }

  // Helper function to get category by ID
  const getCategoryById = (categoryId) => {
    if (!categoryId || !categories.length) return null
    
    // Extract actual ID string from ObjectId object if needed
    const idString = getObjectIdString(categoryId)
    if (!idString) return null
    
    return categories.find(cat => {
      const catId = getObjectIdString(cat._id)
      return catId === idString
    })
  }

  // Helper function to get full category name with parent
  const getFullCategoryName = (categoryId) => {
    if (!categoryId) return 'Unknown Category'
    
    const category = getCategoryById(categoryId)
    if (!category) {
      const idString = getObjectIdString(categoryId)
      return `Unknown Category (${idString?.substring(0, 8)}...)`
    }
    
    let name = category.name
    if (category.parent) {
      const parentCategory = getCategoryById(category.parent)
      if (parentCategory) {
        name = `${parentCategory.name} > ${category.name}`
      }
    }
    return name
  }

  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    const categoryNames = new Set()
    
    // Debug: log first few products to see category structure
    if (Products.length > 0) {
      console.log('First product categories:', Products[0]?.categories)
      console.log('Category structure:', Products[0]?.categories?.[0])
      console.log('Available categories for mapping:', categories)
      
      // Test a specific product with categories
      const productWithCategories = Products.find(p => p.categories && p.categories.length > 0)
      if (productWithCategories) {
        console.log('Product with categories:', productWithCategories.name)
        console.log('Its categories:', productWithCategories.categories)
        console.log('First category type:', typeof productWithCategories.categories[0])
        console.log('First category:', productWithCategories.categories[0])
        
        // Test the mapping function
        const testMapping = getFullCategoryName(productWithCategories.categories[0])
        console.log('Test mapping result:', testMapping)
      }
    }
    
    Products.forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(cat => {
          if (typeof cat === 'object' && cat.name) {
            // Already populated category object
            const hierarchicalName = getHierarchicalCategoryName(cat)
            categoryNames.add(hierarchicalName)
          } else if (typeof cat === 'string') {
            // Category ID string - map to full name
            const fullName = getFullCategoryName(cat)
            categoryNames.add(fullName)
          } else if (typeof cat === 'object' && cat.$oid) {
            // MongoDB ObjectId object - map to full name
            const fullName = getFullCategoryName(cat)
            categoryNames.add(fullName)
          }
        })
      }
    })
    
    console.log('Unique categories found:', Array.from(categoryNames))
    return Array.from(categoryNames).sort()
  }

  // Build hierarchical category name (Parent > Child)
  const getHierarchicalCategoryName = (category) => {
    if (!category) return ''
    
    let name = category.name
    if (category.parent && category.parent.name) {
      name = `${category.parent.name} > ${category.name}`
    }
    return name
  }

  // Format categories for display
  const formatCategoriesForDisplay = (categories) => {
    if (!categories || categories.length === 0) return 'Uncategorized'
    
    return categories.map(cat => {
      if (typeof cat === 'string') {
        // Category ID string - map to full name
        return getFullCategoryName(cat)
      }
      if (typeof cat === 'object' && cat.name) {
        // Already populated - use hierarchical name
        return getHierarchicalCategoryName(cat)
      }
      if (typeof cat === 'object' && cat.$oid) {
        // MongoDB ObjectId object - map to full name
        return getFullCategoryName(cat)
      }
      return 'Unknown Category'
    }).join(', ')
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold text-dark mb-0">Products Management</h2>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <i className="bi bi-download me-2"></i>
                Export
              </button>
              <button 
                className="btn btn-success"
                onClick={() => onNavigate && onNavigate('add-product')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-box text-primary" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-0">{filteredProducts.length}</h4>
              <small className="text-muted">Total Products {filters.search || filters.category || filters.status || filters.priceRange ? '(Filtered)' : ''}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-eye text-success" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-0">{filteredProducts.filter(p => p.status).length}</h4>
              <small className="text-muted">Published</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-eye-slash text-warning" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-0">{filteredProducts.filter(p => !p.status).length}</h4>
              <small className="text-muted">Drafts</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
              <h4 className="mt-2 mb-0">{filteredProducts.filter(p => (p.quantity || 0) < 5).length}</h4>
              <small className="text-muted">Low Stock</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Search Products</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search by name, SKU..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Price Range</label>
                  <select 
                    className="form-select"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="">All Prices</option>
                    <option value="low">₹0 - ₹2,000</option>
                    <option value="medium">₹2,000 - ₹10,000</option>
                    <option value="high">₹10,000+</option>
                  </select>
                </div>
                <div className="col-md-1">
                  <label className="form-label">&nbsp;</label>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => {/* Filters are applied automatically */}}
                    disabled={!filters.search && !filters.category && !filters.status && !filters.priceRange}
                  >
                    <i className="bi bi-funnel"></i>
                  </button>
                </div>
                <div className="col-md-2">
                  <label className="form-label">&nbsp;</label>
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={resetFilters}
                    disabled={!filters.search && !filters.category && !filters.status && !filters.priceRange}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {(filters.search || filters.category || filters.status || filters.priceRange) && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className="text-muted">Active filters:</span>
              
              {filters.search && (
                <span className="badge bg-light text-dark border">
                  Search: "{filters.search}"
                  <button 
                    className="btn-close btn-close-sm ms-1" 
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('search', '')}
                  ></button>
                </span>
              )}
              
              {filters.category && (
                <span className="badge bg-light text-dark border">
                  Category: {filters.category}
                  <button 
                    className="btn-close btn-close-sm ms-1" 
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('category', '')}
                  ></button>
                </span>
              )}
              
              {filters.status && (
                <span className="badge bg-light text-dark border">
                  Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                  <button 
                    className="btn-close btn-close-sm ms-1" 
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('status', '')}
                  ></button>
                </span>
              )}
              
              {filters.priceRange && (
                <span className="badge bg-light text-dark border">
                  Price: {filters.priceRange === 'low' ? '₹0 - ₹2,000' : 
                          filters.priceRange === 'medium' ? '₹2,000 - ₹10,000' : '₹10,000+'}
                  <button 
                    className="btn-close btn-close-sm ms-1" 
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('priceRange', '')}
                  ></button>
                </span>
              )}
              
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={resetFilters}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">
                  All Products 
                  {(filters.search || filters.category || filters.status || filters.priceRange) && (
                    <span className="badge bg-primary ms-2">
                      {filteredProducts.length} filtered
                    </span>
                  )}
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-grid"></i>
                  </button>
                  <button className="btn btn-sm btn-primary">
                    <i className="bi bi-list"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">
                        <input type="checkbox" className="form-check-input" />
                      </th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">Loading products...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-danger">{error}</td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          {Products.length === 0 ? (
                            <>
                              <i className="bi bi-box" style={{ fontSize: '3rem' }}></i>
                              <p className="mt-2">No products found</p>
                              <button 
                                className="btn btn-success"
                                onClick={() => onNavigate && onNavigate('add-product')}
                              >
                                <i className="bi bi-plus-circle me-2"></i>
                                Add Product
                              </button>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                              <p className="mt-2">No products match your filters</p>
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={resetFilters}
                              >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Clear Filters
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(Product => (
                        <tr key={Product._id}>
                          <td className="ps-4"><input type="checkbox" className="form-check-input" /></td>
                          <td>
                            <div className="d-flex align-items-center">
                              {Product.images && Product.images.length > 0 ? (
                                <img 
                                  src={Product.images[0]} 
                                  alt={Product.name}
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="bg-light rounded me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                  <i className="bi bi-image text-muted"></i>
                                </div>
                              )}
                              <div>
                                <div className="fw-semibold">{Product.name || 'N/A'}</div>
                                {Product.short_description && (
                                  <small className="text-muted">{Product.short_description.substring(0, 50)}...</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{Product.sku || 'N/A'}</td>
                          <td>
                            {formatCategoriesForDisplay(Product.categories)}
                          </td>
                          <td>
                            <span className={`badge ${Product.quantity > 10 ? 'bg-success' : Product.quantity > 0 ? 'bg-warning' : 'bg-danger'}`}>
                              {Product.quantity || 0}
                            </span>
                          </td>
                          <td className="fw-semibold">₹{Product.price ? Number(Product.price).toLocaleString('en-IN') : '0.00'}</td>
                          <td>
                            <span className={`badge ${Product.status ? 'bg-success' : 'bg-secondary'}`}>
                              {Product.status ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                title="Edit"
                                onClick={() => handleEdit(Product)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-info" 
                                title="View"
                                onClick={() => handleView(Product)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                title="Delete"
                                onClick={() => handleDelete(Product)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmDelete}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <img 
                        src={selectedProduct.images[0]} 
                        alt={selectedProduct.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                        <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <h4>{selectedProduct.name}</h4>
                    <p className="text-muted">{selectedProduct.short_description}</p>
                    
                    <div className="row mb-2">
                      <div className="col-sm-4"><strong>SKU:</strong></div>
                      <div className="col-sm-8">{selectedProduct.sku || 'N/A'}</div>
                    </div>
                    
                    <div className="row mb-2">
                      <div className="col-sm-4"><strong>Price:</strong></div>
                      <div className="col-sm-8">₹{selectedProduct.price ? Number(selectedProduct.price).toLocaleString('en-IN') : '0.00'}</div>
                    </div>
                    
                    <div className="row mb-2">
                      <div className="col-sm-4"><strong>Stock:</strong></div>
                      <div className="col-sm-8">
                        <span className={`badge ${selectedProduct.quantity > 10 ? 'bg-success' : selectedProduct.quantity > 0 ? 'bg-warning' : 'bg-danger'}`}>
                          {selectedProduct.quantity || 0} units
                        </span>
                      </div>
                    </div>
                    
                    <div className="row mb-2">
                      <div className="col-sm-4"><strong>Status:</strong></div>
                      <div className="col-sm-8">
                        <span className={`badge ${selectedProduct.status ? 'bg-success' : 'bg-secondary'}`}>
                          {selectedProduct.status ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="row mb-2">
                      <div className="col-sm-4"><strong>Category:</strong></div>
                      <div className="col-sm-8">
                        {formatCategoriesForDisplay(selectedProduct.categories)}
                      </div>
                    </div>
                    
                    {/* New Enhanced Fields */}
                    {selectedProduct.rating > 0 && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Rating:</strong></div>
                        <div className="col-sm-8">
                          <span className="text-warning">
                            {'⭐'.repeat(Math.floor(selectedProduct.rating))}
                          </span>
                          <span className="ms-1">
                            {selectedProduct.rating}/5 ({selectedProduct.numReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedProduct.hasActiveCorporatePricing && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Corporate Pricing:</strong></div>
                        <div className="col-sm-8">
                          <span className="badge bg-info">Available</span>
                        </div>
                      </div>
                    )}

                    {selectedProduct.is_corporate_only && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Access:</strong></div>
                        <div className="col-sm-8">
                          <span className="badge bg-warning">Corporate Only</span>
                        </div>
                      </div>
                    )}

                    {/* Product Flags */}
                    {(selectedProduct.is_featured || selectedProduct.is_popular || selectedProduct.is_trending) && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Flags:</strong></div>
                        <div className="col-sm-8">
                          {selectedProduct.is_featured && <span className="badge bg-warning me-1">Featured</span>}
                          {selectedProduct.is_popular && <span className="badge bg-success me-1">Popular</span>}
                          {selectedProduct.is_trending && <span className="badge bg-primary me-1">Trending</span>}
                        </div>
                      </div>
                    )}

                    {/* Business Features */}
                    {(selectedProduct.safe_checkout || selectedProduct.secure_checkout || selectedProduct.social_share) && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Features:</strong></div>
                        <div className="col-sm-8">
                          {selectedProduct.safe_checkout && <span className="badge bg-light text-dark me-1">Safe Checkout</span>}
                          {selectedProduct.secure_checkout && <span className="badge bg-light text-dark me-1">Secure</span>}
                          {selectedProduct.social_share && <span className="badge bg-light text-dark me-1">Social Share</span>}
                        </div>
                      </div>
                    )}

                    {/* Analytics (if available) */}
                    {selectedProduct.analytics?.views?.total > 0 && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Views:</strong></div>
                        <div className="col-sm-8">
                          <span className="badge bg-secondary">
                            {selectedProduct.analytics.views.total} total views
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedProduct.sales_count > 0 && (
                      <div className="row mb-2">
                        <div className="col-sm-4"><strong>Sales:</strong></div>
                        <div className="col-sm-8">
                          <span className="badge bg-success">
                            {selectedProduct.sales_count} sold
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedProduct.description && (
                  <div className="mt-3">
                    <h6>Description:</h6>
                    <p>{selectedProduct.description}</p>
                  </div>
                )}
                
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="mt-3">
                    <h6>Additional Images:</h6>
                    <div className="row">
                      {selectedProduct.images.slice(1).map((img, index) => (
                        <div key={index} className="col-md-3 mb-2">
                          <img 
                            src={img} 
                            alt={`${selectedProduct.name} ${index + 2}`}
                            className="img-fluid rounded"
                            style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowViewModal(false)
                    handleEdit(selectedProduct)
                  }}
                >
                  Edit Product
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
