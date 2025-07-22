'use client'
import { useState } from 'react'
import AdminDashboard from './Dashboard'
import UsersPage from './UsersPage'
import ProductsPage from './ProductsPage'
import AddProductPage from './AddProductPage'
import EditProductPage from './EditProductPage'
import CategoriesPage from './CategoriesPage'

export default function AdminLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return <AdminDashboard />
      case 'users':
        return <UsersPage />
      case 'products':
        return <ProductsPage onNavigate={setActiveMenu} />
      case 'add-product':
        return <AddProductPage onNavigate={setActiveMenu} />
      case 'edit-product':
        return <EditProductPage onNavigate={setActiveMenu} />
      case 'categories':
        return <CategoriesPage onNavigate={setActiveMenu} />
      case 'stores':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Stores Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-shop text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Stores Page</h4>
                <p className="text-muted">Store management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Orders Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-list-ul text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Orders Page</h4>
                <p className="text-muted">Order management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'media':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Media Library</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-image text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Media Page</h4>
                <p className="text-muted">Media management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'blog':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Blog Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-journal-text text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Blog Page</h4>
                <p className="text-muted">Blog management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'pages':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Pages Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-file-earmark text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Pages Management</h4>
                <p className="text-muted">Page management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'taxes':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Tax Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-percent text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Tax Settings</h4>
                <p className="text-muted">Tax management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'shipping':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Shipping Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-truck text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Shipping Settings</h4>
                <p className="text-muted">Shipping management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'coupons':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Coupons Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-ticket text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Coupons & Discounts</h4>
                <p className="text-muted">Coupon management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'currencies':
        return (
          <div className="container-fluid">
            <h2 className="fw-bold text-dark mb-4">Currency Management</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-currency-exchange text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">Currency Settings</h4>
                <p className="text-muted">Currency management functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      default:
        return <AdminDashboard />
    }
  }

  return (
    <>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <div 
          className="sidebar d-flex flex-column p-3 text-white position-fixed" 
          style={{ 
            width: '280px', 
            height: '100vh',
            background: '#000000',
            zIndex: 1000
          }}
        >
          {/* Logo */}
          <div className="mb-4 text-center">
            <h3 className="fw-bold mb-0 d-flex align-items-center justify-content-center">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Zyftoo
            </h3>
          </div>

          {/* Navigation Menu */}
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'dashboard' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('dashboard')}
              >
                <i className="bi bi-house me-2"></i>
                Dashboard
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'users' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('users')}
              >
                <i className="bi bi-people me-2"></i>
                Users
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'products' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('products')}
              >
                <i className="bi bi-box me-2"></i>
                Products
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'categories' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('categories')}
              >
                <i className="bi bi-grid me-2"></i>
                Categories
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'stores' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('stores')}
              >
                <i className="bi bi-shop me-2"></i>
                Stores
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'orders' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('orders')}
              >
                <i className="bi bi-list-ul me-2"></i>
                Orders
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'media' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('media')}
              >
                <i className="bi bi-image me-2"></i>
                Media
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'blog' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('blog')}
              >
                <i className="bi bi-journal-text me-2"></i>
                Blog
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'pages' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('pages')}
              >
                <i className="bi bi-file-earmark me-2"></i>
                Pages
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'taxes' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('taxes')}
              >
                <i className="bi bi-percent me-2"></i>
                Taxes
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'shipping' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('shipping')}
              >
                <i className="bi bi-truck me-2"></i>
                Shipping
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'coupons' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('coupons')}
              >
                <i className="bi bi-ticket me-2"></i>
                Coupons
              </button>
            </li>
            
            <li className="nav-item mb-1">
              <button 
                className={`nav-link text-white d-flex align-items-center py-2 w-100 border-0 bg-transparent ${activeMenu === 'currencies' ? 'active bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveMenu('currencies')}
              >
                <i className="bi bi-currency-exchange me-2"></i>
                Currencies
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1" style={{ marginLeft: '280px' }}>
          {/* Top Header */}
          <header className="bg-white border-bottom py-3 px-4" style={{ height: '70px' }}>
            <div className="d-flex justify-content-between align-items-center h-100">
              <div className="d-flex align-items-center">
                <h4 className="mb-0 fw-bold text-success">Zyftoo</h4>
              </div>
              
              <div className="d-flex align-items-center">
                {/* Search Bar */}
                <div className="me-3">
                  <div className="input-group" style={{ width: '400px' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search zyftoo..." 
                    />
                    <button className="btn btn-warning" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-2 me-3">
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-translate"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-bell"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-moon"></i>
                  </button>
                </div>
                
                {/* Account Dropdown */}
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    Account
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Logout</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 bg-light" style={{ minHeight: 'calc(100vh - 70px)' }}>
            {renderContent()}
          </main>
        </div>
      </div>

      <style jsx global>{`
        /* Custom Bootstrap-like utilities */
        .d-flex { display: flex !important; }
        .flex-column { flex-direction: column !important; }
        .flex-grow-1 { flex-grow: 1 !important; }
        .align-items-center { align-items: center !important; }
        .justify-content-between { justify-content: space-between !important; }
        .justify-content-center { justify-content: center !important; }
        .text-center { text-align: center !important; }
        .text-white { color: white !important; }
        .text-dark { color: #212529 !important; }
        .text-success { color: #198754 !important; }
        .text-muted { color: #6c757d !important; }
        .bg-white { background-color: white !important; }
        .bg-light { background-color: #f8f9fa !important; }
        .bg-transparent { background-color: transparent !important; }
        .border-0 { border: 0 !important; }
        .border-bottom { border-bottom: 1px solid #dee2e6 !important; }
        .shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important; }
        .position-fixed { position: fixed !important; }
        .w-100 { width: 100% !important; }
        .h-100 { height: 100% !important; }
        .mb-0 { margin-bottom: 0 !important; }
        .mb-1 { margin-bottom: 0.25rem !important; }
        .mb-4 { margin-bottom: 1.5rem !important; }
        .mb-auto { margin-bottom: auto !important; }
        .me-2 { margin-right: 0.5rem !important; }
        .me-3 { margin-right: 1rem !important; }
        .ms-auto { margin-left: auto !important; }
        .mt-3 { margin-top: 1rem !important; }
        .p-3 { padding: 1rem !important; }
        .p-4 { padding: 1.5rem !important; }
        .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .py-3 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        .py-5 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
        .px-4 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        .fw-bold { font-weight: 700 !important; }
        
        /* Container */
        .container-fluid { width: 100%; padding-right: 15px; padding-left: 15px; margin-right: auto; margin-left: auto; }
        
        /* Cards */
        .card { position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.375rem; }
        .card-body { flex: 1 1 auto; padding: 1rem; }
        
        /* Navigation */
        .nav { display: flex; flex-wrap: wrap; padding-left: 0; margin-bottom: 0; list-style: none; }
        .nav-pills { flex-direction: column; }
        .nav-item { margin-bottom: 0; }
        .nav-link { display: block; padding: 0.5rem 1rem; color: #0d6efd; text-decoration: none; background: none; border: 1px solid transparent; border-radius: 0.375rem; cursor: pointer; }
        .nav-link:hover { color: #0a58ca; }
        .nav-link.active { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
        
        /* Buttons */
        .btn { display: inline-block; font-weight: 400; line-height: 1.5; color: #212529; text-align: center; text-decoration: none; vertical-align: middle; cursor: pointer; user-select: none; background-color: transparent; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; border-radius: 0.375rem; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; }
        .btn:hover { color: #212529; }
        .btn-outline-secondary { color: #6c757d; border-color: #6c757d; }
        .btn-outline-secondary:hover { color: #fff; background-color: #6c757d; border-color: #6c757d; }
        .btn-warning { color: #000; background-color: #ffc107; border-color: #ffc107; }
        .btn-warning:hover { color: #000; background-color: #ffca2c; border-color: #ffc720; }
        .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.875rem; border-radius: 0.25rem; }
        
        /* Forms */
        .form-control { display: block; width: 100%; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #fff; background-image: none; border: 1px solid #ced4da; border-radius: 0.375rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; }
        .form-control:focus { color: #212529; background-color: #fff; border-color: #86b7fe; outline: 0; box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25); }
        .input-group { position: relative; display: flex; flex-wrap: wrap; align-items: stretch; width: 100%; }
        .input-group .form-control { position: relative; flex: 1 1 auto; width: 1%; min-width: 0; }
        .input-group .btn { position: relative; z-index: 2; }
        
        /* Dropdown */
        .dropdown { position: relative; }
        .dropdown-toggle::after { display: inline-block; margin-left: 0.255em; vertical-align: 0.255em; content: ""; border-top: 0.3em solid; border-right: 0.3em solid transparent; border-bottom: 0; border-left: 0.3em solid transparent; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; min-width: 10rem; padding: 0.5rem 0; margin: 0; font-size: 1rem; color: #212529; text-align: left; list-style: none; background-color: #fff; background-clip: padding-box; border: 1px solid rgba(0,0,0,.15); border-radius: 0.375rem; }
        .dropdown-item { display: block; width: 100%; padding: 0.25rem 1rem; clear: both; font-weight: 400; color: #212529; text-align: inherit; text-decoration: none; white-space: nowrap; background-color: transparent; border: 0; }
        .dropdown-item:hover { color: #1e2125; background-color: #e9ecef; }
        .dropdown-divider { height: 0; margin: 0.5rem 0; overflow: hidden; border-top: 1px solid rgba(0,0,0,.15); }
        
        /* Utility classes */
        .gap-2 { gap: 0.5rem !important; }
        
        /* Icons (simple replacements) */
        .bi::before {
          font-family: 'Arial', sans-serif;
          font-weight: bold;
        }
        .bi-grid-3x3-gap::before { content: "⊞"; }
        .bi-house::before { content: "🏠"; }
        .bi-people::before { content: "👥"; }
        .bi-box::before { content: "📦"; }
        .bi-grid::before { content: "▦"; }
        .bi-shop::before { content: "🏪"; }
        .bi-list-ul::before { content: "☰"; }
        .bi-image::before { content: "🖼"; }
        .bi-journal-text::before { content: "📝"; }
        .bi-file-earmark::before { content: "📄"; }
        .bi-percent::before { content: "%"; }
        .bi-truck::before { content: "🚚"; }
        .bi-ticket::before { content: "🎫"; }
        .bi-currency-exchange::before { content: "💱"; }
        .bi-chevron-right::before { content: "▶"; }
        .bi-search::before { content: "🔍"; }
        .bi-translate::before { content: "🌐"; }
        .bi-bell::before { content: "🔔"; }
        .bi-moon::before { content: "🌙"; }
        
        /* Custom nav-link hover and active styles */
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        body {
          background-color: #f8f9fa;
          margin: 0;
          font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
        }
        
        /* Additional responsive utilities */
        .bg-opacity-20 { background-color: rgba(255, 255, 255, 0.2) !important; }
      `}</style>
    </>
  )
}
