import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero({ onOpenDemo }) {
  return (
    <section className="landing-section landing-hero-section py-5 text-center position-relative landing-section-entrance">
      <div className="landing-hero-visual" aria-hidden="true">
        <div className="landing-grid-plane"></div>
        <div className="landing-data-ribbon ribbon-one"></div>
        <div className="landing-data-ribbon ribbon-two"></div>
        <div className="landing-feature-tile tile-admin">
          <i className="bi bi-building-fill"></i>
          <span>Admin</span>
        </div>
        <div className="landing-feature-tile tile-rag">
          <i className="bi bi-database-check"></i>
          <span>RAG</span>
        </div>
        <div className="landing-feature-tile tile-ai">
          <i className="bi bi-robot"></i>
          <span>AI Tutor</span>
        </div>
      </div>

      <div className="container landing-hero-content" style={{ maxWidth: '960px' }}>
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-4 rounded-pill border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', fontSize: '0.85rem' }}
        >
          <span
            className="rounded-circle"
            style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)' }}
          ></span>
          <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
            Platform Preview - Spring Boot, React, PostgreSQL & Qdrant
          </span>
        </div>

        <h1 className="fw-bold tracking-tight mb-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.15, color: 'var(--text)' }}>
          AI-Powered School Management & Retrieval-Augmented Generation
        </h1>

        <p className="lead mx-auto mb-4" style={{ maxWidth: '720px', color: 'var(--muted)', fontSize: '1.15rem', lineHeight: 1.6 }}>
          A full-stack enterprise education platform built with Spring Boot, React, PostgreSQL, and Qdrant.
          Manage multi-campus schools, academic calendars, assignments, and search course materials with AI-generated answers and verified citations.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-5">
          <Link to="/login" className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2" style={{ height: '46px', fontSize: '0.95rem' }}>
            <span>Sign In to Dashboard</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
          <button onClick={onOpenDemo} className="btn btn-secondary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2" style={{ height: '46px', fontSize: '0.95rem' }}>
            <i className="bi bi-play-circle-fill text-primary"></i>
            <span>Interactive Demo Accounts</span>
          </button>
        </div>

        <div className="d-none d-sm-block rounded-3 border shadow-sm p-2 text-start position-relative" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom" style={{ borderColor: 'var(--border)' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle bg-danger opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-warning opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="rounded-circle bg-success opacity-75" style={{ width: '10px', height: '10px' }}></span>
              <span className="ms-2 small text-muted font-monospace">school-dashboard.internal/overview</span>
            </div>
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle">Spring Boot REST API</div>
          </div>
          <div className="p-4" style={{ background: 'var(--card)' }}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="p-3 rounded border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="text-muted small fw-semibold">SAMPLE ENROLLMENTS</div>
                  <div className="h3 fw-bold my-1" style={{ color: 'var(--text)' }}>1,420</div>
                  <div className="small text-success"><i className="bi bi-graph-up me-1"></i>Dashboard metric preview</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 rounded border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="text-muted small fw-semibold">SAMPLE RAG DOCUMENTS</div>
                  <div className="h3 fw-bold my-1" style={{ color: 'var(--text)' }}>850</div>
                  <div className="small text-primary"><i className="bi bi-database-check me-1"></i>Qdrant Vector DB</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 rounded border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="text-muted small fw-semibold">SAMPLE AI CONVERSATIONS</div>
                  <div className="h3 fw-bold my-1" style={{ color: 'var(--text)' }}>3,890</div>
                  <div className="small text-info"><i className="bi bi-chat-quote me-1"></i>Ollama-backed chat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
