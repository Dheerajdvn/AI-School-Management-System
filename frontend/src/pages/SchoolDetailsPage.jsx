import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { SchoolApi } from '../services/api'

/**
 * School Details Page - View school details from database
 * Role: ROLE_SUPER_ADMIN / ROLE_ADMIN
 */
export default function SchoolDetailsPage() {
  const { id } = useParams()
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSchool()
  }, [id])

  const loadSchool = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await SchoolApi.get(id)
      const data = res?.data || res
      setSchool(data)
    } catch (e) {
      console.error(e)
      setError('Failed to load school details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading school details..." />

  if (error) return <div className="alert alert-danger">{error}</div>

  if (!school) return <div className="alert alert-info">School not found</div>

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>{school.schoolName}</h1>
          <p className="text-muted">School Code: {school.schoolCode}</p>
        </div>
        <div>
          <Link to={`/admin/schools/${school.id}/edit`} className="btn btn-outline-primary me-2">
            <i className="bi bi-pencil me-1"></i>
            Edit
          </Link>
          <Link to="/admin/schools" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Schools
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Contact Information</h5>
            </div>
            <div className="card-body">
              <p><strong>Email:</strong> {school.email}</p>
              <p><strong>Phone:</strong> {school.phone || '—'}</p>
              <p><strong>Address:</strong> {school.address || '—'}</p>
              <p><strong>Location:</strong> {[school.city, school.state, school.country].filter(Boolean).join(', ') || '—'}</p>
              <p><strong>Postal Code:</strong> {school.postalCode || '—'}</p>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Subscription Details</h5>
            </div>
            <div className="card-body">
              <p><strong>Plan:</strong> {school.subscriptionPlan || 'BASIC'}</p>
              <p><strong>AI Enabled:</strong> {school.aiEnabled ? 'Yes' : 'No'}</p>
              <p><strong>Status:</strong> 
                <span className={`badge ms-2 ${school.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                  {school.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">System Meta</h5>
            </div>
            <div className="card-body">
              <p><strong>Created At:</strong> {school.createdAt ? new Date(school.createdAt).toLocaleString() : '—'}</p>
              <p><strong>Last Updated:</strong> {school.updatedAt ? new Date(school.updatedAt).toLocaleString() : '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
