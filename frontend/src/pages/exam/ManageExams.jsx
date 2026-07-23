import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ManageExams() {
  const [exams] = useState([
    { id: 1, name: 'Mid-Term Mathematics', subject: 'Mathematics', class: 'Class 10-A', date: '2025-01-15', duration: '90 min', totalMarks: 100, status: 'completed' },
    { id: 2, name: 'Physics Unit Test', subject: 'Physics', class: 'Class 11-B', date: '2025-01-18', duration: '60 min', totalMarks: 50, status: 'completed' },
    { id: 3, name: 'Chemistry Quiz', subject: 'Chemistry', class: 'Class 10-A', date: '2025-01-20', duration: '45 min', totalMarks: 25, status: 'upcoming' },
    { id: 4, name: 'Biology Practical', subject: 'Biology', class: 'Class 12-A', date: '2025-01-22', duration: '120 min', totalMarks: 30, status: 'upcoming' },
    { id: 5, name: 'English Literature', subject: 'English', class: 'Class 11-A', date: '2025-01-25', duration: '90 min', totalMarks: 80, status: 'scheduled' },
  ])

  const getStatusBadge = (status) => {
    const style = {
      completed: 'bg-success',
      upcoming: 'bg-warning text-dark',
      scheduled: 'bg-info',
    }[status] || 'bg-secondary'
    return <span className={`badge ${style}`}>{status}</span>
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Exams</h2>
        <Link to="/exam/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-1" />
          Create New Exam
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Exam Name</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Total Marks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="fw-medium">{exam.name}</td>
                    <td>{exam.subject}</td>
                    <td>{exam.class}</td>
                    <td>{exam.date}</td>
                    <td>{exam.duration}</td>
                    <td>{exam.totalMarks}</td>
                    <td>{getStatusBadge(exam.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary">Edit</button>
                        <button className="btn btn-outline-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}