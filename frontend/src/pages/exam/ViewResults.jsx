import React, { useState } from 'react'

export default function ViewResults() {
  const [results] = useState([
    { id: 1, student: 'John Doe', exam: 'Mid-Term Mathematics', class: 'Class 10-A', marks: 85, total: 100, grade: 'A', percentage: 85 },
    { id: 2, student: 'Jane Smith', exam: 'Mid-Term Mathematics', class: 'Class 10-A', marks: 92, total: 100, grade: 'A+', percentage: 92 },
    { id: 3, student: 'Mike Johnson', exam: 'Mid-Term Mathematics', class: 'Class 10-A', marks: 78, total: 100, grade: 'B+', percentage: 78 },
    { id: 4, student: 'Sarah Williams', exam: 'Physics Unit Test', class: 'Class 11-B', marks: 88, total: 50, grade: 'A', percentage: 88 },
    { id: 5, student: 'Tom Brown', exam: 'Physics Unit Test', class: 'Class 11-B', marks: 45, total: 50, grade: 'A+', percentage: 90 },
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
        <h2>View Results</h2>
        <div>
          <select className="form-select me-2 d-inline-block w-auto">
            <option>All Exams</option>
            <option>Mid-Term Mathematics</option>
            <option>Physics Unit Test</option>
          </select>
          <button className="btn btn-primary">
            <i className="bi bi-download me-1" />
            Export
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Student Name</th>
                  <th>Exam</th>
                  <th>Class</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="fw-medium">{result.student}</td>
                    <td>{result.exam}</td>
                    <td>{result.class}</td>
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