import React, { useState } from 'react'

export default function RoleShowcase() {
  const [activeRole, setActiveRole] = useState('admin')

  const roles = {
    admin: {
      title: 'School Administrator & Leadership',
      subtitle: 'Centralized Multi-Campus Oversight & Governance',
      items: [
        'Manage academic departments, faculty rosters, and student enrollment records',
        'Monitor live campus telemetry, enrollment growth, and institutional performance metrics',
        'Configure system-wide academic calendars, roles, and administrative security logs',
        'Publish institutional handbooks, policies, and school-wide curriculum libraries'
      ],
      icon: 'bi-building-gear'
    },
    teacher: {
      title: 'Teachers & Faculty',
      subtitle: 'Course Management, AI Lesson Planning & Smart Grading',
      items: [
        'Create and organize interactive courses, class timetables, and assignment modules',
        'Use AI to generate lesson plans, homework problem sets, and practice exams',
        'Grade student submissions quickly with objective rubric scoring and personalized feedback',
        'Upload course syllabi, lecture slides, and study guides for student instant search'
      ],
      icon: 'bi-journal-check'
    },
    student: {
      title: 'Students & Learners',
      subtitle: '24/7 AI Personal Tutor & Interactive Learning Portal',
      items: [
        'Ask the AI Tutor questions about course materials with verified textbook citations',
        'Submit assignments online and receive immediate structured rubric feedback',
        'Take self-paced practice quizzes and track academic progress analytics over time',
        'Access all course syllabi, assignment deadlines, and campus announcements in one place'
      ],
      icon: 'bi-mortarboard-fill'
    }
  }

  const current = roles[activeRole]

  return (
    <section className="landing-section" style={{ paddingTop: '44px', paddingBottom: '44px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div className="text-center mb-4">
          <span className="badge bg-primary-subtle text-primary px-3 py-1.5 mb-2 rounded-pill fw-semibold">
            Role-Based Portals
          </span>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text)', fontSize: '2rem' }}>Tailored Experiences for Every Role</h2>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: 1.5 }}>
            Dedicated portals tailored specifically for administrative leadership, classroom teachers, and student learners.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {[
            { key: 'admin', label: 'School Admin / Principal', icon: 'bi-shield-shaded' },
            { key: 'teacher', label: 'Teacher Portal', icon: 'bi-person-workspace' },
            { key: 'student', label: 'Student Portal', icon: 'bi-mortarboard' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveRole(tab.key)}
              className={`btn ${activeRole === tab.key ? 'btn-primary shadow-sm' : 'btn-secondary'} px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 rounded-pill`}
              style={{ fontSize: '0.88rem' }}
            >
              <i className={`bi ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Role Content Card */}
        <div className="p-4 p-md-5 rounded-4 animate-role-content landing-card shadow-md border">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary" 
                 style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}>
              <i className={`bi ${current.icon}`}></i>
            </div>
            <div>
              <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>{current.title}</h4>
              <span className="small text-muted fw-medium">{current.subtitle}</span>
            </div>
          </div>

          <div className="row g-3">
            {current.items.map((item, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-3.5 rounded-3 h-100 d-flex align-items-start gap-2.5 bg-card border">
                  <i className="bi bi-check-circle-fill text-primary mt-1 flex-shrink-0"></i>
                  <span className="small fw-medium" style={{ color: 'var(--text)', lineHeight: 1.55 }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
