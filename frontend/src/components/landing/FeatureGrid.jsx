import React from 'react'

export default function FeatureGrid() {
  const features = [
    {
      id: 'tutor',
      bentoCol: 'col-12 col-lg-7',
      icon: 'bi-stars',
      tag: 'Vector RAG Engine',
      title: '24/7 AI Academic Tutor with Citations',
      desc: 'Conversational assistant explaining complex concepts and resolving student doubts with verified page-level textbook citations.',
      preview: (
        <div className="mt-3 p-3 rounded-3 border landing-inner-box">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-muted font-monospace" style={{ fontSize: '0.74rem' }}>
              <i className="bi bi-chat-left-dots-fill text-light me-1.5"></i> Live Inquiry
            </span>
            <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '0.7rem' }}>
              Cosine Match: 98.7%
            </span>
          </div>
          <div className="small font-monospace text-white fw-medium mb-1" style={{ fontSize: '0.82rem' }}>
            Q: "Explain Newton's Second Law with momentum derivation"
          </div>
          <div className="small text-muted d-flex align-items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-book-half text-light"></i>
            <span>NCERT Science Class 10 • Chapter 9 (Page 118)</span>
          </div>
        </div>
      )
    },
    {
      id: 'grading',
      bentoCol: 'col-12 col-lg-5',
      icon: 'bi-journal-check',
      tag: 'Faculty Automation',
      title: 'Automated Rubric Grading',
      desc: 'Evaluates homework and essay submissions instantly with objective criteria and actionable personalized student feedback.',
      preview: (
        <div className="mt-3 p-3 rounded-3 border landing-inner-box">
          <div className="d-flex justify-content-between align-items-center mb-1.5">
            <span className="small fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Rubric Evaluation</span>
            <span className="badge bg-white text-dark font-monospace fw-bold" style={{ fontSize: '0.7rem' }}>95 / 100</span>
          </div>
          <div className="progress mb-2" style={{ height: '5px', background: 'var(--home-track-bg)' }}>
            <div className="progress-bar bg-white" role="progressbar" style={{ width: '95%' }}></div>
          </div>
          <div className="small text-success font-monospace d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-check2-circle"></i> Objective rubric criteria verified
          </div>
        </div>
      )
    },
    {
      id: 'governance',
      bentoCol: 'col-12 col-lg-5',
      icon: 'bi-building-fill',
      tag: 'Centralized SIS',
      title: 'Smart Campus Governance',
      desc: 'Centralized multi-campus administration, staff rosters, and timetables synchronized across all branches in real time.',
      preview: (
        <div className="mt-3 p-3 rounded-3 border landing-inner-box">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-muted font-monospace" style={{ fontSize: '0.74rem' }}>
              Multi-Branch Roster State
            </span>
            <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '0.7rem' }}>
              Synchronized
            </span>
          </div>
          <div className="d-flex flex-wrap gap-1.5">
            <span className="badge font-monospace" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A1A1AA', fontSize: '0.72rem' }}>
              12 Departments
            </span>
            <span className="badge font-monospace" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A1A1AA', fontSize: '0.72rem' }}>
              35 Faculty
            </span>
            <span className="badge font-monospace" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A1A1AA', fontSize: '0.72rem' }}>
              2,450 Students
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      bentoCol: 'col-12 col-lg-7',
      icon: 'bi-shield-lock-fill',
      tag: 'Enterprise Security',
      title: 'Zero-Trust Isolation & FERPA Compliance',
      desc: 'Granular role isolation, 256-bit encryption, immutable audit logs, and zero AI model retraining on student data.',
      preview: (
        <div className="mt-3 p-3 rounded-3 border landing-inner-box">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-muted font-monospace" style={{ fontSize: '0.74rem' }}>
              Security Posture
            </span>
            <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '0.7rem' }}>
              SOC-2 / FERPA Ready
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge font-monospace" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A1A1AA', fontSize: '0.72rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <i className="bi bi-shield-check text-success me-1"></i> FERPA & GDPR Aligned
            </span>
            <span className="badge font-monospace" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A1A1AA', fontSize: '0.72rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <i className="bi bi-key-fill text-warning me-1"></i> 256-bit AES
            </span>
            <span className="badge font-monospace" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#A1A1AA', fontSize: '0.72rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <i className="bi bi-slash-circle-fill text-light me-1"></i> Zero Retraining
            </span>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="landing-section" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Section Header - Direct & Clean */}
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            Core Architecture
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--home-heading)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}>
            Engineered for Modern Academic Excellence
          </h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px', fontSize: '0.98rem', lineHeight: 1.55 }}>
            Four foundational capabilities powering campus governance, teacher workflows, and AI learning.
          </p>
        </div>

        {/* Streamlined 4-Card Bento Grid */}
        <div className="row g-3.5 g-lg-4">
          {features.map((f) => (
            <div key={f.id} className={`${f.bentoCol} animate-fade-up`}>
              <div className="p-4 p-lg-4.5 rounded-4 h-100 d-flex flex-column justify-content-between landing-card shadow-sm">
                
                {/* Top: Bento Icon Badge + Tag */}
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bento-icon-badge">
                      <i className={`bi ${f.icon}`}></i>
                    </div>
                    <span className="badge font-monospace" style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', color: '#A1A1AA', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {f.tag}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: 'var(--home-heading)', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
                    {f.title}
                  </h5>
                  <p className="small text-muted mb-2" style={{ lineHeight: 1.6, fontSize: '0.88rem' }}>
                    {f.desc}
                  </p>
                </div>

                {/* Micro Visual Preview */}
                {f.preview}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
