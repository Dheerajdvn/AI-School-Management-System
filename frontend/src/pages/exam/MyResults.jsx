import React, { useState } from 'react'

export default function MyResults() {
  const [myResults] = useState([
    { id: 1, exam: 'Mid-Term Mathematics', date: '2025-01-15', marks: 85, total: 100, grade: 'A', percentage: 85 },
    { id: 2, exam: 'Physics Unit Test', date: '2025-01-10', marks: 42, total: 50, grade: 'A+', percentage: 84 },
    { id: 3, exam: 'Chemistry Quiz', date: '2025-01-05', marks: 22, total: 25, grade: 'A', percentage: 88 },
    { id: 4, exam: 'Biology Practical', date: '2024-12-20', marks: 28, total: 30, grade: 'A+', percentage: 93 },
    { id: 5, exam: 'English Literature', date: '2024-12-15', marks: 72, total: 80, grade: 'A', percentage: 90 },
  ])

  const getGradeBadge = (grade) => {
    const style = {
      'A+': 'bg-success',
      'A': 'bg-primary',
      'B+': 'bg-info',
      'B': 'bg-warning text-dark',
      'C': 'bg-secondary',
      'F': 'bg-danger',
    }[grade] || 'bg-secondary'
    return <span className={`badge ${style}`}>{grade}</span>
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Results</h2>
        <button className="btn btn-primary">
          <i className="bi bi-download me-1" />
          Download Report
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Average Score</p>
              <h3 className="mb-0">87%</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Exams Completed</p>
              <h3 className="mb-0">5</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Pass Rate</p>
              <h3 className="mb-0">100%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Exam Name</th>
                  <th>Date</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {myResults.map((result) => (
                  <tr key={result.id}>
                    <td className="fw-medium">{result.exam}</td>
                    <td>{result.date}</td>
                    <td>{result.marks}</td>
                    <td>{result.total}</td>
                    <td>{result.percentage}%</td>
                    <td>{getGradeBadge(result.grade)}</td>
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