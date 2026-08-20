import React, { useState, useEffect } from 'react'

const EditProfileDialog = ({ show, user, onClose, onSave }) => {
  const [payload, setPayload] = useState({ username: '', firstName: '', lastName: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setPayload({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  const validate = (data) => {
    const errs = {}
    if (!data.username || data.username.trim().length < 3 || /\s/.test(data.username)) {
      errs.username = 'Username is required (min 3 characters, no spaces)'
    }
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      errs.email = 'Valid email is required'
    }
    if (data.phone && !/^\d+$/.test(data.phone)) {
      errs.phone = 'Phone number must contain only numbers'
    }
    return errs
  }

  const handleChange = (k, v) => setPayload(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate(payload)
    setErrors(v)
    if (Object.keys(v).length) return
    setSaving(true)
    try {
      await onSave(payload)
      onClose && onClose()
    } catch (err) {
      setErrors({ form: err.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '480px' }}>
        <div className="modal-content border shadow-2xl bg-card" style={{ borderRadius: '16px' }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header border-bottom py-3">
              <h5 className="modal-title fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className="bi bi-person-gear me-2 text-primary" />
                Edit Profile
              </h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              {errors.form && <div className="alert alert-danger py-2 small">{errors.form}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">First Name</label>
                  <input 
                    className="form-control bg-surface border" 
                    value={payload.firstName} 
                    onChange={e => handleChange('firstName', e.target.value)} 
                    placeholder="First name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Last Name</label>
                  <input 
                    className="form-control bg-surface border" 
                    value={payload.lastName} 
                    onChange={e => handleChange('lastName', e.target.value)} 
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label text-muted small fw-semibold">Username</label>
                <input 
                  className={`form-control bg-surface border ${errors.username ? 'is-invalid' : ''}`} 
                  value={payload.username} 
                  onChange={e => handleChange('username', e.target.value)} 
                  placeholder="Username (no spaces)"
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Email Address</label>
                <input 
                  type="email"
                  className={`form-control bg-surface border ${errors.email ? 'is-invalid' : ''}`} 
                  value={payload.email} 
                  onChange={e => handleChange('email', e.target.value)} 
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-0">
                <label className="form-label text-muted small fw-semibold">Phone Number</label>
                <input 
                  className={`form-control bg-surface border ${errors.phone ? 'is-invalid' : ''}`} 
                  value={payload.phone} 
                  onChange={e => handleChange('phone', e.target.value)} 
                  placeholder="Enter phone number (numbers only)"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>
            <div className="modal-footer border-top py-3">
              <button type="button" className="btn btn-secondary btn-sm rounded-3" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm rounded-3 px-3" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfileDialog