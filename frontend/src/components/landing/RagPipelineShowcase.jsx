import React, { useState } from 'react'

export default function RagPipelineShowcase() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { step: 1, title: 'Upload Course Materials', desc: 'Teachers upload course syllabi, lecture slides, research papers, and textbook chapters.', icon: 'bi-cloud-upload-fill' },
    { step: 2, title: 'Intelligent Reading', desc: 'The system reads, parses, and cleans text content from any document format automatically.', icon: 'bi-file-earmark-text-fill' },
    { step: 3, title: 'Semantic Structuring', desc: 'Content is broken down into structured conceptual topics and key learning outcomes.', icon: 'bi-diagram-3-fill' },
    { step: 4, title: 'Deep Knowledge Indexing', desc: 'AI builds a comprehensive semantic index allowing natural language question answering.', icon: 'bi-lightning-charge-fill' },
    { step: 5, title: 'Instant Concept Search', desc: 'Students search questions in plain English and retrieve exact matching lesson concepts.', icon: 'bi-search' },
    { step: 6, title: 'Verified Answers & Citations', desc: 'The AI Tutor crafts precise explanations with page-level textbook citations and references.', icon: 'bi-chat-left-quote-fill' }
  ]

  return (
    <section className="landing-section" style={{ paddingTop: '44px', paddingBottom: '44px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            <i className="bi bi-stars me-1" /> Smart Knowledge Engine
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '2rem' }}>How Course Materials Turn into an Instant AI Tutor</h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '640px', fontSize: '1rem', lineHeight: 1.5 }}>
            From textbook upload to instant, accurate student answers backed by verified chapter and page references.
          </p>
        </div>

        {/* Workflow Step Bar */}
        <div className="row g-2 mb-4">
          {steps.map((s, idx) => (
            <div key={s.step} className="col-6 col-md-4 col-lg-2">
              <button
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-4 w-100 text-start transition-all landing-card border ${activeStep === idx ? 'step-button-active' : ''}`}
                style={{
                  background: activeStep === idx ? 'var(--hover)' : 'var(--card)',
                  borderColor: activeStep === idx ? 'var(--primary)' : 'var(--border)',
                  boxShadow: activeStep === idx ? '0 8px 24px rgba(99, 102, 241, 0.2)' : 'var(--shadow)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className={`badge ${activeStep === idx ? 'bg-primary text-light' : 'bg-secondary-subtle text-secondary'}`}>
                    {s.step}
                  </span>
                  <i className={`bi ${s.icon} ${activeStep === idx ? 'text-primary fs-5' : 'text-muted'}`}></i>
                </div>
                <div className="fw-semibold small text-truncate" style={{ color: 'var(--text)' }}>{s.title}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Selected Step Showcase Box */}
        <div className="p-4 rounded-4 landing-card shadow-md">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill bg-primary-subtle text-primary fw-semibold small">
                <span>Phase {steps[activeStep].step} of 6</span>
              </div>
              <h3 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>{steps[activeStep].title}</h3>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                {steps[activeStep].desc}
              </p>
              <div className="d-flex align-items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setActiveStep(prev => (prev - 1 + steps.length) % steps.length)} 
                  className="btn btn-sm btn-secondary rounded-3 px-3 py-2"
                >
                  <i className="bi bi-arrow-left me-1"></i> Previous
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveStep(prev => (prev + 1) % steps.length)} 
                  className="btn btn-sm btn-primary rounded-3 px-3 py-2"
                >
                  Next Step <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-4 rounded-4 shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom" style={{ borderColor: 'var(--border)' }}>
                  <span className="fw-semibold small d-inline-flex align-items-center gap-1.5" style={{ color: 'var(--text)' }}>
                    <i className="bi bi-check-circle-fill text-success" /> Live Simulation Preview
                  </span>
                  <span className="badge bg-success-subtle text-success">Active & Ready</span>
                </div>

                {activeStep === 0 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="p-3 rounded-3 bg-card border d-flex align-items-center gap-3">
                      <i className="bi bi-file-earmark-pdf-fill text-danger fs-3" />
                      <div className="flex-grow-1">
                        <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Physics_Mechanics_Syllabus.pdf</div>
                        <div className="small text-muted">48 Pages • 4.2 MB • Uploaded by Dr. Smith</div>
                      </div>
                      <span className="badge bg-primary-subtle text-primary">Uploaded</span>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="p-3 rounded-3 bg-card border">
                      <div className="fw-semibold small mb-1 text-primary">Text Extraction Complete</div>
                      <div className="small text-muted">Extracted 14,200 words across 12 chapters. Formulas, diagrams, and headings organized.</div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="p-3 rounded-3 bg-card border">
                      <div className="fw-semibold small mb-1 text-primary">Topic & Concept Breakdown</div>
                      <div className="d-flex flex-wrap gap-1.5 mt-2">
                        <span className="badge bg-secondary-subtle text-secondary">Newton's 1st Law</span>
                        <span className="badge bg-secondary-subtle text-secondary">Conservation of Momentum</span>
                        <span className="badge bg-secondary-subtle text-secondary">Kinetic Energy</span>
                        <span className="badge bg-secondary-subtle text-secondary">Friction Vectors</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="p-3 rounded-3 bg-card border">
                      <div className="fw-semibold small mb-1 text-primary">Knowledge Graph Created</div>
                      <div className="small text-muted">Cross-referenced formulas with practice problem banks and lesson summaries.</div>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="p-3 rounded-3 bg-card border">
                      <div className="fw-semibold small mb-1 text-muted">Student Query:</div>
                      <div className="fw-bold mb-2" style={{ color: 'var(--text)' }}>"How is momentum conserved in elastic collisions?"</div>
                      <div className="small text-success d-flex align-items-center gap-1">
                        <i className="bi bi-check2-circle" /> Found 3 matching chapters in Physics Syllabus
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="p-3 rounded-3 bg-card border">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-robot text-primary" />
                        <span className="fw-semibold small text-primary">AI Tutor Response:</span>
                      </div>
                      <p className="small mb-2" style={{ color: 'var(--text)', lineHeight: 1.5 }}>
                        In an elastic collision, total linear momentum (p = mv) remains constant because the net external force is zero.
                      </p>
                      <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-subtle text-secondary small">
                        <i className="bi bi-bookmark-check-fill text-primary" />
                        <span>Source: Physics Syllabus, Chapter 4, Page 18</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
