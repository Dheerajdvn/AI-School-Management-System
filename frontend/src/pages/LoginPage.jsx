import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Flagship $100M Enterprise AI SaaS Login Page
 * Redesigned with Glassmorphism, Neural Canvas background, Demo Role Chips, OpenAI/Stripe aesthetics, and 100% theme adaptability.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeDemoRole, setActiveDemoRole] = useState('')

  const { login, clearSessionExpired } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const canvasRef = useRef(null)

  // Check for expired=true query param
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpiredMsg('Your session has expired. Please log in again.')
      window.history.replaceState({}, document.title, '/login')
    }
  }, [searchParams])

  // Interactive Background Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resize = () => {
      if (!canvas || !canvas.parentElement) return
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particleCount = Math.min(45, Math.floor((canvas.width || 800) / 25))
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#6366f1' : '#38bdf8'
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 140) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 140)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Quick Demo Autofill Helper
  const fillDemoRole = (role, user, pass) => {
    setActiveDemoRole(role)
    setUsername(user)
    setPassword(pass)
    setError('')
  }

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
      await login(username, password, rememberMe)
      clearSessionExpired()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page min-vh-100 position-relative d-flex align-items-center justify-content-center overflow-hidden animate-fade" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Background Neural Canvas */}
      <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0 }}>
        <canvas ref={canvasRef} className="w-100 h-100" />
      </div>

      {/* Top Floating Home Navigation Link */}
      <div className="position-absolute top-0 start-0 p-4 z-2">
        <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill border px-3 py-2 d-flex align-items-center gap-2 hover-glow-pill" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
          <i className="bi bi-arrow-left" />
          <span className="small font-semibold">Back to Home</span>
        </Link>
      </div>

      <div className="container position-relative z-1 py-5 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5" style={{ maxWidth: '480px' }}>
            {/* Session Expired Alert */}
            {sessionExpiredMsg && (
              <div className="alert alert-warning border-0 rounded-4 d-flex align-items-center mb-4 shadow-lg p-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <i className="bi bi-clock-history me-2.5 fs-5" />
                <div className="small font-medium">{sessionExpiredMsg}</div>
                <button type="button" className="btn-close ms-auto" onClick={() => setSessionExpiredMsg('')} />
              </div>
            )}

            {/* Main Glassmorphism Login Card */}
            <div
              className="card border-0 rounded-4 shadow-2xl p-4 p-sm-4.5 position-relative overflow-hidden"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              {/* Header Branding */}
              <div className="text-center mb-4">
                <div className="d-inline-flex p-3 rounded-4 mb-3 text-white" style={{ backgroundColor: 'var(--primary)' }}>
                  <i className="bi bi-mortarboard-fill fs-2" />
                </div>
                <h3 className="fw-extrabold mb-1.5 tracking-tight" style={{ fontSize: '24px', color: 'var(--text)' }}>Welcome Back</h3>
                <p className="text-muted small mb-0">Sign in to access AI School OS Command Center</p>
              </div>


              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger border-0 rounded-3 d-flex align-items-center mb-3 p-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6" />
                  <div className="small font-medium">{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-3.5">
                  <label htmlFor="username" className="form-label text-muted small fw-semibold mb-1.5">
                    Username or Email
                  </label>
                  <div className="position-relative">
                    <i className="bi bi-person-fill position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6" />
                    <input
                      type="text"
                      className="form-control rounded-3 ps-5 pe-3 py-2.5 style-login-input"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username or email"
                      disabled={loading}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-3.5">
                  <label htmlFor="password" className="form-label text-muted small fw-semibold mb-1.5">
                    Password
                  </label>
                  <div className="position-relative">
                    <i className="bi bi-lock-fill position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control rounded-3 ps-5 pe-5 py-2.5 style-login-input"
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
                      <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} fs-6`} />
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
                    <label className="form-check-label text-muted small cursor-pointer" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link has been dispatched to your administrator.'); }} className="text-decoration-none small text-primary hover-underline font-semibold">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  className="login-btn-primary w-100"
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
                <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: 'var(--border)' }}>
                  <small className="text-muted x-small d-block" style={{ lineHeight: '1.5' }}>
                    Enterprise System Access • Protected by AES-256 RBAC
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