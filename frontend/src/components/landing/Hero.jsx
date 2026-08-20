import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero({ onOpenDemo }) {
  return (
    <section className="landing-section landing-hero-section text-center position-relative landing-section-entrance" style={{ paddingTop: '48px', paddingBottom: '36px' }}>
      <div className="container landing-hero-content" style={{ maxWidth: '980px' }}>
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1.5 mb-3 rounded-pill shadow-xs"
          style={{ background: 'color-mix(in srgb, var(--text) 5%, var(--bg))', border: '1px solid var(--border)', fontSize: '0.84rem' }}
        >
          <span
            className="pulse-dot"
          ></span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>
            Next-Generation Education Operating System
          </span>
        </div>

        <h1 className="fw-bold tracking-tight mb-3" style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.6rem)', lineHeight: 1.15, color: 'var(--text)' }}>
          Intelligent School Governance & <br className="d-none d-md-inline" />
          <span style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            24/7 AI Learning Assistant
          </span>
        </h1>

        <p className="lead mx-auto mb-4" style={{ maxWidth: '720px', color: 'var(--muted)', fontSize: '1.08rem', lineHeight: 1.6 }}>
          A unified, cloud-native academic platform designed for modern schools, colleges, and multi-campus institutions.
          Automate administrative workflows, manage curriculum and grading, and give every student a personal AI tutor backed by verified textbook citations.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-4">
          <Link to="/login" className="btn btn-primary px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm" style={{ height: '44px', fontSize: '0.92rem', borderRadius: '12px' }}>
            <span>Access Portal</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
          <button onClick={onOpenDemo} className="btn btn-secondary px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2" style={{ height: '44px', fontSize: '0.92rem', borderRadius: '12px' }}>
            <i className="bi bi-play-circle-fill text-primary"></i>
            <span>Interactive Demo Accounts</span>
          </button>
        </div>

        {/* Interactive Platform Mockup Preview */}
        <div className="d-none d-sm-block rounded-4 p-2 text-start position-relative landing-card mt-2 shadow-lg" style={{ backdropFilter: 'blur(16px)' }}>
          <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle bg-danger opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-warning opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-success opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="ms-2 small text-muted font-monospace">school-os.internal/dashboard/live-overview</span>
            </div>
            <div className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
              <i className="bi bi-shield-check" /> Enterprise Protected
            </div>
          </div>
          <div className="p-4" style={{ background: 'transparent' }}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="p-3.5 rounded-3 h-100" style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Active Learners</span>
                    <i className="bi bi-people-fill text-primary" />
                  </div>
                  <div className="h3 fw-bold my-1" style={{ color: 'var(--text)' }}>2,450+</div>
                  <div className="small text-success d-flex align-items-center gap-1">
                    <i className="bi bi-arrow-up-short fs-6" /> 18% enrollment increase
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3.5 rounded-3 h-100" style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Knowledge Library</span>
                    <i className="bi bi-book-half text-primary" />
                  </div>
                  <div className="h3 fw-bold my-1" style={{ color: 'var(--text)' }}>1,280</div>
                  <div className="small text-primary d-flex align-items-center gap-1">
                    <i className="bi bi-check-all fs-6" /> Indexed course materials
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3.5 rounded-3 h-100" style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>AI Study Inquiries</span>
                    <i className="bi bi-stars text-primary" />
                  </div>
                  <div className="h3 fw-bold my-1" style={{ color: 'var(--text)' }}>15,820</div>
                  <div className="small text-success d-flex align-items-center gap-1">
                    <i className="bi bi-lightning-charge-fill fs-6" /> Sub-second response time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
