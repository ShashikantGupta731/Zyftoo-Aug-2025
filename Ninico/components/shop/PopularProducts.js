import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProductAnalytics } from '../../hooks/useProductAnalytics';

const PopularProducts = ({ 
  title = "Popular Products",
  limit = 8,
  category = null,
  timeFrame = 'all', // all, daily, weekly, monthly
  showViewCount = false,
  className = "",
  showAsGrid = true,
  showForUserType = 'all' // all, individual, corporate
}) => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { 
    getPopularProducts, 
    createTrackingProps,
    getUserType 
  } = useProductAnalytics();

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUserType = getUserType();
        const effectiveUserType = showForUserType === 'all' ? 'all' : 
                                 showForUserType === 'current' ? currentUserType : 
                                 showForUserType;

        const response = await getPopularProducts({
          limit,
          category,
          timeFrame,
          userType: effectiveUserType
        });

        setPopularProducts(response.products || []);
      } catch (err) {
        console.error('Error fetching popular products:', err);
        setError('Failed to load popular products');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, [limit, category, timeFrame, showForUserType, getPopularProducts, getUserType]);

  const formatPrice = (product) => {
    const price = product.displayPrice || product.retailPrice?.sellingPrice || product.price || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatViewCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getProductLink = (product) => {
    const userType = getUserType();
    const basePath = userType === 'corporate' ? '/corporate/products' : '/shop-details';
    return `${basePath}/${product._id}`;
  };

  if (loading) {
    return (
      <div className={`popular-products ${className}`}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center mb-50">
                <h2>{title}</h2>
              </div>
            </div>
          </div>
          <div className={`row ${showAsGrid ? 'gy-30' : ''}`}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={showAsGrid ? "col-xl-3 col-lg-4 col-md-6" : "col-12"}>
                <div className="tp-product-item p-relative transition-3 mb-25">
                  <div className="tp-product-thumb p-relative fix">
                    <div className="skeleton-box" style={{ height: '200px', backgroundColor: '#f0f0f0' }}></div>
                  </div>
                  <div className="tp-product-content">
                    <div className="skeleton-box" style={{ height: '20px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}></div>
                    <div className="skeleton-box" style={{ height: '16px', backgroundColor: '#f0f0f0', width: '60%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`popular-products ${className}`}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center mb-50">
                <h2>{title}</h2>
                <p className="text-danger">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (popularProducts.length === 0) {
    return (
      <div className={`popular-products ${className}`}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center mb-50">
                <h2>{title}</h2>
                <p className="text-muted">No popular products found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`popular-products ${className}`}>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section-title text-center mb-50">
              <h2>{title}</h2>
              {timeFrame !== 'all' && (
                <p className="text-muted">
                  Most viewed {timeFrame === 'daily' ? 'today' : 
                            timeFrame === 'weekly' ? 'this week' : 
                            'this month'}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className={`row ${showAsGrid ? 'gy-30' : ''}`}>
          {popularProducts.map((product, index) => {
            const trackingProps = createTrackingProps(product, {
              listType: 'popular',
              position: index + 1,
              timeFrame
            });

            return (
              <div 
                key={product._id} 
                className={showAsGrid ? "col-xl-3 col-lg-4 col-md-6" : "col-12"}
              >
                <div className="tp-product-item p-relative transition-3 mb-25">
                  <div className="tp-product-thumb p-relative fix">
                    <Link 
                      href={getProductLink(product)}
                      {...trackingProps}
                    >
                      <Image
                        src={product.images?.[0] || "/assets/img/product/product-placeholder.jpg"}
                        alt={product.name}
                        width={270}
                        height={250}
                        className="product-image"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                    
                    {/* Popularity indicator */}
                    <div className="tp-product-badge">
                      <span className="product-hot">
                        🔥 #{index + 1}
                      </span>
                    </div>

                    {/* View count badge */}
                    {showViewCount && product.totalViews > 0 && (
                      <div className="tp-product-view-count">
                        <span className="view-count-badge">
                          👁️ {formatViewCount(product.totalViews)}
                        </span>
                      </div>
                    )}

                    {/* Corporate pricing indicator */}
                    {product.hasActiveCorporatePricing && (
                      <div className="tp-product-corporate-badge">
                        <span className="corporate-badge">
                          Bulk Pricing
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="tp-product-content">
                    <div className="tp-product-category">
                      <Link href={`/shop?category=${product.category}`}>
                        {product.category}
                      </Link>
                    </div>
                    <h3 className="tp-product-title">
                      <Link 
                        href={getProductLink(product)}
                        {...trackingProps}
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <div className="tp-product-price-wrapper">
                      <span className="tp-product-price new-price">
                        {formatPrice(product)}
                      </span>
                      {product.retailPrice?.originalPrice && 
                       product.retailPrice.originalPrice > product.displayPrice && (
                        <span className="tp-product-price old-price">
                          {formatPrice({ displayPrice: product.retailPrice.originalPrice })}
                        </span>
                      )}
                    </div>
                    
                    {/* Popularity score for debugging (remove in production) */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-muted small">
                        Score: {product.popularityRank?.toFixed(2)} | Views: {product.totalViews}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .skeleton-box {
          animation: pulse 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          100% { opacity: 0.5; }
        }

        .tp-product-view-count {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1;
        }

        .view-count-badge {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .tp-product-corporate-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          z-index: 1;
        }

        .corporate-badge {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .product-hot {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default PopularProducts;
