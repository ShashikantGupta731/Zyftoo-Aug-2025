/**
 * Modern Gift Categories Component
 * 
 * A sleek, minimalistic category display with smooth animations
 * and elegant curved design
 */

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { giftPageCategories, giftCategoriesMetadata } from "@/data/giftPageCategories";
import styles from './ModernGiftCategories.module.css';

export default function ModernGiftCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories] = useState(giftPageCategories);
  const [isClient, setIsClient] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageError = (categoryId) => {
    setImageErrors(prev => ({
      ...prev,
      [categoryId]: true
    }));
  };

  const ImageFallback = ({ name }) => (
    <div className={styles.imageFallback}>
      <span>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </span>
    </div>
  );

  if (!isClient) {
    return (
      <section className={styles.skeletonContainer}>
        <div className={styles.modernContainer}>
          <div className={styles.skeletonHeader}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonDescription}`} />
          </div>
          <div className={styles.categoriesGrid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateIcon}>
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className={styles.emptyStateTitle}>No Categories Available</h3>
          <p className={styles.emptyStateDescription}>Check back later for our gift categories.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.modernSection}>
      <div className={styles.modernContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>
            Discover
          </span>
          <h2 className={styles.sectionTitle}>
            Gift Categories
          </h2>
          <p className={styles.sectionDescription}>
            Explore our carefully curated collection of gifts for every occasion and person you care about
          </p>
        </div>

        {/* Categories Grid */}
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug || category.id}`}
              className={styles.categoryCard}
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Category Image */}
              <div className={styles.categoryImageContainer}>
                {imageErrors[category.id] ? (
                  <ImageFallback name={category.name} />
                ) : (
                  <img
                    src={category.image}
                    alt={category.name}
                    className={styles.categoryImage}
                    onError={() => handleImageError(category.id)}
                  />
                )}
              </div>

              {/* Category Info */}
              <div className={styles.categoryContent}>
                <h3 className={styles.categoryName}>
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className={styles.categoryDescription}>
                    {category.description}
                  </p>
                )}

                {/* Stats */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <span className={styles.subcategoryCount}>
                    {category.subcategories.length} subcategories
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && giftCategoriesMetadata && (
          <div style={{ marginTop: '64px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px', color: '#6c757d' }}>
            <strong>Debug Info:</strong> Categories loaded from {giftCategoriesMetadata.source || 'static'} • 
            Last updated: {giftCategoriesMetadata.lastUpdated ? new Date(giftCategoriesMetadata.lastUpdated).toLocaleString() : 'Unknown'} • 
            Count: {categories.length}
          </div>
        )}
      </div>
    </section>
  );
}
