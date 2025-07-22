"use client"
import { useState, useEffect } from 'react'
import AddUserPage from './AddUserPage'
import { get } from '@/util/apiService'
import { USER } from '@/util/apiEndpoints'

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Hardcoded admin token for testing
  const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYwNzMyMCwiZXhwIjoxNzUzMjEyMTIwfQ.ugFuaDCq_ewqIE-dZaql3BB91kaXBIxE0TQmqdYnagI'

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError('')
      try {
        console.log('Fetching users from API...')
        
        // Temporarily store admin token
        localStorage.setItem('authToken', ADMIN_TOKEN)
        
        const response = await get(USER.GET_ALL)
        console.log('Response:', response)
        
        if (!response.success) throw new Error(response.message || 'Failed to fetch users')
        setUsers(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])
  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold text-dark mb-0">Users Management</h2>
            <button className="btn btn-success" onClick={() => setShowAddUser(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Search Users</label>
                  <input type="text" className="form-control" placeholder="Search by name, email..." />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select className="form-select">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Role</label>
                  <select className="form-select">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Customer</option>
                    <option>Vendor</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">&nbsp;</label>
                  <button className="btn btn-primary w-100">
                    <i className="bi bi-search me-2"></i>Filter
                  </button>
                </div>
                <div className="col-md-2">
                  <label className="form-label">&nbsp;</label>
                  <button className="btn btn-outline-secondary w-100">Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">All Users</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">
                        <input type="checkbox" className="form-check-input" />
                      </th>
                      <th>User</th>
                      <th>Email</th>
                      <th>phone</th>
                      <th>userType</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">Loading users...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-danger">{error}</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          <i className="bi bi-people" style={{ fontSize: '3rem' }}></i>
                          <p className="mt-2">No users found</p>
                          <button className="btn btn-success" onClick={() => setShowAddUser(true)}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Add First User
                          </button>
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user._id}>
                          <td className="ps-4"><input type="checkbox" className="form-check-input" /></td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.userType}</td>
                          <td>{user.status}</td>
                          <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
                          <td className="text-center">
                            {/* Actions: Edit/Delete/Status Toggle can be added here */}
                            <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                            <button className="btn btn-sm btn-outline-danger">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.3)'}} tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddUser(false)}></button>
              </div>
              <div className="modal-body">
                <AddUserPage onSuccess={() => setShowAddUser(false)} onCancel={() => setShowAddUser(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
