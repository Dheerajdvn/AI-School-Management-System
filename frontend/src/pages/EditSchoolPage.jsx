import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { SchoolApi } from '../services/api'

/**
 * Edit School Page - Edit an existing school in the database
 * Role: ROLE_SUPER_ADMIN / ROLE_ADMIN
 */
export default function EditSchoolPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    subscriptionPlan: 'BASIC',
    aiEnabled: true,
    status: 'ACTIVE'
  })

  useEffect(() => {
    loadSchool()
  }, [id])

  const loadSchool = async () => {
    setInitialLoading(true)
    setError(null)
    try {
      const res = await SchoolApi.get(id)
      const data = res?.data || res
      setFormData({
        schoolName: data.schoolName || '',
        schoolCode: data.schoolCode || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        postalCode: data.postalCode || '',
        subscriptionPlan: data.subscriptionPlan || 'BASIC',
        aiEnabled: data.aiEnabled ?? true,
        status: data.status || 'ACTIVE'
      })
    } catch (e) {
      console.error(e)
      setError('Failed to load school')
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
      await SchoolApi.update(id, formData)
      setSuccess(true)
      setTimeout(() => navigate('/admin/schools'), 1500)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update school')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <LoadingIndicator message="Loading school..." />

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Edit School</h1>
          <p className="text-muted">Update school information</p>
        </div>
        <Link to="/admin/schools" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Schools
        </Link>
      </div>

      {success && (
        <div className="alert alert-success">School updated successfully!</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">Basic Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">School Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">School Code *</label>
                <input
                  type="text"
                  className="form-control"
                  name="schoolCode"
                  value={formData.schoolCode}
                  disabled
                />
                <small className="text-muted">School code cannot be changed.</small>
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
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">Subscription & Settings</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Subscription Plan</label>
                <select
                  className="form-select"
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleChange}
                >
                  <option value="BASIC">Basic</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="aiEnabled"
                    checked={formData.aiEnabled}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">AI Enabled</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Link to="/admin/schools" className="btn btn-outline-secondary me-2">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-1"></span>Updating...</> : 'Update School'}
          </button>
        </div>
      </form>
    </div>
  )
}
