import { useAuth } from '../context/AuthContext'

/**
 * Student Dashboard - Placeholder for future implementation
 * 
 * This is a lightweight placeholder that will be expanded in later prompts.
 * Currently displays user information and basic navigation structure.
 */

export default function StudentDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Student Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.username}!</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="icon bg-primary">
              <i className="bi bi-person"></i>
            </div>
            <div>
              <div className="label">Your Profile</div>
              <div className="value">--</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="icon bg-success">
              <i className="bi bi-calendar-check"></i>
            </div>
            <div>
              <div className="label">Attendance</div>
              <div className="value">--</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="icon bg-info">
              <i className="bi bi-shield-check"></i>
            </div>
            <div>
              <div className="label">Your Role</div>
              <div className="value">STUDENT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <i className="bi bi-info-circle me-2"></i>
          Dashboard Information
        </div>
        <div className="alert alert-info">
          <h5>Student Dashboard - Coming Soon</h5>
          <p className="mb-0">
            This dashboard will provide comprehensive student features including:
          </p>
          <ul className="mb-0 mt-2">
            <li>Personal profile management</li>
            <li>Attendance tracking</li>
            <li>Grades and marks view</li>
            <li>Fees and payments</li>
            <li>AI learning assistant</li>
            <li>Assignments and deadlines</li>
          </ul>
        </div>
      </div>
    </div>
  )
}