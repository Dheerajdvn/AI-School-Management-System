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

  // Show loading spinner while checking authentication status
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

  // If no specific roles required, render children
  if (!requiredRoles) {
    return children
  }

  // Normalize required roles to array
  const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  // Get user roles
  const userRoles = user.roles || []
  
  // Check if user has any of the required roles
  const hasRequiredRole = required.some(role => userRoles.includes(role))

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />
  }

  // Render children if user has required role
  return children
}