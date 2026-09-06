import React from 'react'

export default function ComparisonTable({ onOpenDemo }) {
  const comparisonRows = [
    {
      feature: 'Assignment & Essay Grading',
      legacy: '15+ hours/week of manual repetitive grading; delayed student feedback.',
      aiSchool: 'Sub-second rubric-based evaluation with personalized feedback.',
      highlight: true
    },
    {
      feature: '24/7 Academic Doubt Solving',
      legacy: 'Zero AI; students wait days until the next class for doubt resolution.',
      aiSchool: 'Instant conversational tutor with verified textbook page citations.',
      highlight: true
    },
    {
      feature: 'Campus Data & Roster Queries',
      legacy: 'Manual SQL requests, support tickets, and month-end Excel sheets.',
      aiSchool: 'Natural language queries: ask in plain English for instant roster records.',
      highlight: false
    },
    {
      feature: 'Student Privacy & Governance',
      legacy: 'Vulnerable legacy endpoints with unencrypted student records.',
      aiSchool: 'FERPA & GDPR aligned, 256-bit AES encryption, zero model retraining.',
      highlight: true
    }
  ]

  return (
    <section id="comparison" className="landing-section" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            <i className="bi bi-arrow-left-right me-1"></i> Competitive Benchmark
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--home-heading, #F8F8FA)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Why Institutions Are Replacing Legacy ERPs
          </h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '680px', fontSize: '1rem', lineHeight: 1.6 }}>
            Traditional school software only records history. AI School OS actively automates grading, accelerates learning, and provides proactive intelligence.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div
          className="rounded-4 landing-card shadow-lg border overflow-hidden"
          style={{
            background: 'var(--home-card-bg)',
            borderColor: 'var(--home-border)'
          }}
        >
          <div className="table-responsive">
            <table className="table mb-0 align-middle" style={{ minWidth: '720px' }}>
              <thead>
                <tr style={{ background: 'var(--home-inner-bg)', borderBottom: '1px solid var(--home-border)' }}>
                  <th className="py-3.5 px-4 text-uppercase small fw-bold" style={{ width: '28%', color: 'var(--home-muted)', letterSpacing: '0.06em' }}>
                    Capability / Workflow
                  </th>
                  <th className="py-3.5 px-4 text-uppercase small fw-bold text-danger opacity-85" style={{ width: '36%', letterSpacing: '0.06em' }}>
                    <i className="bi bi-x-circle-fill me-1.5"></i> Traditional Legacy ERPs
                  </th>
                  <th
                    className="py-3.5 px-4 text-uppercase small fw-bold"
                    style={{
                      width: '36%',
                      letterSpacing: '0.06em',
                      color: 'var(--primary)',
                      background: 'color-mix(in srgb, var(--primary) 8%, transparent)'
                    }}
                  >
                    <i className="bi bi-stars me-1.5"></i> AI School OS (Next-Gen)
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--home-inner-border)',
                      background: row.highlight ? 'color-mix(in srgb, var(--primary) 3%, transparent)' : 'transparent'
                    }}
                  >
                    <td className="py-3 px-4 fw-semibold" style={{ color: 'var(--home-heading)', fontSize: '0.88rem' }}>
                      {row.feature}
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--home-muted)', fontSize: '0.84rem', lineHeight: 1.5 }}>
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-x text-danger fs-5 flex-shrink-0" style={{ marginTop: '-2px' }}></i>
                        <span>{row.legacy}</span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 fw-medium"
                      style={{
                        color: 'var(--home-heading)',
                        fontSize: '0.84rem',
                        lineHeight: 1.5,
                        background: 'color-mix(in srgb, var(--primary) 4%, transparent)'
                      }}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-check2-circle text-success fs-5 flex-shrink-0" style={{ marginTop: '-2px' }}></i>
                        <span>{row.aiSchool}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action Banner */}
          <div
            className="p-3.5 p-sm-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3"
            style={{
              background: 'var(--home-inner-bg)',
              borderTop: '1px solid var(--home-border)'
            }}
          >
            <div>
              <h6 className="fw-semibold mb-1" style={{ color: 'var(--home-heading)' }}>
                Upgrade your school in under 48 hours
              </h6>
              <p className="small text-muted mb-0">
                Seamless CSV roster import and instant automated textbook ingestion.
              </p>
            </div>
            <button
              onClick={onOpenDemo}
              className="btn btn-primary fw-semibold px-4 py-2 d-inline-flex align-items-center gap-2 flex-shrink-0"
              style={{ borderRadius: '10px', fontSize: '0.88rem' }}
            >
              <span>Explore Live Platform</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
