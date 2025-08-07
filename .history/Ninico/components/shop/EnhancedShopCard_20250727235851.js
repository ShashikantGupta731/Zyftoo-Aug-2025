'use client'
import Link from "next/link"
import { useContext } from "react"
import AuthContext from '@/components/context/AuthContext'
import { getDisplayPrice, formatPrice, shouldShowCorporatePricing } from '@/util/productPricingHelper'

const EnhancedShopCard = ({ item, addToCart, addToWishlist }) => {
    const { user } = useContext(AuthContext)
    
    // Convert legacy item format to new pricing format for compatibility
    const enhancedItem = {
        ...item,
        price: item.price?.max * 100 || 0, // Legacy compatibility
        retailPrice: item.retailPrice || {
            mrp: item.price?.max * 100 || 0,
            sellingPrice: item.price?.max * 100 || 0,
            discount: 0,
            currency: 'INR'
        },
        corporatePricing: item.corporatePricing || { enabled: false }
    }

    const pricingInfo = getDisplayPrice(enhancedItem, user, 1)
    const isCorporateUser = user?.userType === 'Corporate'
    const showCorporateFeatures = shouldShowCorporatePricing(user, enhancedItem)

    // Determine the appropriate detail page URL
    const detailUrl = isCorporateUser && enhancedItem.corporatePricing?.enabled 
        ? `/corporate/shop-details/${item.id}` 
        : `/shop-details/${item.id}`

    return (
        <>
            <div className="col">
                <div className="tpproduct tpproductitem mb-15 p-relative">
                    {/* Corporate Badge */}
                    {showCorporateFeatures && (
                        <div className="position-absolute" style={{ top: '10px', left: '10px', zIndex: 10 }}>
                            <span className="badge bg-primary">Corporate</span>
                        </div>
                    )}
                    
                    <div className="tpproduct__thumb">
                        <div className="tpproduct__thumbitem p-relative">
                            <Link href={detailUrl}>
                                <img src={`/assets/img/product/${item.imgf}`} alt="product-thumb" />
                                <img className="thumbitem-secondary" src={`/assets/img/product/${item.imgb}`} alt="product-thumb" />
                            </Link>
                            <div className="tpproduct__thumb-bg">
                                <div className="tpproductactionbg">
                                    <a onClick={() => addToCart(item.id)} className="add-to-cart">
                                        <i className="fal fa-shopping-basket" />
                                    </a>
                                    <Link href="#"><i className="fal fa-exchange" /></Link>
                                    <Link href={detailUrl}><i className="fal fa-eye" /></Link>
                                    <a onClick={() => addToWishlist(item.id)} className="wishlist">
                                        <i className="fal fa-heart" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tpproduct__content-area">
                        <h3 className="tpproduct__title mb-5">
                            <Link href={detailUrl}>{item.title}</Link>
                        </h3>
                        
                        <div className="tpproduct__priceinfo p-relative">
                            {/* Standard Price Display */}
                            <div className="tpproduct__ammount">
                                {pricingInfo.originalPrice !== pricingInfo.price && (
                                    <span className="text-muted text-decoration-line-through me-2">
                                        {formatPrice(pricingInfo.originalPrice)}
                                    </span>
                                )}
                                <span className="text-primary fw-bold">
                                    {formatPrice(pricingInfo.price)}
                                </span>
                            </div>
                            
                            {/* Corporate Pricing Preview */}
                            {showCorporateFeatures && enhancedItem.corporatePricing.priceTiers?.length > 0 && (
                                <div className="corporate-pricing-preview mt-1">
                                    <small className="text-muted">
                                        Bulk: From {formatPrice(Math.min(...enhancedItem.corporatePricing.priceTiers.map(t => t.pricePerUnit)))}
                                    </small>
                                </div>
                            )}
                            
                            {/* Discount Badge */}
                            {pricingInfo.discount > 0 && (
                                <div className="position-absolute top-0 end-0">
                                    <span className="badge bg-danger">{pricingInfo.discount}% OFF</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="tpproduct__ratingarea">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="tpproductdot">
                                <Link className="tpproductdot__variationitem" href={detailUrl}>
                                    <div className="tpproductdot__termshape">
                                        <span className="tpproductdot__termshape-bg" />
                                        <span className="tpproductdot__termshape-border" />
                                    </div>
                                </Link>
                                <Link className="tpproductdot__variationitem" href={detailUrl}>
                                    <div className="tpproductdot__termshape">
                                        <span className="tpproductdot__termshape-bg red-product-bg" />
                                        <span className="tpproductdot__termshape-border red-product-border" />
                                    </div>
                                </Link>
                                <Link className="tpproductdot__variationitem" href={detailUrl}>
                                    <div className="tpproductdot__termshape">
                                        <span className="tpproductdot__termshape-bg orange-product-bg" />
                                        <span className="tpproductdot__termshape-border orange-product-border" />
                                    </div>
                                </Link>
                                <Link className="tpproductdot__variationitem" href={detailUrl}>
                                    <div className="tpproductdot__termshape">
                                        <span className="tpproductdot__termshape-bg purple-product-bg" />
                                        <span className="tpproductdot__termshape-border purple-product-border" />
                                    </div>
                                </Link>
                            </div>
                            <div className="tpproduct__rating">
                                <ul>
                                    <li>
                                        <Link href="#"><i className="fas fa-star" /></Link>
                                        <Link href="#"><i className="fas fa-star" /></Link>
                                        <Link href="#"><i className="fas fa-star" /></Link>
                                        <Link href="#"><i className="fas fa-star" /></Link>
                                        <Link href="#"><i className="far fa-star" /></Link>
                                    </li>
                                    <li>
                                        <span>(81)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .corporate-pricing-preview {
                    font-size: 0.75rem;
                    color: #007bff;
                }
                
                .badge {
                    font-size: 0.65rem;
                }
                
                .position-absolute .badge {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            `}</style>
        </>
    )
}

export default EnhancedShopCard
