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

  // Default image for categories without images
  const defaultCategoryImage = "/assets/img/product/category/default-category.svg";

  // Fetch categories from admin panel/API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch page configuration for home page
        const pageConfigResponse = await get('/api/pages/home');
        
        if (pageConfigResponse) {
          // Find the category section
          const categorySection = pageConfigResponse.sections.find(
            section => section.sectionType === 'categorySection'
          );
          
          if (!categorySection || !categorySection.enabled) {
            setSectionVisible(false);
            return;
          }
          
          setSectionVisible(true);
          
          // Get all available categories
          const categoriesResponse = await get('/api/categories');
          console.log('Raw categories from API:', categoriesResponse);
          
          if (categorySection.config?.categories && categoriesResponse) {
            // Map configured categories with actual category data
            const configuredCategories = categorySection.config.categories
              .filter(configCat => configCat.enabled)
              .map(configCat => {
                const actualCategory = categoriesResponse.find(cat => 
                  (cat.id && cat.id === configCat.categoryId) || 
                  (cat._id && cat._id.toString() === configCat.categoryId)
                );
                return actualCategory ? {
                  id: actualCategory.id || actualCategory._id,
                  name: actualCategory.name,
                  icon: actualCategory.image?.url || actualCategory.image || defaultCategoryImage,
                  subcategories: actualCategory.subcategories || [],
                  order: configCat.order || 0
                } : null;
              })
              .filter(cat => cat !== null) // Remove null entries
              .sort((a, b) => a.order - b.order)
              .slice(0, categorySection.config?.maxCategories || 6); // Respect max categories limit
            
            setCategories(configuredCategories);
          } else if (categoriesResponse) {
            // Fallback: show all available categories if no configuration exists
            const allCategories = categoriesResponse
              .slice(0, categorySection.config?.maxCategories || 6)
              .map(cat => ({
                id: cat.id,
                name: cat.name,
                icon: cat.image || cat.icon || defaultCategoryImage,
                subcategories: cat.subcategories || []
              }));
            
            setCategories(allCategories);
          }
        } else {
          // Fallback to static data if page config API fails
          const { giftPageCategories } = await import("@/data/giftPageCategories");
          setCategories(giftPageCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to static data
        try {
          const { giftPageCategories } = await import("@/data/giftPageCategories");
          setCategories(giftPageCategories);
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
          setCategories([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnterCategory = (id) => {
    setActiveCategory(id);
    setActiveSubcategory(null);
  };

  const handleMouseLeaveCategory = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const handleMouseEnterSubcategory = (name) => {
    setActiveSubcategory(name);
  };

  // Don't render if section is hidden
  if (!sectionVisible) {
    return null;
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

      {/* Desktop view */}
      {!loading && categories.length > 0 && (
        <div className="d-none d-lg-block">
          <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-end align-items-center" style={{ height: '80px', paddingRight: '23%' }}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="position-relative d-flex flex-column align-items-center justify-content-center mx-3"
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

                        {activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
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
                                <Link href="/shop" className="text-decoration-none">
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
                                      <Link key={idx} href="/shop" className="text-decoration-none">
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

      {/* Tablet view */}
      {!loading && categories.length > 0 && (
        <div className="d-none d-md-block d-lg-none">
          <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ height: '70px', gap: '20px', padding: '10px 0' }}>
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

                        {activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
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
                                <Link href="/shop" className="text-decoration-none">
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
                                      <Link key={idx} href="/shop" className="text-decoration-none">
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

