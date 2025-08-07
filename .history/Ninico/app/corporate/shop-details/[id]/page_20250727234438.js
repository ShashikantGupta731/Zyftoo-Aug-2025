'use client'
import Layout from "@/components/layout/Layout"
import CorporateProtectedRoute from '@/components/auth/CorporateProtectedRoute'
import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { useParams } from 'next/navigation'
import AuthContext from '@/components/context/AuthContext'
import { getDisplayPrice, formatPrice, shouldShowCorporatePricing, getMinimumCorporateQuantity, requiresCustomQuote } from '@/util/productPricingHelper'

export default function CorporateProductDetails() {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedTier, setSelectedTier] = useState(null)
    const [showQuoteModal, setShowQuoteModal] = useState(false)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    
    const { user } = useContext(AuthContext)
    const params = useParams()
    
    useEffect(() => {
        const productId = params.id
        if (productId) {
            loadProduct(productId)
        }
    }, [params.id])

    useEffect(() => {
        if (product && shouldShowCorporatePricing(user, product)) {
            const minQty = getMinimumCorporateQuantity(product)
            setQuantity(minQty)
            
            // Auto-select first tier
            if (product.corporatePricing?.priceTiers?.length > 0) {
                setSelectedTier(0)
            }
        }
    }, [product, user])
    
    const loadProduct = async (id) => {
        setLoading(true)
        try {
            // In production, this would be an API call to the corporate products endpoint
            // For now, using sample data with corporate pricing
            const sampleProduct = {
                id: id,
                name: "Corporate Gift Package - Premium Set",
                price: 499, // Legacy price for compatibility
                retailPrice: {
                    mrp: 699,
                    sellingPrice: 499,
                    discount: 10,
                    currency: 'INR'
                },
                corporatePricing: {
                    enabled: true,
                    minimumOrderQuantity: 50,
                    priceTiers: [
                        {
                            minQuantity: 50,
                            maxQuantity: 99,
                            pricePerUnit: 450,
                            discount: 10,
                            description: "Small bulk order discount"
                        },
                        {
                            minQuantity: 100,
                            maxQuantity: 499,
                            pricePerUnit: 399,
                            discount: 20,
                            description: "Medium bulk order - Best value"
                        },
                        {
                            minQuantity: 500,
                            maxQuantity: 999,
                            pricePerUnit: 349,
                            discount: 30,
                            description: "Large bulk order - Premium savings"
                        },
                        {
                            minQuantity: 1000,
                            maxQuantity: null,
                            pricePerUnit: 299,
                            discount: 40,
                            description: "Enterprise level pricing"
                        }
                    ],
                    customQuoteThreshold: 5000
                },
                category: "Corporate Gifts",
                rating: 4.5,
                reviews: 150,
                stock: "In Stock",
                sku: "CORP-GFT-001",
                description: "Premium corporate gift package perfect for employee appreciation, client gifts, and corporate events. Includes high-quality items that represent your brand professionally.",
                images: [
                    "/assets/img/product/product-1.jpg",
                    "/assets/img/product/product-2.jpg",
                    "/assets/img/product/product-3.jpg"
                ],
                categories: ["Corporate Gifts", "Premium", "Bulk Orders"],
                tags: ["corporate", "gifts", "premium", "bulk"]
            }
            
            setProduct(sampleProduct)
        } catch (error) {
            console.error('Error loading product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleQuantityChange = (newQuantity) => {
        const qty = Math.max(1, parseInt(newQuantity) || 1)
        setQuantity(qty)
        
        // Auto-select appropriate tier
        if (product?.corporatePricing?.priceTiers) {
            const tierIndex = product.corporatePricing.priceTiers.findIndex(tier => 
                qty >= tier.minQuantity && (!tier.maxQuantity || qty <= tier.maxQuantity)
            )
            setSelectedTier(tierIndex >= 0 ? tierIndex : null)
        }
    }

    const handleTierSelect = (tierIndex) => {
        const tier = product.corporatePricing.priceTiers[tierIndex]
        if (tier) {
            setSelectedTier(tierIndex)
            setQuantity(tier.minQuantity)
        }
    }

    const pricingInfo = product ? getDisplayPrice(product, user, quantity) : null
    const totalPrice = pricingInfo ? pricingInfo.price * quantity : 0
    const needsQuote = product ? requiresCustomQuote(product, quantity) : false

    if (loading) {
        return (
            <CorporateProtectedRoute>
                <Layout headerStyle={1} footerStyle={2}>
                    <div className="container py-5">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading product details...</p>
                        </div>
                    </div>
                </Layout>
            </CorporateProtectedRoute>
        )
    }

    if (!product) {
        return (
            <CorporateProtectedRoute>
                <Layout headerStyle={1} footerStyle={2}>
                    <div className="container py-5">
                        <div className="text-center">
                            <h1>Product Not Found</h1>
                            <Link href="/CorporateHome" className="btn btn-primary mt-3">
                                Back to Corporate Home
                            </Link>
                        </div>
                    </div>
                </Layout>
            </CorporateProtectedRoute>
        )
    }

    return (
        <CorporateProtectedRoute>
            <Layout headerStyle={1} footerStyle={2}>
                <section className="tpshop-area pt-80 pb-80">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                {/* Product Images */}
                                <div className="tpproduct-details__img">
                                    <div className="tpproduct-details__img-main">
                                        <img 
                                            src={product.images[activeImageIndex]} 
                                            alt={product.name}
                                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="tpproduct-details__img-thumbs mt-3">
                                        <div className="d-flex gap-2">
                                            {product.images.map((image, index) => (
                                                <img 
                                                    key={index}
                                                    src={image} 
                                                    alt={`${product.name} view ${index + 1}`}
                                                    style={{ 
                                                        width: '80px', 
                                                        height: '80px', 
                                                        objectFit: 'cover',
                                                        cursor: 'pointer',
                                                        border: activeImageIndex === index ? '2px solid #007bff' : '1px solid #ddd'
                                                    }}
                                                    onClick={() => setActiveImageIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-6">
                                {/* Product Info */}
                                <div className="tpproduct-details__content">
                                    {/* Corporate Badge */}
                                    <div className="corporate-badge mb-3">
                                        <span className="badge bg-primary">Corporate Exclusive</span>
                                        <span className="badge bg-success ms-2">Bulk Pricing Available</span>
                                    </div>

                                    <h3 className="tpproduct-details__title">{product.name}</h3>
                                    
                                    <div className="tpproduct-details__meta mb-3">
                                        <span>SKU: <strong>{product.sku}</strong></span>
                                        <span className="ms-3">Category: <strong>{product.category}</strong></span>
                                        <span className="ms-3 text-success">✓ {product.stock}</span>
                                    </div>

                                    {/* Corporate Pricing Tiers */}
                                    {shouldShowCorporatePricing(user, product) && (
                                        <div className="corporate-pricing-section mb-4">
                                            <h4>Bulk Pricing Tiers</h4>
                                            <div className="pricing-tiers">
                                                {product.corporatePricing.priceTiers.map((tier, index) => (
                                                    <div 
                                                        key={index}
                                                        className={`tier-card p-3 mb-2 border rounded cursor-pointer ${selectedTier === index ? 'border-primary bg-light' : 'border-secondary'}`}
                                                        onClick={() => handleTierSelect(index)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>
                                                                    {tier.minQuantity} - {tier.maxQuantity || '∞'} units
                                                                </strong>
                                                                <div className="text-muted small">{tier.description}</div>
                                                            </div>
                                                            <div className="text-end">
                                                                <div className="price fw-bold text-primary">
                                                                    {formatPrice(tier.pricePerUnit)}/unit
                                                                </div>
                                                                {tier.discount > 0 && (
                                                                    <div className="text-success small">
                                                                        Save {tier.discount}%
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity & Pricing */}
                                    <div className="quantity-pricing-section mb-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="form-label">Quantity:</label>
                                                <div className="input-group">
                                                    <button 
                                                        className="btn btn-outline-secondary" 
                                                        onClick={() => handleQuantityChange(quantity - 1)}
                                                        disabled={quantity <= getMinimumCorporateQuantity(product)}
                                                    >
                                                        -
                                                    </button>
                                                    <input 
                                                        type="number" 
                                                        className="form-control text-center"
                                                        value={quantity}
                                                        min={getMinimumCorporateQuantity(product)}
                                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                                    />
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <small className="text-muted">
                                                    Minimum order: {getMinimumCorporateQuantity(product)} units
                                                </small>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="pricing-display">
                                                    <div className="unit-price">
                                                        <small>Price per unit:</small>
                                                        <div className="h5 text-primary mb-1">
                                                            {formatPrice(pricingInfo?.price || 0)}
                                                        </div>
                                                    </div>
                                                    <div className="total-price">
                                                        <small>Total amount:</small>
                                                        <div className="h4 fw-bold text-success">
                                                            {formatPrice(totalPrice)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="product-actions mb-4">
                                        {needsQuote ? (
                                            <button 
                                                className="btn btn-warning btn-lg me-3"
                                                onClick={() => setShowQuoteModal(true)}
                                            >
                                                <i className="fal fa-file-alt me-2"></i>
                                                Request Custom Quote
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary btn-lg me-3">
                                                    <i className="fal fa-shopping-cart me-2"></i>
                                                    Add to Cart
                                                </button>
                                                <button className="btn btn-success btn-lg">
                                                    <i className="fal fa-credit-card me-2"></i>
                                                    Quick Order
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Corporate Benefits */}
                                    <div className="corporate-benefits">
                                        <h5>Corporate Benefits</h5>
                                        <ul className="list-unstyled">
                                            <li><i className="fal fa-check text-success me-2"></i>Free bulk shipping</li>
                                            <li><i className="fal fa-check text-success me-2"></i>Custom packaging with your logo</li>
                                            <li><i className="fal fa-check text-success me-2"></i>GST invoice provided</li>
                                            <li><i className="fal fa-check text-success me-2"></i>Net 30/60 payment terms available</li>
                                            <li><i className="fal fa-check text-success me-2"></i>Priority customer support</li>
                                            <li><i className="fal fa-check text-success me-2"></i>Volume discounts on repeat orders</li>
                                        </ul>
                                    </div>

                                    {/* Product Description */}
                                    <div className="product-description mt-4">
                                        <h5>Product Description</h5>
                                        <p>{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Custom Quote Modal */}
                {showQuoteModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Request Custom Quote</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close"
                                        onClick={() => setShowQuoteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="quote-details mb-3">
                                        <h6>Quote Details</h6>
                                        <p><strong>Product:</strong> {product.name}</p>
                                        <p><strong>Quantity:</strong> {quantity.toLocaleString()} units</p>
                                        <p><strong>Estimated Value:</strong> {formatPrice(totalPrice)}</p>
                                    </div>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Additional Requirements</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="4"
                                                placeholder="Please describe any specific requirements, customization needs, delivery timeline, etc."
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Expected Delivery Date</label>
                                            <input type="date" className="form-control" />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setShowQuoteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Submit Quote Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .corporate-badge .badge {
                        font-size: 0.8em;
                    }
                    
                    .pricing-tiers .tier-card {
                        transition: all 0.3s ease;
                    }
                    
                    .pricing-tiers .tier-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    
                    .pricing-display {
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 8px;
                        border: 1px solid #dee2e6;
                    }
                    
                    .corporate-benefits ul li {
                        padding: 0.25rem 0;
                    }
                    
                    .quantity-pricing-section .input-group {
                        max-width: 150px;
                    }
                `}</style>
            </Layout>
        </CorporateProtectedRoute>
    )
}
