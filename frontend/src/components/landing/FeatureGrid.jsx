import React, { useState } from 'react'

export default function FeatureGrid() {
  const [activeCategory, setActiveCategory] = useState('all')

  const features = [
    { id: 1, category: 'admin', icon: 'bi-building-fill', title: 'Smart Campus Governance', desc: 'Centralized multi-campus administration, staff rosters, timetables, and department management with instant synchronization.', tag: 'Administration' },
    { id: 2, category: 'ai', icon: 'bi-robot', title: '24/7 AI Personal Tutor', desc: 'Conversational assistant explaining complex concepts, aiding with homework, and clarifying lectures with verified textbook citations.', tag: 'AI Assistant' },
    { id: 3, category: 'analytics', icon: 'bi-graph-up-arrow', title: 'Real-Time Academic Analytics', desc: 'Live student performance tracking, attendance metrics, grade distributions, and executive administrative insights.', tag: 'Analytics' },
    { id: 4, category: 'ai', icon: 'bi-journal-check', title: 'Automated AI Rubric Grading', desc: 'Assist teachers with instant assignment evaluation, objective rubric scoring, and personalized student feedback.', tag: 'Grading' },
    { id: 5, category: 'ai', icon: 'bi-search', title: 'Instant Document Knowledge Search', desc: 'Find answers across course syllabi, textbooks, and lecture slides in milliseconds with exact chapter citations.', tag: 'Search' },
    { id: 6, category: 'academics', icon: 'bi-journal-bookmark-fill', title: 'Curriculum & Course Hub', desc: 'Organize dynamic courses, structured lesson plans, online assignments, and digital study resources seamlessly.', tag: 'Academics' },
    { id: 7, category: 'security', icon: 'bi-shield-lock-fill', title: 'Institutional Privacy & Security', desc: 'Enterprise role-based permissions, automated audit logs, encrypted sensitive data, and secure session protection.', tag: 'Security' },
    { id: 8, category: 'admin', icon: 'bi-diagram-3-fill', title: 'Multi-Role Portals', desc: 'Dedicated, tailored workspaces for Principals, School Admins, Teachers, and Students with zero cross-contamination.', tag: 'Multi-Role' }
  ]

  const filtered = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory)

  return (
    <section className="landing-section" style={{ paddingTop: '44px', paddingBottom: '44px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            Platform Capabilities
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '2rem' }}>Everything Your School Needs to Excel</h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '620px', fontSize: '1rem', lineHeight: 1.5 }}>
            A modular, unified platform designed to elevate administration, empower teachers, and accelerate student learning.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {[
            { key: 'all', label: 'All Capabilities' },
            { key: 'admin', label: 'Administration' },
            { key: 'ai', label: 'AI & Learning Tools' },
            { key: 'academics', label: 'Academics & Courses' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'security', label: 'Security & Privacy' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`btn btn-sm rounded-pill px-3.5 py-1.5 transition-all ${activeCategory === cat.key ? 'btn-primary shadow-sm' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="row g-4">
          {filtered.map(f => (
            <div key={f.id} className="col-12 col-md-6 col-lg-4 animate-fade-up">
              <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between landing-card shadow-sm border">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary" 
                         style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
                      <i className={`bi ${f.icon}`}></i>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary">{f.tag}</span>
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ color: 'var(--text)' }}>{f.title}</h5>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
