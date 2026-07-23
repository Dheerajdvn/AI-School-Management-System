import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { SchoolApi } from '../services/api'

/**
 * Create School Page - Create a new school in the database
 * Role: ROLE_SUPER_ADMIN / ROLE_ADMIN
 */
export default function CreateSchoolPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState(null)
  
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
      const payload = {
        ...formData,
        status: formData.status ? 'ACTIVE' : 'INACTIVE'
      }
      const res = await SchoolApi.create(payload)
      const data = res?.data || res
      
      setGeneratedCredentials({
        username: data.username,
        password: data.temporaryPassword
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create school')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Creating school in database..." />

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Create School</h1>
          <p className="text-muted">Add a new school to the platform database</p>
        </div>
        <Link to="/admin/schools" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Schools
        </Link>
      </div>

      {success && generatedCredentials && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">School Created Successfully!</h5>
              </div>
              <div className="modal-body">
                <p>The school has been saved and the following School Admin account has been created:</p>
                <div className="bg-light p-3 rounded">
                  <p className="mb-1"><strong>Username:</strong> {generatedCredentials.username}</p>
                  <p className="mb-0"><strong>Temporary Password:</strong> {generatedCredentials.password}</p>
                </div>
                <p className="mt-2 mb-0"><small className="text-muted">Please share these credentials with the school administrator.</small></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => navigate('/admin/schools')}>
                  Go to Schools
                </button>
              </div>
            </div>
          </div>
        </div>
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
                  onChange={handleChange}
                  placeholder="e.g. OHS-001"
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
            {loading ? <><span className="spinner-border spinner-border-sm me-1"></span>Creating...</> : 'Create School'}
          </button>
        </div>
      </form>
    </div>
  )
}
