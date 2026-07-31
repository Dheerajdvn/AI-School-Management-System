import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingFooter({ onOpenDemo }) {
  return (
    <footer className="landing-footer" style={{ background: '#0F1117', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px', paddingBottom: '16px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="row g-3 text-start align-items-baseline mb-3">
          {/* Column 1: Logo & Description */}
          <div className="col-12 col-lg-4">
            <div className="fw-bold fs-6 d-inline-flex align-items-center gap-2 mb-1.5">
              <div className="d-flex align-items-center justify-content-center rounded-2 px-2 py-0.5" style={{ background: 'linear-gradient(135deg, #6D7CFF, #8B7CFF)', color: '#fff' }}>
                <i className="bi bi-mortarboard-fill fs-6"></i>
              </div>
              <span style={{ color: '#F8F8FA', letterSpacing: '-0.02em', fontSize: '0.95rem' }}>AI School OS</span>
            </div>
            <p className="small mb-0" style={{ color: '#A8ADB8', lineHeight: 1.45, fontSize: '0.82rem', maxWidth: '320px' }}>
              Next-generation full-stack school operations & RAG vector search intelligence engine. Powered by Spring Boot, PostgreSQL & Qdrant.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="col-6 col-sm-4 col-lg-2">
            <h6 className="fw-semibold mb-2 small text-uppercase" style={{ color: '#C8CDD8', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Platform</h6>
            <ul className="list-unstyled d-flex flex-column gap-1.5 small mb-0" style={{ fontSize: '0.82rem' }}>
              <li><a href="#features" className="text-decoration-none" style={{ color: '#707784', transition: 'color 0.2s' }}>Features</a></li>
              <li><a href="#rag-pipeline" className="text-decoration-none" style={{ color: '#707784', transition: 'color 0.2s' }}>RAG Architecture</a></li>
              <li><a href="#roles" className="text-decoration-none" style={{ color: '#707784', transition: 'color 0.2s' }}>Role Portals</a></li>
              <li><button type="button" className="btn p-0 text-decoration-none small border-0 bg-transparent text-start" style={{ color: '#707784', fontSize: '0.82rem' }} onClick={onOpenDemo}>Demo Accounts</button></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-6 col-sm-4 col-lg-3">
            <h6 className="fw-semibold mb-2 small text-uppercase" style={{ color: '#C8CDD8', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Resources</h6>
            <ul className="list-unstyled d-flex flex-column gap-1.5 small mb-0" style={{ fontSize: '0.82rem' }}>
              <li><a href="#documentation" className="text-decoration-none" style={{ color: '#707784', transition: 'color 0.2s' }}>Documentation</a></li>
              <li><a href="https://github.com/Dheerajdvn" target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: '#707784' }}>API Overview</a></li>
              <li><a href="https://github.com/Dheerajdvn" target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: '#707784' }}>GitHub Repository</a></li>
              <li><span style={{ color: '#707784' }}>Enterprise RBAC</span></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="col-12 col-sm-4 col-lg-3">
            <h6 className="fw-semibold mb-2 small text-uppercase" style={{ color: '#C8CDD8', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Connect</h6>
            <ul className="list-unstyled d-flex flex-column gap-1.5 small mb-0" style={{ fontSize: '0.82rem' }}>
              <li>
                <a href="https://github.com/Dheerajdvn" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-1.5" style={{ color: '#707784' }}>
                  <i className="bi bi-github"></i> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/dheerajdvn/" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-1.5" style={{ color: '#707784' }}>
                  <i className="bi bi-linkedin"></i> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:dheerajdvn@gmail.com" className="text-decoration-none d-inline-flex align-items-center gap-1.5" style={{ color: '#707784' }}>
                  <i className="bi bi-envelope"></i> dheerajdvn@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-2.5 border-top d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 text-muted small" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', color: '#707784', fontSize: '0.78rem' }}>
          <div>
            © {new Date().getFullYear()} AI School OS. All rights reserved. Open-source edtech architecture demo.
          </div>
          <div className="d-flex align-items-center gap-3">
            <a href="#privacy" className="text-decoration-none" style={{ color: '#707784' }}>Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="text-decoration-none" style={{ color: '#707784' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
