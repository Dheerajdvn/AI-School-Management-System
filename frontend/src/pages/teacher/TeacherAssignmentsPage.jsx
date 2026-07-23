import React, { useState, useEffect } from 'react'

export default function TeacherAssignmentsPage() {
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', class: 'Class 10-A', subject: 'Mathematics', dueDate: '', status: 'Draft', description: '' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A']
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English']

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignments([
        { id: 1, title: 'Algebra Worksheet', class: 'Class 10-A', subject: 'Mathematics', dueDate: '2026-07-30', status: 'Published', submissions: 28, total: 38 },
        { id: 2, title: 'Physics Lab Report', class: 'Class 11-A', subject: 'Physics', dueDate: '2026-08-02', status: 'Draft', submissions: 0, total: 32 },
        { id: 3, title: 'Chemistry Equations', class: 'Class 10-B', subject: 'Chemistry', dueDate: '2026-07-28', status: 'Published', submissions: 35, total: 36 },
        { id: 4, title: 'English Essay', class: 'Class 12-A', subject: 'English', dueDate: '2026-08-05', status: 'Published', submissions: 20, total: 30 },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', class: classes[0], subject: subjects[0], dueDate: '', status: 'Draft', description: '' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (a) => {
    setEditing(a)
    setForm({ ...a })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.dueDate) errs.dueDate = 'Required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setAssignments(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a))
      } else {
        setAssignments(prev => [{ ...form, id: Date.now(), submissions: 0, total: 30 }, ...prev])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="tap-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{tapStyles}</style>
      </div>
    )
  }

  return (
    <div className="tap-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-card-text me-2" />Assignments</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />New Assignment</button>
      </div>
      <div className="d-flex gap-2 mb-3">
        <div className="search-bar flex-grow-1">
          <i className="bi bi-search search-icon" />
          <input type="text" className="form-control" placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option><option>Published</option><option>Draft</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><i className="bi bi-card-text" /><h6>{search ? 'No matching assignments' : 'No assignments created yet'}</h6></div>
      ) : (
        <div className="table-responsive">
          <table className="table tap-table">
            <thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Due Date</th><th>Status</th><th>Submissions</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td>{a.class}</td>
                  <td>{a.subject}</td>
                  <td>{a.dueDate}</td>
                  <td><span className={`status-badge ${a.status === 'Published' ? 'published' : 'draft'}`}>{a.status}</span></td>
                  <td>{a.submissions}/{a.total}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(a)}><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(a.id)}><i className="bi bi-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Assignment' : 'New Assignment'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formErrors.title ? 'is-invalid' : ''}`} value={form.title} onChange={e => handleChange('title', e.target.value)} />
                {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Class</label>
                  <select className="form-select" value={form.class} onChange={e => handleChange('class', e.target.value)}>
                    {classes.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={e => handleChange('subject', e.target.value)}>
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Due Date <span className="text-danger">*</span></label>
                <input type="date" className={`form-control ${formErrors.dueDate ? 'is-invalid' : ''}`} value={form.dueDate} onChange={e => handleChange('dueDate', e.target.value)} />
                {formErrors.dueDate && <div className="invalid-feedback">{formErrors.dueDate}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                  <option>Draft</option><option>Published</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={e => handleChange('description', e.target.value)} />
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

      <style>{tapStyles}</style>
    </div>
  )
}

const tapStyles = `
.tap-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.tap-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.tap-page .d-flex.gap-2 { gap: 0.5rem; }
.tap-page .search-bar { position: relative; }
.tap-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.tap-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.tap-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.tap-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.tap-page .tap-table { margin: 0; color: inherit; }
.tap-page .tap-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.tap-page .tap-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.tap-page .tap-table tr:last-child td { border-bottom: none; }
.tap-page .tap-table tr:hover td { background: rgba(255,255,255,0.03); }
.tap-page .status-badge { padding: 2px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem; }
.tap-page .status-badge.published { background: rgba(16,185,129,0.15); color: #34d399; }
.tap-page .status-badge.draft { background: rgba(245,158,11,0.15); color: #fbbf24; }
.tap-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.tap-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.tap-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.tap-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.tap-page .modal-content { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.tap-page .modal-content.confirm-dialog { max-width: 400px; }
.tap-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.tap-page .modal-header-custom h5 { margin: 0; }
.tap-page .modal-body { padding: 1.25rem; }
.tap-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.tap-page .modal-footer-custom.justify-content-center { justify-content: center; }
.tap-page .form-control, .tap-page .form-select, .tap-page textarea.form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.tap-page .form-control:focus, .tap-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.tap-page .form-control.is-invalid { border-color: #ef4444; }
.tap-page .form-label { font-size: 0.85rem; font-weight: 600; }
.tap-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`