import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Unauthorized access page.
 * 
 * Displayed when a user tries to access a page they don't have permission for.
 */

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-card">
          <div className="error-code">403</div>
          
          <h1 className="error-title">Access Denied</h1>
          
          <p className="error-message">
            Sorry, you don't have permission to access this page.
          </p>

          {user && (
            <div className="user-info">
              <p className="mb-2">
                <strong>Logged in as:</strong> {user.username}
              </p>
              <p className="mb-3">
                <strong>Your role:</strong> {user.roles?.join(', ')}
              </p>
            </div>
          )}

          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-house-door me-2"></i>
              Return to Dashboard
            </Link>
          </div>

          <div className="error-footer">
            <p className="text-muted mb-0">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}