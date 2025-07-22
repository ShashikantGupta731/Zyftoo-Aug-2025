"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { giftPageCategories } from "@/data/giftPageCategories";

export default function GiftCategories() {

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);


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
      {/* Hide on mobile (d-none d-lg-block) */}
      <div className="d-none d-lg-block">
        <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-end align-items-center" style={{ height: '80px', paddingRight: '15%' }}>
                  {giftPageCategories.map((category) => (
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

                      {activeCategory === category.id && (
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

      {/* Tablet view - smaller icons */}
      <div className="d-none d-md-block d-lg-none">
        <div className="container-fluid" style={{ backgroundColor: '#f0d9b3', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ height: '70px', gap: '20px', padding: '10px 0' }}>
                  {giftPageCategories.map((category) => (
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

                      {activeCategory === category.id && (
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
    </>
  );
}
