import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth, getDefaultRouteForUser } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import LandingBgCanvas from '../components/landing/LandingBgCanvas'

/**
 * Flagship Institutional AI OS Login Page
 * 100% Shared Theme with Landing Page: pitch-black background, 28px dot-grid,
 * interactive monochrome constellation canvas, and high-contrast styling.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, login, clearSessionExpired } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Automatic redirect if already authenticated
  useEffect(() => {
    if (user) {
      const target = getDefaultRouteForUser(user) || '/admin'
      navigate(target, { replace: true })
    }
  }, [user, navigate])

  // Check for expired=true query param
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpiredMsg('Your session has expired. Please log in again.')
      window.history.replaceState({}, document.title, '/login')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSessionExpiredMsg('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)

    try {
      const loggedInUser = await login(username, password, rememberMe)
      clearSessionExpired()
      const target = getDefaultRouteForUser(loggedInUser) || '/admin'
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoFill = (u, p) => {
    setUsername(u)
    setPassword(p)
    setError('')
  }

  return (
    <div className="home-page login-page min-vh-100 position-relative d-flex align-items-center justify-content-center overflow-hidden animate-fade">
      {/* Exact Landing Page Neural / Constellation Background Canvas */}
      <LandingBgCanvas />

      {/* Top Floating Controls: Back to Home + Theme Toggle */}
      <div className="position-absolute top-0 start-0 end-0 p-3 p-sm-4 d-flex align-items-center justify-content-between z-2">
        <Link to="/" className="btn btn-sm rounded-pill px-3.5 py-2 d-flex align-items-center gap-2 back-home-btn">
          <i className="bi bi-arrow-left" />
          <span className="small fw-semibold">Back to Home</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-sm rounded-pill p-0 d-flex align-items-center justify-content-center theme-toggle-btn"
          style={{ width: '38px', height: '38px' }}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-dark'}`} style={{ fontSize: '1rem' }}></i>
        </button>
      </div>

      <div className="container position-relative z-1 py-5 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5" style={{ maxWidth: '460px' }}>
            {/* Session Expired Alert */}
            {sessionExpiredMsg && (
              <div className="alert border-0 rounded-3 d-flex align-items-center mb-4 p-3 shadow-lg" style={{ backgroundColor: 'rgba(234, 179, 8, 0.12)', color: '#FACC15', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
                <i className="bi bi-clock-history me-2.5 fs-5" />
                <div className="small font-medium">{sessionExpiredMsg}</div>
                <button type="button" className="btn-close ms-auto" onClick={() => setSessionExpiredMsg('')} />
              </div>
            )}

            {/* Main Login Card with Landing Page Aesthetic */}
            <div className="dashdark-login-card p-4 p-sm-4.5 position-relative overflow-hidden">
              {/* Header Branding - Matching Landing Orbital Atom Logo */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--home-heading, #FFFFFF)' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
                    <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="fw-bold mb-1 tracking-tight" style={{ color: 'var(--home-heading, #FFFFFF)', fontSize: '22px', letterSpacing: '-0.02em' }}>
                  AI School OS
                </h3>
                <p className="small mb-0" style={{ color: 'var(--home-paragraph, #A1A1AA)' }}>
                  Command Center • Sign in to institutional portal
                </p>
              </div>

              {/* 1-Click Demo Account Selector */}
              <div className="mb-4">
                <div className="small fw-semibold mb-2 text-center" style={{ color: 'var(--home-muted, #71717A)', fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Quick Demo Accounts
                </div>
                <div className="d-flex gap-1.5 flex-wrap justify-content-center">
                  <button 
                    type="button" 
                    className="btn btn-sm dashdark-demo-chip"
                    onClick={() => handleDemoFill('admin', 'password123')}
                    title="Fill Admin Credentials"
                  >
                    <i className="bi bi-shield-lock-fill text-danger me-1" /> Admin
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm dashdark-demo-chip"
                    onClick={() => handleDemoFill('principal', 'password123')}
                    title="Fill Principal Credentials"
                  >
                    <i className="bi bi-mortarboard-fill text-primary me-1" /> Principal
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm dashdark-demo-chip"
                    onClick={() => handleDemoFill('teacher', 'password123')}
                    title="Fill Teacher Credentials"
                  >
                    <i className="bi bi-person-badge-fill text-info me-1" /> Teacher
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm dashdark-demo-chip"
                    onClick={() => handleDemoFill('student', 'password123')}
                    title="Fill Student Credentials"
                  >
                    <i className="bi bi-book-fill text-success me-1" /> Student
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert border-0 rounded-3 d-flex align-items-center mb-3 p-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6" />
                  <div className="small font-medium">{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label small fw-semibold mb-1.5" style={{ color: 'var(--home-paragraph, #A1A1AA)' }}>
                    Username or Institutional Email
                  </label>
                  <div className="position-relative">
                    <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6" />
                    <input
                      type="text"
                      className="form-control rounded-3 ps-5 pe-3 py-2.5 dashdark-login-input"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin or john@school.edu"
                      disabled={loading}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label small fw-semibold mb-1.5" style={{ color: 'var(--home-paragraph, #A1A1AA)' }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control rounded-3 ps-5 pe-5 py-2.5 dashdark-login-input"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      disabled={loading}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-1 border-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-6`} />
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input style-checkbox cursor-pointer"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <label className="form-check-label small cursor-pointer" htmlFor="rememberMe" style={{ color: 'var(--home-paragraph, #A1A1AA)' }}>
                      Remember me
                    </label>
                  </div>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link has been dispatched to your institution administrator.'); }} className="text-decoration-none small forgot-link fw-semibold">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  className="dashdark-btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <i className="bi bi-arrow-right ms-2 fs-5" />
                    </>
                  )}
                </button>

                {/* Footnote Notice */}
                <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: 'var(--home-border, rgba(255,255,255,0.08))' }}>
                  <small className="x-small d-block" style={{ color: 'var(--home-muted, #71717A)', fontSize: '11px', lineHeight: '1.5' }}>
                    Institutional Access • AES-256 RBAC Protected Session
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}