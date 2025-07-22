'use client'

export default function AdminDashboard() {
  return (
    <div className="container-fluid">
      {/* Stats Cards Row */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1 opacity-75">Total Revenue</h6>
                  <h3 className="mb-0 fw-bold">$ NaN</h3>
                </div>
                <div className="text-end">
                  <i className="bi bi-calendar-check" style={{ fontSize: '2.5rem', opacity: '0.7' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1 opacity-75">Total Orders</h6>
                  <h3 className="mb-0 fw-bold">0</h3>
                </div>
                <div className="text-end">
                  <i className="bi bi-bag-check" style={{ fontSize: '2.5rem', opacity: '0.7' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1 opacity-75">Total Stores</h6>
                  <h3 className="mb-0 fw-bold">0</h3>
                </div>
                <div className="text-end">
                  <i className="bi bi-shop" style={{ fontSize: '2.5rem', opacity: '0.7' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1 opacity-75">Total User</h6>
                  <h3 className="mb-0 fw-bold">0</h3>
                </div>
                <div className="text-end">
                  <i className="bi bi-people" style={{ fontSize: '2.5rem', opacity: '0.7' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="row mb-4">
        {/* Average Revenue Chart */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-graph-up text-success me-2"></i>
                Average Revenue
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <div className="mb-3">
                  <h4 className="text-muted">$ NaN</h4>
                </div>
                <p className="text-muted">No revenue data available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Stores */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-trophy text-warning me-2"></i>
                Top Stores
              </h5>
              <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                <option>Select</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Store Name</th>
                      <th className="fw-semibold">Orders</th>
                      <th className="fw-semibold">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        No Data Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections Row */}
      <div className="row mb-4">
        {/* Top Selling Products */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-star text-success me-2"></i>
                Top Selling Product
              </h5>
              <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                <option>Select</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="card-body">
              <div className="text-center py-4">
                <i className="bi bi-box text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-2">No Data Found</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-clock-history text-primary me-2"></i>
                Recent Orders
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Number</th>
                      <th className="fw-semibold">Date</th>
                      <th className="fw-semibold">Name</th>
                      <th className="fw-semibold">Amount</th>
                      <th className="fw-semibold">Payment</th>
                      <th className="fw-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No Data Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row">
        {/* Product Stock Report */}
        <div className="col-md-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-clipboard-data text-info me-2"></i>
                Product Stock Report
              </h5>
              <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                <option>Select</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
                <option>All Products</option>
              </select>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Image</th>
                      <th className="fw-semibold">Name</th>
                      <th className="fw-semibold">Quantity</th>
                      <th className="fw-semibold">Stock</th>
                      <th className="fw-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No Data Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Reviews & Activity */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-star text-warning me-2"></i>
                Latest Reviews
              </h6>
              <a href="#" className="text-decoration-none text-primary small">View All</a>
            </div>
            <div className="card-body">
              <div className="text-center py-3">
                <i className="bi bi-chat-dots text-muted" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2 small">No reviews available</p>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 py-3">
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="bi bi-journal-text text-success me-2"></i>
                Latest Blogs
              </h6>
            </div>
            <div className="card-body">
              <div className="text-center py-3">
                <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2 small">No blogs available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="text-center py-3 text-muted">
            <small>© Pixelstrap</small>
          </div>
        </div>
      </div>
    </div>
  )
}
