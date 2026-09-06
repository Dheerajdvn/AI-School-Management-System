import React, { useState, useEffect } from 'react'

export default function SectionsPage() {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ sectionName: '', class: '', maxStudents: '', classTeacher: '' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const classes = ['Class 10', 'Class 11', 'Class 12', 'Class 9']
  const teachers = ['Mr. David Lee', 'Ms. Emily Chen', 'Mr. James Wilson', 'Mrs. Sarah Parker']

  useEffect(() => {
    const timer = setTimeout(() => {
      setSections([
        { id: 1, sectionName: 'A', class: 'Class 10', maxStudents: 40, classTeacher: 'Mr. David Lee' },
        { id: 2, sectionName: 'B', class: 'Class 10', maxStudents: 38, classTeacher: 'Ms. Emily Chen' },
        { id: 3, sectionName: 'A', class: 'Class 11', maxStudents: 35, classTeacher: 'Mr. James Wilson' },
        { id: 4, sectionName: 'C', class: 'Class 12', maxStudents: 30, classTeacher: 'Mrs. Sarah Parker' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = sections.filter(s =>
    s.sectionName.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase()) ||
    s.classTeacher.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ sectionName: '', class: classes[0], maxStudents: '', classTeacher: teachers[0] })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (sec) => {
    setEditing(sec)
    setForm({ sectionName: sec.sectionName, class: sec.class, maxStudents: String(sec.maxStudents), classTeacher: sec.classTeacher })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.sectionName.trim()) errs.sectionName = 'Required'
    const max = parseInt(form.maxStudents)
    if (!form.maxStudents || max <= 0 || max > 60) errs.maxStudents = 'Must be 1-60'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setSections(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, maxStudents: parseInt(form.maxStudents) } : s))
      } else {
        setSections(prev => [...prev, { ...form, maxStudents: parseInt(form.maxStudents), id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setSections(prev => prev.filter(s => s.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="sp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{spStyles}</style>
      </div>
    )
  }

  return (
    <div className="sp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-columns-gap me-2" />Sections</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Section</button>
      </div>
      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-columns-gap" />
          <h6>{search ? 'No matching sections found' : 'No sections added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Section</button>}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table sp-table">
            <thead><tr><th>Section</th><th>Class</th><th>Max Students</th><th>Class Teacher</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(sec => (
                <tr key={sec.id}>
                  <td><span className="section-badge">Section {sec.sectionName}</span></td>
                  <td>{sec.class}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span>{sec.maxStudents}</span>
                      <div className="capacity-bar"><div className="capacity-fill" style={{ width: `${(sec.maxStudents / 60) * 100}%` }} /></div>
                    </div>
                  </td>
                  <td>{sec.classTeacher}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(sec)}><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(sec.id)}><i className="bi bi-trash" /></button>
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
              <h5>{editing ? 'Edit Section' : 'Add Section'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Section Name <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formErrors.sectionName ? 'is-invalid' : ''}`} value={form.sectionName} onChange={e => handleChange('sectionName', e.target.value)} placeholder="e.g. A, B, C" />
                {formErrors.sectionName && <div className="invalid-feedback">{formErrors.sectionName}</div>}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Class</label>
                  <select className="form-select" value={form.class} onChange={e => handleChange('class', e.target.value)}>
                    {classes.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Max Students <span className="text-danger">*</span></label>
                  <input type="number" className={`form-control ${formErrors.maxStudents ? 'is-invalid' : ''}`} value={form.maxStudents} onChange={e => handleChange('maxStudents', e.target.value)} min="1" max="60" />
                  {formErrors.maxStudents && <div className="invalid-feedback">{formErrors.maxStudents}</div>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Class Teacher</label>
                <select className="form-select" value={form.classTeacher} onChange={e => handleChange('classTeacher', e.target.value)}>
                  {teachers.map(t => <option key={t}>{t}</option>)}
                </select>
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
              <p className="mb-0 opacity-75">Are you sure you want to delete this section? This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{spStyles}</style>
    </div>
  )
}

const spStyles = `
.sp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.sp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.sp-page .search-bar { position: relative; }
.sp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.sp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.sp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.sp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.sp-page .sp-table { margin: 0; color: inherit; }
.sp-page .sp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.sp-page .sp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sp-page .sp-table tr:last-child td { border-bottom: none; }
.sp-page .sp-table tr:hover td { background: rgba(255,255,255,0.03); }
.sp-page .section-badge { background: rgba(139,92,246,0.15); color: #a78bfa; padding: 2px 10px; border-radius: 20px; font-weight: 600; }
.sp-page .capacity-bar { width: 80px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); overflow: hidden; }
.sp-page .capacity-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #10b981, #34d399); }
.sp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.sp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.sp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.sp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.sp-page .modal-content { background: #0D0D10; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.sp-page .modal-content.confirm-dialog { max-width: 400px; }
.sp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.sp-page .modal-body { padding: 1.25rem; }
.sp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.sp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.sp-page .form-control, .sp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.sp-page .form-control:focus, .sp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.sp-page .form-control.is-invalid { border-color: #ef4444; }
.sp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.sp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`