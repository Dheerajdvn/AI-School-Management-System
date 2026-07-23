import React, { useState, useEffect } from 'react'

const EditProfileDialog = ({ show, user, onClose, onSave }) => {
  const [payload, setPayload] = useState({ username: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setPayload({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  const validate = (data) => {
    const errs = {}
    if (!data.username || data.username.trim().length < 3) {
      errs.username = 'Username is required (min 3 characters)'
    }
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      errs.email = 'Valid email is required'
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
    <div className="modal-backdrop">
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input 
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
                    value={payload.username} 
                    onChange={e => handleChange('username', e.target.value)} 
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                    value={payload.email} 
                    onChange={e => handleChange('email', e.target.value)} 
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input 
                    className="form-control" 
                    value={payload.phone} 
                    onChange={e => handleChange('phone', e.target.value)} 
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfileDialog