import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Modern login page for the AI Student Management System.
 * Professional centered card design with show/hide password and remember me features.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, clearSessionExpired } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Check for expired=true query param
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpiredMsg('Your session has expired. Please log in again.')
      // Clear the query param
      window.history.replaceState({}, document.title, '/login')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSessionExpiredMsg('')

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)

    try {
      await login(username, password, rememberMe)
      clearSessionExpired()
      // Redirect to home page - AuthContext will handle role-based routing
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Session Expired Alert */}
            {sessionExpiredMsg && (
              <div className="alert alert-warning d-flex align-items-center mb-3 shadow-sm" role="alert">
                <i className="bi bi-clock-history me-2 fs-5" />
                <div>{sessionExpiredMsg}</div>
                <button type="button" className="btn-close ms-auto" onClick={() => setSessionExpiredMsg('')} />
              </div>
            )}

            {/* Login Card */}
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-mortarboard-fill text-primary fs-1" />
                  </div>
                  <h2 className="fw-bold mb-1">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    <div>{error}</div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                  {/* Username Field */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-1" />
                      Username or Email
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username or email"
                      disabled={loading}
                      autoComplete="username"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-1" />
                      Password
                    </label>
                    <div className="input-group input-group-lg">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={loading}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember Me
                      </label>
                    </div>
                    <a href="#forgot" className="text-decoration-none small">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2" />
                        Login
                      </>
                    )}
                  </button>

                  {/* Notice */}
                  <div className="text-center">
                    <small className="text-muted">
                      Accounts are created by the Administrator.<br />
                      Please contact your institution if you do not have login credentials.
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}