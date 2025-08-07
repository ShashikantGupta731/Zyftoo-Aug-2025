'use client'

import { useState, useEffect, useRef } from 'react'

export default function AddProductPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState({})
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    short_description: '',
    description: '',

    // Legacy Pricing (kept for backward compatibility)
    price: '',
    compare_price: '',
    cost_price: '',
    sale_price: '',
    discount: '',

    // New Retail Pricing Structure
    retailPrice: {
      mrp: '',
      sellingPrice: '',
      discount: 0,
      currency: 'INR'
    },

    // Corporate Pricing
    corporatePricing: {
      enabled: false,
      minimumOrderQuantity: 1,
      priceTiers: [],
      customQuoteThreshold: null
    },

    // Inventory
    sku: '',
    quantity: '',
    stock_status: 'in_stock',
    type: 'simple',
    unit: '',
    weight: '',
    requires_shipping: true,
    available_from: '',
    available_to: '',

    // Product Variations
    variations: [],

    // Categories & Tags
    categories: [],
    tags: [],

    // Product Relations
    related_products: [],
    cross_sell_products: [],
    is_random_related_products: false,

    // Images
    images: [],
    product_thumbnail_id: null,
    product_galleries_id: [],
    size_chart_image_id: null,

    // SEO
    meta_title: '',
    meta_description: '',
    product_meta_image_id: null,

    // Shipping & Tax
    is_free_shipping: false,
    tax_id: '',
    estimated_delivery_text: '',
    return_policy_text: '',

    // Flags
    is_featured: false,
    is_popular: false,
    is_trending: false,
    is_return: false,
    status: true,

    // New Business Features
    safe_checkout: true,
    secure_checkout: true,
    social_share: true,
    encourage_order: false,
    encourage_view: false,

    // Corporate Features
    is_corporate_only: false
  })

  // Refs for file inputs
  const imageInputs = {
    images: useRef(),
    product_thumbnail_id: useRef(),
    product_galleries_id: useRef(),
    size_chart_image_id: useRef(),
    product_meta_image_id: useRef(),
  }

  // Sample categories with subcategories - will be replaced with API data
  const [availableCategories, setAvailableCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // API base URL - try different ports/hosts for development
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  // Hardcoded admin token for testing
  const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MzI4MTMyMCwiZXhwIjoxNzUzODg2MTIwfQ.3wEx7ZCDvYtUQppFM9CcXjhG1zTQX9_RYY_dy3Y6MZs'

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
      setCategoriesLoading(true)
      console.log('Fetching categories from:', `${API_BASE_URL}/categories`)
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        credentials: 'include'
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched categories:', data)
      
      // Sort categories to show main categories first, then subcategories
      const sortedCategories = data.sort((a, b) => {
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
      
      setAvailableCategories(sortedCategories)
      setError('')
    } catch (err) {
      console.error('Fetch categories error:', err)
      setError('Failed to load categories: ' + err.message)
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Load categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const calculateDiscount = () => {
    const price = parseFloat(formData.price) || 0
    const comparePrice = parseFloat(formData.compare_price) || 0
    if (price && comparePrice && comparePrice > price) {
      const discount = ((comparePrice - price) / comparePrice * 100).toFixed(1)
      return `${discount}% off`
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Product name is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Product description is required')
      }
      if (!formData.price || formData.price <= 0) {
        throw new Error('Valid price is required')
      }
      if (!formData.categories || formData.categories.length === 0) {
        throw new Error('Please select at least one category')
      }
      
      // Prepare product data for backend
      const productData = {
        // Basic Info
        name: formData.name.trim(),
        description: formData.description.trim(),
        short_description: formData.short_description.trim(),
        
        // Legacy Pricing
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        discount: formData.discount || null,
        
        // New Retail Pricing
        retailPrice: formData.retailPrice,
        
        // Corporate Pricing
        corporatePricing: formData.corporatePricing,
        
        // Corporate Specific
        is_corporate_only: formData.is_corporate_only,
        
        // Inventory
        sku: formData.sku.trim() || null,
        quantity: formData.track_quantity ? parseInt(formData.quantity) || 0 : 0,
        stock_status: formData.track_quantity ? (parseInt(formData.quantity) > 0 ? 'in_stock' : 'out_of_stock') : 'in_stock',
        type: formData.type || 'simple',
        unit: formData.unit || null,
        weight: formData.requires_shipping ? parseFloat(formData.weight) || null : null,
        requires_shipping: formData.requires_shipping,
        available_from: formData.available_from || null,
        available_to: formData.available_to || null,
        
        // Product Variations
        variations: formData.variations || [],
        
        // Categories & Tags
        categories: formData.categories.filter(Boolean),
        tags: formData.tags || [],
        
        // Product Relations
        related_products: formData.related_products || [],
        cross_sell_products: formData.cross_sell_products || [],
        is_random_related_products: formData.is_random_related_products,
        
        // Images
        images: formData.images || [],
        product_thumbnail_id: formData.product_thumbnail_id || null,
        product_galleries_id: formData.product_galleries_id || [],
        size_chart_image_id: formData.size_chart_image_id || null,
        product_meta_image_id: formData.product_meta_image_id || null,
        
        // SEO
        meta_title: formData.meta_title.trim() || formData.name.trim(),
        meta_description: formData.meta_description.trim(),
        
        // Shipping & Tax
        is_free_shipping: formData.is_free_shipping,
        tax_id: formData.tax_id && formData.tax_id !== '' && formData.tax_id !== 'tax1' ? formData.tax_id : null,
        estimated_delivery_text: formData.estimated_delivery_text || null,
        return_policy_text: formData.return_policy_text || null,
        
        // Flags
        is_featured: formData.is_featured,
        is_popular: formData.is_popular,
        is_trending: formData.is_trending,
        is_return: formData.is_return,
        status: formData.status,
        
        // Additional Business Features
        safe_checkout: formData.safe_checkout,
        secure_checkout: formData.secure_checkout,
        social_share: formData.social_share,
        encourage_order: formData.encourage_order,
        encourage_view: formData.encourage_view
      }
      
      console.log('Submitting product data:', productData)
      
      // Send to backend API
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || 'Failed to save product')
      }
      
      const savedProduct = await response.json()
      console.log('Product saved successfully:', savedProduct)
      
      // Show success message
      alert('Product saved successfully!')
      
      // Reset form or navigate back
      if (onNavigate) {
        onNavigate('products')
      }
    } catch (err) {
      console.error('Product save error:', err)
      setError('Failed to save product: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderBasicInfoTab = () => (
    <div className="row">
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Product Name *</label>
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
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Short Description</label>
          <textarea
            className="form-control"
            name="short_description"
            value={formData.short_description}
            onChange={handleInputChange}
            rows="2"
            placeholder="Brief product summary for listings"
          />
        </div>
      </div>
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            placeholder="Detailed product description"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderPricingInventoryTab = () => (
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Price *</label>
          <div className="input-group">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Compare at Price</label>
          <div className="input-group">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="compare_price"
              value={formData.compare_price}
              onChange={handleInputChange}
              placeholder="Original price"
            />
          </div>
          {calculateDiscount() && (
            <div className="form-text text-success fw-bold">{calculateDiscount()}</div>
          )}
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Cost per Item</label>
          <div className="input-group">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleInputChange}
              placeholder="Your cost"
            />
          </div>
          <div className="form-text">Customers won't see this</div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            type="text"
            className="form-control"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="Stock keeping unit"
          />
        </div>
      </div>
      
      <div className="col-12">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="track_quantity"
              checked={formData.track_quantity}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Track quantity</label>
          </div>
        </div>
      </div>
      
      {formData.track_quantity && (
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderCategoriesTab = () => (
    <div className="row">
      {error && (
        <div className="col-12 mb-3">
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
        </div>
      )}
      
      {categoriesLoading ? (
        <div className="col-12">
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading categories...</span>
            </div>
            <p className="mt-2 text-muted">Loading categories...</p>
          </div>
        </div>
      ) : availableCategories.length === 0 ? (
        <div className="col-12">
          <div className="border rounded p-4 text-center">
            <i className="bi bi-grid text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3 mb-2">No Categories Available</h5>
            <p className="text-muted mb-3">You need to create categories before adding products.</p>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate && onNavigate('categories')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Categories
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Category Selection */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h6 className="mb-0">Select Category</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Categories *</label>
                  <select
                    className="form-select"
                    multiple
                    size="8"
                    value={formData.categories}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      setFormData(prev => ({
                        ...prev,
                        categories: selectedOptions
                      }))
                    }}
                    required
                  >
                    {availableCategories.map(category => (
                      <option key={category._id} value={category._id}>
                        {formatCategoryHierarchy(category)}
                        {category.description && ` - ${category.description}`}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">Hold Ctrl/Cmd to select multiple categories. Main categories and subcategories are both available.</div>
                  
                  {formData.categories.length > 0 && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Selected {formData.categories.length} categories
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected Categories Display */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h6 className="mb-0">Selected Categories</h6>
              </div>
              <div className="card-body">
                {formData.categories.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-grid text-muted" style={{ fontSize: '2rem' }}></i>
                    <p className="text-muted mt-2 mb-0">No categories selected</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.categories.map(categoryId => {
                        const category = availableCategories.find(cat => cat._id === categoryId)
                        if (!category) return null
                        return (
                          <div key={category._id} className="d-flex align-items-center p-2 bg-primary bg-opacity-10 rounded">
                            {category.image?.url && (
                              <img 
                                src={category.image.url} 
                                alt={category.name}
                                className="rounded me-2"
                                style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <div className="fw-semibold text-primary">{formatCategoryHierarchy(category)}</div>
                              {category.description && (
                                <small className="text-muted">{category.description}</small>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Category Management Link */}
          <div className="col-12 mt-3">
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
              <div>
                <h6 className="mb-1">Need to manage categories?</h6>
                <small className="text-muted">Add, edit, or organize your product categories</small>
              </div>
              <button 
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => onNavigate && onNavigate('categories')}
              >
                <i className="bi bi-gear me-2"></i>
                Manage Categories
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  // Helper for image upload with enhanced features
  const handleImageUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    console.log('Uploading images for field:', field, 'Files:', files.length);
    setError(''); // Clear previous errors
    setUploadingImages(prev => ({ ...prev, [field]: true }));

    // Validate files
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`);
        setUploadingImages(prev => ({ ...prev, [field]: false }));
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} has unsupported format. Please use JPG, PNG, WebP, or GIF.`);
        setUploadingImages(prev => ({ ...prev, [field]: false }));
        return;
      }
    }

    try {
      // For galleries/images, allow multiple; for others, only one
      if (field === 'images' || field === 'product_galleries_id') {
        let uploadedUrls = [];
        for (const file of files) {
          const formDataObj = new FormData();
          formDataObj.append('image', file);
          
          console.log('Uploading file:', file.name, 'to endpoint:', `${API_BASE_URL}/upload/product-images`);
          
          const res = await fetch(`${API_BASE_URL}/upload/product-images`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
            body: formDataObj
          });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(errorData.message || 'Upload failed');
          }
          
          const data = await res.json();
          console.log('Upload response:', data);
          uploadedUrls.push(data.url);
        }
        setFormData(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), ...uploadedUrls]
        }));
      } else {
        // Single file upload for thumbnails, size charts, meta images
        const formDataObj = new FormData();
        formDataObj.append('image', files[0]);
        
        let endpoint;
        switch(field) {
          case 'product_thumbnail_id':
            endpoint = '/upload/product-thumbnail';
            break;
          case 'size_chart_image_id':
            endpoint = '/upload/size-chart';
            break;
          case 'product_meta_image_id':
            endpoint = '/upload/meta-image';
            break;
          default:
            endpoint = '/upload/product-images';
        }
        
        console.log('Uploading single file:', files[0].name, 'to endpoint:', `${API_BASE_URL}${endpoint}`);
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
          body: formDataObj
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Upload failed' }));
          throw new Error(errorData.message || 'Upload failed');
        }
        
        const data = await res.json();
        console.log('Upload response:', data);
        setFormData(prev => ({
          ...prev,
          [field]: data.url
        }));
      }
      
      // Clear the file input after successful upload
      if (e.target) {
        e.target.value = '';
      }
      
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Image upload failed: ' + err.message);
    } finally {
      setUploadingImages(prev => ({ ...prev, [field]: false }));
    }
  };

  const renderImagesTab = () => (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Image Guidelines:</strong> Upload high-quality images (JPG, PNG, WebP, GIF). Maximum file size: 10MB per image.
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-images me-2"></i>
            Product Images
          </label>
          <div className="upload-zone border-2 border-dashed rounded p-3 text-center">
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              multiple 
              ref={imageInputs.images} 
              onChange={e => handleImageUpload(e, 'images')}
              disabled={uploadingImages.images}
            />
            {uploadingImages.images && (
              <div className="mt-2">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <small className="text-primary">Uploading images...</small>
              </div>
            )}
          </div>
          <div className="form-text mt-2">
            <i className="bi bi-upload me-1"></i>
            Upload multiple images. First image will be the main product image.
          </div>
          
          {/* Image Previews */}
          {formData.images && formData.images.length > 0 && (
            <div className="mt-3">
              <h6 className="fw-semibold mb-2">Uploaded Images ({formData.images.length})</h6>
              <div className="row g-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="col-4">
                    <div className="position-relative">
                      <img 
                        src={img} 
                        alt={`Product ${i+1}`} 
                        className="w-100 rounded border"
                        style={{height: '100px', objectFit: 'cover'}}
                      />
                      {i === 0 && (
                        <span className="position-absolute top-0 start-0 badge bg-primary m-1">
                          Main
                        </span>
                      )}
                      <button 
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))}
                        title="Remove image"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-image me-2"></i>
            Product Thumbnail
          </label>
          <div className="upload-zone border-2 border-dashed rounded p-3 text-center">
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              ref={imageInputs.product_thumbnail_id} 
              onChange={e => handleImageUpload(e, 'product_thumbnail_id')}
              disabled={uploadingImages.product_thumbnail_id}
            />
            {uploadingImages.product_thumbnail_id && (
              <div className="mt-2">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <small className="text-primary">Uploading thumbnail...</small>
              </div>
            )}
          </div>
          <div className="form-text">Main thumbnail for product listings</div>
          {formData.product_thumbnail_id && (
            <div className="mt-3">
              <div className="position-relative d-inline-block">
                <img 
                  src={formData.product_thumbnail_id} 
                  alt="Thumbnail" 
                  className="rounded border"
                  style={{width: '120px', height: '120px', objectFit: 'cover'}}
                />
                <button 
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  onClick={() => setFormData(prev => ({...prev, product_thumbnail_id: null}))}
                  title="Remove thumbnail"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-collection me-2"></i>
            Product Galleries
          </label>
          <div className="upload-zone border-2 border-dashed rounded p-3 text-center">
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              multiple 
              ref={imageInputs.product_galleries_id} 
              onChange={e => handleImageUpload(e, 'product_galleries_id')}
              disabled={uploadingImages.product_galleries_id}
            />
            {uploadingImages.product_galleries_id && (
              <div className="mt-2">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <small className="text-primary">Uploading gallery images...</small>
              </div>
            )}
          </div>
          <div className="form-text">Additional gallery images</div>
          {formData.product_galleries_id && formData.product_galleries_id.length > 0 && (
            <div className="mt-3">
              <div className="row g-2">
                {formData.product_galleries_id.map((img, i) => (
                  <div key={i} className="col-6">
                    <div className="position-relative">
                      <img 
                        src={img} 
                        alt={`Gallery ${i+1}`} 
                        className="w-100 rounded border"
                        style={{height: '80px', objectFit: 'cover'}}
                      />
                      <button 
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => setFormData(prev => ({...prev, product_galleries_id: prev.product_galleries_id.filter((_, idx) => idx !== i)}))}
                        title="Remove image"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-rulers me-2"></i>
            Size Chart Image
          </label>
          <div className="upload-zone border-2 border-dashed rounded p-3 text-center">
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              ref={imageInputs.size_chart_image_id} 
              onChange={e => handleImageUpload(e, 'size_chart_image_id')}
              disabled={uploadingImages.size_chart_image_id}
            />
            {uploadingImages.size_chart_image_id && (
              <div className="mt-2">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <small className="text-primary">Uploading size chart...</small>
              </div>
            )}
          </div>
          <div className="form-text">Size guide for customers</div>
          {formData.size_chart_image_id && (
            <div className="mt-3">
              <div className="position-relative d-inline-block">
                <img 
                  src={formData.size_chart_image_id} 
                  alt="Size Chart" 
                  className="rounded border"
                  style={{width: '120px', height: '120px', objectFit: 'cover'}}
                />
                <button 
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  onClick={() => setFormData(prev => ({...prev, size_chart_image_id: null}))}
                  title="Remove size chart"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="bi bi-share me-2"></i>
            Meta Image
          </label>
          <div className="upload-zone border-2 border-dashed rounded p-3 text-center">
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              ref={imageInputs.product_meta_image_id} 
              onChange={e => handleImageUpload(e, 'product_meta_image_id')}
              disabled={uploadingImages.product_meta_image_id}
            />
            {uploadingImages.product_meta_image_id && (
              <div className="mt-2">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <small className="text-primary">Uploading meta image...</small>
              </div>
            )}
          </div>
          <div className="form-text">Image for social media sharing</div>
          {formData.product_meta_image_id && (
            <div className="mt-3">
              <div className="position-relative d-inline-block">
                <img 
                  src={formData.product_meta_image_id} 
                  alt="Meta Image" 
                  className="rounded border"
                  style={{width: '120px', height: '120px', objectFit: 'cover'}}
                />
                <button 
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  onClick={() => setFormData(prev => ({...prev, product_meta_image_id: null}))}
                  title="Remove meta image"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCorporatePricingTab = () => (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Corporate Pricing:</strong> Configure bulk pricing for corporate customers. This allows you to offer different pricing tiers based on quantity.
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.corporatePricing.enabled}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  corporatePricing: {
                    ...prev.corporatePricing,
                    enabled: e.target.checked
                  }
                }))
              }}
            />
            <label className="form-check-label">Enable Corporate Pricing</label>
          </div>
          <div className="form-text">Allow corporate customers to see bulk pricing</div>
        </div>
      </div>
      
      {formData.corporatePricing.enabled && (
        <>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Minimum Order Quantity</label>
              <input
                type="number"
                className="form-control"
                value={formData.corporatePricing.minimumOrderQuantity}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    corporatePricing: {
                      ...prev.corporatePricing,
                      minimumOrderQuantity: parseInt(e.target.value) || 1
                    }
                  }))
                }}
                min="1"
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Custom Quote Threshold</label>
              <input
                type="number"
                className="form-control"
                value={formData.corporatePricing.customQuoteThreshold || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    corporatePricing: {
                      ...prev.corporatePricing,
                      customQuoteThreshold: e.target.value ? parseInt(e.target.value) : null
                    }
                  }))
                }}
                placeholder="Quantity above which to show 'Request Quote'"
              />
              <div className="form-text">Leave empty for no threshold</div>
            </div>
          </div>
          
          <div className="col-12">
            <div className="mb-3">
              <label className="form-label">Price Tiers</label>
              <div className="card">
                <div className="card-body">
                  <p className="text-muted mb-3">Configure pricing tiers for different quantities</p>
                  {/* Price tiers will be implemented here */}
                  <div className="text-center py-3">
                    <button type="button" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Price Tier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_corporate_only"
              checked={formData.is_corporate_only}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Corporate Only Product</label>
          </div>
          <div className="form-text">This product is only available to corporate customers</div>
        </div>
      </div>
    </div>
  )

  const renderProductVariationsTab = () => (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Product Variations:</strong> Create different versions of this product (e.g., different sizes, colors, materials).
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Product Type</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="simple">Simple Product</option>
            <option value="variable">Variable Product</option>
            <option value="grouped">Grouped Product</option>
          </select>
          <div className="form-text">Simple: Single product. Variable: Multiple variations. Grouped: Multiple products sold together.</div>
        </div>
      </div>
      
      {formData.type === 'variable' && (
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Product Variations</h6>
            </div>
            <div className="card-body">
              <p className="text-muted">Variations will be implemented here</p>
              <div className="text-center py-3">
                <button type="button" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Variation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderProductRelationsTab = () => (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Product Relations:</strong> Link related products and cross-sell items to increase sales.
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Related Products</label>
          <select
            className="form-select"
            multiple
            size="6"
            value={formData.related_products}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
              setFormData(prev => ({
                ...prev,
                related_products: selectedOptions
              }))
            }}
          >
            <option value="" disabled>Select related products...</option>
            {/* Product options will be loaded here */}
          </select>
          <div className="form-text">Products that customers might also be interested in</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Cross-Sell Products</label>
          <select
            className="form-select"
            multiple
            size="6"
            value={formData.cross_sell_products}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
              setFormData(prev => ({
                ...prev,
                cross_sell_products: selectedOptions
              }))
            }}
          >
            <option value="" disabled>Select cross-sell products...</option>
            {/* Product options will be loaded here */}
          </select>
          <div className="form-text">Products to suggest during checkout</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_random_related_products"
              checked={formData.is_random_related_products}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Show Random Related Products</label>
          </div>
          <div className="form-text">Display random related products instead of fixed ones</div>
        </div>
      </div>
    </div>
  )

  const renderBusinessFeaturesTab = () => (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Business Features:</strong> Configure checkout experience and social sharing options.
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="safe_checkout"
              checked={formData.safe_checkout}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Safe Checkout</label>
          </div>
          <div className="form-text">Display safe checkout badges</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="secure_checkout"
              checked={formData.secure_checkout}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Secure Checkout</label>
          </div>
          <div className="form-text">Display secure checkout indicators</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="social_share"
              checked={formData.social_share}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Enable Social Sharing</label>
          </div>
          <div className="form-text">Allow customers to share this product</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="encourage_order"
              checked={formData.encourage_order}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Encourage Order</label>
          </div>
          <div className="form-text">Show urgency messages to encourage purchase</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="encourage_view"
              checked={formData.encourage_view}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Encourage View</label>
          </div>
          <div className="form-text">Show messages to encourage product viewing</div>
        </div>
      </div>
    </div>
  )

  const renderShippingTab = () => (
    <div className="row">
      <div className="col-12">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="requires_shipping"
              checked={formData.requires_shipping}
              onChange={handleInputChange}
            />
            <label className="form-check-label">This is a physical product</label>
          </div>
        </div>
      </div>
      
      {formData.requires_shipping && (
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Weight</label>
            <div className="input-group">
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
              />
              <span className="input-group-text">kg</span>
            </div>
            <div className="form-text">Used to calculate shipping rates</div>
          </div>
        </div>
      )}
      
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Tax</label>
          <select
            className="form-select"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleInputChange}
          >
            <option value="">No tax</option>
            <option value="tax1">GST 18%</option>
            <option value="tax2">GST 12%</option>
            <option value="tax3">GST 5%</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderSeoSettingsTab = () => (
    <div className="row">
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Meta Title</label>
          <input
            type="text"
            className="form-control"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleInputChange}
            placeholder="Leave blank to use product name"
          />
        </div>
      </div>
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Meta Description</label>
          <textarea
            className="form-control"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleInputChange}
            rows="3"
            placeholder="Brief description for search engines"
          />
        </div>
      </div>
      
      <div className="col-12">
        <hr className="my-4" />
        <h6 className="fw-semibold mb-3">Product Status</h6>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="status"
              checked={formData.status}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Published</label>
          </div>
          <div className="form-text">Uncheck to save as draft</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Featured Product</label>
          </div>
          <div className="form-text">Show in featured products section</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_popular"
              checked={formData.is_popular}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Popular Product</label>
          </div>
          <div className="form-text">Show in popular products section</div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_trending"
              checked={formData.is_trending}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Trending Product</label>
          </div>
          <div className="form-text">Show in trending products section</div>
        </div>
      </div>
    </div>
  )



  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'bi-info-circle' },
    { id: 'pricing', label: 'Pricing & Inventory', icon: 'bi-currency-dollar' },
    { id: 'corporate', label: 'Corporate Pricing', icon: 'bi-building' },
    { id: 'categories', label: 'Categories', icon: 'bi-grid' },
    { id: 'variations', label: 'Variations', icon: 'bi-collection' },
    { id: 'relations', label: 'Product Relations', icon: 'bi-link' },
    { id: 'images', label: 'Images', icon: 'bi-image' },
    { id: 'shipping', label: 'Shipping & Tax', icon: 'bi-truck' },
    { id: 'business', label: 'Business Features', icon: 'bi-gear' },
    { id: 'seo', label: 'SEO & Settings', icon: 'bi-search' }
  ]

  const uploadEndpoints = {
    images: '/upload/product-image',
    product_thumbnail_id: '/upload/thumbnail-image',
    product_galleries_id: '/upload/product-galleries',
    size_chart_image_id: '/upload/size-chart',
    product_meta_image_id: '/upload/meta-image'
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Add New Product</h2>
              <p className="text-muted mb-0">Create a new product for your store</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => onNavigate && onNavigate('products')}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button type="submit" form="productForm" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
              <button 
                type="button" 
                className="btn-close ms-auto" 
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      <form id="productForm" onSubmit={handleSubmit}>
        <div className="row">
          {/* Sidebar with tabs */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h6 className="mb-0 fw-semibold">Product Details</h6>
              </div>
              <div className="card-body p-0">
                <div className="nav nav-pills flex-column">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`nav-link text-start border-0 rounded-0 ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`${tab.icon} me-2`}></i>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="col-md-9">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h6 className="mb-0 fw-semibold">
                  <i className={`${tabs.find(t => t.id === activeTab)?.icon} me-2`}></i>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h6>
              </div>
              <div className="card-body">
                {activeTab === 'basic' && renderBasicInfoTab()}
                {activeTab === 'pricing' && renderPricingInventoryTab()}
                {activeTab === 'corporate' && renderCorporatePricingTab()}
                {activeTab === 'categories' && renderCategoriesTab()}
                {activeTab === 'variations' && renderProductVariationsTab()}
                {activeTab === 'relations' && renderProductRelationsTab()}
                {activeTab === 'images' && renderImagesTab()}
                {activeTab === 'shipping' && renderShippingTab()}
                {activeTab === 'business' && renderBusinessFeaturesTab()}
                {activeTab === 'seo' && renderSeoSettingsTab()}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
