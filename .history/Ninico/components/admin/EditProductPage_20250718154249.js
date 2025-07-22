'use client'

import { useState, useEffect, useRef } from 'react'
import { put } from '@/util/apiService'
import { PRODUCT } from '@/util/apiEndpoints'

export default function EditProductPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState({})
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    short_description: '',
    description: '',

    // Pricing
    price: '',
    compare_price: '',
    cost_price: '',
    sale_price: '',
    discount: '',

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

    // Categories & Tags
    categories: [],
    tags: [],

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
    tax_status: 'taxable',
    tax_class: '',

    // Other
    status: false,
    featured: false,
    manage_stock: false,
    sold_individually: false,
    reviews_allowed: true,
    note: '',
    purchase_note: '',
    menu_order: 0,
    enable_reviews: true,
    track_quantity: false
  })

  // Load product data on component mount
  useEffect(() => {
    const productData = localStorage.getItem('editProduct')
    if (productData) {
      try {
        const product = JSON.parse(productData)
        setFormData({
          ...formData,
          ...product,
          categories: product.categories || [],
          tags: product.tags || [],
          images: product.images || []
        })
      } catch (error) {
        console.error('Error loading product data:', error)
        setError('Failed to load product data')
      }
    } else {
      setError('No product data found')
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.name || !formData.price || formData.price <= 0) {
        throw new Error('Product name and valid price are required')
      }

      const response = await fetch(`http://localhost:5000/api/products/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'dummy-token'}`
        },
        body: JSON.stringify({
          name: formData.name,
          short_description: formData.short_description,
          description: formData.description,
          price: parseFloat(formData.price),
          compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
          cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
          sku: formData.sku,
          quantity: parseInt(formData.quantity) || 0,
          categories: formData.categories,
          tags: formData.tags,
          images: formData.images,
          status: formData.status,
          featured: formData.featured,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          requires_shipping: formData.requires_shipping,
          is_free_shipping: formData.is_free_shipping,
          track_quantity: formData.track_quantity
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update product')
      }

      // Clear localStorage
      localStorage.removeItem('editProduct')
      
      // Navigate back to products page
      onNavigate && onNavigate('products')
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    localStorage.removeItem('editProduct')
    onNavigate && onNavigate('products')
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button 
                className="btn btn-outline-secondary me-3"
                onClick={handleCancel}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Products
              </button>
              <h2 className="fw-bold text-dark mb-0 d-inline">Edit Product</h2>
            </div>
            <div className="d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="editProductForm"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Update Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <form id="editProductForm" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            {/* Basic Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Basic Information</h5>
              </div>
              <div className="card-body">
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
                
                <div className="mb-3">
                  <label className="form-label">Short Description</label>
                  <textarea
                    className="form-control"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Pricing</h5>
              </div>
              <div className="card-body">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Inventory</h5>
              </div>
              <div className="card-body">
                <div className="row">
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
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Product Status */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Product Status</h5>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    Published
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    Featured Product
                  </label>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="track_quantity"
                    checked={formData.track_quantity}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    Track Quantity
                  </label>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Product Images</h5>
              </div>
              <div className="card-body">
                {formData.images && formData.images.length > 0 ? (
                  <div className="row">
                    {formData.images.map((img, index) => (
                      <div key={index} className="col-6 mb-2">
                        <img 
                          src={img} 
                          alt={`Product ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
                    <p>No images uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
