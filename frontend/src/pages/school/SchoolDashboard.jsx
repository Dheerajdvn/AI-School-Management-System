import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingIndicator from '../../components/LoadingIndicator'

/**
 * School Admin Dashboard - Overview of the school's data and metrics
 * Role: ROLE_SCHOOL_ADMIN
 * Redesigned with premium OpenAI/Stripe aesthetics, dynamic greeting, SPA routing, custom reactive charts, and full theme adaptability.
 */
export default function SchoolDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // Format current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('en-US', options))

    const timer = setTimeout(() => {
      setStats({
        totalStudents: 1250,
        totalTeachers: 68,
        totalClasses: 32,
        totalSubjects: 45,
        attendanceToday: 92,
        assignments: 24,
        aiRequests: 187,
        storageUsed: '2.4 GB',
        recentActivity: [
          { id: 1, action: 'New student enrolled: Sarah Johnson', time: '5 min ago', type: 'student' },
          { id: 2, action: 'Teacher profile updated: Mr. David Lee', time: '12 min ago', type: 'teacher' },
          { id: 3, action: 'Class 10-A timetable modified', time: '1 hr ago', type: 'timetable' },
          { id: 4, action: 'New announcement: Parent-Teacher Meeting', time: '2 hrs ago', type: 'announcement' },
          { id: 5, action: 'Subject added: Advanced Mathematics', time: '3 hrs ago', type: 'subject' },
        ],
        upcomingEvents: [
          { id: 1, title: 'Parent-Teacher Meeting', date: '2026-07-25', type: 'meeting' },
          { id: 2, title: 'Science Exhibition', date: '2026-08-05', type: 'event' },
          { id: 3, title: 'Mid-Term Exams Start', date: '2026-08-15', type: 'exam' },
          { id: 4, title: 'Sports Day', date: '2026-08-28', type: 'event' },
        ],
        studentGrowth: [120, 135, 150, 180, 210, 250, 280, 320, 380, 420, 480, 520],
        attendanceData: [85, 88, 92, 87, 90, 93, 89, 91, 94, 88, 92, 90],
        assignmentData: [15, 18, 22, 20, 25, 28, 30, 26, 32, 35, 38, 42],
      })
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="school-dashboard py-4">
        <div className="dashboard-skeleton">
          <div className="skeleton-header mb-4" style={{ height: '40px', width: '300px', background: 'var(--surface)', borderRadius: '8px' }} />
          <div className="row g-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-md-3 col-sm-6">
                <div className="skeleton-card">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-value" />
                  <div className="skeleton-line skeleton-subtitle" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{dashboardStyles}</style>
      </div>
    )
  }

  return (
    <div className="school-dashboard py-4">
      {/* Header with Greeting & Date */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <span>Welcome back, Admin 👋</span>
          </h4>
          <p className="text-muted small mb-0">{currentDate}</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-success bg-opacity-15 text-success border border-success border-opacity-35 px-3 py-1.5 fw-semibold small d-flex align-items-center gap-1.5">
            <span className="pulse-indicator bg-success" /> System Status: Optimal
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="row g-3 mb-4.5">
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-people-fill text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{stats.totalStudents}</span>
              <span className="stat-change up">+12% this year</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-person-badge-fill text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Teachers</span>
              <span className="stat-value">{stats.totalTeachers}</span>
              <span className="stat-change up">+4 new this month</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-layers-fill text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Classes</span>
              <span className="stat-value">{stats.totalClasses}</span>
              <span className="stat-change up">{stats.totalSubjects} Subjects</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-calendar-check-fill text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Attendance Today</span>
              <span className="stat-value">{stats.attendanceToday}%</span>
              <span className="stat-change up">+2% vs yesterday</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-card-text text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Assignments</span>
              <span className="stat-value">{stats.assignments}</span>
              <span className="stat-change">Active this week</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-robot text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">AI Queries</span>
              <span className="stat-value">{stats.aiRequests}</span>
              <span className="stat-change up">+18% usage</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-hdd-stack-fill text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Storage Used</span>
              <span className="stat-value">{stats.storageUsed}</span>
              <span className="stat-change">45% of 5 GB</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card shadow-xs">
            <div className="stat-icon">
              <i className="bi bi-graph-up-arrow text-primary" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Growth Rate</span>
              <span className="stat-value">+15%</span>
              <span className="stat-change up">Year over year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Bar Charts Section */}
      <div className="row g-4 mb-4.5">
        <div className="col-lg-4 col-md-6">
          <div className="chart-card">
            <div className="card-header-custom">
              <h6 className="mb-0"><i className="bi bi-graph-up text-primary me-2" />Student Growth</h6>
              <span className="badge rounded-pill px-2.5 py-1" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.2)' }}>Monthly</span>
            </div>
            <div className="chart-body">
              <div className="chart-container">
                {stats.studentGrowth.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar blue" style={{ height: `${(val / 520) * 100}%` }}>
                        <span className="chart-tooltip">{val} Students</span>
                      </div>
                    </div>
                    <span className="chart-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="chart-card">
            <div className="card-header-custom">
              <h6 className="mb-0"><i className="bi bi-calendar-check text-success me-2" />Attendance</h6>
              <span className="badge rounded-pill px-2.5 py-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>This Year</span>
            </div>
            <div className="chart-body">
              <div className="chart-container">
                {stats.attendanceData.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar green" style={{ height: `${val}%` }}>
                        <span className="chart-tooltip">{val}% Attendance</span>
                      </div>
                    </div>
                    <span className="chart-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="chart-card">
            <div className="card-header-custom">
              <h6 className="mb-0"><i className="bi bi-card-text text-warning me-2" />Assignments</h6>
              <span className="badge rounded-pill px-2.5 py-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' }}>Monthly</span>
            </div>
            <div className="chart-body">
              <div className="chart-container">
                {stats.assignmentData.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar orange" style={{ height: `${(val / 42) * 100}%` }}>
                        <span className="chart-tooltip">{val} Tasks</span>
                      </div>
                    </div>
                    <span className="chart-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity and Events split row */}
      <div className="row g-4 mb-4.5">
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom">
              <h6 className="mb-0"><i className="bi bi-activity text-primary me-2" />Recent Activities</h6>
            </div>
            <div className="card-body p-0">
              <div className="activity-list">
                {stats.recentActivity.map((item) => (
                  <div key={item.id} className="activity-item d-flex align-items-center">
                    <div className={`activity-icon ${item.type} shadow-sm`}>
                      <i className={`bi bi-${item.type === 'student' ? 'person-plus-fill' : item.type === 'teacher' ? 'person-badge-fill' : item.type === 'timetable' ? 'calendar-week-fill' : item.type === 'announcement' ? 'megaphone-fill' : 'book-fill'}`} />
                    </div>
                    <div className="activity-content ms-3">
                      <p className="activity-text fw-medium mb-0" style={{ color: 'var(--text)' }}>{item.action}</p>
                      <span className="activity-time text-muted small">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom">
              <h6 className="mb-0"><i className="bi bi-calendar-event text-success me-2" />Upcoming Events</h6>
            </div>
            <div className="card-body p-0">
              <div className="event-list">
                {stats.upcomingEvents.map((event) => (
                  <div key={event.id} className="event-item d-flex align-items-center">
                    <div className={`event-date-badge ${event.type} d-flex flex-column align-items-center justify-content-center`}>
                      <span className="event-day fw-bold" style={{ color: 'var(--text)' }}>{new Date(event.date).getDate()}</span>
                      <span className="event-month text-uppercase text-muted" style={{ fontSize: '9px' }}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date(event.date).getMonth()]}</span>
                    </div>
                    <div className="event-content ms-3">
                      <h6 className="fw-semibold mb-1" style={{ color: 'var(--text)' }}>{event.title}</h6>
                      <span className="event-type badge text-uppercase rounded-pill" style={{ 
                        fontSize: '9px',
                        letterSpacing: '0.05em',
                        backgroundColor: event.type === 'meeting' ? 'rgba(59, 130, 246, 0.12)' : event.type === 'exam' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        color: event.type === 'meeting' ? '#60a5fa' : event.type === 'exam' ? '#f87171' : '#34d399',
                        padding: '4px 8px'
                      }}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Router Link Enforced) */}
      <div className="glass-card">
        <div className="card-header-custom">
          <h6 className="mb-0"><i className="bi bi-lightning-charge-fill text-warning me-2" />Quick Actions</h6>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <Link to="/school/students" className="quick-action-card d-block">
                <div className="qa-icon blue"><i className="bi bi-person-plus-fill" /></div>
                <span className="font-medium d-block mt-2" style={{ color: 'var(--text)' }}>Add Student</span>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/school/teachers" className="quick-action-card d-block">
                <div className="qa-icon green"><i className="bi bi-person-badge-fill" /></div>
                <span className="font-medium d-block mt-2" style={{ color: 'var(--text)' }}>Add Teacher</span>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/school/announcements" className="quick-action-card d-block">
                <div className="qa-icon orange"><i className="bi bi-megaphone-fill" /></div>
                <span className="font-medium d-block mt-2" style={{ color: 'var(--text)' }}>New Announcement</span>
              </Link>
            </div>
            <div className="col-md-3 col-6">
              <Link to="/school/timetable" className="quick-action-card d-block">
                <div className="qa-icon purple"><i className="bi bi-calendar-week-fill" /></div>
                <span className="font-medium d-block mt-2" style={{ color: 'var(--text)' }}>Manage Timetable</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{dashboardStyles}</style>
    </div>
  )
}

const dashboardStyles = `
.school-dashboard .stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 1rem;
}
.school-dashboard .stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: var(--shadow-lg);
}
.school-dashboard .stat-card.gradient-card.blue { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.01)); border-color: rgba(59,130,246,0.15); }
.school-dashboard .stat-card.gradient-card.green { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.01)); border-color: rgba(16,185,129,0.15); }
.school-dashboard .stat-card.gradient-card.orange { background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.01)); border-color: rgba(245,158,11,0.15); }
.school-dashboard .stat-card.gradient-card.purple { background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.01)); border-color: rgba(139,92,246,0.15); }
.school-dashboard .stat-card.gradient-card.red { background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.01)); border-color: rgba(239,68,68,0.15); }
.school-dashboard .stat-card.gradient-card.cyan { background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.01)); border-color: rgba(6,182,212,0.15); }
.school-dashboard .stat-card.gradient-card.teal { background: linear-gradient(135deg, rgba(13,148,136,0.1), rgba(13,148,136,0.01)); border-color: rgba(13,148,136,0.15); }
.school-dashboard .stat-card.gradient-card.pink { background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.01)); border-color: rgba(236,72,153,0.15); }

.school-dashboard .stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  flex-shrink: 0;
}
.school-dashboard .stat-content {
  display: flex;
  flex-direction: column;
}
.school-dashboard .stat-label {
  font-size: 0.72rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 2px;
  color: var(--text);
}
.school-dashboard .stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
}
.school-dashboard .stat-change {
  font-size: 0.72rem;
  opacity: 0.7;
  color: var(--muted);
}
.school-dashboard .stat-change.up { color: #10b981; }

.school-dashboard .chart-card, .school-dashboard .glass-card {
  background: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.school-dashboard .card-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.4rem;
  border-bottom: 1px solid var(--border);
}
.school-dashboard .card-header-custom h6 {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--text);
}
.school-dashboard .chart-body { padding: 1.5rem 1.25rem 1.25rem 1.25rem; }
.school-dashboard .chart-container {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
}
.school-dashboard .chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.school-dashboard .chart-bar-track {
  width: 100%;
  height: calc(100% - 20px);
  background-color: var(--surface);
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
  border: 1px solid var(--border);
}
.school-dashboard .chart-bar {
  width: 100%;
  max-width: 18px;
  border-radius: 6px;
  position: relative;
  transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 4px;
}
.school-dashboard .chart-bar.blue { background: linear-gradient(to top, #4f46e5, #818cf8); box-shadow: 0 0 12px rgba(79, 70, 229, 0.2); }
.school-dashboard .chart-bar.green { background: linear-gradient(to top, #059669, #34d399); box-shadow: 0 0 12px rgba(5, 150, 105, 0.2); }
.school-dashboard .chart-bar.orange { background: linear-gradient(to top, #d97706, #fbbf24); box-shadow: 0 0 12px rgba(217, 119, 6, 0.2); }

.school-dashboard .chart-tooltip {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.68rem;
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
.school-dashboard .chart-bar:hover {
  transform: scaleY(1.03);
}
.school-dashboard .chart-bar:hover .chart-tooltip { 
  opacity: 1; 
  transform: translateX(-50%) translateY(-2px);
}
.school-dashboard .chart-label {
  font-size: 0.65rem;
  margin-top: 6px;
  font-weight: 500;
  color: var(--muted);
}

.school-dashboard .activity-item {
  padding: 1rem 1.4rem;
  border-bottom: 1px solid var(--border);
}
.school-dashboard .activity-item:last-child { border-bottom: none; }
.school-dashboard .activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
  border: 1px solid var(--border);
}
.school-dashboard .activity-icon.student { background: rgba(59,130,246,0.12); color: #60a5fa; }
.school-dashboard .activity-icon.teacher { background: rgba(16,185,129,0.12); color: #34d399; }
.school-dashboard .activity-icon.timetable { background: rgba(245,158,11,0.12); color: #fbbf24; }
.school-dashboard .activity-icon.announcement { background: rgba(139,92,246,0.12); color: #a78bfa; }
.school-dashboard .activity-icon.subject { background: rgba(6,182,212,0.12); color: #22d3ee; }

.school-dashboard .event-item {
  padding: 1rem 1.4rem;
  border-bottom: 1px solid var(--border);
}
.school-dashboard .event-item:last-child { border-bottom: none; }
.school-dashboard .event-date-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
  border: 1px solid var(--border);
}
.school-dashboard .event-date-badge.meeting { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.15); }
.school-dashboard .event-date-badge.event { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.15); }
.school-dashboard .event-date-badge.exam { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.15); }
.school-dashboard .event-day {
  font-size: 1.15rem;
  line-height: 1;
}
.school-dashboard .event-month {
  font-size: 0.58rem;
  letter-spacing: 0.5px;
}

.school-dashboard .quick-action-card {
  text-align: center;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  text-decoration: none !important;
  transition: all 0.25s ease;
}
.school-dashboard .quick-action-card:hover {
  background: var(--hover);
  border-color: var(--primary);
  transform: translateY(-3px);
}
.school-dashboard .quick-action-card span {
  font-size: 0.85rem;
}
.school-dashboard .qa-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin: 0 auto;
  border: 1px solid var(--border);
}
.school-dashboard .qa-icon.blue { background: rgba(59,130,246,0.12); color: #60a5fa; }
.school-dashboard .qa-icon.green { background: rgba(16,185,129,0.12); color: #34d399; }
.school-dashboard .qa-icon.orange { background: rgba(245,158,11,0.12); color: #fbbf24; }
.school-dashboard .qa-icon.purple { background: rgba(139,92,246,0.12); color: #a78bfa; }

.school-dashboard .skeleton-card {
  padding: 1.25rem;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
}
.school-dashboard .skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: var(--border);
  margin-bottom: 8px;
  animation: pulse 1.5s infinite;
}
.school-dashboard .skeleton-title { width: 60%; }
.school-dashboard .skeleton-value { width: 40%; height: 24px; }
.school-dashboard .skeleton-subtitle { width: 80%; }

.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}
.pulse-indicator::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  background: inherit;
  animation: ripple 1.6s infinite ease-out;
}
@keyframes ripple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.8); opacity: 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
`