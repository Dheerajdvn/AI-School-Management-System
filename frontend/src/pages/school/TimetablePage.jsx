import React, { useState, useEffect } from 'react'

export default function TimetablePage() {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ day: 'Monday', period: '1', teacher: '', subject: '', room: '' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const periods = ['1','2','3','4','5','6','7','8']
  const teachers = ['Mr. David Lee', 'Ms. Emily Chen', 'Mr. James Wilson', 'Mrs. Sarah Parker']
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science', 'Biology']
  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Lab A', 'Lab B', 'Library']

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntries([
        { id: 1, day: 'Monday', period: '1', teacher: 'Mr. David Lee', subject: 'Physics', room: 'Lab A' },
        { id: 2, day: 'Monday', period: '2', teacher: 'Ms. Emily Chen', subject: 'Mathematics', room: 'Room 101' },
        { id: 3, day: 'Tuesday', period: '1', teacher: 'Mr. James Wilson', subject: 'Computer Science', room: 'Lab B' },
        { id: 4, day: 'Wednesday', period: '3', teacher: 'Mrs. Sarah Parker', subject: 'English', room: 'Room 102' },
        { id: 5, day: 'Thursday', period: '4', teacher: 'Mr. David Lee', subject: 'Chemistry', room: 'Lab A' },
        { id: 6, day: 'Friday', period: '2', teacher: 'Ms. Emily Chen', subject: 'Mathematics', room: 'Room 101' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ day: 'Monday', period: '1', teacher: teachers[0], subject: subjects[0], room: rooms[0] })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (entry) => {
    setEditing(entry)
    setForm({ ...entry })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.teacher) errs.teacher = 'Required'
    if (!form.subject) errs.subject = 'Required'
    if (!form.room) errs.room = 'Required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setEntries(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } : e))
      } else {
        setEntries(prev => [...prev, { ...form, id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    setDeleteConfirm(null)
  }

  const grouped = days.reduce((acc, day) => {
    acc[day] = entries.filter(e => e.day === day).sort((a, b) => parseInt(a.period) - parseInt(b.period))
    return acc
  }, {})

  if (loading) {
    return (
      <div className="ttp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{ttpStyles}</style>
      </div>
    )
  }

  return (
    <div className="ttp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-calendar-week me-2" />Timetable</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Entry</button>
      </div>

      <div className="timetable-grid">
        <div className="tt-header-row">
          <div className="tt-cell header">Day</div>
          {periods.map(p => <div key={p} className="tt-cell header">Period {p}</div>)}
        </div>
        {days.map(day => (
          <div key={day} className="tt-row">
            <div className="tt-cell day">{day}</div>
            {periods.map(p => {
              const entry = grouped[day].find(e => e.period === p)
              return (
                <div key={p} className="tt-cell">
                  {entry ? (
                    <div className="tt-entry">
                      <strong>{entry.subject}</strong>
                      <span>{entry.teacher}</span>
                      <span><i className="bi bi-door-open me-1" />{entry.room}</span>
                    </div>
                  ) : (
                    <span className="tt-empty">-</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Day</label>
                  <select className="form-select" value={form.day} onChange={e => handleChange('day', e.target.value)}>
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Period</label>
                  <select className="form-select" value={form.period} onChange={e => handleChange('period', e.target.value)}>
                    {periods.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Subject <span className="text-danger">*</span></label>
                <select className={`form-select ${formErrors.subject ? 'is-invalid' : ''}`} value={form.subject} onChange={e => handleChange('subject', e.target.value)}>
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
                {formErrors.subject && <div className="invalid-feedback">{formErrors.subject}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Teacher <span className="text-danger">*</span></label>
                <select className={`form-select ${formErrors.teacher ? 'is-invalid' : ''}`} value={form.teacher} onChange={e => handleChange('teacher', e.target.value)}>
                  {teachers.map(t => <option key={t}>{t}</option>)}
                </select>
                {formErrors.teacher && <div className="invalid-feedback">{formErrors.teacher}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Room <span className="text-danger">*</span></label>
                <select className={`form-select ${formErrors.room ? 'is-invalid' : ''}`} value={form.room} onChange={e => handleChange('room', e.target.value)}>
                  {rooms.map(r => <option key={r}>{r}</option>)}
                </select>
                {formErrors.room && <div className="invalid-feedback">{formErrors.room}</div>}
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : (editing ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-body text-center py-4">
              <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }} />
              <h5 className="mt-2">Confirm Delete</h5>
              <p className="mb-0 opacity-75">This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{ttpStyles}</style>
    </div>
  )
}

const ttpStyles = `
.ttp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.ttp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.ttp-page .timetable-grid { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.ttp-page .tt-header-row { display: flex; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); }
.ttp-page .tt-row { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
.ttp-page .tt-row:last-child { border-bottom: none; }
.ttp-page .tt-cell { flex: 1; padding: 0.75rem; min-width: 100px; border-right: 1px solid rgba(255,255,255,0.05); }
.ttp-page .tt-cell:last-child { border-right: none; }
.ttp-page .tt-cell.header { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: center; }
.ttp-page .tt-cell.day { font-weight: 600; background: rgba(59,130,246,0.08); }
.ttp-page .tt-entry { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.8rem; }
.ttp-page .tt-entry strong { color: #60a5fa; }
.ttp-page .tt-entry span { opacity: 0.7; }
.ttp-page .tt-empty { opacity: 0.3; }
.ttp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.ttp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.ttp-page .modal-content { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.ttp-page .modal-content.confirm-dialog { max-width: 400px; }
.ttp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.ttp-page .modal-header-custom h5 { margin: 0; }
.ttp-page .modal-body { padding: 1.25rem; }
.ttp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.ttp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.ttp-page .form-control, .ttp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.ttp-page .form-control:focus, .ttp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.ttp-page .form-control.is-invalid { border-color: #ef4444; }
.ttp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.ttp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`