import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { SchoolAdminApi } from '../services/api'

export default function EditSchoolAdminPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    enabled: true
  })

  useEffect(() => {
    loadAdmin()
  }, [id])

  const loadAdmin = async () => {
    setInitialLoading(true)
    setError(null)
    try {
      const res = await SchoolAdminApi.get(id)
      const data = res?.data || res
      setFormData({
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        enabled: data.enabled ?? true
      })
    } catch (e) {
      console.error(e)
      setError('Failed to load school administrator')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await SchoolAdminApi.update(id, formData)
      setSuccess(true)
      setTimeout(() => navigate('/admin/school-admins'), 1500)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update school administrator')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <LoadingIndicator message="Loading school administrator..." />

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Edit School Administrator</h3>
          <p className="text-muted m-0">Update school admin account details</p>
        </div>
        <Link to="/admin/school-admins" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to School Admins
        </Link>
      </div>

      {success && (
        <div className="alert alert-success py-2">School administrator updated successfully!</div>
      )}

      {error && (
        <div className="alert alert-danger py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0 fs-6">Admin Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="enabled"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="enabled">Account Active</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Link to="/admin/school-admins" className="btn btn-secondary btn-sm">Cancel</Link>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
