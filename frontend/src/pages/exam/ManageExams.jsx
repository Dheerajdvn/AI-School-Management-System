import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

export default function ManageExams() {
  const { success: showSuccess } = useToast()
  const [exams, setExams] = useState([])
  const [editingExam, setEditingExam] = useState(null)
  const [deleteExamId, setDeleteExamId] = useState(null)

  const defaultExams = [
    { id: 1, name: 'Mid-Term Mathematics', subject: 'Mathematics', class: 'Class 10-A', date: '2025-01-15', duration: '90 min', totalMarks: 100, status: 'completed' },
    { id: 2, name: 'Physics Unit Test', subject: 'Physics', class: 'Class 11-B', date: '2025-01-18', duration: '60 min', totalMarks: 50, status: 'completed' },
    { id: 3, name: 'Chemistry Quiz', subject: 'Chemistry', class: 'Class 10-A', date: '2025-01-20', duration: '45 min', totalMarks: 25, status: 'upcoming' },
    { id: 4, name: 'Biology Practical', subject: 'Biology', class: 'Class 12-A', date: '2025-01-22', duration: '120 min', totalMarks: 30, status: 'upcoming' },
    { id: 5, name: 'English Literature', subject: 'English', class: 'Class 11-A', date: '2025-01-25', duration: '90 min', totalMarks: 80, status: 'scheduled' },
  ]

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('exams_list')
      if (stored) {
        setExams(JSON.parse(stored))
      } else {
        localStorage.setItem('exams_list', JSON.stringify(defaultExams))
        setExams(defaultExams)
      }
    } catch (e) {
      setExams(defaultExams)
    }
  }, [])

  // Save changes on Edit
  const handleEditSave = (e) => {
    e.preventDefault()
    const updated = exams.map(ex => ex.id === editingExam.id ? editingExam : ex)
    setExams(updated)
    localStorage.setItem('exams_list', JSON.stringify(updated))
    setEditingExam(null)
    showSuccess('Exam details updated successfully!')
  }

  // Delete Handler
  const handleDeleteConfirm = () => {
    const updated = exams.filter(ex => ex.id !== deleteExamId)
    setExams(updated)
    localStorage.setItem('exams_list', JSON.stringify(updated))
    setDeleteExamId(null)
    showSuccess('Exam deleted successfully!')
  }

  const getStatusBadge = (status) => {
    const style = {
      completed: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
      upcoming: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
      scheduled: { bg: 'rgba(6, 182, 212, 0.15)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
    }[status?.toLowerCase()] || { bg: 'rgba(156, 163, 175, 0.15)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.3)' }

    return (
      <span 
        className="badge rounded-pill fw-semibold text-uppercase"
        style={{ 
          backgroundColor: style.bg, 
          color: style.text, 
          border: `1px solid ${style.border}`,
          fontSize: '10px',
          letterSpacing: '0.05em',
          padding: '5px 10px',
          display: 'inline-block'
        }}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-white mb-1"><i className="bi bi-gear-fill me-2 text-primary" />Manage Exams</h4>
          <p className="text-muted small mb-0">View, schedule, edit, or delete institutional examination rosters.</p>
        </div>
        <Link to="/exam/create" className="btn btn-primary rounded-3 px-3 py-1.5 font-semibold shadow-glow d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle" />
          <span>Create New Exam</span>
        </Link>
      </div>

      <div className="card border-0 shadow-2xl" style={{ backgroundColor: 'rgba(17, 18, 23, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px' }}>
        <div className="card-body p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ color: 'inherit' }}>
              <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <tr className="border-bottom border-secondary border-opacity-20">
                  <th className="px-4 py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Exam Name</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Subject</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Class</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Date</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Duration</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Total Marks</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Status</th>
                  <th className="px-4 py-3 text-muted text-uppercase font-semibold text-end" style={{ fontSize: '11px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted small">No scheduled exams found. Create one using the button above.</td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id} className="border-bottom border-secondary border-opacity-10">
                      <td className="px-4 py-3 fw-bold text-white">{exam.name}</td>
                      <td>{exam.subject}</td>
                      <td>{exam.class}</td>
                      <td>{exam.date}</td>
                      <td>{exam.duration}</td>
                      <td>{exam.totalMarks}</td>
                      <td>{getStatusBadge(exam.status)}</td>
                      <td className="px-4 py-3 text-end">
                        <div className="btn-group btn-group-sm" role="group">
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => setEditingExam({ ...exam })}
                          >
                            <i className="bi bi-pencil" /> Edit
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => setDeleteExamId(exam.id)}
                          >
                            <i className="bi bi-trash" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1. Edit Exam Modal Dialog */}
      {editingExam && (
        <div className="modal-overlay-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-2xl p-4" style={{ maxWidth: '520px', width: '100%', borderRadius: '16px', backgroundColor: '#17181B', borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <h5 className="fw-bold text-white mb-0"><i className="bi bi-pencil-square text-primary me-2" />Edit Exam Details</h5>
              <button className="btn-close btn-close-white" onClick={() => setEditingExam(null)} />
            </div>

            <form onSubmit={handleEditSave}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Exam Name</label>
                <input
                  type="text"
                  className="form-control style-modal-input"
                  value={editingExam.name}
                  onChange={(e) => setEditingExam({ ...editingExam, name: e.target.value })}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control style-modal-input"
                    value={editingExam.subject}
                    onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Class</label>
                  <input
                    type="text"
                    className="form-control style-modal-input"
                    value={editingExam.class}
                    onChange={(e) => setEditingExam({ ...editingExam, class: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Exam Date</label>
                  <input
                    type="date"
                    className="form-control style-modal-input"
                    value={editingExam.date}
                    onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Duration</label>
                  <input
                    type="text"
                    className="form-control style-modal-input"
                    value={editingExam.duration}
                    onChange={(e) => setEditingExam({ ...editingExam, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Total Marks</label>
                  <input
                    type="number"
                    className="form-control style-modal-input"
                    value={editingExam.totalMarks}
                    onChange={(e) => setEditingExam({ ...editingExam, totalMarks: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Status</label>
                  <select
                    className="form-select style-modal-input"
                    value={editingExam.status}
                    onChange={(e) => setEditingExam({ ...editingExam, status: e.target.value })}
                  >
                    <option value="completed">completed</option>
                    <option value="upcoming">upcoming</option>
                    <option value="scheduled">scheduled</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button type="button" className="btn btn-secondary rounded-3 px-3.5" onClick={() => setEditingExam(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4 shadow-glow">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal Dialog */}
      {deleteExamId && (
        <div className="modal-overlay-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-2xl p-4 text-center" style={{ maxWidth: '380px', borderRadius: '16px', backgroundColor: '#17181B', borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="py-3">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-2 d-inline-block" />
              <h5 className="fw-bold text-white mb-2">Delete Exam?</h5>
              <p className="text-muted small mb-0">Are you sure you want to delete this scheduled exam? This action is irreversible.</p>
            </div>
            <div className="d-flex justify-content-center gap-2.5 mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <button className="btn btn-secondary rounded-3 px-3.5" onClick={() => setDeleteExamId(null)}>Cancel</button>
              <button className="btn btn-danger rounded-3 px-4" onClick={handleDeleteConfirm}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}