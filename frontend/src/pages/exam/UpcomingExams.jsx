import React, { useState } from 'react'

export default function UpcomingExams() {
  const [upcomingExams] = useState([
    { id: 1, name: 'Chemistry Quiz', subject: 'Chemistry', class: 'Class 10-A', date: '2025-01-20', time: '10:00 AM', duration: '45 min', totalMarks: 25 },
    { id: 2, name: 'Biology Practical', subject: 'Biology', class: 'Class 12-A', date: '2025-01-22', time: '02:00 PM', duration: '120 min', totalMarks: 30 },
    { id: 3, name: 'English Literature', subject: 'English', class: 'Class 11-A', date: '2025-01-25', time: '09:00 AM', duration: '90 min', totalMarks: 80 },
    { id: 4, name: 'Physics Unit Test', subject: 'Physics', class: 'Class 10-B', date: '2025-01-28', time: '11:00 AM', duration: '60 min', totalMarks: 50 },
  ])

  const getDaysUntil = (dateString) => {
    const examDate = new Date(dateString)
    const today = new Date()
    const diffTime = examDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return 'Past'
    return `${diffDays} days`
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upcoming Exams</h2>
        <div className="text-muted">
          <i className="bi bi-info-circle me-1" />
          Stay prepared for your upcoming examinations
        </div>
      </div>

      <div className="row g-3">
        {upcomingExams.map((exam) => (
          <div className="col-md-6 col-lg-3" key={exam.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: '1.5rem' }} />
                  </div>
                  <span className="badge bg-warning text-dark">
                    {getDaysUntil(exam.date)}
                  </span>
                </div>
                <h5 className="card-title mb-2">{exam.name}</h5>
                <p className="text-muted small mb-3">{exam.class}</p>
                <div className="mb-2">
                  <i className="bi bi-calendar me-1 text-muted" />
                  <span className="small">{exam.date}</span>
                </div>
                <div className="mb-2">
                  <i className="bi bi-clock me-1 text-muted" />
                  <span className="small">{exam.time}</span>
                </div>
                <div className="mb-3">
                  <i className="bi bi-hourglass me-1 text-muted" />
                  <span className="small">{exam.duration}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Total Marks: <strong>{exam.totalMarks}</strong></span>
                  <button className="btn btn-action-view">
                    <i className="bi bi-eye" /> View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {upcomingExams.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-calendar-check text-muted" style={{ fontSize: '3rem' }} />
          <p className="text-muted mt-3">No upcoming exams</p>
        </div>
      )}
    </div>
  )
}