import React, { useState } from 'react'

const ChangePasswordDialog = ({ show, onClose, onSave }) => {
  const [payload, setPayload] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = (data) => {
    const errs = {}
    if (!data.currentPassword) {
      errs.currentPassword = 'Current password is required'
    }
    if (!data.newPassword || data.newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters'
    }
    if (data.newPassword !== data.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
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
      setErrors({ form: err.message || 'Failed to change password' })
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
                <h5 className="modal-title">Change Password</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`} 
                    value={payload.currentPassword} 
                    onChange={e => handleChange('currentPassword', e.target.value)} 
                  />
                  {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`} 
                    value={payload.newPassword} 
                    onChange={e => handleChange('newPassword', e.target.value)} 
                  />
                  {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
                    value={payload.confirmPassword} 
                    onChange={e => handleChange('confirmPassword', e.target.value)} 
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordDialog