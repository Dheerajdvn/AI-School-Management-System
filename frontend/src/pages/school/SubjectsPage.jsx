import React, { useState, useEffect } from 'react'

export default function SubjectsPage() {
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ subjectName: '', subjectCode: '', credits: '', teacher: '', class: '' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const teachers = ['Mr. David Lee', 'Ms. Emily Chen', 'Mr. James Wilson', 'Mrs. Sarah Parker']
  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A']

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubjects([
        { id: 1, subjectName: 'Advanced Mathematics', subjectCode: 'MATH-101', credits: 4, teacher: 'Mr. David Lee', class: 'Class 10-A' },
        { id: 2, subjectName: 'Physics Fundamentals', subjectCode: 'PHY-201', credits: 3, teacher: 'Ms. Emily Chen', class: 'Class 10-B' },
        { id: 3, subjectName: 'English Literature', subjectCode: 'ENG-301', credits: 2, teacher: 'Mrs. Sarah Parker', class: 'Class 11-A' },
        { id: 4, subjectName: 'Computer Science', subjectCode: 'CS-401', credits: 4, teacher: 'Mr. James Wilson', class: 'Class 12-A' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = subjects.filter(s =>
    s.subjectName.toLowerCase().includes(search.toLowerCase()) ||
    s.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
    s.teacher.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  )

  const genCode = (name) => {
    const prefix = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4) || 'SUB'
    return `${prefix}-${String(Date.now()).slice(-3)}`
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ subjectName: '', subjectCode: '', credits: '', teacher: teachers[0], class: classes[0] })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (sub) => {
    setEditing(sub)
    setForm({ subjectName: sub.subjectName, subjectCode: sub.subjectCode, credits: String(sub.credits), teacher: sub.teacher, class: sub.class })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'subjectName') {
      setForm(prev => ({ ...prev, subjectCode: genCode(value) }))
    }
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.subjectName.trim()) errs.subjectName = 'Required'
    const c = parseInt(form.credits)
    if (!form.credits || c < 1 || c > 10) errs.credits = 'Must be 1-10'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setSubjects(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, credits: parseInt(form.credits) } : s))
      } else {
        setSubjects(prev => [...prev, { ...form, credits: parseInt(form.credits), subjectCode: genCode(form.subjectName), id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="subj-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{subjStyles}</style>
      </div>
    )
  }

  return (
    <div className="subj-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-book me-2" />Subjects</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Subject</button>
      </div>
      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-book" />
          <h6>{search ? 'No matching subjects found' : 'No subjects added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Subject</button>}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table subj-table">
            <thead><tr><th>Subject Name</th><th>Code</th><th>Credits</th><th>Teacher</th><th>Class</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id}>
                  <td><strong>{sub.subjectName}</strong></td>
                  <td><code>{sub.subjectCode}</code></td>
                  <td><span className="credits-badge">{sub.credits}</span></td>
                  <td>{sub.teacher}</td>
                  <td><span className="badge bg-info">{sub.class}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(sub)}><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(sub.id)}><i className="bi bi-trash" /></button>
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
              <h5>{editing ? 'Edit Subject' : 'Add Subject'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Subject Name <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formErrors.subjectName ? 'is-invalid' : ''}`} value={form.subjectName} onChange={e => handleChange('subjectName', e.target.value)} placeholder="e.g. Physics" />
                {formErrors.subjectName && <div className="invalid-feedback">{formErrors.subjectName}</div>}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Subject Code</label>
                  <input type="text" className="form-control" value={form.subjectCode} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Credits <span className="text-danger">*</span></label>
                  <input type="number" className={`form-control ${formErrors.credits ? 'is-invalid' : ''}`} value={form.credits} onChange={e => handleChange('credits', e.target.value)} min="1" max="10" />
                  {formErrors.credits && <div className="invalid-feedback">{formErrors.credits}</div>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Teacher</label>
                <select className="form-select" value={form.teacher} onChange={e => handleChange('teacher', e.target.value)}>
                  {teachers.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Class</label>
                <select className="form-select" value={form.class} onChange={e => handleChange('class', e.target.value)}>
                  {classes.map(c => <option key={c}>{c}</option>)}
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
              <p className="mb-0 opacity-75">Are you sure you want to delete this subject? This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{subjStyles}</style>
    </div>
  )
}

const subjStyles = `
.subj-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.subj-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.subj-page .search-bar { position: relative; }
.subj-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.subj-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.subj-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.subj-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.subj-page .subj-table { margin: 0; color: inherit; }
.subj-page .subj-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.subj-page .subj-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.subj-page .subj-table tr:last-child td { border-bottom: none; }
.subj-page .subj-table tr:hover td { background: rgba(255,255,255,0.03); }
.subj-page .credits-badge { background: rgba(16,185,129,0.15); color: #34d399; padding: 2px 10px; border-radius: 20px; font-weight: 600; }
.subj-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.subj-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.subj-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.subj-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.subj-page .modal-content { background: #0D0D10; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.subj-page .modal-content.confirm-dialog { max-width: 400px; }
.subj-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.subj-page .modal-body { padding: 1.25rem; }
.subj-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.subj-page .modal-footer-custom.justify-content-center { justify-content: center; }
.subj-page .form-control, .subj-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.subj-page .form-control:focus, .subj-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.subj-page .form-control.is-invalid { border-color: #ef4444; }
.subj-page .form-label { font-size: 0.85rem; font-weight: 600; }
.subj-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`