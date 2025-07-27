/**
 * Modern Gift Categories Component
 * 
 * A sleek, minimalistic category display with smooth animations
 * and elegant curved design
 */

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { giftPageCategories, giftCategoriesMetadata } from "@/data/giftPageCategoriesData";
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
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className={styles.horizontalCategoriesSection}>
        <div className={styles.horizontalContainer}>
          <div className={styles.emptyState}>
            <span className={styles.emptyStateText}>No categories available</span>
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
            <Link
              key={category.id}
              href={`/shop?category=${category.slug || category.id}`}
              className={`${styles.categoryNavItem} ${activeCategory === category.id ? styles.active : ''}`}
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
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
          ))}
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && giftCategoriesMetadata && (
          <div style={{ marginTop: '32px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', fontSize: '12px', color: '#6c757d', textAlign: 'center' }}>
            <strong>Debug:</strong> {categories.length} categories loaded • {giftCategoriesMetadata.source || 'static'}
          </div>
        )}
      </div>
    </section>
  );
}
