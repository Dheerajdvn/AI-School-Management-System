import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useToast from '../../hooks/useToast'

export default function CreateExam() {
  const navigate = useNavigate()
  const { success: showSuccess } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    class: '',
    date: '',
    duration: '60',
    totalMarks: '100',
    instructions: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const defaultExams = [
      { id: 1, name: 'Mid-Term Mathematics', subject: 'Mathematics', class: 'Class 10-A', date: '2025-01-15', duration: '90 min', totalMarks: 100, status: 'completed' },
      { id: 2, name: 'Physics Unit Test', subject: 'Physics', class: 'Class 11-B', date: '2025-01-18', duration: '60 min', totalMarks: 50, status: 'completed' },
      { id: 3, name: 'Chemistry Quiz', subject: 'Chemistry', class: 'Class 10-A', date: '2025-01-20', duration: '45 min', totalMarks: 25, status: 'upcoming' },
      { id: 4, name: 'Biology Practical', subject: 'Biology', class: 'Class 12-A', date: '2025-01-22', duration: '120 min', totalMarks: 30, status: 'upcoming' },
      { id: 5, name: 'English Literature', subject: 'English', class: 'Class 11-A', date: '2025-01-25', duration: '90 min', totalMarks: 80, status: 'scheduled' },
    ]

    let storedExams = []
    try {
      const stored = localStorage.getItem('exams_list')
      storedExams = stored ? JSON.parse(stored) : defaultExams
    } catch (err) {
      storedExams = defaultExams
    }

    const newExam = {
      id: Date.now(),
      name: formData.name,
      subject: formData.subject,
      class: formData.class,
      date: formData.date,
      duration: `${formData.duration} min`,
      totalMarks: Number(formData.totalMarks),
      status: 'upcoming'
    }

    const updated = [newExam, ...storedExams]
    localStorage.setItem('exams_list', JSON.stringify(updated))

    showSuccess('New exam scheduled & synchronized successfully!')
    navigate('/exam/manage')
  }

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-white mb-1"><i className="bi bi-plus-circle me-2 text-primary" />Create Exam</h4>
          <p className="text-muted small mb-0">Schedule and configure new tests, quizzes, or final examinations.</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm rounded-3 text-white border-0 px-3 py-1.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} onClick={() => navigate('/exam/manage')}>
          <i className="bi bi-arrow-left me-1" />
          Back to List
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-2xl p-4" style={{ backgroundColor: 'rgba(17, 18, 23, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3.5">
                <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Exam Name</label>
                <input
                  type="text"
                  className="form-control style-exam-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mid-Term Mathematics"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3.5">
                  <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Subject</label>
                  <select
                    className="form-select style-exam-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3.5">
                  <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Class</label>
                  <select
                    className="form-select style-exam-input"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="Class 9-A">Class 9-A</option>
                    <option value="Class 9-B">Class 9-B</option>
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 10-B">Class 10-B</option>
                    <option value="Class 11-A">Class 11-A</option>
                    <option value="Class 11-B">Class 11-B</option>
                    <option value="Class 12-A">Class 12-A</option>
                    <option value="Class 12-B">Class 12-B</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3.5">
                  <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Exam Date</label>
                  <input
                    type="date"
                    className="form-control style-exam-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3.5">
                  <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control style-exam-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-3.5">
                <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Total Marks</label>
                <input
                  type="number"
                  className="form-control style-exam-input"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Instructions</label>
                <textarea
                  className="form-control style-exam-input"
                  rows="4"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Enter exam guidelines for students..."
                />
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <button type="button" className="btn btn-outline-secondary rounded-3 px-4 font-semibold text-white border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} onClick={() => navigate('/exam/manage')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-3 px-4 font-semibold shadow-glow d-flex align-items-center gap-2">
                  <i className="bi bi-check-lg" />
                  <span>Create & Publish Exam</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .style-exam-input {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          color: #ffffff !important;
          font-size: 14px;
          border-radius: 10px !important;
          padding: 0.65rem 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .style-exam-input:focus {
          background-color: rgba(255, 255, 255, 0.07) !important;
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25) !important;
          color: #ffffff !important;
        }
        .style-exam-input::placeholder {
          color: #6b7280 !important;
        }
        .style-exam-input option {
          background-color: #17181b;
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}