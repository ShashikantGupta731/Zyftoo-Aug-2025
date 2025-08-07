// Product service for handling product-related API calls
export const productService = {
  getAllProducts: async () => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create product')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}
