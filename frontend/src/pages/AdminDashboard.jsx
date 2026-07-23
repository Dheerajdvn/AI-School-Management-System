import { useAuth } from '../context/AuthContext'

/**
 * Admin Dashboard - Placeholder for future implementation
 * 
 * This is a lightweight placeholder that will be expanded in later prompts.
 * Currently displays user information and basic navigation structure.
 */

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.username}!</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="icon bg-primary">
              <i className="bi bi-people"></i>
            </div>
            <div>
              <div className="label">Total Users</div>
              <div className="value">--</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="icon bg-success">
              <i className="bi bi-person-check"></i>
            </div>
            <div>
              <div className="label">Active Users</div>
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
              <div className="value">ADMIN</div>
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
          <h5>Admin Dashboard - Coming Soon</h5>
          <p className="mb-0">
            This dashboard will provide comprehensive system management features including:
          </p>
          <ul className="mb-0 mt-2">
            <li>User management and role assignment</li>
            <li>System configuration and settings</li>
            <li>Audit logs and security monitoring</li>
            <li>Database management tools</li>
            <li>AI model configuration</li>
            <li>System health monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  )
}