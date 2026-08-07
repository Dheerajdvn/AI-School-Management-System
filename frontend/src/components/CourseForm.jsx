import React, { useEffect, useState } from 'react'
import { UserApi } from '../services/api'

function validate(p) {
  const errors = {}
  if (!p.courseCode || p.courseCode.trim().length < 2) errors.courseCode = 'Course code is required'
  if (!p.title || p.title.trim().length < 3) errors.title = 'Course title is required (min 3)'
  if (!p.teacherId) errors.teacherId = 'Teacher is required'
  if (p.capacity != null && (isNaN(p.capacity) || p.capacity <= 0)) errors.capacity = 'Capacity must be a positive number'
  return errors
}

export default function CourseForm({ course, onClose, onSave }) {
  const [payload, setPayload] = useState({ courseCode: '', title: '', description: '', teacherId: null, status: 'ACTIVE', capacity: null })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    if (course) setPayload({ ...course })
    UserApi.list({ role: 'ROLE_TEACHER', size: 100 })
      .then(r => {
        const pageData = r?.data?.data || r?.data || r
        const list = pageData.content || (Array.isArray(pageData) ? pageData : [])
        setTeachers(list)
      })
      .catch(() => setTeachers([]))
  }, [course])

  const handleChange = (k, v) => setPayload(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate(payload)
    setErrors(v)
    if (Object.keys(v).length) return
    setSaving(true)
    try {
      await onSave(payload)
      onClose()
    } catch (err) {
      setErrors({ form: err.message })
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{course ? 'Edit Course' : 'Create Course'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <div className="mb-3">
                  <label className="form-label">Course Code</label>
                  <input className={`form-control ${errors.courseCode ? 'is-invalid' : ''}`} value={payload.courseCode || ''} onChange={e => handleChange('courseCode', e.target.value)} />
                  {errors.courseCode && <div className="invalid-feedback">{errors.courseCode}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={payload.title || ''} onChange={e => handleChange('title', e.target.value)} />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={payload.description || ''} onChange={e => handleChange('description', e.target.value)} />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Teacher</label>
                    <select className={`form-select ${errors.teacherId ? 'is-invalid' : ''}`} value={payload.teacherId || ''} onChange={e => handleChange('teacherId', e.target.value)}>
                      <option value="">Select teacher</option>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.username} ({t.email})</option>)}
                    </select>
                    {errors.teacherId && <div className="invalid-feedback">{errors.teacherId}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={payload.status || 'ACTIVE'} onChange={e => handleChange('status', e.target.value)}>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Capacity</label>
                    <input type="number" min={0} className={`form-control ${errors.capacity ? 'is-invalid' : ''}`} value={payload.capacity || ''} onChange={e => handleChange('capacity', e.target.value ? Number(e.target.value) : null)} />
                    {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
                  </div>
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
