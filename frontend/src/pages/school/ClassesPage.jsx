import React, { useState, useEffect } from 'react'

export default function ClassesPage() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ className: '', classCode: '', capacity: '', homeroomTeacher: '', academicYear: '2026-2027' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const teachers = ['Mr. David Lee', 'Ms. Emily Chen', 'Mr. James Wilson', 'Mrs. Sarah Parker']
  const academicYears = ['2026-2027', '2025-2026', '2024-2025']

  useEffect(() => {
    const timer = setTimeout(() => {
      setClasses([
        { id: 1, className: 'Class 10-A', classCode: 'CLS-1001', capacity: 40, homeroomTeacher: 'Mr. David Lee', academicYear: '2026-2027' },
        { id: 2, className: 'Class 10-B', classCode: 'CLS-1002', capacity: 38, homeroomTeacher: 'Ms. Emily Chen', academicYear: '2026-2027' },
        { id: 3, className: 'Class 11-A', classCode: 'CLS-2001', capacity: 35, homeroomTeacher: 'Mr. James Wilson', academicYear: '2025-2026' },
        { id: 4, className: 'Class 12-A', classCode: 'CLS-3001', capacity: 30, homeroomTeacher: 'Mrs. Sarah Parker', academicYear: '2026-2027' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = classes.filter(c =>
    c.className.toLowerCase().includes(search.toLowerCase()) ||
    c.classCode.toLowerCase().includes(search.toLowerCase()) ||
    c.homeroomTeacher.toLowerCase().includes(search.toLowerCase())
  )

  const generateCode = () => `CLS-${String(Date.now()).slice(-4)}`

  const openAdd = () => {
    setEditing(null)
    setForm({ className: '', classCode: generateCode(), capacity: '', homeroomTeacher: teachers[0], academicYear: '2026-2027' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (cls) => {
    setEditing(cls)
    setForm({ className: cls.className, classCode: cls.classCode, capacity: String(cls.capacity), homeroomTeacher: cls.homeroomTeacher, academicYear: cls.academicYear })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.className.trim()) errs.className = 'Required'
    if (!form.capacity || parseInt(form.capacity) <= 0) errs.capacity = 'Must be a positive number'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setClasses(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, capacity: parseInt(form.capacity) } : c))
      } else {
        setClasses(prev => [...prev, { ...form, capacity: parseInt(form.capacity), id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="cp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{cpStyles}</style>
      </div>
    )
  }

  return (
    <div className="cp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-layers me-2" />Classes</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Class</button>
      </div>
      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-layers" />
          <h6>{search ? 'No matching classes found' : 'No classes added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Class</button>}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table cp-table">
            <thead><tr><th>Class Name</th><th>Code</th><th>Capacity</th><th>Homeroom Teacher</th><th>Academic Year</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(cls => (
                <tr key={cls.id}>
                  <td><strong>{cls.className}</strong></td>
                  <td><code>{cls.classCode}</code></td>
                  <td><span className="capacity-badge">{cls.capacity}</span></td>
                  <td>{cls.homeroomTeacher}</td>
                  <td><span className="badge bg-info">{cls.academicYear}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(cls)}><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(cls.id)}><i className="bi bi-trash" /></button>
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
              <h5>{editing ? 'Edit Class' : 'Add Class'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Class Name <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formErrors.className ? 'is-invalid' : ''}`} value={form.className} onChange={e => handleChange('className', e.target.value)} placeholder="e.g. Class 10-A" />
                {formErrors.className && <div className="invalid-feedback">{formErrors.className}</div>}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Class Code</label>
                  <input type="text" className="form-control" value={form.classCode} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Capacity <span className="text-danger">*</span></label>
                  <input type="number" className={`form-control ${formErrors.capacity ? 'is-invalid' : ''}`} value={form.capacity} onChange={e => handleChange('capacity', e.target.value)} min="1" />
                  {formErrors.capacity && <div className="invalid-feedback">{formErrors.capacity}</div>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Homeroom Teacher</label>
                <select className="form-select" value={form.homeroomTeacher} onChange={e => handleChange('homeroomTeacher', e.target.value)}>
                  {teachers.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Academic Year</label>
                <select className="form-select" value={form.academicYear} onChange={e => handleChange('academicYear', e.target.value)}>
                  {academicYears.map(y => <option key={y}>{y}</option>)}
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
              <p className="mb-0 opacity-75">Are you sure you want to delete this class? This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{cpStyles}</style>
    </div>
  )
}

const cpStyles = `
.cp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.cp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.cp-page .search-bar { position: relative; }
.cp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.cp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.cp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.cp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.cp-page .cp-table { margin: 0; color: inherit; }
.cp-page .cp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.cp-page .cp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.cp-page .cp-table tr:last-child td { border-bottom: none; }
.cp-page .cp-table tr:hover td { background: rgba(255,255,255,0.03); }
.cp-page .capacity-badge { background: rgba(59,130,246,0.15); color: #60a5fa; padding: 2px 10px; border-radius: 20px; font-weight: 600; }
.cp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.cp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.cp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.cp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.cp-page .modal-content { background: #0D0D10; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.cp-page .modal-content.confirm-dialog { max-width: 400px; }
.cp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.cp-page .modal-header-custom h5 { margin: 0; }
.cp-page .modal-body { padding: 1.25rem; }
.cp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.cp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.cp-page .form-control, .cp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.cp-page .form-control:focus, .cp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.cp-page .form-control.is-invalid { border-color: #ef4444; }
.cp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.cp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.cp-page .btn-secondary, .cp-page .btn-danger { border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`