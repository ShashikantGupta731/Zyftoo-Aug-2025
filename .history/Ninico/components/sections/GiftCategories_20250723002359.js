"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { giftPageCategories } from "@/data/giftPageCategories";

export default function GiftCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load static categories
    setCategories(giftPageCategories);
    setLoading(false);
  }, []);

  // Calculate dynamic spacing based on number of categories
  const getSpacing = () => {
    const categoryCount = categories.length;
    if (categoryCount <= 3) return 'mx-4';
    else if (categoryCount <= 4) return 'mx-3';
    else if (categoryCount <= 6) return 'mx-2';
    else return 'mx-1';
  };

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

  return (
    <>
      {/* Debug info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="position-fixed top-0 end-0 bg-dark text-white p-2 small" style={{ zIndex: 9999, maxWidth: '300px' }}>
          <div><strong>GiftCategories Debug:</strong></div>
          <div>Loading: {loading.toString()}</div>
          <div>SectionVisible: {sectionVisible.toString()}</div>
          <div>Categories: {categories.length}</div>
          <div>Error: {error || 'None'}</div>
          <div>Config: {JSON.stringify(config)}</div>
          {categories.length > 0 && (
            <div>Names: {categories.map(c => c.name).join(', ')}</div>
          )}
        </div>
      )}

      {/* Add error display for debugging */}
      {error && (
        <div className="alert alert-danger m-3">
          <strong>Debug Error:</strong> {error}
        </div>
      )}
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
                    {categories.map((category, index) => {
                      console.log(`🎯 Rendering category ${index + 1}:`, {
                        id: category.id,
                        name: category.name,
                        icon: category.icon,
                        image: category.image,
                        subcategoriesCount: category.subcategories?.length || 0
                      });
                      
                      return (
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

