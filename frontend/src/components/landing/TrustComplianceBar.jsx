import React from 'react'

export default function TrustComplianceBar() {
  const standards = [
    { label: 'NEP 2020 Aligned', desc: 'National Education Policy Framework', icon: 'bi-mortarboard-fill', color: '#E4E4E7' },
    { label: 'NCERT & CBSE Ready', desc: 'Curriculum & Syllabus Mapped', icon: 'bi-journal-bookmark-fill', color: '#10B981' },
    { label: 'pgvector Vector Store', desc: 'PostgreSQL Dense Embeddings', icon: 'bi-database-fill-check', color: '#A1A1AA' },
    { label: 'Spring Boot 3 Enterprise', desc: 'Type-Safe Modular Architecture', icon: 'bi-cpu-fill', color: '#E4E4E7' },
    { label: 'Role-Based Isolation', desc: 'RBAC Multitenant Security', icon: 'bi-shield-lock-fill', color: '#F59E0B' },
  ]

  const privacyPrinciples = [
    { icon: 'bi-shield-check', text: 'FERPA & GDPR Privacy Guidelines', color: '#10B981' },
    { icon: 'bi-lock-fill', text: '256-bit AES Data Encryption', color: '#E4E4E7' },
    { icon: 'bi-slash-circle-fill', text: 'Zero Model Retraining on Student Data', color: '#A1A1AA' },
    { icon: 'bi-key-fill', text: 'Granular Role-Segregated Portals', color: '#F59E0B' },
    { icon: 'bi-file-earmark-check-fill', text: 'Deterministic Textbook Citations', color: '#10B981' }
  ]

  return (
    <section className="landing-trust-section py-3">
      <div className="container" style={{ maxWidth: '1140px' }}>
        
        {/* Top: Standards & Technology Foundations */}
        <div className="text-center mb-3">
          <p className="text-uppercase fw-semibold tracking-wider small mb-3" style={{ fontSize: '0.74rem', letterSpacing: '0.12em', color: 'var(--home-muted, #707784)' }}>
            Institutional Architecture & Curriculum Standards
          </p>

          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2.5 gap-md-3">
            {standards.map((std, i) => (
              <div
                key={i}
                className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill institutional-pill"
                style={{
                  background: 'var(--home-inner-bg)',
                  border: '1px solid var(--home-inner-border)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--home-heading)',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`bi ${std.icon}`} style={{ color: std.color, fontSize: '0.9rem' }}></i>
                <span>{std.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Real Security & Privacy Guarantees */}
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 gap-sm-3">
          {privacyPrinciples.map((badge, idx) => (
            <div
              key={idx}
              className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-2 trust-badge-chip"
              style={{
                background: 'var(--home-inner-bg)',
                border: '1px solid var(--home-inner-border)',
                fontSize: '0.76rem',
                color: 'var(--home-paragraph)'
              }}
            >
              <i className={`bi ${badge.icon}`} style={{ color: badge.color, fontSize: '0.82rem' }}></i>
              <span className="fw-medium">{badge.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
