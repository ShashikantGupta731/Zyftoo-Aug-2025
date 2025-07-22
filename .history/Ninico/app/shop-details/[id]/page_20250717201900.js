'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 5,
    spaceBetween: 25,
    autoplay: {
        delay: 3500,
    },
    breakpoints: {
        1400: {
            slidesPerView: 5,
        },
        1200: {
            slidesPerView: 5,
        },
        992: {
            slidesPerView: 4,
        },
        768: {
            slidesPerView: 2,
        },
        576: {
            slidesPerView: 2,
        },
        0: {
            slidesPerView: 1,
        },
    },
    navigation: {
        nextEl: '.tprelated__nxt',
        prevEl: '.tprelated__prv',
    },
}

export default function ProductDetails() {
    const [activeIndex, setActiveIndex] = useState(1)
    const [activeIndex2, setActiveIndex2] = useState(4)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const params = useParams()
    
    useEffect(() => {
        const productId = params.id
        if (productId) {
            loadProduct(productId)
        }
    }, [params.id])
    
    const loadProduct = (id) => {
        setLoading(true)
        
        // Sample product data - in real app, this would come from an API
        const sampleProducts = {
            '1': {
                id: 1,
                name: "Wide Cotton Tunic Dress",
                price: 725,
                originalPrice: 935,
                category: "Dress",
                rating: 3,
                reviews: 10,
                stock: "In Stock",
                sku: "BO1D0MX8SJ",
                description: "Priyoshop has brought to you the Hijab 3 Pieces Combo Pack PS23. It is a completely modern design and you feel comfortable to put on this hijab. Buy it at the best price.",
                images: [
                    "/assets/img/product/product-1.jpg",
                    "/assets/img/product/product-2.jpg",
                    "/assets/img/product/product-3.jpg"
                ],
                categories: ["T-Shirts", "Tops", "Womens"],
                tags: ["fashion", "t-shirts", "women"]
            },
            '2': {
                id: 2,
                name: "Premium Silk Scarf",
                price: 1599,
                originalPrice: 2250,
                category: "Accessories",
                rating: 4,
                reviews: 25,
                stock: "In Stock",
                sku: "PS2X9KL3MN",
                description: "Luxurious silk scarf perfect for any occasion. Made from 100% pure silk with elegant patterns that add sophistication to your outfit.",
                images: [
                    "/assets/img/product/product-2.jpg",
                    "/assets/img/product/product-1.jpg",
                    "/assets/img/product/product-3.jpg"
                ],
                categories: ["Accessories", "Scarves", "Womens"],
                tags: ["silk", "luxury", "accessories"]
            },
            '3': {
                id: 3,
                name: "Casual Denim Jacket",
                price: 4500,
                originalPrice: 6500,
                category: "Jackets",
                rating: 5,
                reviews: 18,
                stock: "Limited Stock",
                sku: "DJ4R7T8QW2",
                description: "Classic denim jacket perfect for casual outings. Made from high-quality denim with a comfortable fit and timeless design.",
                images: [
                    "/assets/img/product/product-3.jpg",
                    "/assets/img/product/product-1.jpg",
                    "/assets/img/product/product-2.jpg"
                ],
                categories: ["Jackets", "Denim", "Unisex"],
                tags: ["denim", "casual", "jacket"]
            }
        }
        
        // Simulate API call delay
        setTimeout(() => {
            const selectedProduct = sampleProducts[id] || sampleProducts['1']
            setProduct(selectedProduct)
            setLoading(false)
        }, 500)
    }
    
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }
    
    const handleOnClick2 = (index) => {
        setActiveIndex2(index)
    }

    if (loading) {
        return (
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Loading...">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!product) {
        return (
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Product Not Found">
                <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '50vh' }}>
                    <h3>Product Not Found</h3>
                    <Link href="/shop" className="btn btn-primary mt-3">Back to Shop</Link>
                </div>
            </Layout>
        )
    }

    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle={product.name}>
                <div>
                    <section className="product-area pt-80 pb-25">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-5 col-md-12">
                                    <div className="tpproduct-details__nab pr-50 mb-40">
                                        <div className="d-flex align-items-start">
                                            <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                {product.images.map((image, index) => (
                                                    <button key={index} className={activeIndex2 == (4 + index) ? "nav-link active" : "nav-link"} onClick={() => handleOnClick2(4 + index)}>
                                                        <img src={image} alt={`${product.name} ${index + 1}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="tab-content" id="v-pills-tabContent">
                                                {product.images.map((image, index) => (
                                                    <div key={index} className={activeIndex2 == (4 + index) ? "tab-pane fade show active" : "tab-pane fade"}>
                                                        <img src={image} alt={`${product.name} ${index + 1}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-7">
                                    <div className="tpproduct-details__content">
                                        <div className="tpproduct-details__tag-area d-flex align-items-center mb-5">
                                            <span className="tpproduct-details__tag">{product.category}</span>
                                            <div className="tpproduct-details__rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <Link key={i} href="#"><i className={i < product.rating ? "fas fa-star" : "far fa-star"} /></Link>
                                                ))}
                                            </div>
                                            <a className="tpproduct-details__reviewers">{product.reviews} Reviews</a>
                                        </div>
                                        <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                                            <h3 className="tpproduct-details__title">{product.name}</h3>
                                            <span className="tpproduct-details__stock">{product.stock}</span>
                                        </div>
                                        <div className="tpproduct-details__price mb-30">
                                            <del>₹{product.originalPrice}</del>
                                            <span>₹{product.price}</span>
                                        </div>
                                        <div className="tpproduct-details__pera">
                                            <p>{product.description}</p>
                                        </div>
                                        <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                                            <div className="tpproduct-details__quantity">
                                                <span className="cart-minus"><i className="far fa-minus" /></span>
                                                <input className="tp-cart-input" type="text" defaultValue={1} />
                                                <span className="cart-plus"><i className="far fa-plus" /></span>
                                            </div>
                                            <div className="tpproduct-details__cart ml-20">
                                                <button><i className="fal fa-shopping-cart" /> Add To Cart</button>
                                            </div>
                                            <div className="tpproduct-details__wishlist ml-20">
                                                <Link href="#"><i className="fal fa-heart" /></Link>
                                            </div>
                                        </div>
                                        <div className="tpproductdot mb-30">
                                            <Link className="tpproductdot__variationitem" href="#">
                                                <div className="tpproductdot__termshape">
                                                    <span className="tpproductdot__termshape-bg" />
                                                    <span className="tpproductdot__termshape-border" />
                                                </div>
                                            </Link>
                                            <Link className="tpproductdot__variationitem" href="#">
                                                <div className="tpproductdot__termshape">
                                                    <span className="tpproductdot__termshape-bg red-product-bg" />
                                                    <span className="tpproductdot__termshape-border red-product-border" />
                                                </div>
                                            </Link>
                                            <Link className="tpproductdot__variationitem" href="#">
                                                <div className="tpproductdot__termshape">
                                                    <span className="tpproductdot__termshape-bg orange-product-bg" />
                                                    <span className="tpproductdot__termshape-border orange-product-border" />
                                                </div>
                                            </Link>
                                            <Link className="tpproductdot__variationitem" href="#">
                                                <div className="tpproductdot__termshape">
                                                    <span className="tpproductdot__termshape-bg purple-product-bg" />
                                                    <span className="tpproductdot__termshape-border purple-product-border" />
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="tpproduct-details__information tpproduct-details__code">
                                            <p>SKU:</p><span>{product.sku}</span>
                                        </div>
                                        <div className="tpproduct-details__information tpproduct-details__categories">
                                            <p>Categories:</p>
                                            {product.categories.map((category, index) => (
                                                <span key={index}>
                                                    <Link href="#">{category}{index < product.categories.length - 1 ? ',' : ''}</Link>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="tpproduct-details__information tpproduct-details__tags">
                                            <p>Tags:</p>
                                            {product.tags.map((tag, index) => (
                                                <span key={index}>
                                                    <Link href="#">{tag}{index < product.tags.length - 1 ? ',' : ''}</Link>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="tpproduct-details__information tpproduct-details__social">
                                            <p>Share:</p>
                                            <Link href="#"><i className="fab fa-facebook-f" /></Link>
                                            <Link href="#"><i className="fab fa-twitter" /></Link>
                                            <Link href="#"><i className="fab fa-behance" /></Link>
                                            <Link href="#"><i className="fab fa-youtube" /></Link>
                                            <Link href="#"><i className="fab fa-linkedin" /></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-5">
                                    <div className="tpproduct-details__condation">
                                        <ul>
                                            <li>
                                                <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                    <div className="tpproduct-details__condation-thumb">
                                                        <img src="/assets/img/icon/product-det-1.png" alt="" className="tpproduct-details__img-hover" />
                                                    </div>
                                                    <div className="tpproduct-details__condation-text">
                                                        <p>Free Shipping apply to all<br />orders over ₹1000</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                    <div className="tpproduct-details__condation-thumb">
                                                        <img src="/assets/img/icon/product-det-2.png" alt="" className="tpproduct-details__img-hover" />
                                                    </div>
                                                    <div className="tpproduct-details__condation-text">
                                                        <p>Guranteed 100% Organic<br />from natural farmas</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                    <div className="tpproduct-details__condation-thumb">
                                                        <img src="/assets/img/icon/product-det-3.png" alt="" className="tpproduct-details__img-hover" />
                                                    </div>
                                                    <div className="tpproduct-details__condation-text">
                                                        <p>1 Day Returns if you change<br />your mind</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                    <div className="tpproduct-details__condation-thumb">
                                                        <img src="/assets/img/icon/product-det-4.png" alt="" className="tpproduct-details__img-hover" />
                                                    </div>
                                                    <div className="tpproduct-details__condation-text">
                                                        <p>Covid-19 Info: We keep<br />delivering.</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Product Details Tabs */}
                    <div className="product-details-area">
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
                                                    <button className={activeIndex == 3 ? "nav-links active" : "nav-links"}>Reviews ({product.reviews})</button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="tab-content tp-content-tab" id="myTabContent-2">
                                            <div className={activeIndex == 1 ? "tab-para tab-pane fade show active" : "tab-para tab-pane fade"}>
                                                <p className="mb-30">{product.description}</p>
                                                <p>This product represents quality craftsmanship and attention to detail. Perfect for modern consumers who value both style and functionality.</p>
                                            </div>
                                            <div className={activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"}>
                                                <div className="product__details-info table-responsive">
                                                    <table className="table table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <td className="add-info">SKU</td>
                                                                <td className="add-info-list">{product.sku}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="add-info">Categories</td>
                                                                <td className="add-info-list">{product.categories.join(', ')}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="add-info">Tags</td>
                                                                <td className="add-info-list">{product.tags.join(', ')}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="add-info">Stock Status</td>
                                                                <td className="add-info-list">{product.stock}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className={activeIndex == 3 ? "tab-pane fade show active" : "tab-pane fade"}>
                                                <div className="product-details-review">
                                                    <h3 className="tp-comments-title mb-35">{product.reviews} reviews for "{product.name}"</h3>
                                                    <div className="latest-comments mb-55">
                                                        <ul>
                                                            <li>
                                                                <div className="comments-box d-flex">
                                                                    <div className="comments-avatar mr-25">
                                                                        <img src="/assets/img/blog/comments-1.png" alt="" />
                                                                    </div>
                                                                    <div className="comments-text">
                                                                        <div className="avatar-name mb-15">
                                                                            <h5>Siarhei Dzenisenka</h5>
                                                                            <span className="post-meta"> March 20, 2023</span>
                                                                            <div className="comments-reply">
                                                                                <Link href="#"><i className="fas fa-reply-all" /></Link>
                                                                            </div>
                                                                        </div>
                                                                        <p>Very good quality! Exactly as described and fast delivery.</p>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
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
            </Layout>
        </>
    )
}
