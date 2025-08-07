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

    // New Retail Pricing Structure
    retailPrice: {
      mrp: '',
      sellingPrice: '',
      discount: 0,
      currency: 'INR'
    },

    // Corporate/Bulk Pricing
    corporatePricing: {
      enabled: false,
      minimumOrderQuantity: 1,
      priceTiers: [],
      customQuoteThreshold: ''
    },

    // Corporate Specific
    is_corporate_only: false,

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

    // Product Variations (for variable products)
    variations: [],

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
    tax_status: 'taxable',
    tax_class: '',

    // Additional Business Features
    safe_checkout: true,
    secure_checkout: true,
    social_share: true,
    encourage_order: false,
    encourage_view: false,

    // Enhanced Flags (extending existing)
    is_featured: false,
    is_popular: false,
    is_trending: false,
    is_return: false,

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
          // Safely handle arrays
          categories: product.categories || [],
          tags: product.tags || [],
          images: product.images || [],
          variations: product.variations || [],
          related_products: product.related_products || [],
          cross_sell_products: product.cross_sell_products || [],
          
          // Safely handle nested objects
          retailPrice: {
            mrp: product.retailPrice?.mrp || product.price || '',
            sellingPrice: product.retailPrice?.sellingPrice || product.price || '',
            discount: product.retailPrice?.discount || 0,
            currency: product.retailPrice?.currency || 'INR'
          },
          
          corporatePricing: {
            enabled: product.corporatePricing?.enabled || false,
            minimumOrderQuantity: product.corporatePricing?.minimumOrderQuantity || 1,
            priceTiers: product.corporatePricing?.priceTiers || [],
            customQuoteThreshold: product.corporatePricing?.customQuoteThreshold || ''
          },

          // Handle boolean flags with fallbacks
          is_corporate_only: product.is_corporate_only || false,
          safe_checkout: product.safe_checkout !== undefined ? product.safe_checkout : true,
          secure_checkout: product.secure_checkout !== undefined ? product.secure_checkout : true,
          social_share: product.social_share !== undefined ? product.social_share : true,
          encourage_order: product.encourage_order || false,
          encourage_view: product.encourage_view || false,
          is_random_related_products: product.is_random_related_products || false
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

      const response = await put(`${PRODUCT.UPDATE}/${formData._id}`, {
        // Basic fields
        name: formData.name,
        short_description: formData.short_description,
        description: formData.description,
        
        // Legacy pricing
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        discount: formData.discount,
        
        // New pricing structures
        retailPrice: formData.retailPrice,
        corporatePricing: formData.corporatePricing,
        
        // Inventory
        sku: formData.sku,
        quantity: parseInt(formData.quantity) || 0,
        stock_status: formData.stock_status,
        type: formData.type,
        unit: formData.unit,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        requires_shipping: formData.requires_shipping,
        available_from: formData.available_from,
        available_to: formData.available_to,
        
        // Product relations and variations
        variations: formData.variations,
        related_products: formData.related_products,
        cross_sell_products: formData.cross_sell_products,
        is_random_related_products: formData.is_random_related_products,
        
        // Categories and tags
        categories: formData.categories,
        tags: formData.tags,
        
        // Images
        images: formData.images,
        product_thumbnail_id: formData.product_thumbnail_id,
        product_galleries_id: formData.product_galleries_id,
        size_chart_image_id: formData.size_chart_image_id,
        
        // SEO
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        product_meta_image_id: formData.product_meta_image_id,
        
        // Shipping and tax
        is_free_shipping: formData.is_free_shipping,
        tax_id: formData.tax_id,
        estimated_delivery_text: formData.estimated_delivery_text,
        return_policy_text: formData.return_policy_text,
        
        // Flags
        is_featured: formData.is_featured,
        is_popular: formData.is_popular,
        is_trending: formData.is_trending,
        is_return: formData.is_return,
        status: formData.status,
        
        // Business features
        safe_checkout: formData.safe_checkout,
        secure_checkout: formData.secure_checkout,
        social_share: formData.social_share,
        encourage_order: formData.encourage_order,
        encourage_view: formData.encourage_view,
        
        // Corporate specific
        is_corporate_only: formData.is_corporate_only,
        
        // Legacy fields (for backward compatibility)
        featured: formData.featured,
        track_quantity: formData.track_quantity
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to update product')
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

            {/* Corporate & Business Features */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Corporate & Business Features</h5>
              </div>
              <div className="card-body">
                {/* Corporate Only Flag */}
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_corporate_only"
                    checked={formData.is_corporate_only}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    Corporate Only Product
                  </label>
                  <small className="form-text text-muted d-block">Only available to corporate users</small>
                </div>

                {/* Corporate Pricing Toggle */}
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="corporatePricing.enabled"
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
                  <label className="form-check-label">
                    Enable Corporate Pricing
                  </label>
                  <small className="form-text text-muted d-block">Bulk pricing tiers for corporate customers</small>
                </div>

                {/* Business Features */}
                <hr className="my-3" />
                <h6 className="fw-semibold mb-3">Business Features</h6>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="safe_checkout"
                        checked={formData.safe_checkout}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Safe Checkout</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="secure_checkout"
                        checked={formData.secure_checkout}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Secure Checkout</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="social_share"
                        checked={formData.social_share}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Social Share</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="encourage_order"
                        checked={formData.encourage_order}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Encourage Orders</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Product Flags */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-semibold">Product Flags</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Featured</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_popular"
                        checked={formData.is_popular}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Popular</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_trending"
                        checked={formData.is_trending}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Trending</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_return"
                        checked={formData.is_return}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small">Returnable</label>
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
