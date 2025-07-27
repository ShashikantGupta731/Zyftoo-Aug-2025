"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { giftPageCategories, giftCategoriesMetadata } from "@/data/giftPageCategories";
import styles from './GiftCategories.module.css';

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
  const getSpacingClass = () => {
    const categoryCount = categories.length;
    if (categoryCount <= 3) return styles.spacing1;
    else if (categoryCount <= 4) return styles.spacing2;
    else if (categoryCount <= 5) return styles.spacing3;
    else if (categoryCount <= 6) return styles.spacing4;
    else if (categoryCount <= 8) return styles.spacing5;
    else return styles.spacing6;
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
        <div className={styles.debugInfo}>
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
          <div className={`container-fluid ${styles.giftCategoriesContainer}`}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className={styles.categoriesWrapper}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`${styles.categoryItem} ${getSpacingClass()}`}
                        onMouseEnter={() => handleMouseEnterCategory(category.id)}
                        onMouseLeave={handleMouseLeaveCategory}
                      >
                        <div className={styles.categoryContent}>
                          <img
                            src={category.icon || category.image}
                            alt={category.name}
                            className={styles.categoryImage}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/category/default-category.svg'
                            }}
                          />
                          <span className={styles.categoryLabel}>
                            {category.name}
                          </span>
                        </div>

                        {/* Subcategories dropdown */}
                        {activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                          <div className={styles.subcategoriesDropdown}>
                            {category.subcategories.map((sub, index) => (
                              <div
                                key={sub.id || index}
                                className={styles.subcategoryItem}
                                onMouseEnter={() => handleMouseEnterSubcategory(sub.name)}
                                onMouseLeave={() => setActiveSubcategory(null)}
                              >
                                <Link href={`/shop?category=${category.id}&subcategory=${encodeURIComponent(sub.name)}`} className={styles.subcategoryLink}>
                                  <span>{sub.name}</span>
                                  {sub.children && <span className={styles.subcategoryArrow}>›</span>}
                                </Link>

                                {sub.children && activeSubcategory === sub.name && (
                                  <div className={styles.subSubcategoriesDropdown}>
                                    {sub.children.map((child, idx) => (
                                      <Link 
                                        key={idx} 
                                        href={`/shop?category=${category.id}&subcategory=${encodeURIComponent(sub.name)}&child=${encodeURIComponent(child)}`} 
                                        className={styles.subSubcategoryLink}
                                      >
                                        {child}
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
          <div className={`container-fluid ${styles.giftCategoriesContainer}`}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className={styles.categoriesWrapper}>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={styles.categoryItem}
                        onMouseEnter={() => handleMouseEnterCategory(category.id)}
                        onMouseLeave={handleMouseLeaveCategory}
                      >
                        <div className={styles.categoryContent}>
                          <img
                            src={category.icon || category.image}
                            alt={category.name}
                            className={styles.categoryImage}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/category/default-category.svg'
                            }}
                          />
                          <span className={styles.categoryLabel}>
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

      {/* Mobile view */}
      {categories.length > 0 && (
        <div className="d-block d-md-none">
          <div className={`container-fluid ${styles.giftCategoriesContainer}`}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className={styles.categoriesWrapper}>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop?category=${category.id}`}
                        className={styles.categoryItem}
                      >
                        <div className={styles.categoryContent}>
                          <img
                            src={category.icon || category.image}
                            alt={category.name}
                            className={styles.categoryImage}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/category/default-category.svg'
                            }}
                          />
                          <span className={styles.categoryLabel}>
                            {category.name}
                          </span>
                        </div>
                      </Link>
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