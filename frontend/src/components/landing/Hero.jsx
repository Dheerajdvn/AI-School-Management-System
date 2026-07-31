import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero({ onOpenDemo }) {
  return (
    <section className="landing-section landing-hero-section text-center position-relative landing-section-entrance" style={{ paddingTop: '48px', paddingBottom: '36px' }}>
      <div className="container landing-hero-content" style={{ maxWidth: '960px' }}>
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2 rounded-pill"
          style={{ background: 'color-mix(in srgb, var(--text) 4%, var(--bg))', fontSize: '0.82rem' }}
        >
          <span
            className="rounded-circle"
            style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)' }}
          ></span>
          <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
            Platform Preview - Spring Boot, React, PostgreSQL & Qdrant
          </span>
        </div>

        <h1 className="fw-bold tracking-tight mb-2.5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.12, color: 'var(--text)' }}>
          AI-Powered School Management & Retrieval-Augmented Generation
        </h1>

        <p className="lead mx-auto mb-3" style={{ maxWidth: '700px', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.5 }}>
          A full-stack enterprise education platform built with Spring Boot, React, PostgreSQL, and Qdrant.
          Manage multi-campus schools, academic calendars, assignments, and search course materials with AI-generated answers and verified citations.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2.5 mb-3">
          <Link to="/login" className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2" style={{ height: '40px', fontSize: '0.88rem', borderRadius: '10px' }}>
            <span>Sign In to Dashboard</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
          <button onClick={onOpenDemo} className="btn btn-secondary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2" style={{ height: '40px', fontSize: '0.88rem', borderRadius: '10px' }}>
            <i className="bi bi-play-circle-fill text-primary"></i>
            <span>Interactive Demo Accounts</span>
          </button>
        </div>

        <div className="d-none d-sm-block rounded-4 p-2 text-start position-relative landing-card mt-1">
          <div className="d-flex align-items-center justify-content-between px-3 py-2">
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle bg-danger opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-warning opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-success opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="ms-2 small text-muted font-monospace">school-dashboard.internal/overview</span>
            </div>
            <div className="badge bg-primary-subtle text-primary">Spring Boot REST API</div>
          </div>
          <div className="p-4" style={{ background: 'transparent' }}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div className="text-muted small fw-semibold">SAMPLE ENROLLMENTS</div>
                  <div className="h3 fw-bold my-1" style={{ color: '#F8F8FA' }}>1,420</div>
                  <div className="small text-success"><i className="bi bi-graph-up me-1"></i>Dashboard metric preview</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div className="text-muted small fw-semibold">SAMPLE RAG DOCUMENTS</div>
                  <div className="h3 fw-bold my-1" style={{ color: '#F8F8FA' }}>850</div>
                  <div className="small text-primary"><i className="bi bi-database-check me-1"></i>Qdrant Vector DB</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div className="text-muted small fw-semibold">SAMPLE AI CONVERSATIONS</div>
                  <div className="h3 fw-bold my-1" style={{ color: '#F8F8FA' }}>3,890</div>
                  <div className="small text-primary"><i className="bi bi-chat-quote me-1"></i>Ollama-backed chat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
