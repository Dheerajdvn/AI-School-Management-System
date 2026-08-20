import React, { useState, useEffect } from 'react'

export default function TeachersPage() {
  const [loading, setLoading] = useState(true)
  const [teachers, setTeachers] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', employeeId: '', email: '', phone: '', department: '',
    subjects: '', qualification: '', experience: '', photo: null, status: 'Active'
  })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [resetPwdTarget, setResetPwdTarget] = useState(null)

  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignForm, setAssignForm] = useState({ teacherId: '', selectedSubjects: [] })

  const departments = ['Science', 'Commerce', 'Arts', 'Mathematics', 'Computer Science']
  const allSubjectsList = ['Physics', 'Chemistry', 'Algebra', 'Geometry', 'Programming', 'Data Structures', 'English Literature', 'History', 'Biology', 'Business Studies', 'Economics']

  useEffect(() => {
    const timer = setTimeout(() => {
      setTeachers([
        { id: 1, name: 'Mr. David Lee', employeeId: 'EMP-001', email: 'david@school.edu', phone: '+91-98765-10001', department: 'Science', subjects: 'Physics, Chemistry', qualification: 'M.Sc Physics', experience: 8, photo: null, status: 'Active' },
        { id: 2, name: 'Ms. Emily Chen', employeeId: 'EMP-002', email: 'emily@school.edu', phone: '+91-98765-10002', department: 'Mathematics', subjects: 'Algebra, Geometry', qualification: 'M.Sc Mathematics', experience: 5, photo: null, status: 'Active' },
        { id: 3, name: 'Mr. James Wilson', employeeId: 'EMP-003', email: 'james@school.edu', phone: '+91-98765-10003', department: 'Computer Science', subjects: 'Programming, Data Structures', qualification: 'M.Tech CSE', experience: 6, photo: null, status: 'Active' },
        { id: 4, name: 'Mrs. Sarah Parker', employeeId: 'EMP-004', email: 'sarah@school.edu', phone: '+91-98765-10004', department: 'Arts', subjects: 'English Literature', qualification: 'MA English', experience: 10, photo: null, status: 'Inactive' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase())
  )

  const genEmpId = () => `EMP-${String(Date.now()).slice(-4)}`

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', employeeId: genEmpId(), email: '', phone: '', department: departments[0], subjects: '', qualification: '', experience: '', photo: null, status: 'Active' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({ ...t })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => handleChange('photo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setTeachers(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t))
      } else {
        setTeachers(prev => [...prev, { ...form, id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id))
    setDeleteConfirm(null)
  }

  const toggleStatus = (id) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t))
  }

  const openAssignModal = () => {
    if (teachers.length === 0) {
      alert('Please add at least one teacher first.')
      return
    }
    setAssignForm({
      teacherId: String(teachers[0].id),
      selectedSubjects: teachers[0].subjects ? teachers[0].subjects.split(', ').map(s => s.trim()) : []
    })
    setShowAssignModal(true)
  }

  const handleAssignTeacherChange = (teacherId) => {
    const selectedTeacher = teachers.find(t => String(t.id) === teacherId)
    setAssignForm({
      teacherId,
      selectedSubjects: selectedTeacher && selectedTeacher.subjects ? selectedTeacher.subjects.split(', ').map(s => s.trim()) : []
    })
  }

  const handleSubjectCheckboxChange = (subject, checked) => {
    setAssignForm(prev => {
      const updated = checked
        ? [...prev.selectedSubjects, subject]
        : prev.selectedSubjects.filter(s => s !== subject)
      return { ...prev, selectedSubjects: updated }
    })
  }

  const handleSaveAssignment = () => {
    const tId = Number(assignForm.teacherId)
    setTeachers(prev => prev.map(t => {
      if (t.id === tId) {
        return { ...t, subjects: assignForm.selectedSubjects.join(', ') }
      }
      return t
    }))
    setShowAssignModal(false)
  }

  return (
    <div className="tp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-person-badge me-2" />Teachers</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm" onClick={openAssignModal}><i className="bi bi-people me-1" />Assign Subjects</button>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Teacher</button>
        </div>
      </div>
      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-person-badge" />
          <h6>{search ? 'No matching teachers found' : 'No teachers added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Teacher</button>}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table tp-table">
            <thead><tr><th>Photo</th><th>Name</th><th>Employee ID</th><th>Department</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="teacher-avatar">
                      {t.photo ? <img src={t.photo} alt="" /> : <span>{t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
                    </div>
                  </td>
                  <td><strong>{t.name}</strong></td>
                  <td><code>{t.employeeId}</code></td>
                  <td>{t.department}</td>
                  <td>{t.email}</td>
                  <td><span className={`status-badge ${t.status === 'Active' ? 'active' : 'inactive'}`}>{t.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(t)} title="Edit"><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-success me-1" onClick={() => toggleStatus(t.id)} title={t.status === 'Active' ? 'Deactivate' : 'Activate'}><i className={`bi bi-${t.status === 'Active' ? 'pause' : 'play'}`} /></button>
                    <button className="btn btn-sm btn-outline-warning me-1" onClick={() => setResetPwdTarget(t)} title="Reset Password"><i className="bi bi-key" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(t.id)} title="Delete"><i className="bi bi-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Teacher Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Teacher' : 'Add Teacher'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="text-center mb-3">
                <label className="teacher-avatar-upload">
                  <input type="file" accept="image/*" onChange={handlePhoto} hidden />
                  <div className="teacher-avatar large">
                    {form.photo ? <img src={form.photo} alt="" /> : <span>{form.name ? form.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'T'}</span>}
                  </div>
                  <span className="upload-hint">Upload Photo</span>
                </label>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} value={form.name} onChange={e => handleChange('name', e.target.value)} />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Employee ID</label>
                  <input type="text" className="form-control" value={form.employeeId} readOnly />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} value={form.email} onChange={e => handleChange('email', e.target.value)} />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.department} onChange={e => handleChange('department', e.target.value)}>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Experience (years)</label>
                  <input type="number" className="form-control" value={form.experience} onChange={e => handleChange('experience', e.target.value)} min="0" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Qualification</label>
                <input type="text" className="form-control" value={form.qualification} onChange={e => handleChange('qualification', e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Subjects (comma separated)</label>
                <input type="text" className="form-control" value={form.subjects} onChange={e => handleChange('subjects', e.target.value)} placeholder="Physics, Chemistry" />
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
              <p className="mb-0 opacity-75">This action cannot be undone.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password */}
      {resetPwdTarget && (
        <div className="modal-overlay" onClick={() => setResetPwdTarget(null)}>
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-body text-center py-4">
              <i className="bi bi-key-fill text-warning" style={{ fontSize: '2.5rem' }} />
              <h5 className="mt-2">Reset Password</h5>
              <p className="mb-0 opacity-75">Password will be reset to <strong>default123</strong> for <strong>{resetPwdTarget.name}</strong>.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setResetPwdTarget(null)}>Cancel</button>
              <button className="btn btn-warning" onClick={() => { alert('Password reset to default123'); setResetPwdTarget(null); }}>Reset Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Subjects Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header-custom">
              <h5>Assign Subjects to Teacher</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowAssignModal(false)} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Teacher</label>
                <select
                  className="form-select"
                  value={assignForm.teacherId}
                  onChange={e => handleAssignTeacherChange(e.target.value)}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Assign Subjects</label>
              </div>
              <div className="row g-2 px-1">
                {allSubjectsList.map(sub => {
                  const isChecked = assignForm.selectedSubjects.includes(sub)
                  return (
                    <div key={sub} className="col-6">
                      <div className="form-check p-2.5 rounded-3 border d-flex align-items-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <input
                          className="form-check-input ms-0 me-2"
                          type="checkbox"
                          id={`assign-sub-${sub}`}
                          checked={isChecked}
                          onChange={e => handleSubjectCheckboxChange(sub, e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <label className="form-check-label small cursor-pointer" style={{ color: 'var(--text)' }} htmlFor={`assign-sub-${sub}`}>
                          {sub}
                        </label>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveAssignment}>Save Assignments</button>
            </div>
          </div>
        </div>
      )}

      <style>{tpStyles}</style>
    </div>
  )
}

const tpStyles = `
.tp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.tp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.tp-page .search-bar { position: relative; }
.tp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.tp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.tp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.tp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.tp-page .tp-table { margin: 0; color: inherit; }
.tp-page .tp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.tp-page .tp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.tp-page .tp-table tr:last-child td { border-bottom: none; }
.tp-page .tp-table tr:hover td { background: rgba(255,255,255,0.03); }
.tp-page .teacher-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: white; font-weight: 600; overflow: hidden; }
.tp-page .teacher-avatar img { width: 100%; height: 100%; object-fit: cover; }
.tp-page .teacher-avatar.large { width: 72px; height: 72px; font-size: 1.1rem; }
.tp-page .teacher-avatar-upload { cursor: pointer; display: inline-block; position: relative; }
.tp-page .teacher-avatar-upload .upload-hint { display: block; font-size: 0.75rem; color: #3b82f6; margin-top: 0.25rem; }
.tp-page .status-badge { padding: 2px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem; }
.tp-page .status-badge.active { background: rgba(16,185,129,0.15); color: #34d399; }
.tp-page .status-badge.inactive { background: rgba(239,68,68,0.15); color: #f87171; }
.tp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.tp-page .modal-content { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; }
.tp-page .modal-content.confirm-dialog { max-width: 400px; }
.tp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.tp-page .modal-header-custom h5 { margin: 0; }
.tp-page .modal-body { padding: 1.25rem; }
.tp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.tp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.tp-page .form-control, .tp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.tp-page .form-control:focus, .tp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.tp-page .form-control.is-invalid { border-color: #ef4444; }
.tp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.tp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.tp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.tp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`