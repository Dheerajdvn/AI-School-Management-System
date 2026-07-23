import React from 'react'

export default function ExamAnalytics() {
  const analyticsData = [
    { subject: 'Mathematics', avgScore: 82, highestScore: 98, lowestScore: 45, passRate: 94 },
    { subject: 'Physics', avgScore: 75, highestScore: 95, lowestScore: 40, passRate: 88 },
    { subject: 'Chemistry', avgScore: 68, highestScore: 92, lowestScore: 38, passRate: 82 },
    { subject: 'Biology', avgScore: 78, highestScore: 96, lowestScore: 42, passRate: 90 },
    { subject: 'English', avgScore: 85, highestScore: 99, lowestScore: 50, passRate: 95 },
  ]

  const classWisePerformance = [
    { className: 'Class 9-A', exams: 5, avgScore: 78, passRate: 92 },
    { className: 'Class 9-B', exams: 5, avgScore: 81, passRate: 95 },
    { className: 'Class 10-A', exams: 6, avgScore: 76, passRate: 90 },
    { className: 'Class 10-B', exams: 6, avgScore: 79, passRate: 93 },
  ]

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Exam Analytics</h2>
        <div className="text-muted">
          <i className="bi bi-calendar3 me-1" />
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">Subject-wise Performance</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Subject</th>
                  <th>Average Score</th>
                  <th>Highest Score</th>
                  <th>Lowest Score</th>
                  <th>Pass Rate</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="fw-medium">{item.subject}</td>
                    <td>{item.avgScore}%</td>
                    <td>{item.highestScore}</td>
                    <td>{item.lowestScore}</td>
                    <td>{item.passRate}%</td>
                    <td>
                      <div className="progress" style={{ width: '200px', height: '8px' }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${item.avgScore}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class-wise Performance */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">Class-wise Performance</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {classWisePerformance.map((item, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="card-title mb-3">{item.className}</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Exams Conducted</span>
                      <span className="fw-bold">{item.exams}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Average Score</span>
                      <span className="fw-bold">{item.avgScore}%</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Pass Rate</span>
                      <span className="fw-bold text-success">{item.passRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}