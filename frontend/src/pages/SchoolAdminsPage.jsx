import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SchoolAdminApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

export default function SchoolAdminsPage() {
  const [admins, setAdmins] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAdmins()
  }, [page, size])

  const loadAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await SchoolAdminApi.list({ page, size, sortBy: 'id', direction: 'desc' })
      const data = res?.data || res
      setAdmins(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load school administrators')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading school administrators..." />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>School Admins</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>Manage school administrator accounts</p>
        </div>
        <Link to="/admin/school-admins/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>
          Create Admin
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>School</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="fw-medium">{admin.firstName || admin.lastName ? `${admin.firstName || ''} ${admin.lastName || ''}`.trim() : admin.username}</td>
                <td>{admin.email}</td>
                <td>{admin.phone || '—'}</td>
                <td>{admin.schoolName || '—'}</td>
                <td>{admin.role || 'School Admin'}</td>
                <td>
                  <span className={`badge ${admin.enabled !== false ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                    {admin.enabled !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Link to={`/admin/school-admins/${admin.id}`} className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link to={`/admin/school-admins/${admin.id}/edit`} className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-pencil"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={total > 0 ? Math.ceil(total / size) : 1}
        totalElements={total}
        onPageChange={setPage}
      />
    </div>
  )
}