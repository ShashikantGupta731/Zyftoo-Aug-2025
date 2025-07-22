import { useEffect, useState } from 'react'

export default function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) return <div className="text-center py-4">Loading users...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>User Type</th>
            <th>Status</th>
            <th>Role</th>
            <th>Gender</th>
            <th>Pincode</th>
            <th>Company</th>
            <th>Last Login</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-5 text-muted">
                <i className="bi bi-person" style={{ fontSize: '3rem' }}></i>
                <p className="mt-2">No users found</p>
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.userType}</td>
                <td>{user.status}</td>
                <td>{user.role}</td>
                <td>{user.gender}</td>
                <td>{user.pincode}</td>
                <td>{user.companyDetails?.companyName}</td>
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
  )
}
