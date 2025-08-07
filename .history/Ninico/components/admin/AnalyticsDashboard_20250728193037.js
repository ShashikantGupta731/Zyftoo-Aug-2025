import React, { useState, useEffect } from 'react';
import { useProductAnalytics } from '../../hooks/useProductAnalytics';

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('all');

  const { getAnalyticsDashboard, getPopularProducts } = useProductAnalytics();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashboardResponse, popularProductsResponse] = await Promise.all([
          getAnalyticsDashboard(),
          getPopularProducts({ limit: 10, timeFrame: selectedTimeFrame })
        ]);

        setDashboardData({
          ...dashboardResponse,
          popularProducts: popularProductsResponse.products
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load analytics dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (getAnalyticsDashboard) {
      fetchDashboardData();
    }
  }, [getAnalyticsDashboard, getPopularProducts, selectedTimeFrame]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toString() || '0';
  };

  const formatPercentage = (value) => {
    return `${parseFloat(value || 0).toFixed(1)}%`;
  };

  if (!getAnalyticsDashboard) {
    return (
      <div className="analytics-dashboard">
        <div className="alert alert-warning">
          Access denied. Analytics dashboard is only available for administrators.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="analytics-dashboard">
        <div className="alert alert-info">No analytics data available</div>
      </div>
    );
  }

  const { overview, viewStats, topProducts, popularProducts } = dashboardData;

  return (
    <div className="analytics-dashboard">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">📊 Product Analytics Dashboard</h2>
              <div className="btn-group" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="timeFrame"
                  id="timeAll"
                  value="all"
                  checked={selectedTimeFrame === 'all'}
                  onChange={(e) => setSelectedTimeFrame(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="timeAll">All Time</label>

                <input
                  type="radio"
                  className="btn-check"
                  name="timeFrame"
                  id="timeWeekly"
                  value="weekly"
                  checked={selectedTimeFrame === 'weekly'}
                  onChange={(e) => setSelectedTimeFrame(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="timeWeekly">This Week</label>

                <input
                  type="radio"
                  className="btn-check"
                  name="timeFrame"
                  id="timeMonthly"
                  value="monthly"
                  checked={selectedTimeFrame === 'monthly'}
                  onChange={(e) => setSelectedTimeFrame(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="timeMonthly">This Month</label>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Total Products</h6>
                    <h3 className="mb-0">{formatNumber(overview.totalProducts)}</h3>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-box fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Products with Views</h6>
                    <h3 className="mb-0">{formatNumber(overview.productsWithAnalytics)}</h3>
                    <small>{formatPercentage(overview.viewedProductsPercentage)} of total</small>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-eye fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Total Views</h6>
                    <h3 className="mb-0">{formatNumber(viewStats.totalViews)}</h3>
                    <small>Avg: {formatNumber(viewStats.avgViewsPerProduct)} per product</small>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-chart-line fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Corporate Views</h6>
                    <h3 className="mb-0">{formatNumber(viewStats.totalCorporateViews)}</h3>
                    <small>{formatPercentage((viewStats.totalCorporateViews / viewStats.totalViews) * 100)} of total</small>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-building fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row mb-4">
          {/* Popular Products Table */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  🔥 Most Popular Products ({selectedTimeFrame === 'all' ? 'All Time' : 
                    selectedTimeFrame === 'weekly' ? 'This Week' : 'This Month'})
                </h5>
              </div>
              <div className="card-body">
                {popularProducts && popularProducts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Views</th>
                          <th>Score</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {popularProducts.map((product, index) => (
                          <tr key={product._id}>
                            <td>
                              <span className="badge bg-primary">#{index + 1}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={product.images?.[0] || '/assets/img/product/product-placeholder.jpg'}
                                  alt={product.name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded me-2"
                                />
                                <div>
                                  <strong>{product.name}</strong>
                                  {product.hasActiveCorporatePricing && (
                                    <span className="badge bg-info ms-2">Bulk</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{product.category}</td>
                            <td>{formatNumber(product.totalViews)}</td>
                            <td>{product.popularityRank?.toFixed(1) || '0'}</td>
                            <td>₹{formatNumber(product.displayPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No popular products data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Performing Products (All Time) */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">🏆 Top Performers (All Time)</h5>
              </div>
              <div className="card-body">
                {topProducts && topProducts.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {topProducts.map((product, index) => (
                      <div key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>#{index + 1}</strong>
                          <div className="small text-muted">{product.name}</div>
                        </div>
                        <div className="text-end">
                          <div className="small">{formatNumber(product.analytics?.views?.total || 0)} views</div>
                          <div className="small text-muted">Score: {product.analytics?.popularityScore?.toFixed(1) || '0'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No top products data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Distribution */}
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">👥 View Distribution</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <h4 className="text-primary">{formatNumber(viewStats.totalIndividualViews)}</h4>
                    <small className="text-muted">Individual Users</small>
                  </div>
                  <div className="col-4">
                    <h4 className="text-warning">{formatNumber(viewStats.totalCorporateViews)}</h4>
                    <small className="text-muted">Corporate Users</small>
                  </div>
                  <div className="col-4">
                    <h4 className="text-info">{formatNumber(viewStats.totalViews)}</h4>
                    <small className="text-muted">Total Views</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">📈 Engagement Metrics</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <h4 className="text-success">{formatPercentage(overview.viewedProductsPercentage)}</h4>
                    <small className="text-muted">Products Viewed</small>
                  </div>
                  <div className="col-6">
                    <h4 className="text-info">{formatNumber(viewStats.avgViewsPerProduct)}</h4>
                    <small className="text-muted">Avg Views/Product</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
