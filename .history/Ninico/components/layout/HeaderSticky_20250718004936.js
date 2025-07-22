import Link from "next/link"
import CartShow from "../elements/CartShow"
import WishListShow from "../elements/WishListShow"

export default function HeaderSticky({ scroll, isCartSidebar, handleCartSidebar }) {
    return (
        <>
            <div id="header-sticky" className={`logo-area tp-sticky-one mainmenu-5 d-none d-xl-block ${scroll ? "header-sticky" : ""}`} style={{ backgroundColor: '#000000', display: 'none !important' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-2 col-lg-3">
                            <div className="logo">
                                <Link href="/"><img src="/assets/img/logo/logo.png" alt="logo" /></Link>
                            </div>
                        </div>
                        <div className="col-xl-10 col-lg-9">
                            <div className="header-meta-info d-flex align-items-center justify-content-between">
                                <div className="header-search-bar">
                                    <form action="#">
                                        <div className="search-info p-relative">
                                            <button className="header-search-icon"><i className="fal fa-search" /></button>
                                            <input type="text" placeholder="Search products..." />
                                        </div>
                                    </form>
                                </div>
                                <div className="header-meta header-brand d-flex align-items-center">
                                    <div className="header-meta__social d-flex align-items-center ml-25">
                                        <button className="header-cart p-relative tp-cart-toggle" onClick={handleCartSidebar}>
                                            <i className="fal fa-shopping-cart" />
                                            <CartShow />
                                        </button>
                                        <div className="d-inline-block mx-2" />
                                        <Link href="/sign-in" className="zy-header-login-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                                            <i className="fal fa-user" />
                                        </Link>
                                        <div className="d-inline-block mx-2" />
                                        <Link href="/wishlist" className="header-cart p-relative tp-cart-toggle">
                                            <i className="fal fa-heart" />
                                            <WishListShow />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
    #header-sticky {
        background-color: #000000 !important;
    }
    .logo-area {
        background-color: #000000 !important;
    }
    .header-search-bar input {
        background-color: #fff !important;
        color: #000 !important;
    }
    .header-search-bar input::placeholder {
        color: #666 !important;
    }
    .header-meta__social i,
    .zy-header-login-icon i,
    .header-cart i {
        color: #fff !important;
    }
    .tp-cat-toggle {
        color: #fff !important;
    }
    .main-menu ul li a {
        color: #fff !important;
    }
    .main-menu ul li a:hover {
        color: #0989ff !important;
    }
    .cat-menu__list li a {
        color: #333 !important;
    }
    .daily-offer ul li a {
        color: #333 !important;
    }
`}</style>
        </>
    )
}
