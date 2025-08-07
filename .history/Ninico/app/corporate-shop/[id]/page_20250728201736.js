'use client'
import Layout from "@/components/layout/Layout"
import CorporateProtectedRoute from '@/components/auth/CorporateProtectedRoute'
import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import AuthContext from '@/components/context/AuthContext'
import { getDisplayPrice, formatPrice, shouldShowCorporatePricing } from '@/util/productPricingHelper'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from 'swiper/modules'

const ShopSingleDynamicV1 = () => {
    const [activeIndex, setActiveIndex] = useState(1)
    const [selectedQuantity, setSelectedQuantity] = useState(50)
    const [selectedVariation, setSelectedVariation] = useState('default')
    const [selectedVolume, setSelectedVolume] = useState('75ml')
    const { user } = useContext(AuthContext)
    
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }

    // Sample product data - in production this would come from API based on ID
    const product = {
        id: 1,
        title: "High Quality Corporate Gift Package - Premium Set",
        category: "Corporate Gifts",
        price: { max: 499 },
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
                { minQuantity: 500, maxQuantity: 999, pricePerUnit: 349, discount: 30 },
                { minQuantity: 1000, maxQuantity: null, pricePerUnit: 299, discount: 40 }
            ]
        },
        imgf: "product-1.jpg",
        imgb: "product-2.jpg",
        minOrder: 50,
        specifications: {
            material: "Premium Quality Materials",
            customization: "Logo Printing Available",
            packaging: "Gift Box Packaging",
            warranty: "1 Year Warranty",
            origin: "Made in India",
            certification: "ISO 9001:2015"
        },
        variations: [
            { id: 'default', name: 'Standard', available: true },
            { id: 'premium', name: 'Premium', available: true },
            { id: 'deluxe', name: 'Deluxe', available: true }
        ],
        volumes: ['75ml', '100ml', '150ml']
    }

    const getCurrentPrice = () => {
        const tier = product.corporatePricing.priceTiers.find(tier => 
            selectedQuantity >= tier.minQuantity && 
            (tier.maxQuantity === null || selectedQuantity <= tier.maxQuantity)
        )
        return tier ? tier.pricePerUnit : product.price.max
    }

    const getCurrentDiscount = () => {
        const tier = product.corporatePricing.priceTiers.find(tier => 
            selectedQuantity >= tier.minQuantity && 
            (tier.maxQuantity === null || selectedQuantity <= tier.maxQuantity)
        )
        return tier ? tier.discount : 0
    }

    const addToCart = (productId) => {
        console.log(`Added product ${productId} to cart with quantity ${selectedQuantity}`)
        // Add to cart logic here
    }

    const qtyHandler = (productId, quantity) => {
        setSelectedQuantity(parseInt(quantity))
    }

    const swiperOptions = {
        modules: [Navigation],
        slidesPerView: 4,
        spaceBetween: 20,
        navigation: {
            nextEl: ".tprelated__nxt",
            prevEl: ".tprelated__prv",
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
        }
    }
    return (
        <CorporateProtectedRoute>
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Corporate Product Details">
                <section className="product-area pt-80 pb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="tpproduct-details__list-img">
                                    <div className="tpproduct-details__list-img-item">
                                        <img src={`/assets/img/product/${product.imgf}`} alt="" className="w-100" />
                                    </div>
                                    <div className="tpproduct-details__list-img-item mt-3">
                                        <img src={`/assets/img/product/${product.imgb}`} alt="" className="w-100" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="tpproduct-details__content tpproduct-details__sticky">
                                    <div className="tpproduct-details__tag-area d-flex align-items-center mb-3">
                                        <span className="tpproduct-details__tag badge bg-primary">{product.category}</span>
                                        <div className="tpproduct-details__rating ms-3">
                                            <Link href="#"><i className="fas fa-star text-warning" /></Link>
                                            <Link href="#"><i className="fas fa-star text-warning" /></Link>
                                            <Link href="#"><i className="fas fa-star text-warning" /></Link>
                                            <Link href="#"><i className="fas fa-star text-warning" /></Link>
                                            <Link href="#"><i className="far fa-star text-warning" /></Link>
                                        </div>
                                        <a className="tpproduct-details__reviewers ms-2 text-muted">47 Reviews</a>
                                    </div>
                                    
                                    <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-3">
                                        <h3 className="tpproduct-details__title">{product?.title}</h3>
                                        <span className="tpproduct-details__stock ms-auto badge bg-success">In Stock</span>
                                    </div>

                                    {/* Alibaba-style Price Display */}
                                    <div className="alibaba-price-section mb-4 p-3 border rounded bg-light">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="price-range">
                                                    <span className="text-muted small">Price Range:</span>
                                                    <div className="price-display">
                                                        <span className="current-price h4 text-primary">₹{getCurrentPrice()}</span>
                                                        <span className="text-muted"> - </span>
                                                        <span className="max-price h5">₹{product.price.max}</span>
                                                    </div>
                                                    <div className="retail-price">
                                                        <span className="text-muted small">Retail Price: </span>
                                                        <del className="text-muted">₹{product.retailPrice.mrp}</del>
                                                        <span className="badge bg-danger ms-2">{getCurrentDiscount()}% OFF</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="quantity-discount">
                                                    <span className="text-muted small">Volume Discounts:</span>
                                                    <div className="discount-tiers small">
                                                        {product.corporatePricing.priceTiers.map((tier, index) => (
                                                            <div key={index} className="d-flex justify-content-between">
                                                                <span>{tier.minQuantity}+ pcs:</span>
                                                                <span className="text-success">₹{tier.pricePerUnit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Variations Section */}
                                    <div className="variations-section mb-4">
                                        <h6 className="mb-2">Variations:</h6>
                                        <div className="variation-options d-flex gap-2 mb-3">
                                            {product.variations.map(variation => (
                                                <button 
                                                    key={variation.id}
                                                    className={`btn btn-sm ${selectedVariation === variation.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setSelectedVariation(variation.id)}
                                                >
                                                    {variation.name}
                                                </button>
                                            ))}
                                        </div>

                                        <h6 className="mb-2">Volume (ml):</h6>
                                        <div className="volume-options d-flex gap-2 mb-3">
                                            {product.volumes.map(volume => (
                                                <button 
                                                    key={volume}
                                                    className={`btn btn-sm ${selectedVolume === volume ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setSelectedVolume(volume)}
                                                >
                                                    {volume}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="tpproduct-details__pera mb-4">
                                        <p>Premium corporate gift package perfect for business relationships and employee recognition. Features customizable branding options and comes in elegant packaging suitable for corporate presentations.</p>
                                    </div>

                                    <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-4">
                                        <div className="product-quantity me-3">
                                            <label className="small text-muted">Quantity:</label>
                                            <div className="item-quantity">
                                                <input
                                                    type="number"
                                                    className="qty form-control"
                                                    name="qty"
                                                    value={selectedQuantity}
                                                    min={product.minOrder}
                                                    onChange={(e) =>
                                                        qtyHandler(product?.id, e.target.value)
                                                    }
                                                />
                                            </div>
                                            <small className="text-muted">Min order: {product.minOrder} pcs</small>
                                        </div>
                                        <div className="tpproduct-details__cart me-3">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => addToCart(product.id)}
                                            >
                                                <i className="fal fa-shopping-cart me-2" />
                                                Send Inquiry
                                            </button>
                                        </div>
                                        <div className="tpproduct-details__wishlist">
                                            <button className="btn btn-outline-secondary">
                                                <i className="fal fa-heart" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total Price Calculator */}
                                    <div className="total-price-section p-3 bg-primary text-white rounded mb-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="small">Total for {selectedQuantity} pieces:</span>
                                                <div className="h5 mb-0">₹{(getCurrentPrice() * selectedQuantity).toLocaleString()}</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="small">You save:</div>
                                                <div className="h6 mb-0">₹{((product.retailPrice.mrp - getCurrentPrice()) * selectedQuantity).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Information */}
                                    <div className="product-info-grid">
                                        <div className="row small">
                                            <div className="col-6 mb-2">
                                                <span className="text-muted">SKU:</span>
                                                <span className="ms-2">CG001-{selectedVariation.toUpperCase()}</span>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <span className="text-muted">Material:</span>
                                                <span className="ms-2">{product.specifications.material}</span>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <span className="text-muted">Origin:</span>
                                                <span className="ms-2">{product.specifications.origin}</span>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <span className="text-muted">Certification:</span>
                                                <span className="ms-2">{product.specifications.certification}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tpproduct-details__information tpproduct-details__categories mt-3">
                                        <p className="mb-1">Categories:</p>
                                        <span><Link href="#" className="text-primary">Corporate Gifts,</Link></span>
                                        <span><Link href="#" className="text-primary">Premium Items,</Link></span>
                                        <span><Link href="#" className="text-primary">Business</Link></span>
                                    </div>

                                    <div className="tpproduct-details__information tpproduct-details__social mt-3">
                                        <p className="mb-1">Share:</p>
                                        <Link href="#" className="me-2"><i className="fab fa-facebook-f" /></Link>
                                        <Link href="#" className="me-2"><i className="fab fa-twitter" /></Link>
                                        <Link href="#" className="me-2"><i className="fab fa-whatsapp" /></Link>
                                        <Link href="#" className="me-2"><i className="fab fa-linkedin" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Protections Section - Alibaba Style */}
                <section className="protections-section py-4 bg-light">
                    <div className="container">
                        <h5 className="mb-3">Protections for this product</h5>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="protection-item d-flex align-items-center">
                                    <i className="fas fa-shield-alt text-success me-2"></i>
                                    <div>
                                        <div className="fw-bold small">Secure payments</div>
                                        <div className="text-muted small">Every payment is secured</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="protection-item d-flex align-items-center">
                                    <i className="fas fa-undo text-primary me-2"></i>
                                    <div>
                                        <div className="fw-bold small">Standard refund policy</div>
                                        <div className="text-muted small">Get refund if order issues</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="protection-item d-flex align-items-center">
                                    <i className="fas fa-shipping-fast text-info me-2"></i>
                                    <div>
                                        <div className="fw-bold small">Fast delivery</div>
                                        <div className="text-muted small">Ships within 2-3 business days</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="protection-item d-flex align-items-center">
                                    <i className="fas fa-headset text-warning me-2"></i>
                                    <div>
                                        <div className="fw-bold small">24/7 Support</div>
                                        <div className="text-muted small">Dedicated customer service</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="product-setails-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tpproduct-details__navtab mb-60">
                                    <div className="tpproduct-details__nav mb-30">
                                        <ul className="nav nav-tabs pro-details-nav-btn" id="myTabs" role="tablist">
                                            <li className="nav-item" onClick={() => handleOnClick(1)}>
                                                <button className={activeIndex == 1 ? "nav-links active" : "nav-links"}>Description</button>
                                            </li>
                                            <li className="nav-item" onClick={() => handleOnClick(2)}>
                                                <button className={activeIndex == 2 ? "nav-links active" : "nav-links"}>Additional information</button>
                                            </li>
                                            <li className="nav-item" onClick={() => handleOnClick(3)}>
                                                <button className={activeIndex == 3 ? "nav-links active" : "nav-links"}>Reviews (2)</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content tp-content-tab" id="myTabContent-2">
                                        <div className={activeIndex == 1 ? "tab-para tab-pane fade show active" : "tab-para tab-pane fade"}>
                                            <p className="mb-30">In marketing a product is an object or system made available for consumer use it is anything that can be offered to a market to satisfy the desire or need of a customer. In retailing, products are often referred to as
                                                merchandise, and in manufacturing, products are bought as raw materials and then sold as finished goods. A service is also regarded to as a type of product. Commodities are usually raw materials such as metals
                                                and agricultural products, but a commodity can also be anything widely available in the open market. In project management, products are the formal definition of the project deliverables that make up contribute
                                                to delivering the objectives of the project.</p>
                                            <p>A product can be classified as tangible or intangible. A tangible product is a physical object that can be perceived by touch such as a building, vehicle, gadget, or clothing. An intangible product is a product that
                                                can only be perceived indirectly such as an insurance policy. Services can be broadly classified under intangible products which can be durable or non durable. A product line is "a group of products that are
                                                closely related, either because they function in a similar manner, are sold to the same customer groups, are marketed through the same types of outlets, or fall within given price ranges."Many businesses offer a
                                                range of product lines which may be unique to a single organisation or may be common across the business's industry. In 2002 the US Census compiled revenue figures for the finance and insurance industry by
                                                various product lines such as "accident, health and medical insurance premiums" and "income from secured consumer loans.</p>
                                        </div>
                                        <div className={activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <div className="product__details-info table-responsive">
                                                <table className="table table-striped">
                                                    <tbody>
                                                        <tr>
                                                            <td className="add-info">Weight</td>
                                                            <td className="add-info-list"> 2 lbs</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Dimensions</td>
                                                            <td className="add-info-list"> 12 Ã— 16 Ã— 19 in</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Product</td>
                                                            <td className="add-info-list"> Purchase this product on rag-bone.com</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Color</td>
                                                            <td className="add-info-list"> Gray, Black</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Size</td>
                                                            <td className="add-info-list"> S, M, L, XL</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Model</td>
                                                            <td className="add-info-list"> Model </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Shipping</td>
                                                            <td className="add-info-list"> Standard shipping: â‚¹59.50</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Care Info</td>
                                                            <td className="add-info-list"> Machine Wash up to 40ÂºC/86ÂºF Gentle Cycle</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Brand</td>
                                                            <td className="add-info-list">  Kazen</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className={activeIndex == 3 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <div className="product-details-review">
                                                <h3 className="tp-comments-title mb-35">3 reviews for â€œWide Cotton Tunic extreme hammerâ€</h3>
                                                <div className="latest-comments mb-55">
                                                    <ul>
                                                        <li>
                                                            <div className="comments-box d-flex">
                                                                <div className="comments-avatar mr-25">
                                                                    <img src="/assets/img/shop/reviewer-01.png" alt="" />
                                                                </div>
                                                                <div className="comments-text">
                                                                    <div className="comments-top d-sm-flex align-items-start justify-content-between mb-5">
                                                                        <div className="avatar-name">
                                                                            <b>Siarhei Dzenisenka</b>
                                                                            <div className="comments-date mb-20">
                                                                                <span>March 27, 2018 9:51 am</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user-rating">
                                                                            <ul>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <p className="m-0">This is cardigan is a comfortable warm classic piece. Great to layer with a light top and you can dress up or down given the jewel buttons. I'm 5'8â€ 128lbs a 34A and the Small fit fine.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="comments-box d-flex">
                                                                <div className="comments-avatar mr-25">
                                                                    <img src="/assets/img/shop/reviewer-02.png" alt="" />
                                                                </div>
                                                                <div className="comments-text">
                                                                    <div className="comments-top d-sm-flex align-items-start justify-content-between mb-5">
                                                                        <div className="avatar-name">
                                                                            <b>Tommy Jarvis </b>
                                                                            <div className="comments-date mb-20">
                                                                                <span>March 27, 2018 9:51 am</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user-rating">
                                                                            <ul>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <p className="m-0">This is cardigan is a comfortable warm classic piece. Great to layer with a light top and you can dress up or down given the jewel buttons. I'm 5'8â€ 128lbs a 34A and the Small fit fine.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="comments-box d-flex">
                                                                <div className="comments-avatar mr-25">
                                                                    <img src="/assets/img/shop/reviewer-03.png" alt="" />
                                                                </div>
                                                                <div className="comments-text">
                                                                    <div className="comments-top d-sm-flex align-items-start justify-content-between mb-5">
                                                                        <div className="avatar-name">
                                                                            <b>Johnny Cash</b>
                                                                            <div className="comments-date mb-20">
                                                                                <span>March 27, 2018 9:51 am</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user-rating">
                                                                            <ul>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <p className="m-0">This is cardigan is a comfortable warm classic piece. Great to layer with a light top and you can dress up or down given the jewel buttons. I'm 5'8â€ 128lbs a 34A and the Small fit fine.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="product-details-comment">
                                                    <div className="comment-title mb-20">
                                                        <h3>Add a review</h3>
                                                        <p>Your email address will not be published. Required fields are marked*</p>
                                                    </div>
                                                    <div className="comment-rating mb-20 d-flex">
                                                        <span>Overall ratings</span>
                                                        <ul>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                        </ul>
                                                    </div>
                                                    <div className="comment-input-box">
                                                        <form action="#">
                                                            <div className="row">
                                                                <div className="col-xxl-12">
                                                                    <div className="comment-input">
                                                                        <textarea placeholder="Your review..." />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xxl-6">
                                                                    <div className="comment-input">
                                                                        <input type="text" placeholder="Your Name*" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xxl-6">
                                                                    <div className="comment-input">
                                                                        <input type="email" placeholder="Your Email*" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xxl-12">
                                                                    <div className="comment-submit">
                                                                        <button type="submit" className="tp-btn pro-submit">Submit</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="related-product-area pt-65 pb-50 related-product-border">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-sm-6">
                                <div className="tpsection mb-40">
                                    <h4 className="tpsection__title">Related Products</h4>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="tprelated__arrow d-flex align-items-center justify-content-end mb-40">
                                    <div className="tprelated__prv"><i className="far fa-long-arrow-left" /></div>
                                    <div className="tprelated__nxt"><i className="far fa-long-arrow-right" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="swiper-container related-product-active">
                            <Swiper {...swiperOptions}>
                                <SwiperSlide>
                                    <div className="tpproduct pb-15 mb-30">
                                        <div className="tpproduct__thumb p-relative">
                                            <Link href="/shop-details-2">
                                                <img src="/assets/img/product/product-1.jpg" alt="product-thumb" />
                                                <img className="product-thumb-secondary" src="/assets/img/product/product-2.jpg" alt="" />
                                            </Link>
                                            <div className="tpproduct__thumb-action">
                                                <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproduct__content">
                                            <h3 className="tpproduct__title"><Link href="/shop-details">Miko Wooden Bluetooth Speaker</Link></h3>
                                            <div className="tpproduct__priceinfo p-relative">
                                                <div className="tpproduct__priceinfo-list">
                                                    <span>₹31.00</span>
                                                </div>
                                                <div className="tpproduct__cart">
                                                    <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="tpproduct pb-15 mb-30">
                                        <div className="tpproduct__thumb p-relative">
                                            <Link href="/shop-details">
                                                <img src="/assets/img/product/product-3.jpg" alt="product-thumb" />
                                                <img className="product-thumb-secondary" src="/assets/img/product/product-4.jpg" alt="" />
                                            </Link>
                                            <div className="tpproduct__thumb-action">
                                                <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproduct__content">
                                            <h3 className="tpproduct__title"><Link href="/shop-details-2">Gorgeous Wooden Gloves</Link></h3>
                                            <div className="tpproduct__priceinfo p-relative">
                                                <div className="tpproduct__priceinfo-list">
                                                    <span>₹31.00</span>
                                                </div>
                                                <div className="tpproduct__cart">
                                                    <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="tpproduct pb-15 mb-30">
                                        <div className="tpproduct__thumb p-relative">
                                            <Link href="/shop-details-2">
                                                <img src="/assets/img/product/product-5.jpg" alt="product-thumb" />
                                                <img className="product-thumb-secondary" src="/assets/img/product/product-6.jpg" alt="" />
                                            </Link>
                                            <div className="tpproduct__thumb-action">
                                                <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproduct__content">
                                            <h3 className="tpproduct__title"><Link href="/shop-details">Pinkol Enormous Granite Bottle</Link></h3>
                                            <div className="tpproduct__priceinfo p-relative">
                                                <div className="tpproduct__priceinfo-list">
                                                    <span>₹31.00</span>
                                                </div>
                                                <div className="tpproduct__cart">
                                                    <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="tpproduct pb-15 mb-30">
                                        <div className="tpproduct__thumb p-relative">
                                            <span className="tpproduct__thumb-topsall">On Sale</span>
                                            <Link href="/shop-details-2">
                                                <img src="/assets/img/product/product-7.jpg" alt="product-thumb" />
                                                <img className="product-thumb-secondary" src="/assets/img/product/product-8.jpg" alt="" />
                                            </Link>
                                            <div className="tpproduct__thumb-action">
                                                <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproduct__content">
                                            <h3 className="tpproduct__title"><Link href="/shop-details-2">Gorgeous Aluminum Table</Link></h3>
                                            <div className="tpproduct__priceinfo p-relative">
                                                <div className="tpproduct__priceinfo-list">
                                                    <span>₹31.00</span>
                                                </div>
                                                <div className="tpproduct__cart">
                                                    <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="tpproduct pb-15 mb-30">
                                        <div className="tpproduct__thumb p-relative">
                                            <Link href="/shop-details-2">
                                                <img src="/assets/img/product/product-9.jpg" alt="product-thumb" />
                                                <img className="product-thumb-secondary" src="/assets/img/product/product-10.jpg" alt="" />
                                            </Link>
                                            <div className="tpproduct__thumb-action">
                                                <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproduct__content">
                                            <h3 className="tpproduct__title"><Link href="/shop-details">Evo Lightweight Granite Shirt</Link></h3>
                                            <div className="tpproduct__priceinfo p-relative">
                                                <div className="tpproduct__priceinfo-list">
                                                    <span>₹31.00</span>
                                                    <span className="tpproduct__priceinfo-list-oldprice">₹39.00</span>
                                                </div>
                                                <div className="tpproduct__cart">
                                                    <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="tpproduct pb-15 mb-30">
                                        <div className="tpproduct__thumb p-relative">
                                            <span className="tpproduct__thumb-volt"><i className="fas fa-bolt" /></span>
                                            <Link href="/shop-details-2">
                                                <img src="/assets/img/product/product-11.jpg" alt="product-thumb" />
                                                <img className="product-thumb-secondary" src="/assets/img/product/product-12.jpg" alt="" />
                                            </Link>
                                            <div className="tpproduct__thumb-action">
                                                <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproduct__content">
                                            <h3 className="tpproduct__title"><Link href="#">CLCo. Incredible Paper Car</Link></h3>
                                            <div className="tpproduct__priceinfo p-relative">
                                                <div className="tpproduct__priceinfo-list">
                                                    <span>₹31.00</span>
                                                </div>
                                                <div className="tpproduct__cart">
                                                    <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default ShopSingleDynamicV1
