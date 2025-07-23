"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { giftPageCategories, giftCategoriesMetadata } from "@/data/giftPageCategories";

console.log('🚨 === GIFT CATEGORIES FILE LOADED ===')

export default function GiftCategories() {
  console.log('🚨 === GIFT CATEGORIES COMPONENT FUNCTION CALLED ===')
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [categories] = useState(giftPageCategories); // ✨ Pure static data, no API calls
  const [isClient, setIsClient] = useState(false); // Track if we're on client

  // Ensure we're on the client before showing time-dependent content
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log('📊 GiftCategories loaded:', {
    source: giftCategoriesMetadata?.source || 'static',
    lastUpdated: giftCategoriesMetadata?.lastUpdated,
    categoriesCount: categories.length
  });

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
      {/* Fixed debug info - only show on client and remove time display */}
      {process.env.NODE_ENV === 'development' && isClient && (
        <div className="position-fixed top-0 end-0 bg-success text-white p-2 small" style={{ zIndex: 9999, fontSize: '10px' }}>
          <div><strong>GiftCategories:</strong></div>
          <div>📁 Static File</div>
          <div>📊 {categories.length} categories</div>
          <div>📅 {giftCategoriesMetadata?.lastUpdated ? new Date(giftCategoriesMetadata.lastUpdated).toLocaleDateString() : 'Unknown'}</div>
          <div>🎯 {giftCategoriesMetadata?.source || 'Unknown'}</div>
        </div>
      )}

      {/* Desktop view */}
      {categories.length > 0 && (
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
                            src={category.icon || category.image}
                            alt={category.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/category/default-category.svg'
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

                        {/* Subcategories dropdown */}
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
                                key={sub.id || index}
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

      {/* Tablet view */}
      {categories.length > 0 && (
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
                            src={category.icon || category.image}
                            alt={category.name}
                            style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/category/default-category.svg'
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {console.log('🎬 === GIFT CATEGORIES COMPONENT RENDER END ===')}
    </>
  );
}