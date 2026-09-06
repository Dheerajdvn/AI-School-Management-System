import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function TeacherPortalDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        myClasses: 5,
        totalStudents: 156,
        assignments: 8,
        attendanceToday: 94,
        pendingGrading: 23,
        aiRequests: 45,
        notifications: 7,
        upcomingClasses: [
          { id: 1, subject: 'Mathematics', class: '10-A', time: '8:00 AM', room: 'Room 101' },
          { id: 2, subject: 'Physics', class: '11-A', time: '10:00 AM', room: 'Lab A' },
          { id: 3, subject: 'Chemistry', class: '10-B', time: '11:30 AM', room: 'Lab B' },
        ],
        attendanceTrend: [85, 88, 92, 87, 90, 93, 89],
        assignmentCompletion: [65, 72, 68, 75, 70, 78, 82],
        studentPerformance: [72, 68, 75, 70, 73, 69, 76],
      })
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="tpd-page py-4">
        <div className="row g-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="col-md-2 col-sm-4">
              <div className="skeleton-card animate-pulse" style={{ height: '80px', background: 'var(--surface)', borderRadius: '16px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="tpd-page py-4">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-speedometer2 text-primary me-2" />Teacher Control Center
          </h4>
          <p className="text-muted small mb-0 font-medium">Overview of assigned courses, roster stats, and AI prompt volumes.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-layers-fill text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">My Classes</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.myClasses}</strong>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-people-fill text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">Total Students</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.totalStudents}</strong>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-card-text text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">Assignments</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.assignments}</strong>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-calendar-check-fill text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">Attendance Today</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.attendanceToday}%</strong>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-pencil-square text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">Pending Grading</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.pendingGrading} Submissions</strong>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-robot text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">AI Queries</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.aiRequests} Inquiries</strong>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="stat-card shadow-xs">
            <div className="stat-icon"><i className="bi bi-folder-fill text-primary" /></div>
            <div className="stat-content">
              <span className="stat-label">Study Materials</span>
              <strong className="stat-value" style={{ color: 'var(--text)' }}>{stats.studyMaterials} Uploads</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Bar Charts Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="chart-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                <i className="bi bi-calendar-check text-success me-2" />Attendance Trend
              </h5>
            </div>
            <div className="chart-body p-3">
              <div className="chart-container">
                {stats.attendanceTrend.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar green" style={{ height: `${val}%` }}>
                        <span className="chart-tooltip">{val}% Attendance</span>
                      </div>
                    </div>
                    <span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="chart-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                <i className="bi bi-card-text text-primary me-2" />Assignment Completion
              </h5>
            </div>
            <div className="chart-body p-3">
              <div className="chart-container">
                {stats.assignmentCompletion.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar blue" style={{ height: `${val}%` }}>
                        <span className="chart-tooltip">{val}% Complete</span>
                      </div>
                    </div>
                    <span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="chart-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                <i className="bi bi-graph-up text-warning me-2" />Student Performance
              </h5>
            </div>
            <div className="chart-body p-3">
              <div className="chart-container">
                {stats.studentPerformance.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar orange" style={{ height: `${val}%` }}>
                        <span className="chart-tooltip">{val}% Performance</span>
                      </div>
                    </div>
                    <span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Upcoming Classes */}
        <div className="col-md-6">
          <div className="glass-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-calendar-event text-success me-2" />Upcoming Classes
              </h5>
            </div>
            <div className="card-body p-0">
              {stats.upcomingClasses.map(cls => (
                <div key={cls.id} className="upcoming-class-item d-flex align-items-center justify-content-between p-3 border-bottom">
                  <div className="class-time small text-muted font-medium" style={{ minWidth: '100px' }}>
                    <i className="bi bi-clock me-1.5" />{cls.time}
                  </div>
                  <div className="class-info flex-grow-1 ms-3">
                    <strong className="d-block" style={{ color: 'var(--text)', fontSize: '13.5px' }}>{cls.subject}</strong>
                    <span className="text-muted small" style={{ fontSize: '11px' }}>Class {cls.class}</span>
                  </div>
                  <div className="class-room small text-muted font-medium">
                    <i className="bi bi-door-open me-1.5" />{cls.room}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions (SPA Router Link Enforced) */}
        <div className="col-md-6">
          <div className="glass-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-lightning-charge-fill text-warning me-2" />Quick Actions
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {[
                  { to: '/teacher/attendance', icon: 'bi-calendar-check', label: 'Mark Attendance', color: 'blue' },
                  { to: '/teacher/assignments', icon: 'bi-card-text', label: 'New Assignment', color: 'green' },
                  { to: '/teacher/lesson-planner', icon: 'bi-robot', label: 'AI Lesson Plan', color: 'purple' },
                  { to: '/teacher/quiz-generator', icon: 'bi-question-circle', label: 'Generate Quiz', color: 'orange' },
                ].map((action, i) => (
                  <div className="col-6" key={i}>
                    <Link to={action.to} className="quick-action-card">
                      <div className={`qa-icon ${action.color} shadow-xs`}>
                        <i className={`bi ${action.icon}`} />
                      </div>
                      <span className="font-semibold text-muted mt-2" style={{ fontSize: '12.5px' }}>{action.label}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{tpdStyles}</style>
    </div>
  )
}

const tpdStyles = `
.tpd-page .stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  gap: 1rem;
}
.tpd-page .stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
}
.tpd-page .stat-card.gradient-card.blue { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.01)); border-color: rgba(59,130,246,0.15); }
.tpd-page .stat-card.gradient-card.green { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.01)); border-color: rgba(16,185,129,0.15); }
.tpd-page .stat-card.gradient-card.orange { background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.01)); border-color: rgba(245,158,11,0.15); }
.tpd-page .stat-card.gradient-card.purple { background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.01)); border-color: rgba(139,92,246,0.15); }
.tpd-page .stat-card.gradient-card.red { background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.01)); border-color: rgba(239,68,68,0.15); }
.tpd-page .stat-card.gradient-card.cyan { background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.01)); border-color: rgba(6,182,212,0.15); }
.tpd-page .stat-card.gradient-card.teal { background: linear-gradient(135deg, rgba(13,148,136,0.1), rgba(13,148,136,0.01)); border-color: rgba(13,148,136,0.15); }

.tpd-page .stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  flex-shrink: 0;
}
.tpd-page .stat-content {
  display: flex;
  flex-direction: column;
}
.tpd-page .stat-label {
  font-size: 0.72rem;
  opacity: 0.65;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 2px;
  color: var(--text);
}
.tpd-page .stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
}

.tpd-page .chart-card, .tpd-page .glass-card {
  background: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.tpd-page .card-header-custom {
  border-bottom: 1px solid var(--border) !important;
}
.tpd-page .chart-container {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
}
.tpd-page .chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.tpd-page .chart-bar-track {
  width: 100%;
  height: calc(100% - 20px);
  background-color: var(--surface);
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border: 1px solid var(--border);
  overflow: visible;
}
.tpd-page .chart-bar {
  width: 100%;
  max-width: 18px;
  border-radius: 6px;
  position: relative;
  transition: height 0.5s ease;
  min-height: 4px;
}
.tpd-page .chart-bar.green { background: linear-gradient(to top, #059669, #34d399); box-shadow: 0 0 8px rgba(5,150,105,0.18); }
.tpd-page .chart-bar.blue { background: linear-gradient(to top, #2563eb, #60a5fa); box-shadow: 0 0 8px rgba(37,99,235,0.18); }
.tpd-page .chart-bar.orange { background: linear-gradient(to top, #d97706, #fbbf24); box-shadow: 0 0 8px rgba(217,119,6,0.18); }

.tpd-page .chart-tooltip {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
  z-index: 10;
  box-shadow: var(--shadow);
}
.tpd-page .chart-bar:hover {
  transform: scaleY(1.02);
}
.tpd-page .chart-bar:hover .chart-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}
.tpd-page .chart-label {
  font-size: 10px;
  margin-top: 6px;
  font-weight: 500;
  color: var(--muted);
}
.tpd-page .upcoming-class-item {
  border-bottom: 1px solid var(--border) !important;
}
.tpd-page .upcoming-class-item:last-child {
  border-bottom: none !important;
}
.tpd-page .upcoming-class-item:hover {
  background-color: var(--hover);
}
.tpd-page .quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  text-decoration: none !important;
  transition: all 0.25s ease;
  color: inherit;
}
.tpd-page .quick-action-card:hover {
  background: var(--hover);
  border-color: var(--primary);
  transform: translateY(-3px);
}
.tpd-page .qa-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 1px solid var(--border);
}
.tpd-page .qa-icon.blue { background: rgba(59,130,246,0.12); color: #60a5fa; }
.tpd-page .qa-icon.green { background: rgba(16,185,129,0.12); color: #34d399; }
.tpd-page .qa-icon.purple { background: rgba(139,92,246,0.12); color: #a78bfa; }
.tpd-page .qa-icon.orange { background: rgba(245,158,11,0.12); color: #fbbf24; }
`