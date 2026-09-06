import React, { useState } from 'react'

export default function RoiCalculator({ onOpenDemo }) {
  const [teachers, setTeachers] = useState(35)
  const [students, setStudents] = useState(850)

  // Calculations
  // Average faculty spends 12 hrs/mo on manual grading & quiz generation. AI reduces this by 65%.
  const facultyHoursSavedMonthly = Math.round(teachers * 12 * 0.65)
  // Annual dollar savings based on blended educator & admin labor rate ($24/hr) + paper/printing reductions
  const annualDollarSavings = Math.round((facultyHoursSavedMonthly * 12 * 24) + (students * 6.5))
  // Student monthly queries resolved instantly via 24/7 RAG Tutor
  const monthlyAiQueriesResolved = Math.round(students * 5.2)

  return (
    <section id="roi-calculator" className="landing-section" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            <i className="bi bi-calculator me-1"></i> Institutional Value Calculator
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--home-heading, #F8F8FA)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Calculate Your Time & Cost Savings
          </h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '680px', fontSize: '1rem', lineHeight: 1.6 }}>
            Adjust the sliders below to see how many hours of manual grading and administration your institution can reclaim with AI automation.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div
          className="rounded-4 landing-card shadow-lg border p-4 p-md-5 position-relative"
          style={{
            background: 'var(--home-card-bg)',
            borderColor: 'var(--home-border)'
          }}
        >
          <div className="row g-4 align-items-center">
            
            {/* Left: Interactive Sliders */}
            <div className="col-12 col-lg-6">
              
              {/* Slider 1: Teachers */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-semibold small text-uppercase" style={{ color: 'var(--home-heading)', letterSpacing: '0.04em' }}>
                    <i className="bi bi-person-badge me-1.5 text-primary"></i> Total Teachers / Faculty
                  </label>
                  <span className="badge bg-primary fs-6 px-3 py-1 rounded-pill fw-bold">
                    {teachers} Teachers
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range custom-roi-range"
                  min="5"
                  max="200"
                  step="5"
                  value={teachers}
                  onChange={(e) => setTeachers(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between small text-muted font-monospace mt-1" style={{ fontSize: '0.74rem' }}>
                  <span>5 faculty</span>
                  <span>100 faculty</span>
                  <span>200 faculty</span>
                </div>
              </div>

              {/* Slider 2: Students */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-semibold small text-uppercase" style={{ color: 'var(--home-heading)', letterSpacing: '0.04em' }}>
                    <i className="bi bi-people me-1.5 text-primary"></i> Total Enrolled Students
                  </label>
                  <span className="badge bg-primary fs-6 px-3 py-1 rounded-pill fw-bold">
                    {students.toLocaleString()} Students
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range custom-roi-range"
                  min="100"
                  max="5000"
                  step="50"
                  value={students}
                  onChange={(e) => setStudents(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between small text-muted font-monospace mt-1" style={{ fontSize: '0.74rem' }}>
                  <span>100 learners</span>
                  <span>2,500 learners</span>
                  <span>5,000 learners</span>
                </div>
              </div>

              <div className="p-3 rounded-3 border landing-inner-box">
                <div className="d-flex align-items-start gap-2 small text-muted">
                  <i className="bi bi-lightbulb-fill text-warning flex-shrink-0 mt-0.5"></i>
                  <span>
                    Mathematical model based on standard educational benchmarks: average 10–12 weekly hours spent by faculty on manual homework correction and lesson planning.
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Dynamic Output Metric Cards */}
            <div className="col-12 col-lg-6">
              <div className="row g-3">
                
                {/* Metric 1 */}
                <div className="col-12 col-sm-6">
                  <div className="p-3.5 rounded-3 h-100 border landing-inner-box">
                    <div className="text-muted small fw-semibold text-uppercase mb-1" style={{ fontSize: '0.72rem' }}>
                      Teacher Time Reclaimed
                    </div>
                    <div className="h2 fw-bold text-primary mb-1">
                      {facultyHoursSavedMonthly.toLocaleString()} <span className="fs-6 text-muted fw-normal">hrs/mo</span>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                      Saved from repetitive homework grading & manual question drafting.
                    </div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="col-12 col-sm-6">
                  <div className="p-3.5 rounded-3 h-100 border landing-inner-box">
                    <div className="text-muted small fw-semibold text-uppercase mb-1" style={{ fontSize: '0.72rem' }}>
                      Est. Annual Savings
                    </div>
                    <div className="h2 fw-bold text-success mb-1">
                      ${annualDollarSavings.toLocaleString()} <span className="fs-6 text-muted fw-normal">/yr</span>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                      Reclaimed administrative overhead and operational paperwork.
                    </div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="col-12 col-sm-6">
                  <div className="p-3.5 rounded-3 h-100 border landing-inner-box">
                    <div className="text-muted small fw-semibold text-uppercase mb-1" style={{ fontSize: '0.72rem' }}>
                      Instant Doubts Solved
                    </div>
                    <div className="h3 fw-bold mb-1" style={{ color: 'var(--home-heading)' }}>
                      {monthlyAiQueriesResolved.toLocaleString()} <span className="fs-6 text-muted fw-normal">/mo</span>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                      24/7 textbook-grounded answers without teacher backlog.
                    </div>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="col-12 col-sm-6">
                  <div className="p-3.5 rounded-3 h-100 border landing-inner-box">
                    <div className="text-muted small fw-semibold text-uppercase mb-1" style={{ fontSize: '0.72rem' }}>
                      Doubt Resolution Latency
                    </div>
                    <div className="h3 fw-bold text-info mb-1">
                      &lt; 1 Second
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                      Down from traditional 24-48 hour wait times.
                    </div>
                  </div>
                </div>

              </div>

              {/* Call to action */}
              <div className="mt-3.5 text-center text-sm-start d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 pt-2">
                <span className="small text-muted">Want a detailed audit for your campus?</span>
                <button
                  onClick={onOpenDemo}
                  className="btn btn-sm btn-primary fw-semibold px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                  style={{ borderRadius: '8px' }}
                >
                  <span>Request Custom ROI Report</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
