import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingFooter({ onOpenDemo }) {
  return (
    <footer className="landing-footer py-5 border-top" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between gap-4 text-start">
          <div className="landing-footer-brand">
            <div className="fw-bold fs-5 text-primary d-inline-flex align-items-center gap-2">
              <i className="bi bi-mortarboard-fill"></i>
              <span>AI School OS</span>
            </div>
            <p className="small text-muted mb-0 mt-1">
              Full-Stack School Management & RAG Vector Search Platform. Built with Spring Boot & React.
            </p>
          </div>

          <div className="landing-footer-links">
            <Link to="/login" className="landing-contact-link">Sign In</Link>
            <button type="button" className="landing-contact-link landing-contact-button" onClick={onOpenDemo}>
              Demo Accounts
            </button>
            <a href="https://github.com/Dheerajdvn" target="_blank" rel="noopener noreferrer" className="landing-contact-link">
              <i className="bi bi-github"></i>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/dheerajdvn/" target="_blank" rel="noopener noreferrer" className="landing-contact-link">
              <i className="bi bi-linkedin"></i>
              LinkedIn
            </a>
            <a href="mailto:dheerajdvn@gmail.com" className="landing-contact-link">
              <i className="bi bi-envelope"></i>
              dheerajdvn@gmail.com
            </a>
            <span className="landing-contact-link">
              <i className="bi bi-geo-alt"></i>
              Hyderabad, India
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-top text-center text-muted small" style={{ borderColor: 'var(--border)' }}>
          © {new Date().getFullYear()} AI School OS. Open-source educational technology architecture demo.
        </div>
      </div>
    </footer>
  )
}
