/**
 * Modern Gift Categories Component
 * 
 * A sleek, minimalistic category display with smooth animations
 * and elegant curved design
 */

"use client";

import Link from "next/link";
import Image from "next/image";
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
              onMouseEnter={() => setActiveCategory(category._id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link href={`/shop?category=${category.slug || category._id}`}>
                <div className="relative">
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    {imageErrors[category._id] ? (
                      <ImageFallback name={category.name} />
                    ) : (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(category._id)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Content */}
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub._id}
                              className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-modern-md"
                            >
                              {sub.name}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-modern-md">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {category.subcategories && category.subcategories.length > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {category.subcategories.length} subcategories
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                        Explore
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ModernCard>
          ))}
        </div>

        {/* View All Button */}
        {categories.length > 8 && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-modern-xl font-medium hover:bg-blue-700 transition-colors shadow-modern-lg hover:shadow-modern-xl"
            >
              View All Categories
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && giftCategoriesMetadata && (
          <div className="mt-16 p-4 bg-gray-100 rounded-modern-lg text-sm text-gray-600">
            <strong>Debug Info:</strong> Categories loaded from {giftCategoriesMetadata.source || 'static'} • 
            Last updated: {giftCategoriesMetadata.lastUpdated ? new Date(giftCategoriesMetadata.lastUpdated).toLocaleString() : 'Unknown'} • 
            Count: {categories.length}
          </div>
        )}
      </div>
    </section>
  );
}
