import React, { useState } from 'react'

export default function RoleShowcase() {
  const [activeRole, setActiveRole] = useState('admin')

  const roles = {
    admin: {
      title: 'School Administrator & Leadership',
      subtitle: 'Multi-Campus Governance & SIS Operations',
      items: [
        'Centralized multi-campus faculty rosters, enrollment, and department management',
        'Live institutional telemetry, attendance rates, and academic performance analytics',
        'Granular role-based permissions, FERPA compliance, and automated audit logs'
      ],
      icon: 'bi-building-gear'
    },
    teacher: {
      title: 'Teachers & Faculty',
      subtitle: 'Lesson Planning, AI Grading & Course Hub',
      items: [
        '1-click AI generation of lesson plans, homework problem sets, and practice exams',
        'Fast automated rubric grading with personalized student improvement feedback',
        'Course syllabus, lecture slides, and study guide repository with instant search'
      ],
      icon: 'bi-journal-check'
    },
    student: {
      title: 'Students & Learners',
      subtitle: '24/7 AI Personal Tutor & Study Workspace',
      items: [
        '24/7 conversational tutor with verified textbook and syllabus page citations',
        'Instant assignment submission evaluation with objective rubric scoring',
        'Self-paced practice quizzes and progress analytics across all enrolled courses'
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
          <h2 className="fw-bold mb-2" style={{ color: 'var(--home-heading)', fontSize: '2rem' }}>Tailored Experiences for Every Role</h2>
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
            <div className="bento-icon-badge" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
              <i className={`bi ${current.icon}`}></i>
            </div>
            <div>
              <h4 className="fw-bold mb-1" style={{ color: 'var(--home-heading)' }}>{current.title}</h4>
              <span className="small text-muted fw-medium">{current.subtitle}</span>
            </div>
          </div>

          <div className="row g-3">
            {current.items.map((item, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-3.5 rounded-3 h-100 d-flex align-items-start gap-2.5 landing-inner-box">
                  <i className="bi bi-check-circle-fill text-primary mt-1 flex-shrink-0"></i>
                  <span className="small fw-medium" style={{ color: 'var(--home-heading)', lineHeight: 1.55 }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
