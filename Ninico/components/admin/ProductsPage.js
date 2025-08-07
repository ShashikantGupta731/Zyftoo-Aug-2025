'use client'
import { useState, useEffect } from 'react'
import { get, del } from '@/util/apiService'
import { PRODUCT, CATEGORY } from '@/util/apiEndpoints'
import { 
  fetchCategories as serviceFetchCategories,
  fetchSubcategories as serviceFetchSubcategories
} from '@/services/categoryService'

export default function ProductsPage({ onNavigate }) {
  const [Products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [allSubcategories, setAllSubcategories] = useState([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
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

  // Fetch all categories and subcategories once on component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        console.log('📂 Fetching all categories and subcategories...')
        
        // Fetch both in parallel - same approach as CategoriesPage
        const [categoriesData, subcategoriesData] = await Promise.all([
          serviceFetchCategories(),
          serviceFetchSubcategories()
        ])
        
        console.log('✅ Fetched categories:', categoriesData)
        console.log('✅ Fetched subcategories:', subcategoriesData)
        
        setAllCategories(categoriesData || [])
        setAllSubcategories(subcategoriesData || [])
        setCategoriesLoaded(true)
      } catch (error) {
        console.error('❌ Error fetching categories:', error)
        setCategoriesLoaded(true) // Set to true even on error to prevent infinite loading
      }
    }
    
    fetchCategoriesData()
  }, [])

  // Helper function to get category/subcategory name by ID
  const getCategoryNameById = (categoryId) => {
    if (!categoryId || !categoriesLoaded) return null
    
    // Clean the ID - remove prefixes if they exist
    const cleanId = categoryId.replace('MainCategory-', '').replace('subcategory-', '')
    
    // First check in main categories
    const mainCategory = allCategories.find(cat => {
      const catId = cat._id || cat.id
      return catId === categoryId || catId === cleanId || catId === `MainCategory-${cleanId}`
    })
    
    if (mainCategory) {
      return {
        name: mainCategory.name,
        type: 'main',
        fullName: mainCategory.name
      }
    }
    
    // Then check in subcategories
    const subCategory = allSubcategories.find(subcat => {
      const subcatId = subcat._id || subcat.id
      return subcatId === categoryId || subcatId === cleanId || subcatId === `subcategory-${cleanId}`
    })
    
    if (subCategory) {
      // Get parent name if available
      const parentName = subCategory.parent?.name || 'Unknown'
      return {
        name: subCategory.name,
        type: 'sub',
        fullName: `${parentName} > ${subCategory.name}`,
        parent: parentName
      }
    }
    
    return null
  }

  // Format categories for display - separate main and sub
  const formatCategoriesForDisplay = (productCategories) => {
    if (!productCategories || !Array.isArray(productCategories) || productCategories.length === 0) {
      return { main: 'Uncategorized', sub: 'Uncategorized' }
    }
    
    const mainCats = []
    const subCats = []
    
    productCategories.forEach(catId => {
      const categoryInfo = getCategoryNameById(catId)
      
      if (categoryInfo) {
        if (categoryInfo.type === 'main') {
          mainCats.push(categoryInfo.name)
        } else if (categoryInfo.type === 'sub') {
          subCats.push(categoryInfo.fullName)
        }
      }
    })
    
    return {
      main: mainCats.length > 0 ? mainCats.join(', ') : 'Uncategorized',
      sub: subCats.length > 0 ? subCats.join(', ') : 'Uncategorized'
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        console.log('Fetching products and categories from API...')
        
        // Check if admin token exists
        const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('authToken')
        if (!adminToken) {
          console.error('No admin token found in localStorage')
          setError('Authentication required. Please login again.')
          setTimeout(() => {
            window.location.href = '/adminLogin'
          }, 2000)
          return
        }

        console.log('Admin token found, fetching products...')
        
        // First fetch products without population to get raw category IDs
        const productsResponse = await get(PRODUCT.GET_ALL, { 
          adminView: 'true', 
          limit: 100
        })
        
        console.log('Products Response:', productsResponse)
        
        if (!productsResponse.success) throw new Error(productsResponse.message || 'Failed to fetch Products')
        
        // Handle products
        const productsArray = Array.isArray(productsResponse.data) 
          ? productsResponse.data 
          : (productsResponse.data.products || [])
        
        setProducts(productsArray)
        setFilteredProducts(productsArray)
        
        console.log('Products fetched:', productsArray.length)
        console.log('Sample product categories:', productsArray[0]?.categories)
        
      } catch (err) {
        console.error('Fetch error:', err)
        
        // Handle authentication errors specifically
        if (err.message?.includes('Admin token not found') || err.message?.includes('jwt expired')) {
          setError('Session expired. Please login again.')
          setTimeout(() => {
            window.location.href = '/adminLogin'
          }, 2000)
        } else {
          setError(err.message)
        }
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

    // Category filter - updated to work with the new approach
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => {
        if (!product.categories || !Array.isArray(product.categories)) return false
        
        return product.categories.some(catId => {
          const categoryInfo = getCategoryNameById(catId)
          if (categoryInfo) {
            return categoryInfo.fullName === filters.category || categoryInfo.name === filters.category
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
  }, [Products, filters, categoriesLoaded])

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
      // Check admin token before delete
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('authToken')
      if (!adminToken) {
        alert('Authentication required. Please login again.')
        window.location.href = '/adminLogin'
        return
      }

      const response = await del(`${PRODUCT.DELETE}/${productToDelete._id}`)

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete product')
      }

      // Remove product from state
      setProducts(Products.filter(p => p._id !== productToDelete._id))
      setShowDeleteModal(false)
      setProductToDelete(null)
      
      alert('Product deleted successfully!')
    } catch (err) {
      console.error('Delete error:', err)
      
      if (err.message?.includes('Admin token not found') || err.message?.includes('jwt expired')) {
        alert('Session expired. Please login again.')
        window.location.href = '/adminLogin'
      } else {
        alert('Failed to delete product: ' + err.message)
      }
    }
  }

  // Get unique categories for filter dropdown - updated for new approach
  const getUniqueCategories = () => {
    const categoryNames = new Set()
    
    if (!categoriesLoaded) return []
    
    Products.forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(catId => {
          const categoryInfo = getCategoryNameById(catId)
          if (categoryInfo && categoryInfo.fullName !== 'Uncategorized') {
            categoryNames.add(categoryInfo.fullName)
          }
        })
      }
    })
    
    return Array.from(categoryNames).sort()
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
                      <th>Main Category</th>
                      <th>Subcategories</th>
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
                        <td colSpan="9" className="text-center py-5 text-danger">{error}</td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5 text-muted">
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
                      filteredProducts.map(Product => {
                        const categoryDisplay = formatCategoriesForDisplay(Product.categories)
                        return (
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
                            {!categoriesLoaded ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              categoryDisplay.main
                            )}
                          </td>
                          <td>
                            {!categoriesLoaded ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              categoryDisplay.sub
                            )}
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
                        )
                      })
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
                        {formatCategoriesForDisplayLegacy(selectedProduct.categories)}
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
