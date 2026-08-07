import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * RoleProtectedRoute component for wrapping routes that require specific roles.
 * 
 * Checks if the user has the required role(s) and redirects to unauthorized page if not.
 * Shows a loading spinner while authentication state is being initialized.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.requiredRoles - Single role or array of roles required
 * @param {string} props.redirectTo - Optional custom redirect path (default: /unauthorized)
 */
export default function RoleProtectedRoute({ 
  children, 
  requiredRoles, 
  redirectTo = '/unauthorized' 
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!requiredRoles) {
    return children
  }

  const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  const userRoles = user.roles || []
  
  const hasRequiredRole = required.some(role => userRoles.includes(role))

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}