import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Role constants
const ROLE_ADMIN = 'ROLE_ADMIN'
const ROLE_PRINCIPAL = 'ROLE_PRINCIPAL'
const ROLE_SCHOOL_ADMIN = 'ROLE_SCHOOL_ADMIN'
const ROLE_TEACHER = 'ROLE_TEACHER'
const ROLE_STUDENT = 'ROLE_STUDENT'

export default function ExamDashboard() {
  const { user } = useAuth()
  const [stats] = useState({
    totalExams: 24,
    upcomingExams: 5,
    completedExams: 19,
    averageScore: 78,
    passRate: 92,
    activeStudents: 450,
  })

  const roles = user?.roles || []
  const isTeacher = roles.includes(ROLE_TEACHER)
  const isSchoolAdmin = roles.includes(ROLE_SCHOOL_ADMIN)
  const isStudent = roles.includes(ROLE_STUDENT)
  const isPrincipal = roles.includes(ROLE_PRINCIPAL)
  const isAdmin = roles.includes(ROLE_ADMIN)

  const quickActions = []

  if (isTeacher || isAdmin || isSchoolAdmin) {
    quickActions.push(
      { to: '/exam/create', icon: 'bi-plus-circle', label: 'Create Exam', color: 'primary' },
      { to: '/exam/manage', icon: 'bi-list-check', label: 'Manage Exams', color: 'success' },
      { to: '/exam/results', icon: 'bi-bar-chart-line', label: 'View Results', color: 'info' },
    )
  }

  if (isStudent) {
    quickActions.push(
      { to: '/exam/upcoming', icon: 'bi-calendar-event', label: 'Upcoming Exams', color: 'warning' },
      { to: '/exam/my-results', icon: 'bi-graph-up', label: 'My Results', color: 'info' },
      { to: '/exam/practice', icon: 'bi-question-circle', label: 'Practice Tests', color: 'secondary' },
    )
  }

  if (isPrincipal || isAdmin) {
    quickActions.push(
      { to: '/exam/analytics', icon: 'bi-graph-up-arrow', label: 'Exam Analytics', color: 'dark' },
    )
  }

  const recentExams = [
    { id: 1, name: 'Mid-Term Mathematics', class: 'Class 10-A', date: '2025-01-15', status: 'completed', students: 45 },
    { id: 2, name: 'Physics Unit Test', class: 'Class 11-B', date: '2025-01-18', status: 'completed', students: 38 },
    { id: 3, name: 'Chemistry Quiz', class: 'Class 10-A', date: '2025-01-20', status: 'upcoming', students: 45 },
    { id: 4, name: 'Biology Practical', class: 'Class 12-A', date: '2025-01-22', status: 'upcoming', students: 32 },
  ]

  const getStatusBadge = (status) => {
    const style = status === 'completed' ? 'bg-success' : 'bg-warning text-dark'
    return <span className={`badge ${style}`}>{status}</span>
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Examination & Assessment</h2>
        <div className="text-muted">
          <i className="bi bi-calendar3 me-1" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Exams</p>
                  <h3 className="mb-0">{stats.totalExams}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Upcoming</p>
                  <h3 className="mb-0">{stats.upcomingExams}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-calendar-event text-warning" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Average Score</p>
                  <h3 className="mb-0">{stats.averageScore}%</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-graph-up text-success" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Pass Rate</p>
                  <h3 className="mb-0">{stats.passRate}%</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-check-circle text-info" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.to}
                    className={`btn btn-outline-${action.color} text-start d-flex align-items-center`}
                  >
                    <i className={`bi ${action.icon} me-2`} />
                    {action.label}
                  </Link>
                ))}
                {quickActions.length === 0 && (
                  <p className="text-muted text-center py-4">No actions available for your role.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Exams */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Exams</h5>
              <Link to="/exam/manage" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Exam Name</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="fw-medium">{exam.name}</td>
                        <td>{exam.class}</td>
                        <td>{exam.date}</td>
                        <td>{exam.students}</td>
                        <td>{getStatusBadge(exam.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Performance Overview</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 border rounded">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Mathematics</span>
                      <span className="fw-bold">82%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-primary" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Physics</span>
                      <span className="fw-bold">75%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Chemistry</span>
                      <span className="fw-bold">68%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-info" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}