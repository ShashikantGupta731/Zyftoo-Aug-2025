/**
 * Modern Gift Categories Component
 * 
 * A sleek, minimalistic category display with smooth animations
 * and elegant curved design. Now with dynamic data loading.
 */

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { giftPageCategories, giftCategoriesMetadata } from "@/data/giftPageCategoriesData";
import styles from './ModernGiftCategories.module.css';

export default function ModernGiftCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [dataSource, setDataSource] = useState('loading'); // 'api', 'static', 'loading', 'error'

  useEffect(() => {
    setIsClient(true);
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    try {
      setIsLoading(true);
      setDataSource('loading');

      // TODO: Replace this URL with your actual API endpoint
      const API_ENDPOINT = '/api/gift-categories'; // You'll provide this later
      
      console.log('🔄 Attempting to fetch categories from API...');
      
      // Try to fetch from API first
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const apiData = await response.json();
      
      // Validate the API response structure
      if (!apiData.categories || !Array.isArray(apiData.categories)) {
        throw new Error('Invalid API response structure');
      }

      // Use API data
      setCategories(apiData.categories);
      setMetadata(apiData.metadata || {
        ...giftCategoriesMetadata,
        source: 'api',
        lastUpdated: new Date().toISOString()
      });
      setDataSource('api');
      
      console.log('✅ Successfully loaded categories from API', {
        count: apiData.categories.length,
        source: 'api'
      });

    } catch (error) {
      console.warn('⚠️ API fetch failed, falling back to static data:', error.message);
      
      // Fallback to static data
      setCategories(giftPageCategories);
      setMetadata({
        ...giftCategoriesMetadata,
        source: 'static_fallback',
        fallbackReason: error.message
      });
      setDataSource('static');
      
      console.log('📁 Using static fallback data', {
        count: giftPageCategories.length,
        source: 'static_fallback'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (categoryId) => {
    setImageErrors(prev => ({
      ...prev,
      [categoryId]: true
    }));
  };

  const handleRetryAPI = () => {
    console.log('🔄 Retrying API fetch...');
    loadCategoriesData();
  };

  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  // Loading state
  if (!isClient || isLoading) {
    return (
      <section className={styles.horizontalCategoriesSection}>
        <div className={styles.horizontalContainer}>
          <div className={styles.categoriesNavBar}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={styles.categoryNavItem}>
                <div className={`${styles.skeleton} ${styles.skeletonCircle}`} />
                <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
              </div>
            ))}
          </div>
          
          {/* Loading indicator */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              marginTop: '16px', 
              padding: '8px 12px', 
              background: '#e3f2fd', 
              borderRadius: '6px', 
              fontSize: '12px', 
              color: '#1565c0', 
              textAlign: 'center',
              border: '1px solid #bbdefb'
            }}>
              🔄 Loading categories...
            </div>
          )}
        </div>
      </section>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <section className={styles.horizontalCategoriesSection}>
        <div className={styles.horizontalContainer}>
          <div className={styles.emptyState}>
            <span className={styles.emptyStateText}>No categories available</span>
            {dataSource === 'static' && (
              <button 
                onClick={handleRetryAPI}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: '#c4986d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Retry API
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.horizontalCategoriesSection}>
      <div className={styles.horizontalContainer}>
        {/* Categories Navigation Bar */}
        <div className={styles.categoriesNavBar}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoryNavItem} ${activeCategory === category.id ? styles.active : ''}`}
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={handleCategoryLeave}
            >
              <Link
                href={`/shop?category=${category.slug || category.id}`}
                className={styles.categoryLink}
              >
                {/* Category Icon Circle */}
                <div className={styles.categoryIconCircle}>
                  {imageErrors[category.id] ? (
                    <div className={styles.iconFallback}>
                      <span>{category.name?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                  ) : (
                    <img
                      src={category.image}
                      alt={category.name}
                      className={styles.categoryIcon}
                      onError={() => handleImageError(category.id)}
                    />
                  )}
                </div>

                {/* Category Label */}
                <span className={styles.categoryLabel}>
                  {category.name}
                </span>
              </Link>

              {/* Subcategories Dropdown */}
              {activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                <div className={styles.subcategoriesDropdown}>
                  <div className={styles.subcategoriesContent}>
                    <div className={styles.subcategoriesHeader}>
                      <h4 className={styles.subcategoriesTitle}>{category.name}</h4>
                      <p className={styles.subcategoriesDescription}>
                        {category.description || `Explore all ${category.name.toLowerCase()} products`}
                      </p>
                    </div>
                    
                    <div className={styles.subcategoriesList}>
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={subcategory.link}
                          className={styles.subcategoryItem}
                        >
                          <span className={styles.subcategoryName}>{subcategory.name}</span>
                          <span className={styles.subcategoryArrow}>→</span>
                        </Link>
                      ))}
                    </div>

                    <div className={styles.subcategoriesFooter}>
                      <Link
                        href={`/shop?category=${category.slug || category.id}`}
                        className={styles.viewAllLink}
                      >
                        View All {category.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && metadata && (
          <div style={{ 
            marginTop: '24px', 
            padding: '12px', 
            background: dataSource === 'api' ? '#e8f5e8' : '#fff3cd', 
            borderRadius: '6px', 
            fontSize: '12px', 
            color: dataSource === 'api' ? '#2e7d32' : '#856404', 
            textAlign: 'center',
            border: `1px solid ${dataSource === 'api' ? '#c8e6c9' : '#ffeaa7'}`
          }}>
            <div>
              <strong>Source:</strong> {dataSource === 'api' ? '🌐 API' : '📁 Static Fallback'} • 
              <strong> Categories:</strong> {categories.length} • 
              <strong> Updated:</strong> {new Date(metadata.lastUpdated).toLocaleTimeString()}
            </div>
            
            {dataSource === 'static' && metadata.fallbackReason && (
              <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
                <strong>Fallback Reason:</strong> {metadata.fallbackReason}
              </div>
            )}
            
            {dataSource === 'static' && (
              <button 
                onClick={handleRetryAPI}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  background: '#c4986d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                🔄 Retry API
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}