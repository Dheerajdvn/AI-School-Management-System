import React, { useState, useEffect } from 'react'

export default function StudentsPage() {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', rollNumber: '', admissionNumber: '', gender: 'Male', dob: '', parentName: '',
    phone: '', email: '', class: 'Class 10-A', section: 'A', photo: null, status: 'Active'
  })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [resetPwdTarget, setResetPwdTarget] = useState(null)
  const [transferTarget, setTransferTarget] = useState(null)

  const classOptions = ['Class 9-A', 'Class 9-B', 'Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A']
  const sectionOptions = ['A', 'B', 'C']

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents([
        { id: 1, name: 'Rahul Sharma', rollNumber: 'R-1001', admissionNumber: 'ADM-2024-001', gender: 'Male', dob: '2008-05-15', parentName: 'Mr. Arun Sharma', phone: '+91-98765-50001', email: 'rahul@student.edu', class: 'Class 10-A', section: 'A', photo: null, status: 'Active' },
        { id: 2, name: 'Priya Patel', rollNumber: 'R-1002', admissionNumber: 'ADM-2024-002', gender: 'Female', dob: '2007-11-20', parentName: 'Mrs. Meera Patel', phone: '+91-98765-50002', email: 'priya@student.edu', class: 'Class 10-A', section: 'A', photo: null, status: 'Active' },
        { id: 3, name: 'Amit Kumar', rollNumber: 'R-1003', admissionNumber: 'ADM-2024-003', gender: 'Male', dob: '2007-03-10', parentName: 'Mr. Suresh Kumar', phone: '+91-98765-50003', email: 'amit@student.edu', class: 'Class 10-B', section: 'B', photo: null, status: 'Active' },
        { id: 4, name: 'Sneha Singh', rollNumber: 'R-1004', admissionNumber: 'ADM-2024-004', gender: 'Female', dob: '2008-07-25', parentName: 'Mrs. Ritu Singh', phone: '+91-98765-50004', email: 'sneha@student.edu', class: 'Class 11-A', section: 'A', photo: null, status: 'Inactive' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const genRoll = () => `R-${1000 + students.length + 1}`
  const genAdmission = () => `ADM-2024-${String(students.length + 1).padStart(3, '0')}`

  const openAdd = () => {
    setEditing(null)
    setForm({
      name: '', rollNumber: genRoll(), admissionNumber: genAdmission(), gender: 'Male', dob: '', parentName: '',
      phone: '', email: '', class: 'Class 10-A', section: 'A', photo: null, status: 'Active'
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (stu) => {
    setEditing(stu)
    setForm({ ...stu })
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
    if (!form.parentName.trim()) errs.parentName = 'Required'
    if (!form.phone.trim()) errs.phone = 'Required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setStudents(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s))
      } else {
        setStudents(prev => [...prev, { ...form, id: Date.now() }])
      }
      setSaving(false)
      setShowModal(false)
    }, 600)
  }

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id))
    setDeleteConfirm(null)
  }

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
  }

  const transferStudent = (stu) => {
    const currentCls = stu.class
    const idx = classOptions.indexOf(currentCls)
    const targetCls = idx >= 0 && idx < classOptions.length - 1 ? classOptions[idx + 1] : currentCls
    setStudents(prev => prev.map(s => s.id === stu.id ? { ...s, class: targetCls, section: 'A' } : s))
    setTransferTarget(null)
  }

  return (
    <div className="stp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-people me-2" />Students</h4>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1" />Add Student</button>
      </div>
      <div className="d-flex gap-2 mb-3">
        <div className="search-bar flex-grow-1">
          <i className="bi bi-search search-icon" />
          <input type="text" className="form-control" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-people" />
          <h6>{search ? 'No matching students found' : 'No students added yet'}</h6>
          {!search && <button className="btn btn-primary btn-sm" onClick={openAdd}>Add Your First Student</button>}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table stp-table">
            <thead><tr><th>Photo</th><th>Name</th><th>Roll No</th><th>Class</th><th>Parent Name</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="student-avatar">
                      {s.photo ? <img src={s.photo} alt="" /> : <span>{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
                    </div>
                  </td>
                  <td><strong>{s.name}</strong></td>
                  <td><code>{s.rollNumber}</code></td>
                  <td>{s.class}-{s.section}</td>
                  <td>{s.parentName}</td>
                  <td><span className={`status-badge ${s.status === 'Active' ? 'active' : 'inactive'}`}>{s.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(s)} title="Edit"><i className="bi bi-pencil" /></button>
                    <button className="btn btn-sm btn-outline-success me-1" onClick={() => setTransferTarget(s)} title="Transfer"><i className="bi bi-arrow-right" /></button>
                    <button className="btn btn-sm btn-outline-warning me-1" onClick={() => setResetPwdTarget(s)} title="Reset Password"><i className="bi bi-key" /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(s.id)} title="Delete"><i className="bi bi-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5>{editing ? 'Edit Student' : 'Add Student'}</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} value={form.name} onChange={e => handleChange('name', e.target.value)} />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6"><label className="form-label">Roll Number</label><input type="text" className="form-control" value={form.rollNumber} readOnly /></div>
                <div className="col-md-6"><label className="form-label">Admission Number</label><input type="text" className="form-control" value={form.admissionNumber} readOnly /></div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-control" value={form.dob} onChange={e => handleChange('dob', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Parent Name <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control ${formErrors.parentName ? 'is-invalid' : ''}`} value={form.parentName} onChange={e => handleChange('parentName', e.target.value)} />
                  {formErrors.parentName && <div className="invalid-feedback">{formErrors.parentName}</div>}
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Phone <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`} value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                  {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Class</label>
                  <select className="form-select" value={form.class} onChange={e => handleChange('class', e.target.value)}>
                    {classOptions.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Section</label>
                  <select className="form-select" value={form.section} onChange={e => handleChange('section', e.target.value)}>
                    {sectionOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
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
              <p className="mb-0 opacity-75">Are you sure you want to delete this student? This action cannot be undone.</p>
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

      {/* Transfer Student */}
      {transferTarget && (
        <div className="modal-overlay" onClick={() => setTransferTarget(null)}>
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-body text-center py-4">
              <i className="bi bi-arrow-right-circle-fill text-info" style={{ fontSize: '2.5rem' }} />
              <h5 className="mt-2">Transfer Student</h5>
              <p className="mb-0 opacity-75">Transfer <strong>{transferTarget.name}</strong> to the next class? Current class: <strong>{transferTarget.class}</strong>.</p>
            </div>
            <div className="modal-footer-custom justify-content-center">
              <button className="btn btn-secondary" onClick={() => setTransferTarget(null)}>Cancel</button>
              <button className="btn btn-info" onClick={() => transferStudent(transferTarget)}>Transfer</button>
            </div>
          </div>
        </div>
      )}

      <style>{stpStyles}</style>
    </div>
  )
}

const stpStyles = `
.stp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.stp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.stp-page .d-flex.gap-2 { gap: 0.5rem; }
.stp-page .search-bar { position: relative; }
.stp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.stp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.stp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.stp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.stp-page .stp-table { margin: 0; color: inherit; }
.stp-page .stp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.stp-page .stp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.stp-page .stp-table tr:last-child td { border-bottom: none; }
.stp-page .stp-table tr:hover td { background: rgba(255,255,255,0.03); }
.stp-page .student-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #34d399); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: white; font-weight: 600; overflow: hidden; }
.stp-page .student-avatar img { width: 100%; height: 100%; object-fit: cover; }
.stp-page .status-badge { padding: 2px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem; }
.stp-page .status-badge.active { background: rgba(16,185,129,0.15); color: #34d399; }
.stp-page .status-badge.inactive { background: rgba(239,68,68,0.15); color: #f87171; }
.stp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.stp-page .modal-content { background: #0D0D10; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }
.stp-page .modal-content.confirm-dialog { max-width: 400px; }
.stp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.stp-page .modal-header-custom h5 { margin: 0; }
.stp-page .modal-body { padding: 1.25rem; }
.stp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.stp-page .modal-footer-custom.justify-content-center { justify-content: center; }
.stp-page .form-control, .stp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.stp-page .form-control:focus, .stp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.stp-page .form-control.is-invalid { border-color: #ef4444; }
.stp-page .form-label { font-size: 0.85rem; font-weight: 600; }
.stp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.stp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.stp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`