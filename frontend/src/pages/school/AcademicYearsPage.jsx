import React, { useState, useEffect } from 'react'

/**
 * Academic Years Management Page
 * Role: ROLE_SCHOOL_ADMIN
 */
export default function AcademicYearsPage() {
  const [loading, setLoading] = useState(true)
  const [years, setYears] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ academicYear: '', startDate: '', endDate: '', isCurrent: false, status: 'Active' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setYears([
        { id: 1, academicYear: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isCurrent: true, status: 'Active' },
        { id: 2, academicYear: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', isCurrent: false, status: 'Active' },
        { id: 3, academicYear: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', isCurrent: false, status: 'Inactive' },
        { id: 4, academicYear: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', isCurrent: false, status: 'Inactive' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = years.filter(y =>
    y.academicYear.toLowerCase().includes(search.toLowerCase()) ||
    y.status.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ academicYear: '', startDate: '', endDate: '', isCurrent: false, status: 'Active' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (year) => {
    setEditing(year)
    setForm({ academicYear: year.academicYear, startDate: year.startDate, endDate: year.endDate, isCurrent: year.isCurrent, status: year.status })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.academicYear.trim()) errs.academicYear = 'Required'
    if (!form.startDate) errs.startDate = 'Required'
    if (!form.endDate) errs.endDate = 'Required'
    if (form.startDate && form.endDate && form.startDate >= form.endDate) errs.endDate = 'Must be after start date'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setYears(prev => prev.map(y => y.id === editing.id ? { ...y, ...form } : form.isCurrent ? { ...y, isCurrent: false } : y))
      } else {
        const newYear = { ...form, id: Date.now() }
        setYears(prev => form.isCurrent ? prev.map(y => ({ ...y, isCurrent: false })).concat(newYear) : [...prev, newYear])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setYears(prev => prev.filter(y => y.id !== id))
    setDeleteConfirm(null)
  }

  const toggleCurrent = (id) => {
    setYears(prev => prev.map(y => ({ ...y, isCurrent: y.id === id })))
  }

  if (loading) {
    return (
      <div className="ayp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{aypStyles}</style>
      </div>
    )
  }

  return (
    <div className="ayp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-calendar3 me-2" />Academic Years</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Year</button>
      </div>

      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search academic years..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-calendar3" />
          <h6>{search ? 'No matching academic years found' : 'No academic years added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Year</button>}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table ay-table">
            <thead><tr><th>Academic Year</th><th>Start Date</th><th>End Date</th><th>Current</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(year => (
                <tr key={year.id}>
                  <td><strong>{year.academicYear}</strong></td>
                  <td>{year.startDate}</td><td>{year.endDate}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={year.isCurrent} onChange={() => toggleCurrent(year.id)} />
                    </div>
                  </td>
                  <td><span className={`badge ${year.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{year.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(year)}><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(year.id)}><i className="bi bi-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Academic Year' : 'Add Academic Year'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Academic Year</label>
                <input type="text" className={`form-control ${formErrors.academicYear ? 'is-invalid' : ''}`} value={form.academicYear} onChange={e => handleChange('academicYear', e.target.value)} placeholder="e.g. 2026-2027" />
                {formErrors.academicYear && <div className="invalid-feedback">{formErrors.academicYear}</div>}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input type="date" className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`} value={form.startDate} onChange={e => handleChange('startDate', e.target.value)} />
                  {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input type="date" className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`} value={form.endDate} onChange={e => handleChange('endDate', e.target.value)} />
                  {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={form.isCurrent} onChange={e => handleChange('isCurrent', e.target.checked)} id="isCurrent" />
                <label className="form-check-label" htmlFor="isCurrent">Set as Current Year</label>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-body text-center py-4">
              <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }} />
              <h5 className="mt-2">Confirm Delete</h5>
              <p className="mb-0 opacity-75">Are you sure you want to delete this academic year? This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{aypStyles}</style>
    </div>
  )
}

const aypStyles = `
.ayp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.ayp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.ayp-page .search-bar { position: relative; }
.ayp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.ayp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.ayp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.ayp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.ayp-page .ay-table { margin: 0; color: inherit; }
.ayp-page .ay-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.ayp-page .ay-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.ayp-page .ay-table tr:last-child td { border-bottom: none; }
.ayp-page .ay-table tr:hover td { background: rgba(255,255,255,0.03); }
.ayp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.ayp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.ayp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.ayp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.ayp-page .modal-content { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.ayp-page .modal-content.confirm-dialog { max-width: 400px; }
.ayp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.ayp-page .modal-header-custom h5 { margin: 0; }
.ayp-page .modal-body { padding: 1.25rem; }
.ayp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.ayp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.ayp-page .form-control, .ayp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.ayp-page .form-control:focus, .ayp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.ayp-page .form-control.is-invalid { border-color: #ef4444; }
.ayp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.ayp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.ayp-page .btn-secondary { border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`