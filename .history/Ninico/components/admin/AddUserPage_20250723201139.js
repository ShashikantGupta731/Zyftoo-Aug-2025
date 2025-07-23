'use client'
import { useState } from 'react'

const initialState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  userType: 'Customer',
  status: 'Active',
  role: 'user',
  gender: '',
  dob: '',
  pincode: '',
  isVerified: false,
  emailVerified: false,
  emailVerificationToken: '',
  companyDetails: {
    companyName: '',
    gstNumber: '',
    address: ''
  },
  lastLogin: ''
}

export default function AddUserPage({ onSuccess, onCancel }) {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('companyDetails.')) {
      const key = name.split('.')[1]
      setForm(prev => ({ ...prev, companyDetails: { ...prev.companyDetails, [key]: value } }))
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  // Hardcoded admin token for testing
  const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzZhYTJmYzc3YWY4ODU3Njk1ZDA5MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MzI4MTMyMCwiZXhwIjoxNzUzODg2MTIwfQ.3wEx7ZCDvYtUQppFM9CcXjhG1zTQX9_RYY_dy3Y6MZs'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      // Save user via users API with auth middleware
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to add user')
      setSuccess('User added successfully!')
      if (onSuccess) onSuccess()
      setForm(initialState)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <h2 className="fw-bold mb-3">Add New User</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name *</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Password *</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">User Type</label>
          <select className="form-select" name="userType" value={form.userType} onChange={handleChange}>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="tempAdmin">Temp Admin</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" name="dob" value={form.dob} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Pincode</label>
          <input type="text" className="form-control" name="pincode" value={form.pincode} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Company Name</label>
          <input type="text" className="form-control" name="companyDetails.companyName" value={form.companyDetails.companyName} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">GST Number</label>
          <input type="text" className="form-control" name="companyDetails.gstNumber" value={form.companyDetails.gstNumber} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label">Company Address</label>
          <input type="text" className="form-control" name="companyDetails.address" value={form.companyDetails.address} onChange={handleChange} />
        </div>
        <div className="col-12 d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-success" disabled={loading}>{loading ? 'Saving...' : 'Add User'}</button>
          {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  )
}
