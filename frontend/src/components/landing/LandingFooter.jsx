import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingFooter({ onOpenDemo }) {
  return (
    <footer className="landing-footer border-top py-5" style={{ background: 'var(--home-footer-bg)', borderColor: 'var(--home-border)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="row g-4 text-start align-items-start mb-4">
          {/* Column 1: Logo & Description */}
          <div className="col-12 col-lg-4">
            <Link to="/" className="text-decoration-none fw-bold fs-5 d-inline-flex align-items-center gap-2.5 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: 'var(--home-heading)' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <span style={{ color: 'var(--home-heading)', letterSpacing: '-0.03em', fontSize: '1.05rem' }}>AI School OS</span>
            </Link>
            <p className="small mb-3" style={{ color: 'var(--home-muted)', lineHeight: 1.6, fontSize: '0.88rem', maxWidth: '340px' }}>
              The unified intelligent operating system for modern academic institutions. Empowering leadership, faculty, and students with smart automation and 24/7 AI tutoring.
            </p>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small border" style={{ background: 'var(--home-inner-bg)', borderColor: 'var(--home-inner-border)' }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px', backgroundColor: '#10B981' }} />
              <span style={{ color: 'var(--home-heading)', fontSize: '0.78rem', fontWeight: 500 }}>All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="col-6 col-sm-4 col-lg-2">
            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--home-heading)', letterSpacing: '0.06em', fontSize: '0.78rem' }}>Platform</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0" style={{ fontSize: '0.86rem' }}>
              <li><a href="#features" className="text-decoration-none" style={{ color: 'var(--home-muted)', transition: 'color 0.2s' }}>Features</a></li>
              <li><a href="#knowledge-engine" className="text-decoration-none" style={{ color: 'var(--home-muted)', transition: 'color 0.2s' }}>Knowledge Engine</a></li>
              <li><a href="#roles" className="text-decoration-none" style={{ color: 'var(--home-muted)', transition: 'color 0.2s' }}>Role Portals</a></li>
              <li><button type="button" className="btn p-0 text-decoration-none small border-0 bg-transparent text-start" style={{ color: 'var(--home-muted)', fontSize: '0.86rem' }} onClick={onOpenDemo}>Demo Accounts</button></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-6 col-sm-4 col-lg-3">
            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--home-heading)', letterSpacing: '0.06em', fontSize: '0.78rem' }}>Resources</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0" style={{ fontSize: '0.86rem' }}>
              <li><a href="#faq" className="text-decoration-none" style={{ color: 'var(--home-muted)', transition: 'color 0.2s' }}>Help & FAQ</a></li>
              <li><a href="https://github.com/Dheerajdvn" target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: 'var(--home-muted)', transition: 'color 0.2s' }}>GitHub Project</a></li>
              <li><Link to="/login" className="text-decoration-none" style={{ color: 'var(--home-muted)', transition: 'color 0.2s' }}>Portal Login</Link></li>
              <li><span style={{ color: 'var(--home-muted)' }}>Enterprise Security</span></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="col-12 col-sm-4 col-lg-3">
            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--home-heading)', letterSpacing: '0.06em', fontSize: '0.78rem' }}>Connect</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0" style={{ fontSize: '0.86rem' }}>
              <li>
                <a href="https://github.com/Dheerajdvn" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-2" style={{ color: 'var(--home-muted)' }}>
                  <i className="bi bi-github"></i> GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/dheerajdvn/" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-2" style={{ color: 'var(--home-muted)' }}>
                  <i className="bi bi-linkedin"></i> LinkedIn Profile
                </a>
              </li>
              <li>
                <a href="mailto:dheerajdvn@gmail.com" className="text-decoration-none d-inline-flex align-items-center gap-2" style={{ color: 'var(--home-muted)' }}>
                  <i className="bi bi-envelope"></i> dheerajdvn@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-3 border-top d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 text-muted small" style={{ borderColor: 'var(--home-border)', fontSize: '0.82rem' }}>
          <div>
            © {new Date().getFullYear()} AI School OS. All rights reserved. Empowering the future of intelligent education.
          </div>
          <div className="d-flex align-items-center gap-3">
            <a href="#privacy" className="text-decoration-none" style={{ color: 'var(--muted)' }}>Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="text-decoration-none" style={{ color: 'var(--muted)' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
