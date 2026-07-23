import { useAuth } from '../context/AuthContext'

export default function PrincipalDashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Principal Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.username}!</p>
      </div>
      <div className="alert alert-info">
        <h5>Coming Soon</h5>
        <p className="mb-0">Institutional analytics and management features.</p>
      </div>
    </div>
  )
}