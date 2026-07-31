import React, { useState } from 'react'

export default function FeatureGrid() {
  const [activeCategory, setActiveCategory] = useState('all')

  const features = [
    { id: 1, category: 'admin', icon: 'bi-building-fill', title: 'Smart School Governance', desc: 'Manage multi-campus school administration, staff rosters, timetables, and departments with instant sync.', tag: 'Core Admin' },
    { id: 2, category: 'ai', icon: 'bi-robot', title: '24/7 AI Tutor & Assistant', desc: 'Conversational assistant answering student queries, explaining complex concepts, and aiding homework with verified citations.', tag: 'Generative AI' },
    { id: 3, category: 'analytics', icon: 'bi-graph-up-arrow', title: 'Analytics & Telemetry', desc: 'Real-time telemetry, enrollment statistics, grade distributions, and executive dashboard metrics.', tag: 'Analytics' },
    { id: 4, category: 'ai', icon: 'bi-journal-check', title: 'Automated AI Rubric Grading', desc: 'AI-assisted assignment grading, rubric scoring, and structured feedback generation for student submissions.', tag: 'Automation' },
    { id: 5, category: 'ai', icon: 'bi-search', title: 'RAG Document Vector Search', desc: 'Instant semantic search across uploaded course syllabi, textbooks, and notes powered by Qdrant vector DB.', tag: 'RAG Search' },
    { id: 6, category: 'academics', icon: 'bi-journal-bookmark-fill', title: 'Curriculum & Course Hub', desc: 'Organize courses, structured lesson plans, assignments, and digital study materials seamlessly.', tag: 'Academics' },
    { id: 7, category: 'security', icon: 'bi-shield-lock-fill', title: 'RBAC & Sensitive Data Protection', desc: 'Role-based access control, AES field encryption for provider keys, and token-based session handling with refresh support.', tag: 'Security' },
    { id: 8, category: 'admin', icon: 'bi-diagram-3-fill', title: 'Multi-Tenant Architecture', desc: 'Isolated data access and permission boundaries for School Admins, Teachers, Students, and Principals.', tag: 'Multi-Tenant' }
  ]

  const filtered = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory)

  return (
    <section className="landing-section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div className="text-center mb-3">
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '1.9rem' }}>Built for Complete Academic Operations</h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '600px', fontSize: '0.95rem', lineHeight: 1.5 }}>
            A modular feature set designed for administrators, teachers, and students.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-3.5" style={{ marginBottom: '20px' }}>
          {[
            { key: 'all', label: 'All Capabilities' },
            { key: 'admin', label: 'Administration' },
            { key: 'ai', label: 'AI & RAG Services' },
            { key: 'academics', label: 'Academics' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'security', label: 'Security' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`btn btn-sm rounded-pill px-3.5 ${activeCategory === cat.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ height: '34px', borderRadius: '10px', fontSize: '0.82rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="row g-4">
          {filtered.map(f => (
            <div key={f.id} className="col-12 col-md-6 col-lg-4 animate-fade-up">
              <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between landing-card">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary" 
                         style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                      <i className={`bi ${f.icon}`}></i>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary">{f.tag}</span>
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ color: '#FAFAF9' }}>{f.title}</h5>
                  <p className="small text-muted mb-0" style={{ color: '#A8A29E', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
