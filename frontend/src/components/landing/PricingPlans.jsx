import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function PricingPlans({ onOpenDemo }) {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      id: 'starter',
      name: 'Starter Campus',
      badge: 'Small Academies',
      description: 'Ideal for specialized academies, tuition centers, and standalone coaching institutes.',
      monthlyPrice: 89,
      annualPrice: 71,
      popular: false,
      features: [
        'Up to 400 Enrolled Students',
        'Up to 25 Teacher & Staff Accounts',
        'Core SIS, Attendance & Timetables',
        'Basic AI Academic Tutor (2,000 queries/mo)',
        'AI Rubric Grading (100 submissions/mo)',
        'Standard Email & Community Support',
        'Isolated Data Architecture'
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaVariant: 'btn-secondary'
    },
    {
      id: 'pro',
      name: 'Pro Academy',
      badge: 'Most Popular',
      description: 'The complete AI-powered operating system for full K-12 schools and senior colleges.',
      monthlyPrice: 249,
      annualPrice: 199,
      popular: true,
      features: [
        'Up to 2,500 Active Students',
        'Unlimited Faculty & Staff Accounts',
        'Unlimited 24/7 AI RAG Textbook Tutor',
        'Unlimited Automated AI Rubric Grading',
        'Natural Language MCP Database Queries',
        'Dynamic pgvector Course Material Ingestion',
        'Multi-Role Dashboards (Admin, Teacher, Student)',
        'Priority 24/7 Support & Faculty Onboarding',
        'FERPA, GDPR & SOC-2 Security Logs'
      ],
      ctaText: 'Deploy Pro Campus',
      ctaVariant: 'btn-primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise District',
      badge: 'School Networks',
      description: 'Custom governance and dedicated vector infrastructure for multi-branch school networks.',
      monthlyPrice: 599,
      annualPrice: 479,
      popular: false,
      features: [
        'Unlimited Students Across Multi-Campus Branches',
        'Dedicated Enterprise Vector Pipeline & SLA',
        'Custom Fine-Tuned Curriculum AI Models',
        'On-Premise / Private VPC Deployment Option',
        'Direct Legacy SIS/ERP API Data Migration',
        '99.99% Uptime SLA Guarantee',
        'Dedicated Solutions Architect & Training'
      ],
      ctaText: 'Request Institutional Quote',
      ctaVariant: 'btn-secondary'
    }
  ]

  return (
    <section id="pricing" className="landing-section" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
      <div className="container" style={{ maxWidth: '1140px' }}>
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            <i className="bi bi-tag-fill me-1"></i> Transparent Pricing
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--home-heading, #F8F8FA)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Predictable Plans for Every Campus
          </h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '640px', fontSize: '1rem', lineHeight: 1.6 }}>
            No hidden per-query surprise fees. Transparent institutional tiers designed to scale as your student body grows.
          </p>

          {/* Billing Interval Toggle */}
          <div className="d-inline-flex align-items-center gap-3 p-1.5 rounded-pill border" style={{ background: 'var(--home-inner-bg)', borderColor: 'var(--home-border)' }}>
            <button
              onClick={() => setAnnual(false)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all ${!annual ? 'btn-primary shadow-xs' : 'btn-link text-muted text-decoration-none'}`}
              style={{ fontSize: '0.84rem' }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all d-inline-flex align-items-center gap-1.5 ${annual ? 'btn-primary shadow-xs' : 'btn-link text-muted text-decoration-none'}`}
              style={{ fontSize: '0.84rem' }}
            >
              <span>Annual Billing</span>
              <span className="badge bg-success text-white rounded-pill px-2 py-0.5 fw-bold" style={{ fontSize: '0.68rem' }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="row g-4 align-items-stretch">
          {plans.map((p) => {
            const price = annual ? p.annualPrice : p.monthlyPrice

            return (
              <div key={p.id} className="col-12 col-lg-4">
                <div
                  className={`p-4 p-xl-4.5 rounded-4 h-100 d-flex flex-column justify-content-between position-relative landing-card shadow-sm border ${
                    p.popular ? 'pricing-card-popular' : ''
                  }`}
                  style={{
                    background: 'var(--home-card-bg)',
                    borderColor: p.popular ? 'rgba(255, 255, 255, 0.45)' : 'var(--home-border)',
                    boxShadow: p.popular ? '0 16px 48px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.2)' : 'none'
                  }}
                >
                  {/* Top Popular Glow Tag */}
                  {p.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span className="badge bg-white text-dark px-3 py-1 rounded-pill shadow-xs fw-bold" style={{ fontSize: '0.74rem', letterSpacing: '0.04em' }}>
                        <i className="bi bi-stars me-1"></i> {p.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0" style={{ color: 'var(--home-heading)' }}>{p.name}</h5>
                      {!p.popular && (
                        <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.72rem' }}>
                          {p.badge}
                        </span>
                      )}
                    </div>

                    <p className="small text-muted mb-4" style={{ minHeight: '40px', lineHeight: 1.5 }}>
                      {p.description}
                    </p>

                    {/* Price Header */}
                    <div className="d-flex align-items-baseline gap-1.5 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--home-inner-border)' }}>
                      <span className="h1 fw-bold mb-0" style={{ color: 'var(--home-heading)' }}>
                        ${price}
                      </span>
                      <span className="text-muted small">
                        / month {annual ? <span className="text-success font-monospace">(billed annually)</span> : ''}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="list-unstyled mb-4 d-flex flex-column gap-2.5">
                      {p.features.map((feat, fIdx) => (
                        <li key={fIdx} className="d-flex align-items-start gap-2 small" style={{ color: 'var(--home-paragraph)', lineHeight: 1.5 }}>
                          <i className="bi bi-check2 text-primary fs-6 flex-shrink-0" style={{ marginTop: '-1px' }}></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card CTA */}
                  <button
                    onClick={onOpenDemo}
                    className={`btn ${p.ctaVariant} w-100 py-2.5 fw-semibold d-inline-flex align-items-center justify-content-center gap-2`}
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                  >
                    <span>{p.ctaText}</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>

                </div>
              </div>
            )
          })}
        </div>

        {/* Pre-Footer Institutional Callout */}
        <div
          className="mt-5 p-4 p-md-5 rounded-4 text-center border landing-card position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--home-card-bg)) 0%, color-mix(in srgb, #8B5CF6 8%, var(--home-card-bg)) 100%)',
            borderColor: 'var(--home-border)'
          }}
        >
          <h3 className="fw-bold mb-2" style={{ color: 'var(--home-heading)' }}>
            Ready to modernise your institution?
          </h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px', fontSize: '0.98rem' }}>
            Experience our full multi-role platform with pre-loaded demo accounts for Super Admin, Principal, Teacher, and Student.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              onClick={onOpenDemo}
              className="btn btn-primary px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
              style={{ borderRadius: '10px', fontSize: '0.92rem' }}
            >
              <i className="bi bi-play-circle-fill"></i>
              <span>Launch Interactive Demo</span>
            </button>
            <Link
              to="/login"
              className="btn btn-secondary px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
              style={{ borderRadius: '10px', fontSize: '0.92rem' }}
            >
              <span>Sign In to Your Campus</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
