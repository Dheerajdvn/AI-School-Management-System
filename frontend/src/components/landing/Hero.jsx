import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Hero({ onOpenDemo }) {
  const [copied, setCopied] = useState(false)

  const copyQuickCommand = () => {
    navigator.clipboard?.writeText('npx ai-school-os@latest')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="landing-section landing-hero-section text-center position-relative landing-section-entrance">
      <div className="container landing-hero-content" style={{ maxWidth: '1040px' }}>
        
        {/* Saasfly-Style Top Announcement Pill */}
        <div className="mb-3">
          <a href="#ai-sandbox" className="saasfly-announcement-pill">
            <span className="badge rounded-pill bg-white text-dark fw-bold px-2 py-0.5" style={{ fontSize: '0.68rem' }}>2.0</span>
            <span>Introducing AI School OS with pgvector Textbook Grounding</span>
            <i className="bi bi-chevron-right small opacity-75"></i>
          </a>
        </div>

        {/* Meridian-Style High-Impact Headline */}
        <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(2.3rem, 5.2vw, 3.8rem)', lineHeight: 1.12, color: 'var(--home-heading)', letterSpacing: '-0.035em' }}>
          Intelligent School Governance & <br className="d-none d-md-inline" />
          <span style={{ background: 'linear-gradient(180deg, #FFFFFF 20%, #E4E4E7 60%, #A1A1AA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            24/7 AI Learning Assistant
          </span>
        </h1>

        <p className="lead mx-auto mb-4" style={{ maxWidth: '720px', color: 'var(--home-paragraph)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          A unified, cloud-native academic operating system designed for modern campuses. Automate administrative workflows, streamline grading, and give every learner a verified AI tutor.
        </p>

        {/* Dual CTA: Solid High-Contrast White Button + Saasfly Terminal Chip */}
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-4">
          <Link
            to="/login"
            className="btn btn-primary px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2"
            style={{ height: '42px', fontSize: '0.9rem', borderRadius: '12px' }}
          >
            <span>Access Portal</span>
            <i className="bi bi-arrow-right"></i>
          </Link>

          <button
            type="button"
            onClick={copyQuickCommand}
            className="terminal-command-chip"
            title="Click to copy setup command"
            style={{ height: '42px' }}
          >
            <span className="opacity-50">$</span>
            <span className="text-white">npx ai-school-os@latest</span>
            <span className="copy-badge d-inline-flex align-items-center gap-1 ms-1">
              <i className={`bi ${copied ? 'bi-check2 text-success' : 'bi-clipboard'}`}></i>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenDemo}
            className="btn btn-secondary px-3.5 py-2 fw-medium d-inline-flex align-items-center gap-2"
            style={{ height: '42px', fontSize: '0.88rem', borderRadius: '12px' }}
          >
            <i className="bi bi-play-circle-fill text-light"></i>
            <span>Demo Accounts</span>
          </button>
        </div>

        {/* Meridian-Style 3D Perspective Slanted Dark Console */}
        <div className="meridian-console-perspective d-none d-sm-block">
          <div className="meridian-console-card text-start">
            
            {/* Window Top Controls & Navigation Bar */}
            <div className="d-flex align-items-center justify-content-between px-3 py-2.5 border-bottom border-secondary border-opacity-10" style={{ background: '#0E0F12' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-danger opacity-75" style={{ width: '10px', height: '10px' }}></span>
                <span className="rounded-circle bg-warning opacity-75" style={{ width: '10px', height: '10px' }}></span>
                <span className="rounded-circle bg-success opacity-75" style={{ width: '10px', height: '10px' }}></span>
                <span className="ms-2 small text-muted font-monospace" style={{ fontSize: '0.78rem' }}>console.school-os.internal</span>
              </div>

              {/* Monospace console tabs */}
              <div className="d-none d-md-flex align-items-center gap-3 font-monospace small" style={{ fontSize: '0.76rem', color: '#71717A' }}>
                <span style={{ color: '#FFFFFF', borderBottom: '1px solid #FFFFFF', paddingBottom: '2px' }}>[ OVERVIEW ]</span>
                <span>TELEMETRY</span>
                <span>VECTOR STORE</span>
                <span>AUDIT LOGS</span>
              </div>

              <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10B981', fontSize: '0.72rem', fontWeight: 600 }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px', backgroundColor: '#10B981' }}></span>
                <span>Cluster Healthy</span>
              </div>
            </div>

            {/* Console Content Grid */}
            <div className="p-3.5 p-md-4" style={{ background: '#0B0C0E' }}>
              
              {/* Top Metric Bar (Meridian Style) */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="small text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Active Learners</div>
                    <div className="h4 fw-bold text-white my-1" style={{ letterSpacing: '-0.02em' }}>2,450+</div>
                    <div className="small text-success d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-arrow-up-short"></i> +18.4% enrollment
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="small text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Vector Chunks</div>
                    <div className="h4 fw-bold text-white my-1" style={{ letterSpacing: '-0.02em' }}>48,500</div>
                    <div className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-cpu text-light"></i> pgvector HNSW
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="small text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>AI Queries Resolved</div>
                    <div className="h4 fw-bold text-white my-1" style={{ letterSpacing: '-0.02em' }}>24.8K</div>
                    <div className="small text-success d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-lightning-charge-fill"></i> 280ms avg latency
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="small text-muted fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Rubric Alignment</div>
                    <div className="h4 fw-bold text-white my-1" style={{ letterSpacing: '-0.02em' }}>99.2%</div>
                    <div className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-shield-check text-success"></i> 0 hallucination rate
                    </div>
                  </div>
                </div>
              </div>

              {/* Glowing SVG Telemetry Graph (Like Meridian Console Chart) */}
              <div className="p-3 p-md-4 rounded-3 position-relative overflow-hidden" style={{ background: 'rgba(18, 19, 24, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <span className="small text-muted text-uppercase fw-semibold font-monospace" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                      System Telemetry • 24-Hour RAG Query Volume
                    </span>
                    <div className="text-white fw-bold fs-5 mt-0.5">24,850 queries processed</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge font-monospace text-muted border border-secondary border-opacity-25" style={{ fontSize: '0.7rem' }}>p99 = 310ms</span>
                    <span className="badge bg-white text-dark font-monospace fw-bold" style={{ fontSize: '0.7rem' }}>LIVE</span>
                  </div>
                </div>

                {/* SVG Area Chart */}
                <div className="w-100 position-relative" style={{ height: '140px' }}>
                  <svg viewBox="0 0 800 140" preserveAspectRatio="none" className="w-100 h-100" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
                        <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="20" x2="800" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="800" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                    {/* Gradient Area Fill */}
                    <path
                      d="M 0,110 Q 100,105 180,85 T 360,65 T 520,40 T 680,25 T 800,15 L 800,140 L 0,140 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Crisp Ascending Telemetry Line */}
                    <path
                      d="M 0,110 Q 100,105 180,85 T 360,65 T 520,40 T 680,25 T 800,15"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.2"
                      filter="url(#glow)"
                    />

                    {/* Target Data Marker */}
                    <circle cx="800" cy="15" r="4" fill="#FFFFFF" />
                    <circle cx="800" cy="15" r="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Bottom Time Coordinates */}
                <div className="d-flex justify-content-between small text-muted font-monospace mt-2" style={{ fontSize: '0.7rem' }}>
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span className="text-white">NOW</span>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
