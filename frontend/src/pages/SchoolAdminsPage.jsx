import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

/**
 * School Admins Page - Manage school administrators
 * Role: ROLE_SUPER_ADMIN
 */
export default function SchoolAdminsPage() {
  const [admins, setAdmins] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAdmins()
  }, [page, size])

  const loadAdmins = async () => {
    setLoading(true)
    try {
      const mockAdmins = [
        { id: 1, username: 'admin_ohs', email: 'admin@oakwood.edu', school: 'Oakwood High School', status: 'ACTIVE' },
        { id: 2, username: 'admin_ra', email: 'admin@riverside.edu', school: 'Riverside Academy', status: 'ACTIVE' },
        { id: 3, username: 'admin_mge', email: 'admin@maplegrove.edu', school: 'Maple Grove Elementary', status: 'INACTIVE' },
      ]
      setAdmins(mockAdmins)
      setTotal(3)
      setTotalPages(1)
    } catch (e) {
      setError('Failed to load school admins')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>School Admins</h1>
          <p className="text-muted">Manage school administrator accounts</p>
        </div>
        <Link to="/admin/schools/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Create New School
        </Link>
      </div>

      {loading ? (
        <LoadingIndicator message="Loading school admins..." />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : admins.length === 0 ? (
        <div className="alert alert-info">No school admins found</div>
      ) : (
        <>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>School</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>{admin.school}</td>
                  <td>
                    <span className={`badge ${admin.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}