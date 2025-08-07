'use client'

import { useState, useEffect, useRef } from 'react'

export default function BulkUploadPage({ onNavigate }) {
  const [loading, setLoading] = useState(false)
  const [uploadType, setUploadType] = useState('json') // json, csv, excel
  const [productsData, setProductsData] = useState('')
  const [csvFile, setCsvFile] = useState(null)
  const [excelFile, setExcelFile] = useState(null)
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [defaultCategory, setDefaultCategory] = useState('')
  const [defaultSubcategories, setDefaultSubcategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const fileInputRef = useRef()
  
  // Add state for default images
  const [defaultImages, setDefaultImages] = useState({
    images: [],
    product_thumbnail_id: null,
    product_galleries_id: [],
    size_chart_image_id: null,
    product_meta_image_id: null
  })
  const [uploadingDefaultImages, setUploadingDefaultImages] = useState({})

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  const getAdminToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('authToken') || ''
  }

  // Fetch categories and subcategories on mount
  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const token = getAdminToken()
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const categoriesData = data.data || data
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchSubcategories = async () => {
    try {
      setSubcategoriesLoading(true)
      const token = getAdminToken()
      const response = await fetch(`${API_BASE_URL}/subcategories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const subcategoriesData = data.data || data
        setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : [])
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
    } finally {
      setSubcategoriesLoading(false)
    }
  }

  // Helper functions for categories
  const getMainCategories = () => {
    return categories.filter(cat => !cat.parent)
  }

  const getSubcategoriesForCategory = (parentId) => {
    return subcategories.filter(subcat => {
      if (subcat.parent) {
        if (typeof subcat.parent === 'object' && subcat.parent._id) {
          return subcat.parent._id === parentId
        } else if (typeof subcat.parent === 'string') {
          return subcat.parent === parentId
        } else if (typeof subcat.parent === 'object' && subcat.parent.id) {
          return subcat.parent.id === parentId
        }
      }
      return false
    })
  }

  const handleCategoryChange = (categoryId) => {
    setDefaultCategory(categoryId)
    setDefaultSubcategories([]) // Clear subcategories when main category changes
  }

  const handleSubcategoryChange = (subcategoryIds) => {
    setDefaultSubcategories(subcategoryIds)
  }

  // Add helper function to resize image to thumbnail
  const resizeImageToThumbnail = async (imageUrl, width = 300, height = 300) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        // Calculate aspect ratio and center the image
        const imgAspect = img.width / img.height
        const canvasAspect = width / height
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0
        
        if (imgAspect > canvasAspect) {
          // Image is wider - fit by height
          drawHeight = height
          drawWidth = height * imgAspect
          offsetX = -(drawWidth - width) / 2
        } else {
          // Image is taller - fit by width
          drawWidth = width
          drawHeight = width / imgAspect
          offsetY = -(drawHeight - height) / 2
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
        
        canvas.toBlob(blob => {
          if (blob) {
            // Upload resized blob to server
            const token = getAdminToken()
            const formData = new FormData()
            formData.append('image', blob, 'thumbnail.jpg')
            
            fetch(`${API_BASE_URL}/upload/product-thumbnail`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData
            })
              .then(res => {
                if (!res.ok) {
                  throw new Error('Failed to upload thumbnail')
                }
                return res.json()
              })
              .then(data => resolve(data.url))
              .catch(reject)
          } else {
            reject(new Error('Failed to create thumbnail blob'))
          }
        }, 'image/jpeg', 0.85)
      }
      img.onerror = () => reject(new Error('Failed to load image for thumbnail creation'))
      img.src = imageUrl
    })
  }

  // Image upload functions - matching AddProductPage exactly
  const handleDefaultImageUpload = async (e, field) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    console.log('Uploading images for field:', field, 'Files:', files.length)
    setUploadingDefaultImages(prev => ({ ...prev, [field]: true }))
    
    const token = getAdminToken()
    if (!token) {
      alert('No admin token found. Please login again.')
      setUploadingDefaultImages(prev => ({ ...prev, [field]: false }))
      return
    }

    // Validate files
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    for (const file of files) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        setUploadingDefaultImages(prev => ({ ...prev, [field]: false }))
        return
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has unsupported format. Please use JPG, PNG, WebP, or GIF.`)
        setUploadingDefaultImages(prev => ({ ...prev, [field]: false }))
        return
      }
    }

    try {
      // For multiple image fields
      if (field === 'images' || field === 'product_galleries_id') {
        const uploadedUrls = []
        for (const file of files) {
          const formData = new FormData()
          formData.append('image', file)
          
          console.log('Uploading file:', file.name, 'to endpoint:', `${API_BASE_URL}/upload/product-images`)
          
          const response = await fetch(`${API_BASE_URL}/upload/product-images`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}` 
            },
            body: formData
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Upload failed' }))
            throw new Error(errorData.message || 'Upload failed')
          }
          
          const data = await response.json()
          console.log('Upload response:', data)
          uploadedUrls.push(data.url)
        }
        
        setDefaultImages(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), ...uploadedUrls]
        }))
      } else {
        // Single image fields
        const formData = new FormData()
        formData.append('image', files[0])
        
        // Use the same endpoint mapping as AddProductPage
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
        
        console.log('Uploading single file:', files[0].name, 'to endpoint:', `${API_BASE_URL}${endpoint}`)
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}` 
          },
          body: formData
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Upload failed' }))
          throw new Error(errorData.message || 'Upload failed')
        }
        
        const data = await response.json()
        console.log('Upload response:', data)
        setDefaultImages(prev => ({
          ...prev,
          [field]: data.url
        }))
      }
      
      // Clear the file input after successful upload
      if (e.target) {
        e.target.value = ''
      }
      
    } catch (error) {
      console.error('Image upload error:', error)
      alert(`Failed to upload image for ${field}: ${error.message}`)
    } finally {
      setUploadingDefaultImages(prev => ({ ...prev, [field]: false }))
    }
  }

  const removeDefaultImage = (field, indexOrUrl = null) => {
    if (field === 'images' || field === 'product_galleries_id') {
      // Remove specific image from array
      setDefaultImages(prev => ({
        ...prev,
        [field]: prev[field].filter((_, index) => index !== indexOrUrl)
      }))
    } else {
      // Clear single image
      setDefaultImages(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const product = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        // Convert numeric fields
        if (['price', 'compare_price', 'cost_price', 'quantity', 'weight'].includes(header)) {
          product[header] = value ? parseFloat(value) : 0
        }
        // Convert boolean fields
        else if (['status', 'is_featured', 'is_popular', 'is_trending', 'requires_shipping'].includes(header)) {
          product[header] = value.toLowerCase() === 'true' || value === '1'
        }
        // Convert array fields
        else if (['categories', 'tags', 'images'].includes(header)) {
          product[header] = value ? value.split(';').map(v => v.trim()).filter(Boolean) : []
        }
        else {
          product[header] = value
        }
      })
      
      return product
    })
  }

  const parseExcel = async (file) => {
    // For Excel parsing, we'll need to use a library like xlsx
    // For now, return a placeholder
    return []
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileType = file.name.split('.').pop().toLowerCase()
    
    if (fileType === 'csv') {
      setCsvFile(file)
      setUploadType('csv')
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const csvData = event.target.result
        const products = parseCSV(csvData)
        setProductsData(JSON.stringify(products, null, 2))
      }
      reader.readAsText(file)
    } else if (['xlsx', 'xls'].includes(fileType)) {
      setExcelFile(file)
      setUploadType('excel')
      // Handle Excel parsing here
    }
  }

  const validateProduct = (product) => {
    const errors = []
    
    if (!product.name || !product.name.trim()) {
      errors.push('Product name is required')
    }
    
    if (!product.price || product.price <= 0) {
      errors.push('Valid price is required')
    }
    
    if (!product.description) {
      errors.push('Description is required')
    }
    
    return errors
  }

  const handleBulkUpload = async () => {
    setLoading(true)
    setResults([])
    setProcessedCount(0)
    
    try {
      // Parse products data
      let products = []
      
      if (uploadType === 'json') {
        products = JSON.parse(productsData)
      } else if (uploadType === 'csv' && csvFile) {
        const csvText = await csvFile.text()
        products = parseCSV(csvText)
      } else if (uploadType === 'excel' && excelFile) {
        products = await parseExcel(excelFile)
      }
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid data format. Expected an array of products.')
      }
      
      setTotalCount(products.length)
      const token = getAdminToken()
      
      if (!token) {
        throw new Error('No admin token found. Please login again.')
      }
      
      // Process each product
      for (let i = 0; i < products.length; i++) {
        const product = products[i]
        
        try {
          // Validate required fields (same as AddProductPage)
          if (!product.name || !product.name.trim()) {
            throw new Error('Product name is required')
          }
          if (!product.description) {
            throw new Error('Product description is required')
          }
          if (!product.price || product.price <= 0) {
            throw new Error('Valid price is required')
          }
          if (!defaultCategory && (!product.categories || product.categories.length === 0)) {
            throw new Error('Please select at least one category')
          }
          
          // Determine main image URL for thumbnail generation
          const mainImageUrl = (product.images && product.images.length > 0)
            ? product.images[0]
            : (defaultImages.images && defaultImages.images.length > 0 ? defaultImages.images[0] : null)

          // Generate thumbnail from first image if no thumbnail is provided
          let thumbnailUrl = product.product_thumbnail_id || defaultImages.product_thumbnail_id || null
          
          if (!thumbnailUrl && mainImageUrl) {
            try {
              console.log('Generating thumbnail from image:', mainImageUrl)
              thumbnailUrl = await resizeImageToThumbnail(mainImageUrl)
              console.log('Generated thumbnail URL:', thumbnailUrl)
            } catch (error) {
              console.error('Failed to generate thumbnail:', error)
              // Continue without thumbnail if generation fails
            }
          }
          
          // Prepare product data - EXACTLY matching AddProductPage structure
          const productData = {
            // Basic Info
            name: product.name.trim(),
            description: product.description.trim(),
            short_description: product.short_description?.trim() || '',
            
            // Legacy Pricing (required for backward compatibility)
            price: parseFloat(product.price),
            compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
            cost_price: product.cost_price ? parseFloat(product.cost_price) : null,
            sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
            discount: product.discount || null,
            
            // New Retail Pricing Structure
            retailPrice: {
              mrp: product.retailPrice?.mrp || product.mrp || parseFloat(product.price),
              sellingPrice: product.retailPrice?.sellingPrice || product.sellingPrice || parseFloat(product.price),
              discount: product.retailPrice?.discount || product.retailDiscount || 0,
              currency: product.retailPrice?.currency || product.currency || 'INR'
            },
            
            // Corporate Pricing Structure
            corporatePricing: {
              enabled: product.corporatePricing?.enabled || product.corporatePricingEnabled || false,
              minimumOrderQuantity: product.corporatePricing?.minimumOrderQuantity || product.minimumOrderQuantity || 1,
              priceTiers: product.corporatePricing?.priceTiers || product.priceTiers || [],
              customQuoteThreshold: product.corporatePricing?.customQuoteThreshold || product.customQuoteThreshold || null
            },
            
            // Corporate Specific
            is_corporate_only: product.is_corporate_only || false,
            
            // Inventory
            sku: product.sku?.trim() || null,
            quantity: product.track_quantity ? parseInt(product.quantity) || 0 : parseInt(product.quantity) || 0,
            stock_status: product.track_quantity ? 
              (parseInt(product.quantity) > 0 ? 'in_stock' : 'out_of_stock') : 
              (product.stock_status || 'in_stock'),
            type: product.type || 'simple',
            unit: product.unit || null,
            weight: product.requires_shipping !== false ? parseFloat(product.weight) || null : null,
            requires_shipping: product.requires_shipping !== false,
            available_from: product.available_from || null,
            available_to: product.available_to || null,
            
            // Product Variations
            variations: product.variations || [],
            
            // Categories & Tags - Combine selected category and subcategories
            categories: product.categories || (defaultCategory ? [defaultCategory, ...defaultSubcategories].filter(Boolean) : []),
            tags: product.tags || [],
            
            // Product Relations
            related_products: product.related_products || [],
            cross_sell_products: product.cross_sell_products || [],
            is_random_related_products: product.is_random_related_products || false,
            
            // Images - use product images or default images, with auto-generated thumbnail
            images: product.images || defaultImages.images || [],
            product_thumbnail_id: thumbnailUrl,
            product_galleries_id: product.product_galleries_id || defaultImages.product_galleries_id || [],
            size_chart_image_id: product.size_chart_image_id || defaultImages.size_chart_image_id || null,
            product_meta_image_id: product.product_meta_image_id || defaultImages.product_meta_image_id || null,
            
            // SEO
            meta_title: product.meta_title?.trim() || product.name.trim(),
            meta_description: product.meta_description?.trim() || '',
            
            // Shipping & Tax
            is_free_shipping: product.is_free_shipping || false,
            tax_id: product.tax_id && product.tax_id !== '' && product.tax_id !== 'tax1' ? product.tax_id : null,
            estimated_delivery_text: product.estimated_delivery_text || null,
            return_policy_text: product.return_policy_text || null,
            
            // Flags
            is_featured: product.is_featured || false,
            is_popular: product.is_popular || false,
            is_trending: product.is_trending || false,
            is_return: product.is_return || false,
            status: product.status !== undefined ? product.status : true,
            
            // Additional Business Features
            safe_checkout: product.safe_checkout !== undefined ? product.safe_checkout : true,
            secure_checkout: product.secure_checkout !== undefined ? product.secure_checkout : true,
            social_share: product.social_share !== undefined ? product.social_share : true,
            encourage_order: product.encourage_order || false,
            encourage_view: product.encourage_view || false,
            
            // Reviews & Ratings (defaults for new products)
            reviews: [],
            rating: 0,
            numReviews: 0,
            
            // Sales Analytics (defaults for new products)
            sales_count: 0,
            
            // Analytics (defaults for new products)
            analytics: {
              views: {
                total: 0,
                individual: 0,
                corporate: 0,
                anonymous: 0
              },
              lastViewed: null,
              popularityScore: 0,
              dailyViews: [],
              weeklyViews: 0,
              monthlyViews: 0
            }
          }
          
          // Send to backend API - matching AddProductPage exactly
          console.log('Submitting product data:', productData)
          
          const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || errorData.error || 'Failed to save product')
          }
          
          const savedProduct = await response.json()
          console.log('Product saved successfully:', savedProduct)
          
          setResults(prev => [...prev, {
            index: i + 1,
            name: product.name,
            success: true,
            message: 'Uploaded successfully',
            productId: savedProduct.data?._id || savedProduct._id
          }])
          
        } catch (error) {
          setResults(prev => [...prev, {
            index: i + 1,
            name: product.name || `Product ${i + 1}`,
            success: false,
            message: error.message
          }])
        }
        
        setProcessedCount(i + 1)
        
        // Add a small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
    } catch (error) {
      alert('Bulk upload error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = {
      csv: `name,description,short_description,price,compare_price,cost_price,quantity,sku,categories,tags,images,stock_status,is_featured,is_popular,status
Product Name 1,Full description here,Short desc,999.99,1299.99,600,100,SKU001,main_category_id;subcategory_id1,tag1;tag2,https://image1.jpg;https://image2.jpg,in_stock,false,false,true
Product Name 2,Another description,Short desc 2,1999.99,2499.99,1200,50,SKU002,main_category_id;subcategory_id2,tag3;tag4,https://image3.jpg,in_stock,true,true,true`,
      
      json: JSON.stringify([
        {
          name: "Product Name 1",
          description: "Full product description goes here",
          short_description: "Brief summary",
          price: 999.99,
          compare_price: 1299.99,
          cost_price: 600,
          quantity: 100,
          sku: "SKU001",
          categories: ["main_category_id", "subcategory_id1", "subcategory_id2"],
          tags: ["tag1", "tag2"],
          images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
          stock_status: "in_stock",
          is_featured: false,
          is_popular: false,
          status: true
        },
        {
          name: "Product Name 2",
          description: "Another product description",
          short_description: "Another brief summary",
          price: 1999.99,
          compare_price: 2499.99,
          cost_price: 1200,
          quantity: 50,
          sku: "SKU002",
          categories: ["main_category_id", "subcategory_id1"],
          tags: ["tag3", "tag4"],
          images: ["https://example.com/image3.jpg"],
          stock_status: "in_stock",
          is_featured: true,
          is_popular: true,
          status: true
        }
      ], null, 2)
    }

    const content = uploadType === 'csv' ? template.csv : template.json
    const filename = uploadType === 'csv' ? 'product_template.csv' : 'product_template.json'
    const type = uploadType === 'csv' ? 'text/csv' : 'application/json'
    
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportResults = () => {
    const csvContent = 'Index,Product Name,Status,Message\n' +
      results.map(r => `${r.index},"${r.name}",${r.success ? 'Success' : 'Failed'},"${r.message}"`).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk_upload_results_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const successCount = results.filter(r => r.success).length
  const failureCount = results.filter(r => !r.success).length

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Bulk Product Upload</h2>
              <p className="text-muted mb-0">Upload multiple products at once using JSON, CSV, or Excel format</p>
            </div>
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={() => onNavigate && onNavigate('add-product')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Upload Products</h5>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${uploadType === 'json' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setUploadType('json')}
                  >
                    JSON
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${uploadType === 'csv' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setUploadType('csv')}
                  >
                    CSV
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${uploadType === 'excel' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setUploadType('excel')}
                    disabled
                  >
                    Excel
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Default Category Selection */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-folder me-2"></i>
                      Default Main Category (Optional)
                    </label>
                    <select
                      className="form-select"
                      value={defaultCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      disabled={categoriesLoading}
                    >
                      <option value="">Select default category for all products...</option>
                      {getMainCategories().map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">This category will be applied to products without categories specified</div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-diagram-3 me-2"></i>
                      Default Subcategories (Optional)
                    </label>
                    <select
                      className="form-select"
                      multiple
                      size="4"
                      value={defaultSubcategories}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                        handleSubcategoryChange(selectedOptions)
                      }}
                      disabled={!defaultCategory || subcategoriesLoading}
                    >
                      {defaultCategory ? (
                        getSubcategoriesForCategory(defaultCategory).length > 0 ? (
                          getSubcategoriesForCategory(defaultCategory).map(subcategory => (
                            <option key={subcategory._id} value={subcategory._id}>
                              {subcategory.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No subcategories available for this category</option>
                        )
                      ) : (
                        <option disabled>Select a main category first</option>
                      )}
                    </select>
                    <div className="form-text">
                      {defaultCategory 
                        ? (getSubcategoriesForCategory(defaultCategory).length > 0 
                          ? 'Hold Ctrl/Cmd to select multiple subcategories'
                          : 'No subcategories available for this category')
                        : 'Select a main category first'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Categories Summary */}
              {(defaultCategory || defaultSubcategories.length > 0) && (
                <div className="mb-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title mb-3">
                        <i className="bi bi-check-circle me-2"></i>
                        Default Categories for Products
                      </h6>
                      <div className="row">
                        {defaultCategory && (
                          <div className="col-md-6">
                            <div className="mb-2">
                              <strong className="text-primary">Main Category:</strong>
                              <div className="ms-3">
                                {(() => {
                                  const category = categories.find(cat => cat._id === defaultCategory)
                                  return category ? category.name : 'Unknown Category'
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
                        {defaultSubcategories.length > 0 && (
                          <div className="col-md-6">
                            <div className="mb-2">
                              <strong className="text-success">Subcategories:</strong>
                              <div className="ms-3">
                                {defaultSubcategories.map(subcategoryId => {
                                  const subcategory = subcategories.find(subcat => subcat._id === subcategoryId)
                                  return subcategory ? (
                                    <span key={subcategoryId} className="badge bg-success me-1 mb-1">
                                      {subcategory.name}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        These categories will be applied to products that don't have categories specified in their data
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Default Images Section */}
              <div className="mb-4">
                <div className="card border-primary">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-image me-2"></i>
                      Default Images for All Products
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-3">
                      Upload default images that will be used for all products in the bulk upload. 
                      Individual product data can override these defaults.
                    </p>
                    
                    <div className="row">
                      {/* Product Images */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Product Images (Multiple)</label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleDefaultImageUpload(e, 'images')}
                          disabled={uploadingDefaultImages.images}
                        />
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          First image will be automatically resized to create the product thumbnail
                        </div>
                        {uploadingDefaultImages.images && (
                          <div className="text-primary mt-1">
                            <small><i className="bi bi-cloud-upload me-1"></i>Uploading...</small>
                          </div>
                        )}
                        {defaultImages.images.length > 0 && (
                          <div className="mt-2">
                            {defaultImages.images.map((url, index) => (
                              <div key={index} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mb-1">
                                <small className="text-truncate me-2">
                                  {index === 0 && <span className="badge bg-primary me-1">Thumbnail Source</span>}
                                  {url}
                                </small>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeDefaultImage('images', index)}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Auto-Generated Thumbnail Info */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Product Thumbnail (Auto-Generated)</label>
                        <div className="form-control-plaintext bg-light p-3 rounded">
                          <div className="text-center">
                            <i className="bi bi-magic text-primary" style={{ fontSize: '2rem' }}></i>
                            <div className="mt-2">
                              <strong>Automatically Generated</strong>
                            </div>
                            <small className="text-muted">
                              Thumbnail will be created from the first product image and resized to 300x300px
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Product Galleries */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Product Galleries (Multiple)</label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleDefaultImageUpload(e, 'product_galleries_id')}
                          disabled={uploadingDefaultImages.product_galleries_id}
                        />
                        {uploadingDefaultImages.product_galleries_id && (
                          <div className="text-primary mt-1">
                            <small><i className="bi bi-cloud-upload me-1"></i>Uploading...</small>
                          </div>
                        )}
                        {defaultImages.product_galleries_id.length > 0 && (
                          <div className="mt-2">
                            {defaultImages.product_galleries_id.map((url, index) => (
                              <div key={index} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mb-1">
                                <small className="text-truncate me-2">{url}</small>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeDefaultImage('product_galleries_id', index)}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Size Chart Image */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Size Chart Image</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleDefaultImageUpload(e, 'size_chart_image_id')}
                          disabled={uploadingDefaultImages.size_chart_image_id}
                        />
                        {uploadingDefaultImages.size_chart_image_id && (
                          <div className="text-primary mt-1">
                            <small><i className="bi bi-cloud-upload me-1"></i>Uploading...</small>
                          </div>
                        )}
                        {defaultImages.size_chart_image_id && (
                          <div className="mt-2">
                            <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                              <small className="text-truncate me-2">{defaultImages.size_chart_image_id}</small>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeDefaultImage('size_chart_image_id')}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meta Image */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Meta Image</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleDefaultImageUpload(e, 'product_meta_image_id')}
                          disabled={uploadingDefaultImages.product_meta_image_id}
                        />
                        {uploadingDefaultImages.product_meta_image_id && (
                          <div className="text-primary mt-1">
                            <small><i className="bi bi-cloud-upload me-1"></i>Uploading...</small>
                          </div>
                        )}
                        {defaultImages.product_meta_image_id && (
                          <div className="mt-2">
                            <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                              <small className="text-truncate me-2">{defaultImages.product_meta_image_id}</small>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeDefaultImage('product_meta_image_id')}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Clear All Button */}
                    {(defaultImages.images.length > 0 || 
                      defaultImages.product_galleries_id.length > 0 || defaultImages.size_chart_image_id || 
                      defaultImages.product_meta_image_id) && (
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => setDefaultImages({
                            images: [],
                            product_thumbnail_id: null,
                            product_galleries_id: [],
                            size_chart_image_id: null,
                            product_meta_image_id: null
                          })}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Clear All Images
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              {(uploadType === 'csv' || uploadType === 'excel') && (
                <div className="mb-3">
                  <label className="form-label">Upload File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="form-control"
                    accept={uploadType === 'csv' ? '.csv' : '.xlsx,.xls'}
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {/* Data Input Area */}
              <div className="mb-3">
                <label className="form-label">
                  {uploadType === 'json' ? 'Products JSON Data' : 'Preview Data'}
                </label>
                <textarea
                  className="form-control font-monospace"
                  rows="15"
                  value={productsData}
                  onChange={(e) => setProductsData(e.target.value)}
                  placeholder={uploadType === 'json' ? 'Paste your JSON data here...' : 'File data will appear here...'}
                  readOnly={uploadType !== 'json'}
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={handleBulkUpload}
                  disabled={loading || !productsData.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading... ({processedCount}/{totalCount})
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload Products
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={downloadTemplate}
                >
                  <i className="bi bi-download me-2"></i>
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upload Results</h5>
              {results.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={exportResults}
                >
                  <i className="bi bi-download me-1"></i>
                  Export
                </button>
              )}
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {results.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cloud-upload text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-3">No uploads yet</p>
                  <small className="text-muted">Upload results will appear here</small>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="mb-3 p-3 bg-light rounded">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="fw-bold text-primary">{results.length}</div>
                        <small className="text-muted">Total</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-success">{successCount}</div>
                        <small className="text-muted">Success</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-danger">{failureCount}</div>
                        <small className="text-muted">Failed</small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {loading && (
                    <div className="mb-3">
                      <div className="progress">
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          role="progressbar" 
                          style={{ width: `${(processedCount / totalCount) * 100}%` }}
                        >
                          {Math.round((processedCount / totalCount) * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Results List */}
                  <div className="list-group list-group-flush">
                    {results.map((result, idx) => (
                      <div 
                        key={idx} 
                        className={`list-group-item px-0 ${result.success ? 'border-success' : 'border-danger'}`}
                      >
                        <div className="d-flex align-items-start">
                          <span className={`badge ${result.success ? 'bg-success' : 'bg-danger'} me-2`}>
                            {result.index}
                          </span>
                          <div className="flex-grow-1">
                            <div className="fw-semibold">{result.name}</div>
                            <small className={result.success ? 'text-success' : 'text-danger'}>
                              {result.message}
                            </small>
                            {result.productId && (
                              <div>
                                <small className="text-muted">ID: {result.productId}</small>
                              </div>
                            )}
                          </div>
                          <i className={`bi ${result.success ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'}`}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Help Section */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">
                <i className="bi bi-question-circle me-2"></i>
                Help
              </h6>
            </div>
            <div className="card-body">
              <small className="text-muted">
                <p className="mb-2"><strong>Required Fields:</strong></p>
                <ul className="mb-2">
                  <li>name - Product name</li>
                  <li>price - Product price (number)</li>
                  <li>description - Product description</li>
                </ul>
                
                <p className="mb-2"><strong>Optional Fields:</strong></p>
                <ul className="mb-2">
                  <li>compare_price, cost_price, sale_price</li>
                  <li>quantity, sku, stock_status</li>
                  <li>categories (array or semicolon-separated category IDs)</li>
                  <li>tags (array or semicolon-separated)</li>
                  <li>images (array or semicolon-separated URLs)</li>
                  <li>is_featured, is_popular, is_trending (boolean)</li>
                </ul>
                
                <p className="mb-2"><strong>Image Handling:</strong></p>
                <ul className="mb-2">
                  <li><strong>Product Images:</strong> Upload or specify URLs in product data</li>
                  <li><strong>Auto Thumbnail:</strong> First product image is automatically resized to 300x300px thumbnail</li>
                  <li><strong>Galleries:</strong> Additional product gallery images</li>
                  <li><strong>Size Chart & Meta:</strong> Optional specialized images</li>
                </ul>
                
                <p className="mb-2"><strong>Category Usage:</strong></p>
                <ul className="mb-2">
                  <li><strong>Default Categories:</strong> Selected above will be applied to products without categories</li>
                  <li><strong>Product-specific Categories:</strong> Use category IDs in the categories field</li>
                  <li><strong>Subcategories:</strong> Include subcategory IDs along with main category IDs</li>
                  <li><strong>Example:</strong> categories: ["main_category_id", "subcategory_id1", "subcategory_id2"]</li>
                </ul>
                
                <p className="mb-0">
                  <strong>Note:</strong> All products are encrypted before sending to the server for security.
                </p>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
