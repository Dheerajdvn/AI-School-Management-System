import React, { useEffect, useState } from 'react'

function validate(payload) {
  const errors = {}
  if (!payload.username || payload.username.trim().length < 3) errors.username = 'Username is required (min 3)'
  if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) errors.email = 'Valid email is required'
  if (!payload.id && (!payload.password || payload.password.length < 6)) errors.password = 'Password is required (min 6 characters)'
  return errors
}

export default function UserForm({ user, onClose, onSave }) {
  const [payload, setPayload] = useState({ username: '', email: '', password: '', roles: ['ROLE_TEACHER'], firstName: '', lastName: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setPayload({
        username: user.username || '',
        email: user.email || '',
        password: '',
        roles: user.roles || ['ROLE_TEACHER'],
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        id: user.id
      })
    }
  }, [user])

  const handleChange = (k, v) => setPayload(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate(payload)
    setErrors(v)
    if (Object.keys(v).length) return
    setSaving(true)
    try {
      const finalPayload = {
        ...payload,
        roles: (!payload.roles || payload.roles.length === 0) ? ['ROLE_TEACHER'] : payload.roles
      }
      if (user && !finalPayload.password) {
        delete finalPayload.password
      }
      await onSave(finalPayload)
      onClose()
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || 'Failed to save user' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{user ? 'Edit User' : 'Add User'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input className="form-control" value={payload.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" value={payload.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input className={`form-control ${errors.username ? 'is-invalid' : ''}`} value={payload.username} onChange={e => handleChange('username', e.target.value)} />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={payload.email} onChange={e => handleChange('email', e.target.value)} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password {user ? <small className="text-muted">(leave blank to keep)</small> : '*'}</label>
                  <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={payload.password} onChange={e => handleChange('password', e.target.value)} placeholder={user ? 'Leave blank to keep current' : 'Min 6 characters'} />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={payload.phone} onChange={e => handleChange('phone', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Roles</label>
                  <select multiple className="form-select" value={payload.roles || []} onChange={e => handleChange('roles', Array.from(e.target.selectedOptions).map(o => o.value))}>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_SCHOOL_ADMIN">School Admin</option>
                    <option value="ROLE_TEACHER">Teacher</option>
                    <option value="ROLE_STUDENT">Student</option>
                  </select>
                  <small className="text-muted">Hold Ctrl/Cmd to select multiple roles.</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
