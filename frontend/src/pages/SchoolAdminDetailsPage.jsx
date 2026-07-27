import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { SchoolAdminApi } from '../services/api'

export default function SchoolAdminDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAdmin()
  }, [id])

  const loadAdmin = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await SchoolAdminApi.get(id)
      const data = res?.data || res
      setAdmin(data)
    } catch (e) {
      console.error(e)
      setError('Failed to load school administrator details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading administrator details..." />

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/admin/school-admins" className="btn btn-secondary btn-sm">Back to School Admins</Link>
      </div>
    )
  }

  if (!admin) return null

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>School Administrator Details</h3>
          <p className="text-muted m-0">Viewing details for {admin.username || admin.email}</p>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/admin/school-admins/${admin.id}/edit`} className="btn btn-primary btn-sm">
            <i className="bi bi-pencil me-1"></i> Edit
          </Link>
          <Link to="/admin/school-admins" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Back
          </Link>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <strong>ID:</strong> {admin.id}
            </div>
            <div className="col-md-6">
              <strong>Username:</strong> {admin.username}
            </div>
            <div className="col-md-6">
              <strong>Full Name:</strong> {admin.fullName || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || '—'}
            </div>
            <div className="col-md-6">
              <strong>Email:</strong> {admin.email}
            </div>
            <div className="col-md-6">
              <strong>Phone:</strong> {admin.phone || '—'}
            </div>
            <div className="col-md-6">
              <strong>Status:</strong>{' '}
              <span className={`badge ${admin.enabled !== false ? 'bg-success' : 'bg-secondary'}`}>
                {admin.enabled !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="col-md-6">
              <strong>Roles:</strong> {admin.roles ? (Array.isArray(admin.roles) ? admin.roles.join(', ') : JSON.stringify(admin.roles)) : 'School Admin'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
