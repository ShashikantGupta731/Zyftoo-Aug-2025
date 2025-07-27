import React, { useState } from 'react';

export default function CurrentSelections({ pageId, token }) {
  // Mock data for CurrentSelections (completely separate from CategorySelector)
  const mockMainCategories = [
    {
      id: '687fbada33f196eb765aecd2',
      name: 'Fashion & Clothing',
      description: 'Trendy clothing and fashion accessories for all occasions',
      image: null,
      status: true
    },
    {
      id: '687fbaed33f196eb765aecd5',
      name: 'Electronics',
      description: 'Latest gadgets and electronic devices',
      image: null,
      status: true
    },
    {
      id: '687fbaf333f196eb765aecd8', 
      name: 'Home & Living',
      description: 'Home decor, furniture, and living essentials',
      image: null,
      status: true
    },
    {
      id: '687fbafa33f196eb765aecdb',
      name: 'Health & Beauty',
      description: 'Beauty products, skincare, and health supplements',
      image: null,
      status: false
    },
    {
      id: '687fbb0633f196eb765aece1',
      name: 'Sports & Outdoor',
      description: 'Sports equipment, outdoor gear, and fitness products',
      image: null,
      status: true
    },
    {
      id: '687fbb0b33f196eb765aece4',
      name: 'Books & Media',
      description: 'Books, digital media, and educational content',
      image: null,
      status: false
    }
  ];

  const mockSubcategories = [
    // Fashion & Clothing subcategories
    {
      id: '687fbc8d33f196eb765aecf1',
      name: 'Men\'s Clothing',
      description: 'Shirts, pants, suits, and men\'s fashion wear',
      parent: '687fbada33f196eb765aecd2',
      image: null,
      status: true
    },
    {
      id: '687fbc9333f196eb765aecf6', 
      name: 'Women\'s Clothing',
      description: 'Dresses, tops, skirts, and women\'s fashion wear',
      parent: '687fbada33f196eb765aecd2',
      image: null,
      status: true
    },
    {
      id: '687fbc9a33f196eb765aecfb',
      name: 'Shoes & Footwear',
      description: 'Casual shoes, formal shoes, sneakers, and sandals',
      parent: '687fbada33f196eb765aecd2',
      image: null,
      status: true
    },
    {
      id: '687fbca033f196eb765aed00',
      name: 'Fashion Accessories',
      description: 'Bags, belts, scarves, and fashion accessories',
      parent: '687fbada33f196eb765aecd2',
      image: null,
      status: true
    },
    // Electronics subcategories
    {
      id: 'sub_electronics_1',
      name: 'Mobile Phones',
      description: 'Latest smartphones and mobile devices',
      parent: '687fbaed33f196eb765aecd5',
      image: null,
      status: true
    },
    {
      id: 'sub_electronics_2',
      name: 'Laptops & Computers',
      description: 'Laptops, desktops, and computer accessories',
      parent: '687fbaed33f196eb765aecd5',
      image: null,
      status: true
    },
    {
      id: 'sub_electronics_3',
      name: 'Audio & Video',
      description: 'Headphones, speakers, and audio equipment',
      parent: '687fbaed33f196eb765aecd5',
      image: null,
      status: false
    },
    // Home & Living subcategories
    {
      id: 'sub_home_1',
      name: 'Furniture',
      description: 'Chairs, tables, beds, and home furniture',
      parent: '687fbaf333f196eb765aecd8',
      image: null,
      status: true
    },
    {
      id: 'sub_home_2',
      name: 'Home Decor',
      description: 'Wall art, decorative items, and home accessories',
      parent: '687fbaf333f196eb765aecd8',
      image: null,
      status: false
    }
  ];

  // Mock category configuration (selected categories)
  const mockCategoryConfig = {
    categoryIds: [
      '687fbada33f196eb765aecd2', // Fashion & Clothing
      '687fbaed33f196eb765aecd5', // Electronics
      '687fbaf333f196eb765aecd8', // Home & Living
      '687fbc8d33f196eb765aecf1', // Men's Clothing
      '687fbc9333f196eb765aecf6', // Women's Clothing
      '687fbc9a33f196eb765aecfb', // Shoes & Footwear
      '687fbca033f196eb765aed00', // Fashion Accessories
      'sub_electronics_1',         // Mobile Phones
      'sub_electronics_2',         // Laptops & Computers
      'sub_home_1'                 // Furniture
    ]
  };

  // State for selected main category (for viewing subcategories)
  const [selectedMainCategory, setSelectedMainCategory] = useState('687fbada33f196eb765aecd2');

  // Get only main categories (no parent)
  const mainCategories = mockMainCategories;

  // Get subcategories for selected main category
  const getSubcategoriesForCategory = (categoryId) => {
    console.log('🔍 Getting subcategories for category ID:', categoryId);
    const filtered = mockSubcategories.filter(subCat => {
      const parentId = subCat.parent;
      const match = parentId === categoryId;
      console.log(`   - Subcategory "${subCat.name}" parent: ${parentId}, matches: ${match}`);
      return match;
    });
    console.log(`   - Found ${filtered.length} subcategories for category ${categoryId}:`, filtered);
    return filtered;
  };

  const selectedCategorySubcategories = selectedMainCategory ? 
    getSubcategoriesForCategory(selectedMainCategory) : [];

  // Helper function to get current counts
  const getCurrentCounts = () => {
    const selectedMainCats = mockCategoryConfig.categoryIds.filter(id => 
      mainCategories.some(cat => cat.id === id)
    );
    const selectedSubcats = mockCategoryConfig.categoryIds.filter(id => 
      mockSubcategories.some(sub => sub.id === id)
    );
    return {
      mainCategoriesCount: selectedMainCats.length,
      selectedSubcategories: selectedSubcats.length
    };
  };

  // Create default icons exactly like in the original components
  const defaultCategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Zm9sZGVyIGZpbGw9IiM5NjliYTYiLz4KPHN2ZyB4PSI2IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yIDJoOGwyIDJoMTB2MTJIMlYyeiIgZmlsbD0iIzk2OWJhNiIvPgo8L3N2Zz4KPC9zdmc+';
  const defaultSubcategoryIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjhmOWZhIiByeD0iNiIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSI4IiBmaWxsPSIjZGVlMmU2Ii8+CjxjaXJjbGUgY3g9IjE4IiBjeT0iMTgiIHI9IjMiIGZpbGw9IiM5NjliYTYiLz4KPC9zdmc+';

  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <label className="form-label fw-semibold mb-3">Select Categories and Subcategories</label>
          
          {mainCategories.length > 0 ? (
            <div className="row">
              {/* Main Categories - EXACT COPY from MainCategoriesList */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <i className="bi bi-grid text-primary me-2"></i>
                      Main Categories ({mainCategories.length})
                    </h6>
                    <span className="badge bg-primary">
                      {getCurrentCounts().mainCategoriesCount} selected
                    </span>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {mainCategories.map((category, index) => {
                        const isSelected = mockCategoryConfig.categoryIds.includes(category.id);
                        const isCurrentlyViewed = selectedMainCategory === category.id;
                        
                        return (
                          <div 
                            key={category.id} 
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${isCurrentlyViewed ? 'active' : ''}`}
                            onClick={() => setSelectedMainCategory(category.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex align-items-center flex-grow-1">
                              <img 
                                src={category.image || defaultCategoryIcon}
                                alt={category.name}
                                className="me-3"
                                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => {
                                  e.target.src = defaultCategoryIcon;
                                }}
                              />
                              <div className="flex-grow-1">
                                <div className="fw-medium">{category.name}</div>
                                {category.description && (
                                  <small className="text-muted">{category.description}</small>
                                )}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              {isCurrentlyViewed && (
                                <span className="badge bg-info">Viewing</span>
                              )}
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  checked={isSelected}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subcategories - EXACT COPY from SubcategoriesList */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <i className="bi bi-tag text-secondary me-2"></i>
                      Subcategories
                      {selectedMainCategory && (
                        <span className="text-muted ms-2">
                          for "{mainCategories.find(cat => cat.id === selectedMainCategory)?.name}"
                        </span>
                      )}
                    </h6>
                    {selectedCategorySubcategories.length > 0 && (
                      <span className="badge bg-secondary">
                        {selectedCategorySubcategories.length} subcategories
                      </span>
                    )}
                  </div>
                  <div className="card-body p-0">
                    {selectedMainCategory ? (
                      selectedCategorySubcategories.length > 0 ? (
                        <>
                          {/* Subcategory Stats */}
                          <div className="p-3 bg-light border-bottom">
                            <div className="row text-center">
                              <div className="col-6">
                                <div className="small">
                                  <strong>{selectedCategorySubcategories.filter(sub => mockCategoryConfig.categoryIds.includes(sub.id)).length}</strong>
                                  <br />
                                  <span className="text-muted">Selected</span>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="small">
                                  <strong>{selectedCategorySubcategories.filter(sub => sub.status).length}</strong>
                                  <br />
                                  <span className="text-muted">Active</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bulk Actions for Subcategories */}
                          <div className="p-2 border-bottom">
                            <div className="d-flex gap-1">
                              <button 
                                type="button" 
                                className="btn btn-outline-success btn-sm"
                                disabled
                              >
                                <i className="bi bi-check-all me-1"></i>
                                Select All
                              </button>
                              
                              <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm"
                                disabled
                              >
                                <i className="bi bi-x-circle me-1"></i>
                                Clear All
                              </button>
                            </div>
                          </div>

                          {/* Subcategories List */}
                          <div className="list-group list-group-flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {selectedCategorySubcategories.map((subcategory, index) => {
                              const isSelected = mockCategoryConfig.categoryIds.includes(subcategory.id);
                              
                              return (
                                <div 
                                  key={subcategory.id} 
                                  className="list-group-item d-flex align-items-center justify-content-between"
                                >
                                  <div className="d-flex align-items-center flex-grow-1">
                                    <img 
                                      src={subcategory.image || defaultSubcategoryIcon}
                                      alt={subcategory.name}
                                      className="me-3"
                                      style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }}
                                      onError={(e) => {
                                        e.target.src = defaultSubcategoryIcon;
                                      }}
                                    />
                                    <div className="flex-grow-1">
                                      <div className="fw-medium">{subcategory.name}</div>
                                      {subcategory.description && (
                                        <small className="text-muted">{subcategory.description}</small>
                                      )}
                                      <div className="d-flex gap-2 mt-1">
                                        <span className={`badge ${subcategory.status ? 'bg-success' : 'bg-danger'}`}>
                                          {subcategory.status ? 'Active' : 'Inactive'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="form-check">
                                    <input 
                                      className="form-check-input" 
                                      type="checkbox" 
                                      checked={isSelected}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Footer Info */}
                          <div className="p-2 bg-light border-top text-center">
                            <small className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              Current selections for homepage display
                            </small>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-folder2-open text-muted" style={{ fontSize: '2.5rem' }}></i>
                          <h6 className="mt-3 text-muted">No subcategories found</h6>
                          <p className="text-muted mb-3">
                            The category "{mainCategories.find(cat => cat.id === selectedMainCategory)?.name}" doesn't have any subcategories yet.
                          </p>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            disabled
                          >
                            <i className="bi bi-plus-circle me-1"></i>
                            Create Subcategories
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-5">
                        <i className="bi bi-arrow-left text-primary" style={{ fontSize: '2.5rem' }}></i>
                        <h6 className="mt-3 text-muted">Select a main category</h6>
                        <p className="text-muted mb-0">
                          Click on a main category from the left panel to view and select its subcategories.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-folder2-open text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2 text-muted">No categories available</p>
              <small className="text-muted">Create categories first to configure this section.</small>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions - EXACT COPY from CategorySelector */}
      {mainCategories.length > 0 && (
        <div className="row">
          <div className="col-12">
            <div className="d-flex gap-2 flex-wrap">
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm"
                disabled
              >
                <i className="bi bi-check-all me-1"></i>
                Select All Main Categories
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline-success btn-sm"
                disabled
              >
                <i className="bi bi-tags me-1"></i>
                Select All Subcategories
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm"
                disabled
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear All Selections
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

