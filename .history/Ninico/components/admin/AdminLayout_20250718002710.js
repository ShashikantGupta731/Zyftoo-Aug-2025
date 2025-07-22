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
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            zIndex: 1000
          }}
        >
          {/* Logo */}
          <div className="mb-4 text-center">
            <h3 className="fw-bold mb-0 d-flex align-items-center justify-content-center">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              FastKart
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
                <h4 className="mb-0 fw-bold text-success">FastKart</h4>
              </div>
              
              <div className="d-flex align-items-center">
                {/* Search Bar */}
                <div className="me-3">
                  <div className="input-group" style={{ width: '400px' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search FastKart..." 
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
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        body {
          background-color: #f8f9fa;
        }
      `}</style>
    </>
  )
}
