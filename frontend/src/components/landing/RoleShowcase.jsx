import React, { useState } from 'react'

export default function RoleShowcase() {
  const [activeRole, setActiveRole] = useState('admin')

  const roles = {
    admin: {
      title: 'School Administrator & Principal',
      subtitle: 'Centralized Multi-Campus Oversight & Governance',
      items: [
        'Manage departments, staff rosters, and student enrollment records',
        'Monitor active student stats, enrollment trends, and school performance telemetry',
        'Configure system settings, RBAC roles, and security audit logs',
        'Upload school-wide handbooks and policies to the RAG knowledge base'
      ],
      icon: 'bi-building-gear'
    },
    teacher: {
      title: 'Teachers & Instructors',
      subtitle: 'Course Management, AI Lesson Planning & Grading',
      items: [
        'Create and manage courses, section timetables, and assignments',
        'Use AI to generate lesson plans, quizzes, and practice exams',
        'Grade student assignment submissions with automated AI rubric feedback',
        'Upload subject syllabi and textbook materials for student RAG search'
      ],
      icon: 'bi-journal-check'
    },
    student: {
      title: 'Students & Learners',
      subtitle: '24/7 AI Tutor & Interactive Study Hub',
      items: [
        'Ask the AI Tutor questions about course materials with verified page citations',
        'Submit assignment homework and review structured rubric feedback',
        'Take adaptive practice quizzes and track academic progress analytics',
        'Access course syllabi, calendars, and announcements'
      ],
      icon: 'bi-mortarboard-fill'
    }
  }

  const current = roles[activeRole]

  return (
    <section className="landing-section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="text-center mb-3" style={{ marginBottom: '20px' }}>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '1.9rem' }}>Tailored Experiences for Every Role</h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '580px', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Multi-tenant role-based access control (RBAC) ensures each user gets exact tools.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          {[
            { key: 'admin', label: 'School Admin / Principal', icon: 'bi-shield-shaded' },
            { key: 'teacher', label: 'Teacher Portal', icon: 'bi-person-workspace' },
            { key: 'student', label: 'Student Portal', icon: 'bi-mortarboard' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveRole(tab.key)}
              className={`btn ${activeRole === tab.key ? 'btn-primary' : 'btn-secondary'} px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2`}
            >
              <i className={`bi ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Role Content Card */}
        <div className="p-4 rounded-4 animate-role-content landing-card">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary" 
                 style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
              <i className={`bi ${current.icon}`}></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0" style={{ color: '#F8F8FA' }}>{current.title}</h4>
              <span className="small text-muted" style={{ color: '#707784' }}>{current.subtitle}</span>
            </div>
          </div>

          <div className="row g-3 mt-2">
            {current.items.map((item, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-3 rounded-3 h-100 d-flex align-items-start gap-2" 
                     style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <i className="bi bi-check-circle-fill text-primary mt-1"></i>
                  <span className="small fw-medium" style={{ color: '#F8F8FA', lineHeight: 1.5 }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
