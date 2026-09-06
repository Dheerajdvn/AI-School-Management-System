import React, { useState, useEffect } from 'react'

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [search, setSearch] = useState('')
  const [targetFilter, setTargetFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', message: '', target: 'All', publishDate: '', status: 'Draft' })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const targets = ['All', 'Teachers', 'Students', 'Parents']

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncements([
        { id: 1, title: 'Parent-Teacher Meeting', message: 'Annual parent-teacher meeting scheduled for all classes. Attendance is mandatory.', target: 'All', publishDate: '2026-07-25', status: 'Published' },
        { id: 2, title: 'Mid-Term Exam Schedule', message: 'Mid-term examinations will begin from August 15th. Check the timetable for details.', target: 'Students', publishDate: '2026-08-01', status: 'Published' },
        { id: 3, title: 'Science Exhibition', message: 'Annual science exhibition for classes 9-12. Register before August 1st.', target: 'All', publishDate: '2026-08-05', status: 'Published' },
        { id: 4, title: 'Staff Meeting', message: 'Monthly staff meeting to discuss curriculum updates.', target: 'Teachers', publishDate: '2026-07-28', status: 'Draft' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase())
    const matchTarget = targetFilter === 'All' || a.target === targetFilter
    return matchSearch && matchTarget
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', message: '', target: 'All', publishDate: new Date().toISOString().split('T')[0], status: 'Draft' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (ann) => {
    setEditing(ann)
    setForm({ ...ann })
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
    if (!form.message.trim()) errs.message = 'Required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setAnnouncements(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a))
      } else {
        setAnnouncements(prev => [{ ...form, id: Date.now() }, ...prev])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="anp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{anpStyles}</style>
      </div>
    )
  }

  return (
    <div className="anp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-megaphone me-2" />Announcements</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />New Announcement</button>
      </div>
      <div className="d-flex gap-2 mb-3">
        <div className="search-bar flex-grow-1">
          <i className="bi bi-search search-icon" />
          <input type="text" className="form-control" placeholder="Search announcements..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={targetFilter} onChange={e => setTargetFilter(e.target.value)}>
          {targets.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-megaphone" />
          <h6>{search ? 'No matching announcements found' : 'No announcements yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Create Your First Announcement</button>}
        </div>
      ) : (
        <div className="announcements-list">
          {filtered.map(ann => (
            <div key={ann.id} className="announcement-card">
              <div className="ann-header">
                <div className="ann-title-row">
                  <h5>{ann.title}</h5>
                  <span className={`ann-target-badge ${ann.target.toLowerCase()}`}>{ann.target}</span>
                </div>
                <div className="ann-meta">
                  <span><i className="bi bi-calendar3 me-1" />{ann.publishDate}</span>
                  <span className={`status-badge ${ann.status === 'Published' ? 'published' : 'draft'}`}>{ann.status}</span>
                </div>
              </div>
              <p className="ann-message">{ann.message}</p>
              <div className="ann-actions">
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(ann)}><i className="bi bi-pencil" />Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(ann.id)}><i className="bi bi-trash" />Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Announcement' : 'New Announcement'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formErrors.title ? 'is-invalid' : ''}`} value={form.title} onChange={e => handleChange('title', e.target.value)} />
                {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Message <span className="text-danger">*</span></label>
                <textarea className={`form-control ${formErrors.message ? 'is-invalid' : ''}`} rows="3" value={form.message} onChange={e => handleChange('message', e.target.value)} />
                {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Target Audience</label>
                  <select className="form-select" value={form.target} onChange={e => handleChange('target', e.target.value)}>
                    {targets.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Publish Date</label>
                  <input type="date" className="form-control" value={form.publishDate} onChange={e => handleChange('publishDate', e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                  <option>Draft</option><option>Published</option>
                </select>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : (editing ? 'Update' : 'Publish')}
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

      <style>{anpStyles}</style>
    </div>
  )
}

const anpStyles = `
.anp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.anp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.anp-page .d-flex.gap-2 { gap: 0.5rem; }
.anp-page .search-bar { position: relative; }
.anp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.anp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.anp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.anp-page .announcements-list { display: flex; flex-direction: column; gap: 0.75rem; }
.anp-page .announcement-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.25rem; transition: all 0.3s; }
.anp-page .announcement-card:hover { border-color: rgba(59,130,246,0.3); }
.anp-page .ann-title-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.5rem; }
.anp-page .ann-title-row h5 { margin: 0; font-weight: 600; }
.anp-page .ann-target-badge { padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
.anp-page .ann-target-badge.all { background: rgba(59,130,246,0.15); color: #60a5fa; }
.anp-page .ann-target-badge.teachers { background: rgba(16,185,129,0.15); color: #34d399; }
.anp-page .ann-target-badge.students { background: rgba(245,158,11,0.15); color: #fbbf24; }
.anp-page .ann-target-badge.parents { background: rgba(139,92,246,0.15); color: #a78bfa; }
.anp-page .ann-meta { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; opacity: 0.7; margin-bottom: 0.5rem; }
.anp-page .ann-message { margin: 0; font-size: 0.9rem; opacity: 0.85; }
.anp-page .ann-actions { margin-top: 0.75rem; }
.anp-page .status-badge { padding: 2px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem; }
.anp-page .status-badge.published { background: rgba(16,185,129,0.15); color: #34d399; }
.anp-page .status-badge.draft { background: rgba(245,158,11,0.15); color: #fbbf24; }
.anp-page .skeleton-row { height: 80px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.anp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.anp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.anp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.anp-page .modal-content { background: #0D0D10; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.anp-page .modal-content.confirm-dialog { max-width: 400px; }
.anp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.anp-page .modal-header-custom h5 { margin: 0; }
.anp-page .modal-body { padding: 1.25rem; }
.anp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.anp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.anp-page .form-control, .anp-page .form-select, .anp-page textarea.form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.anp-page .form-control:focus, .anp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.anp-page .form-control.is-invalid { border-color: #ef4444; }
.anp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.anp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`