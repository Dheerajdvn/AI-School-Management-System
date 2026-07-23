import React, { useState, useEffect } from 'react'

export default function DepartmentsPage() {
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', head: '' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const heads = ['Mr. David Lee', 'Ms. Emily Chen', 'Mr. James Wilson', 'Mrs. Sarah Parker']

  useEffect(() => {
    const timer = setTimeout(() => {
      setDepartments([
        { id: 1, name: 'Science', description: 'Physics, Chemistry, Biology streams', head: 'Mr. David Lee' },
        { id: 2, name: 'Commerce', description: 'Accountancy, Business Studies, Economics', head: 'Ms. Emily Chen' },
        { id: 3, name: 'Arts', description: 'Literature, History, Political Science', head: 'Mrs. Sarah Parker' },
        { id: 4, name: 'Mathematics', description: 'Pure and Applied Mathematics', head: 'Mr. James Wilson' },
        { id: 5, name: 'Computer Science', description: 'Programming, Data Science, AI', head: 'Mr. James Wilson' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', description: '', head: heads[0] })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (dep) => {
    setEditing(dep)
    setForm({ ...dep })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setDepartments(prev => prev.map(d => d.id === editing.id ? { ...d, ...form } : d))
      } else {
        setDepartments(prev => [...prev, { ...form, id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setDepartments(prev => prev.filter(d => d.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="dp-page">
        <div className="row g-3">{[...Array(5)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{dpStyles}</style>
      </div>
    )
  }

  return (
    <div className="dp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-diagram-3 me-2" />Departments</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Department</button>
      </div>
      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-diagram-3" />
          <h6>{search ? 'No matching departments found' : 'No departments added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Department</button>}
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(dep => (
            <div className="col-md-4 col-sm-6" key={dep.id}>
              <div className="dept-card">
                <div className="dept-header">
                  <div className="dept-icon"><i className="bi bi-diagram-3" /></div>
                  <div className="dept-actions">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(dep)}><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(dep.id)}><i className="bi bi-trash" /></button>
                  </div>
                </div>
                <h5>{dep.name}</h5>
                <p className="dept-desc">{dep.description}</p>
                <div className="dept-footer">
                  <span className="dept-head"><i className="bi bi-person me-1" />{dep.head}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Department' : 'Add Department'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Department Name <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} value={form.name} onChange={e => handleChange('name', e.target.value)} />
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="2" value={form.description} onChange={e => handleChange('description', e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Department Head</label>
                <select className="form-select" value={form.head} onChange={e => handleChange('head', e.target.value)}>
                  {heads.map(h => <option key={h}>{h}</option>)}
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
              <p className="mb-0 opacity-75">This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{dpStyles}</style>
    </div>
  )
}

const dpStyles = `
.dp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.dp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.dp-page .search-bar { position: relative; }
.dp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.dp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.dp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.dp-page .dept-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.25rem; transition: all 0.3s; }
.dp-page .dept-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); border-color: rgba(59,130,246,0.3); }
.dp-page .dept-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem; }
.dp-page .dept-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #a78bfa; }
.dp-page .dept-card h5 { margin: 0 0 0.25rem 0; font-weight: 600; }
.dp-page .dept-desc { font-size: 0.8rem; opacity: 0.7; margin-bottom: 1rem; flex: 1; }
.dp-page .dept-footer { display: flex; justify-content: space-between; align-items: center; }
.dp-page .dept-head { font-size: 0.8rem; opacity: 0.8; }
.dp-page .skeleton-row { height: 80px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.dp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.dp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.dp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.dp-page .modal-content { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.dp-page .modal-content.confirm-dialog { max-width: 400px; }
.dp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.dp-page .modal-header-custom h5 { margin: 0; }
.dp-page .modal-body { padding: 1.25rem; }
.dp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.dp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.dp-page .form-control, .dp-page .form-select, .dp-page textarea.form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.dp-page .form-control:focus, .dp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.dp-page .form-control.is-invalid { border-color: #ef4444; }
.dp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.dp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`