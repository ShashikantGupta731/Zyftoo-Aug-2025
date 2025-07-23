"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "@/util/apiService";

export default function GiftCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [config, setConfig] = useState({});
  const [error, setError] = useState(null);

  // Default image for categories without images
  const defaultCategoryImage = "/assets/img/product/category/default-category.svg";

  // Fetch categories from admin panel/API
  useEffect(() => {
    console.log('🚀 === GIFT CATEGORIES COMPONENT MOUNTED ===');
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('📡 === FETCHING CATEGORIES START ===');
      setLoading(true);
      setError(null);

      // Log the API call
      const apiUrl = '/api/pages/home/categories';
      console.log('1. Making API call to:', apiUrl);
      console.log('2. Frontend base URL check:', window.location.origin);

      // Fetch categories for display based on page configuration
      const response = await get(apiUrl);
      console.log('3. API Response received:', {
        success: response?.success,
        dataExists: !!response?.data,
        enabled: response?.data?.enabled,
        categoriesCount: response?.data?.categories?.length
      });
      console.log('4. Full response object:', response);
      
      if (response.success) {
        console.log('5. Processing successful response...');
        setSectionVisible(response.data.enabled);
        setConfig(response.data.config || {});
        
        console.log('6. Section enabled:', response.data.enabled);
        console.log('7. Config set:', response.data.config);
        console.log('8. Categories array:', response.data.categories);
        
        if (response.data.enabled && response.data.categories) {
          console.log('9. Setting categories - count:', response.data.categories.length);
          console.log('10. Category details:', response.data.categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            image: cat.image,
            hasSubcategories: cat.subcategories?.length > 0
          })));
          
          setCategories(response.data.categories);
          console.log('11. ✅ Categories state updated successfully');
        } else {
          console.log('9. ❌ No categories to display - enabled:', response.data.enabled, 'count:', response.data.categories?.length);
          setCategories([]);
        }
      } else {
        console.log('5. ❌ API response unsuccessful:', response);
        // Fallback to all categories
        const categoriesResponse = await get('/api/categories');
        if (categoriesResponse.success) {
          console.log('6. Fallback categories loaded:', categoriesResponse.data.length);
          const transformedCategories = categoriesResponse.data
            .slice(0, 6) // Default limit
            .map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: cat.image || defaultCategoryImage,
              subcategories: []
            }));
          setCategories(transformedCategories);
          console.log('7. ✅ Fallback categories set');
        } else {
          console.log('6. ❌ Fallback categories also failed');
          setCategories([]);
        }
      }
      } catch (error) {
        console.error('❌ === FETCH CATEGORIES ERROR ===');
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        // Try fallback to static data
        try {
          const { giftPageCategories } = await import("@/data/giftPageCategories");
          console.log('🔄 Using static fallback data:', giftPageCategories.length);
          setCategories(giftPageCategories);
        } catch (fallbackError) {
          console.error('❌ Failed to load static fallback data:', fallbackError);
          setCategories([]);
        }
      } finally {
        setLoading(false);
        console.log('🏁 === FETCH CATEGORIES COMPLETE ===');
      }
    };

    fetchCategories();
    
    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchCategories, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic spacing based on number of categories
  const getSpacing = () => {
    const categoryCount = categories.length;
    console.log('📐 Calculating spacing for', categoryCount, 'categories');
    
    let spacing;
    if (categoryCount <= 3) spacing = 'mx-4';
    else if (categoryCount <= 4) spacing = 'mx-3';
    else if (categoryCount <= 6) spacing = 'mx-2';
    else spacing = 'mx-1';
    
    console.log('📐 Spacing class:', spacing);
    return spacing;
  };

  const handleMouseEnterCategory = (id) => {
    console.log('🖱️ Mouse enter category:', id);
    setActiveCategory(id);
    setActiveSubcategory(null);
  };

  const handleMouseLeaveCategory = () => {
    console.log('🖱️ Mouse leave category');
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const handleMouseEnterSubcategory = (name) => {
    console.log('🖱️ Mouse enter subcategory:', name);
    setActiveSubcategory(name);
  };

  // Add comprehensive render logging
  console.log('🎨 === RENDER GIFT CATEGORIES ===');
  console.log('Render state:', {
    loading,
    error,
    sectionVisible,
    categoriesCount: categories.length,
    config,
    activeCategory,
    activeSubcategory
  });

  // Log what we're about to render
  if (!sectionVisible) {
    console.log('👻 Component hidden - sectionVisible:', sectionVisible);
    return null;
  }

  if (loading) {
    console.log('🔄 Rendering loading state');
  } else if (categories.length === 0) {
    console.log('📭 Rendering empty state');
  } else {
    console.log('✅ Rendering categories:', categories.length);
    console.log('Categories to render:', categories.map(c => ({ id: c.id, name: c.name })));
  }

  return (
    <>
      {/* Loading state */}
      {loading && (
        <div className="d-none d-lg-block">
          <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading categories...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop view with dynamic spacing */}
      {!loading && categories.length > 0 && (
        <div className="d-none d-lg-block">
          <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`position-relative d-flex flex-column align-items-center justify-content-center ${getSpacing()}`}
                        style={{ 
                          height: '100%',
                          padding: '0 5px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease',
                          minWidth: '60px'
                        }}
                        onMouseEnter={() => handleMouseEnterCategory(category.id)}
                        onMouseLeave={handleMouseLeaveCategory}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <div className="d-flex flex-column align-items-center" style={{ gap: '2px' }}>
                          <img
                            src={category.icon}
                            alt={category.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = defaultCategoryImage;
                            }}
                          />
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '500', 
                            whiteSpace: 'nowrap', 
                            color: '#333', 
                            textAlign: 'center', 
                            lineHeight: '1.1' 
                          }}>
                            {category.name}
                          </span>
                        </div>

                        {/* Show subcategories only if enabled in config */}
                        {config.showSubcategories && activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                          <div 
                            className="position-absolute bg-white shadow-lg d-flex flex-column"
                            style={{
                              top: '80px',
                              left: '0',
                              padding: '10px 15px',
                              minWidth: '200px',
                              zIndex: 1000,
                              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            {category.subcategories.map((sub, index) => (
                              <div
                                key={index}
                                className="position-relative"
                                style={{ padding: '6px 10px', whiteSpace: 'nowrap' }}
                                onMouseEnter={() => handleMouseEnterSubcategory(sub.name)}
                                onMouseLeave={() => setActiveSubcategory(null)}
                              >
                                <Link href={`/shop?category=${category.id}&subcategory=${encodeURIComponent(sub.name)}`} className="text-decoration-none">
                                  <span className="d-inline-flex align-items-center justify-content-between w-100" style={{ fontSize: '13px', color: '#222' }}>
                                    {sub.name}
                                    {sub.children && <span style={{ marginLeft: '6px', fontWeight: 'bold' }}>›</span>}
                                  </span>
                                </Link>

                                {sub.children && activeSubcategory === sub.name && (
                                  <div 
                                    className="position-absolute bg-white shadow d-flex flex-column"
                                    style={{
                                      top: '0',
                                      left: '100%',
                                      padding: '8px 12px',
                                      boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.12)'
                                    }}
                                  >
                                    {sub.children.map((child, idx) => (
                                      <Link key={idx} href={`/shop?category=${category.id}&subcategory=${encodeURIComponent(sub.name)}&child=${encodeURIComponent(child)}`} className="text-decoration-none">
                                        <span style={{ padding: '4px 0', fontSize: '13px', color: '#333' }}>
                                          {child}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablet view with dynamic spacing */}
      {!loading && categories.length > 0 && (
        <div className="d-none d-md-block d-lg-none">
          <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ height: '70px', gap: '15px', padding: '10px 0' }}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="position-relative d-flex flex-column align-items-center justify-content-center"
                        style={{ 
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease',
                          minWidth: '50px'
                        }}
                        onMouseEnter={() => handleMouseEnterCategory(category.id)}
                        onMouseLeave={handleMouseLeaveCategory}
                      >
                        <div className="d-flex flex-column align-items-center" style={{ gap: '2px' }}>
                          <img
                            src={category.icon}
                            alt={category.name}
                            style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = defaultCategoryImage;
                            }}
                          />
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: '500', 
                            whiteSpace: 'nowrap', 
                            color: '#333', 
                            textAlign: 'center', 
                            lineHeight: '1.1' 
                          }}>
                            {category.name}
                          </span>
                        </div>

                        {/* Show subcategories only if enabled in config */}
                        {config.showSubcategories && activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                          <div 
                            className="position-absolute bg-white shadow-lg d-flex flex-column"
                            style={{
                              top: '60px',
                              left: '0',
                              padding: '10px 15px',
                              minWidth: '200px',
                              zIndex: 1000,
                              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            {category.subcategories.map((sub, index) => (
                              <div
                                key={index}
                                className="position-relative"
                                style={{ padding: '6px 10px', whiteSpace: 'nowrap' }}
                                onMouseEnter={() => handleMouseEnterSubcategory(sub.name)}
                                onMouseLeave={() => setActiveSubcategory(null)}
                              >
                                <Link href={`/shop?category=${category.id}&subcategory=${encodeURIComponent(sub.name)}`} className="text-decoration-none">
                                  <span className="d-inline-flex align-items-center justify-content-between w-100" style={{ fontSize: '13px', color: '#222' }}>
                                    {sub.name}
                                    {sub.children && <span style={{ marginLeft: '6px', fontWeight: 'bold' }}>›</span>}
                                  </span>
                                </Link>

                                {sub.children && activeSubcategory === sub.name && (
                                  <div 
                                    className="position-absolute bg-white shadow d-flex flex-column"
                                    style={{
                                      top: '0',
                                      left: '100%',
                                      padding: '8px 12px',
                                      boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.12)'
                                    }}
                                  >
                                    {sub.children.map((child, idx) => (
                                      <Link key={idx} href={`/shop?category=${category.id}&subcategory=${encodeURIComponent(sub.name)}&child=${encodeURIComponent(child)}`} className="text-decoration-none">
                                        <span style={{ padding: '4px 0', fontSize: '13px', color: '#333' }}>
                                          {child}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && categories.length === 0 && (
        <div className="d-none d-lg-block">
          <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="text-muted">No categories available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

