
/**
 * Corporate Home Page
 * Protected landing page for authenticated corporate users
 */

'use client'
import { useContext } from 'react'
import Layout from "@/components/layout/Layout"
import CorporateProtectedRoute from '@/components/auth/CorporateProtectedRoute'
import AuthContext from '@/components/context/AuthContext'
import Banner2 from "@/components/sections/Banner2"
import Blog2 from "@/components/sections/Blog2"
import Brand2 from "@/components/sections/Brand2"
import DealProduct2 from "@/components/sections/DealProduct2"
import Product3 from "@/components/sections/Product3"
import Product2 from "@/components/sections/Product2"
import Services from "@/components/sections/Services"
import Slider3 from "@/components/sections/Slider3"
import WhiteProduct from "@/components/sections/WhiteProduct"
import ModernGiftCategories from "@/components/sections/ModernGiftCategories"
import PlatinamProduct from "@/components/sections/PlatinamProduct"
import Link from "next/link"
import Banner1 from "@/components/sections/Banner1"

console.log('📄 === CORPORATE HOME PAGE LOADED ===')
console.log('📦 ModernGiftCategories imported:', typeof ModernGiftCategories)

export default function CorporateHome() {
    const { user, logout } = useContext(AuthContext)

    const handleLogout = () => {
        logout()
        // Redirect will be handled by AuthContext
    }

    return (
        <CorporateProtectedRoute>
            <Layout headerStyle={1} footerStyle={2}>
                {/* Corporate Welcome Banner */}
                <section className="corporate-welcome-area pt-80 pb-40">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="corporate-welcome-banner">
                                    <div className="welcome-content">
                                        <h1 className="corporate-title">
                                            Welcome, {user?.name || 'Corporate User'}
                                        </h1>
                                        <p className="corporate-subtitle">
                                            {user?.companyDetails?.companyName && (
                                                <>Exclusive corporate portal for <strong>{user.companyDetails.companyName}</strong></>
                                            )}
                                            {!user?.companyDetails?.companyName && (
                                                <>Access exclusive corporate benefits and pricing</>
                                            )}
                                        </p>
                                        <div className="corporate-actions">
                                            <Link href="/corporate/bulk-order" className="btn btn-corporate-primary">
                                                <i className="fal fa-shopping-cart"></i> Start Bulk Order
                                            </Link>
                                            <Link href="/corporate/products" className="btn btn-corporate-secondary">
                                                <i className="fal fa-boxes"></i> Browse Corporate Products
                                            </Link>
                                            <Link href="/corporate/orders" className="btn btn-corporate-secondary">
                                                <i className="fal fa-history"></i> View Orders
                                            </Link>
                                            <button onClick={handleLogout} className="btn btn-corporate-outline">
                                                <i className="fal fa-sign-out-alt"></i> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Corporate Enhanced E-commerce Sections */}
                <ModernGiftCategories />
                
                {/* Enhanced Product Sections with Corporate Pricing */}
                <section className="product-area pb-65">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="tpsection mb-40">
                                    <h4 className="tpsection__title">Corporate Recommended Products</h4>
                                    <p className="text-muted">Specially curated for corporate clients with bulk pricing</p>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tpproductall text-end">
                                    <Link href="/corporate/products" className="btn btn-primary">
                                        View All Corporate Products<i className="far fa-long-arrow-right ms-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct">
                            <CorporateAwareFilterShopBox itemStart={0} itemEnd={10} useCorporateCard={true} />
                        </div>
                    </div>
                </section>
                
                <Slider3 />
                <Banner1 />
                <Product2 />
                <Product3 />
                <Banner2 />

                <style jsx>{`
                    .corporate-welcome-area {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        position: relative;
                        overflow: hidden;
                    }

                    .corporate-welcome-area::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        right: -20%;
                        width: 40%;
                        height: 200%;
                        background: rgba(255,255,255,0.1);
                        border-radius: 50%;
                        z-index: 1;
                    }

                    .corporate-welcome-banner {
                        background: rgba(255,255,255,0.1);
                        border-radius: 20px;
                        padding: 60px 40px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255,255,255,0.2);
                        position: relative;
                        z-index: 2;
                    }

                    .welcome-content {
                        text-align: center;
                        color: white;
                    }

                    .corporate-title {
                        font-size: 42px;
                        font-weight: 700;
                        margin-bottom: 15px;
                        color: white;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .corporate-subtitle {
                        font-size: 20px;
                        opacity: 0.9;
                        margin-bottom: 40px;
                        line-height: 1.6;
                    }

                    .corporate-actions {
                        display: flex;
                        gap: 20px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .btn-corporate-primary {
                        background: rgba(255,255,255,0.2);
                        border: 2px solid rgba(255,255,255,0.3);
                        color: white;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-weight: 600;
                        text-decoration: none;
                        transition: all 0.3s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .btn-corporate-primary:hover {
                        background: rgba(255,255,255,0.3);
                        border-color: rgba(255,255,255,0.5);
                        color: white;
                        text-decoration: none;
                        transform: translateY(-2px);
                    }

                    .btn-corporate-secondary {
                        background: transparent;
                        border: 2px solid rgba(255,255,255,0.4);
                        color: white;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-weight: 600;
                        text-decoration: none;
                        transition: all 0.3s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .btn-corporate-secondary:hover {
                        background: rgba(255,255,255,0.1);
                        border-color: rgba(255,255,255,0.6);
                        color: white;
                        text-decoration: none;
                        transform: translateY(-2px);
                    }

                    .btn-corporate-outline {
                        background: transparent;
                        border: 2px solid rgba(255,255,255,0.3);
                        color: rgba(255,255,255,0.8);
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        cursor: pointer;
                    }

                    .btn-corporate-outline:hover {
                        background: rgba(255,255,255,0.1);
                        border-color: rgba(255,255,255,0.5);
                        color: white;
                        transform: translateY(-2px);
                    }

                    @media (max-width: 768px) {
                        .corporate-title {
                            font-size: 32px;
                        }

                        .corporate-subtitle {
                            font-size: 18px;
                        }

                        .corporate-actions {
                            flex-direction: column;
                            align-items: center;
                        }

                        .corporate-welcome-banner {
                            padding: 40px 20px;
                        }
                    }
                `}</style>
            </Layout>
        </CorporateProtectedRoute>
    )
}