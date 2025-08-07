'use client'
import Layout from "@/components/layout/Layout"
import CorporateProtectedRoute from '@/components/auth/CorporateProtectedRoute'
import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import AuthContext from '@/components/context/AuthContext'
import { getDisplayPrice, formatPrice, shouldShowCorporatePricing } from '@/util/productPricingHelper'

export default function CorporateProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const { user } = useContext(AuthContext)

    useEffect(() => {
        loadCorporateProducts()
    }, [])

    const loadCorporateProducts = async () => {
        setLoading(true)
        try {
            // In production, this would fetch from /api/products/corporate
            // For now, using sample data with corporate pricing
            const sampleProducts = [
                {
                    id: 1,
                    name: "Corporate Gift Package - Premium Set",
                    price: 499,
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
                            { minQuantity: 50, maxQuantity: 99, pricePerUnit: 450, discount: 10 },
                            { minQuantity: 100, maxQuantity: 499, pricePerUnit: 399, discount: 20 },
                            { minQuantity: 500, maxQuantity: null, pricePerUnit: 349, discount: 30 }
                        ]
                    },
                    image: "/assets/img/product/product-1.jpg",
                    category: "Corporate Gifts",
                    minOrder: 50
                },
                {
                    id: 2,
                    name: "Branded Corporate Merchandise",
                    price: 299,
                    retailPrice: {
                        mrp: 399,
                        sellingPrice: 299,
                        discount: 5,
                        currency: 'INR'
                    },
                    corporatePricing: {
                        enabled: true,
                        minimumOrderQuantity: 100,
                        priceTiers: [
                            { minQuantity: 100, maxQuantity: 249, pricePerUnit: 270, discount: 10 },
                            { minQuantity: 250, maxQuantity: 499, pricePerUnit: 249, discount: 17 },
                            { minQuantity: 500, maxQuantity: null, pricePerUnit: 220, discount: 26 }
                        ]
                    },
                    image: "/assets/img/product/product-2.jpg",
                    category: "Branded Items",
                    minOrder: 100
                },
                {
                    id: 3,
                    name: "Executive Office Supplies Bundle",
                    price: 199,
                    retailPrice: {
                        mrp: 299,
                        sellingPrice: 199,
                        discount: 15,
                        currency: 'INR'
                    },
                    corporatePricing: {
                        enabled: true,
                        minimumOrderQuantity: 25,
                        priceTiers: [
                            { minQuantity: 25, maxQuantity: 49, pricePerUnit: 180, discount: 10 },
                            { minQuantity: 50, maxQuantity: 99, pricePerUnit: 160, discount: 20 },
                            { minQuantity: 100, maxQuantity: null, pricePerUnit: 140, discount: 30 }
                        ]
                    },
                    image: "/assets/img/product/product-3.jpg",
                    category: "Office Supplies",
                    minOrder: 25
                }
            ]
            
            setProducts(sampleProducts)
        } catch (error) {
            console.error('Error loading corporate products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(product => {
        if (filter === 'all') return true
        return product.category.toLowerCase().includes(filter.toLowerCase())
    })

    if (loading) {
        return (
            <CorporateProtectedRoute>
                <Layout headerStyle={1} footerStyle={2}>
                    <div className="container py-5">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading corporate products...</p>
                        </div>
                    </div>
                </Layout>
            </CorporateProtectedRoute>
        )
    }

    return (
        <CorporateProtectedRoute>
            <Layout headerStyle={1} footerStyle={2}>
                {/* Header Section */}
                <section className="corporate-products-header py-5 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <h1 className="display-5 fw-bold">Corporate Products</h1>
                                <p className="lead">
                                    Exclusive bulk pricing for corporate clients. Save more with larger quantities.
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <div className="corporate-benefits-box bg-white text-dark p-4 rounded">
                                    <h6 className="fw-bold text-primary">Corporate Benefits</h6>
                                    <ul className="list-unstyled small mb-0">
                                        <li>✓ Volume discounts up to 40%</li>
                                        <li>✓ Custom packaging</li>
                                        <li>✓ Priority support</li>
                                        <li>✓ Flexible payment terms</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter Section */}
                <section className="py-4 bg-light">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <h5 className="mb-3 mb-md-0">Filter Products</h5>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex gap-2 flex-wrap">
                                    <button 
                                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                        onClick={() => setFilter('all')}
                                    >
                                        All Products
                                    </button>
                                    <button 
                                        className={`btn ${filter === 'gifts' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                        onClick={() => setFilter('gifts')}
                                    >
                                        Corporate Gifts
                                    </button>
                                    <button 
                                        className={`btn ${filter === 'branded' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                        onClick={() => setFilter('branded')}
                                    >
                                        Branded Items
                                    </button>
                                    <button 
                                        className={`btn ${filter === 'office' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                        onClick={() => setFilter('office')}
                                    >
                                        Office Supplies
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            {filteredProducts.map(product => {
                                const pricingInfo = getDisplayPrice(product, user, product.minOrder)
                                const lowestTierPrice = product.corporatePricing?.priceTiers?.length > 0 ? 
                                    Math.min(...product.corporatePricing.priceTiers.map(t => t.pricePerUnit)) : pricingInfo.price

                                return (
                                    <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                                        <div className="card h-100 corporate-product-card">
                                            <div className="position-relative">
                                                <img 
                                                    src={product.image} 
                                                    className="card-img-top" 
                                                    alt={product.name}
                                                    style={{ height: '250px', objectFit: 'cover' }}
                                                />
                                                <div className="position-absolute top-0 start-0 m-2">
                                                    <span className="badge bg-primary">Corporate Exclusive</span>
                                                </div>
                                                {product.corporatePricing?.priceTiers?.length > 0 && (
                                                    <div className="position-absolute top-0 end-0 m-2">
                                                        <span className="badge bg-success">
                                                            Up to {Math.max(...product.corporatePricing.priceTiers.map(t => t.discount))}% Off
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="text-muted small">{product.category}</p>
                                                
                                                {/* Pricing Display */}
                                                <div className="pricing-section mb-3">
                                                    <div className="retail-price text-muted small">
                                                        Retail: <span className="text-decoration-line-through">{formatPrice(pricingInfo.originalPrice)}</span>
                                                    </div>
                                                    <div className="corporate-price">
                                                        <span className="h6 text-primary mb-0">
                                                            From {formatPrice(lowestTierPrice)}/unit
                                                        </span>
                                                    </div>
                                                    <div className="min-order text-muted small">
                                                        Min. order: {product.minOrder} units
                                                    </div>
                                                </div>

                                                {/* Tier Preview */}
                                                {shouldShowCorporatePricing(user, product) && (
                                                    <div className="tiers-preview mb-3">
                                                        <small className="text-muted">Bulk Pricing:</small>
                                                        <div className="small">
                                                            {product.corporatePricing.priceTiers.slice(0, 2).map((tier, index) => (
                                                                <div key={index} className="d-flex justify-content-between">
                                                                    <span>{tier.minQuantity}+ units:</span>
                                                                    <span className="text-primary fw-bold">{formatPrice(tier.pricePerUnit)}</span>
                                                                </div>
                                                            ))}
                                                            {product.corporatePricing.priceTiers.length > 2 && (
                                                                <div className="text-center">
                                                                    <small className="text-muted">...and more tiers</small>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-auto">
                                                    <Link 
                                                        href={`/corporate/shop-details/${product.id}`}
                                                        className="btn btn-primary w-100"
                                                    >
                                                        View Details & Order
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-5">
                                <h4>No products found</h4>
                                <p className="text-muted">Try adjusting your filters or contact support for custom requirements.</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setFilter('all')}
                                >
                                    View All Products
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-lg-8 mx-auto">
                                <h3>Need Custom Solutions?</h3>
                                <p className="lead">
                                    Our corporate team can help you with custom packaging, branding, and special requirements.
                                </p>
                                <div className="d-flex gap-3 justify-content-center flex-wrap">
                                    <button className="btn btn-primary btn-lg">
                                        <i className="fal fa-phone me-2"></i>
                                        Contact Corporate Team
                                    </button>
                                    <button className="btn btn-outline-primary btn-lg">
                                        <i className="fal fa-file-alt me-2"></i>
                                        Request Custom Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <style jsx>{`
                    .corporate-product-card {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        border: none;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    
                    .corporate-product-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    }
                    
                    .pricing-section {
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 8px;
                        border-left: 4px solid #007bff;
                    }
                    
                    .tiers-preview {
                        background: #e3f2fd;
                        padding: 0.75rem;
                        border-radius: 6px;
                    }
                    
                    .corporate-benefits-box {
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }
                `}</style>
            </Layout>
        </CorporateProtectedRoute>
    )
}
