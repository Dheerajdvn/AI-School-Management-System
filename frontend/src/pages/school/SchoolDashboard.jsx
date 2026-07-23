import React, { useState, useEffect } from 'react'
import LoadingIndicator from '../../components/LoadingIndicator'

/**
 * School Admin Dashboard - Overview of the school's data and metrics
 * Role: ROLE_SCHOOL_ADMIN
 */
export default function SchoolDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
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
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="dashboard-skeleton">
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
    )
  }

  return (
    <div className="school-dashboard">
      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card blue">
            <div className="stat-icon">
              <i className="bi bi-people-fill" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{stats.totalStudents}</span>
              <span className="stat-change up">+12% this year</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card green">
            <div className="stat-icon">
              <i className="bi bi-person-badge-fill" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Teachers</span>
              <span className="stat-value">{stats.totalTeachers}</span>
              <span className="stat-change up">+4 new this month</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card orange">
            <div className="stat-icon">
              <i className="bi bi-layers-fill" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Classes</span>
              <span className="stat-value">{stats.totalClasses}</span>
              <span className="stat-change up">{stats.totalSubjects} Subjects</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card purple">
            <div className="stat-icon">
              <i className="bi bi-calendar-check-fill" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Attendance Today</span>
              <span className="stat-value">{stats.attendanceToday}%</span>
              <span className="stat-change up">+2% vs yesterday</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card red">
            <div className="stat-icon">
              <i className="bi bi-card-text" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Assignments</span>
              <span className="stat-value">{stats.assignments}</span>
              <span className="stat-change">Active this week</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card cyan">
            <div className="stat-icon">
              <i className="bi bi-robot" />
            </div>
            <div className="stat-content">
              <span className="stat-label">AI Requests Today</span>
              <span className="stat-value">{stats.aiRequests}</span>
              <span className="stat-change up">+18% usage</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card teal">
            <div className="stat-icon">
              <i className="bi bi-hdd-stack-fill" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Storage Used</span>
              <span className="stat-value">{stats.storageUsed}</span>
              <span className="stat-change">45% of 5 GB</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stat-card gradient-card pink">
            <div className="stat-icon">
              <i className="bi bi-graph-up-arrow" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Growth Rate</span>
              <span className="stat-value">+15%</span>
              <span className="stat-change up">Year over year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom">
              <h5><i className="bi bi-graph-up me-2" />Student Growth</h5>
              <span className="badge bg-primary">Monthly</span>
            </div>
            <div className="chart-body">
              <div className="chart-container">
                {stats.studentGrowth.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar blue" style={{ height: `${(val / 520) * 100}%` }}>
                      <span className="chart-tooltip">{val}</span>
                    </div>
                    <span className="chart-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom">
              <h5><i className="bi bi-calendar-check me-2" />Attendance</h5>
              <span className="badge bg-success">This Year</span>
            </div>
            <div className="chart-body">
              <div className="chart-container">
                {stats.attendanceData.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar green" style={{ height: `${val}%` }}>
                      <span className="chart-tooltip">{val}%</span>
                    </div>
                    <span className="chart-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom">
              <h5><i className="bi bi-card-text me-2" />Assignments</h5>
              <span className="badge bg-warning text-dark">Monthly</span>
            </div>
            <div className="chart-body">
              <div className="chart-container">
                {stats.assignmentData.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar orange" style={{ height: `${(val / 42) * 100}%` }}>
                      <span className="chart-tooltip">{val}</span>
                    </div>
                    <span className="chart-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity and Events Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom">
              <h5><i className="bi bi-activity me-2" />Recent Activity</h5>
            </div>
            <div className="card-body p-0">
              <div className="activity-list">
                {stats.recentActivity.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className={`activity-icon ${item.type}`}>
                      <i className={`bi bi-${item.type === 'student' ? 'person-plus' : item.type === 'teacher' ? 'person-badge' : item.type === 'timetable' ? 'calendar-week' : item.type === 'announcement' ? 'megaphone' : 'book'}`} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{item.action}</p>
                      <span className="activity-time">{item.time}</span>
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
              <h5><i className="bi bi-calendar-event me-2" />Upcoming Events</h5>
            </div>
            <div className="card-body p-0">
              <div className="event-list">
                {stats.upcomingEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className={`event-date-badge ${event.type}`}>
                      <span className="event-day">{new Date(event.date).getDate()}</span>
                      <span className="event-month">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date(event.date).getMonth()]}</span>
                    </div>
                    <div className="event-content">
                      <h6>{event.title}</h6>
                      <span className="event-type">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card">
        <div className="card-header-custom">
          <h5><i className="bi bi-lightning-charge-fill me-2" />Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <a href="/school/students" className="quick-action-card">
                <div className="qa-icon blue"><i className="bi bi-person-plus-fill" /></div>
                <span>Add Student</span>
              </a>
            </div>
            <div className="col-md-3 col-6">
              <a href="/school/teachers" className="quick-action-card">
                <div className="qa-icon green"><i className="bi bi-person-badge" /></div>
                <span>Add Teacher</span>
              </a>
            </div>
            <div className="col-md-3 col-6">
              <a href="/school/announcements" className="quick-action-card">
                <div className="qa-icon orange"><i className="bi bi-megaphone-fill" /></div>
                <span>New Announcement</span>
              </a>
            </div>
            <div className="col-md-3 col-6">
              <a href="/school/timetable" className="quick-action-card">
                <div className="qa-icon purple"><i className="bi bi-calendar-week-fill" /></div>
                <span>Manage Timetable</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .school-dashboard .stat-card {
          display: flex;
          align-items: center;
          padding: 1.25rem;
          border-radius: 16px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          gap: 1rem;
        }
        .school-dashboard .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        .school-dashboard .stat-card.gradient-card.blue { background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1)); border-color: rgba(59,130,246,0.3); }
        .school-dashboard .stat-card.gradient-card.green { background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1)); border-color: rgba(16,185,129,0.3); }
        .school-dashboard .stat-card.gradient-card.orange { background: linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1)); border-color: rgba(245,158,11,0.3); }
        .school-dashboard .stat-card.gradient-card.purple { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1)); border-color: rgba(139,92,246,0.3); }
        .school-dashboard .stat-card.gradient-card.red { background: linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1)); border-color: rgba(239,68,68,0.3); }
        .school-dashboard .stat-card.gradient-card.cyan { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.1)); border-color: rgba(6,182,212,0.3); }
        .school-dashboard .stat-card.gradient-card.teal { background: linear-gradient(135deg, rgba(13,148,136,0.3), rgba(13,148,136,0.1)); border-color: rgba(13,148,136,0.3); }
        .school-dashboard .stat-card.gradient-card.pink { background: linear-gradient(135deg, rgba(236,72,153,0.3), rgba(236,72,153,0.1)); border-color: rgba(236,72,153,0.3); }
        .school-dashboard .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .school-dashboard .stat-content {
          display: flex;
          flex-direction: column;
        }
        .school-dashboard .stat-label {
          font-size: 0.8rem;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .school-dashboard .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .school-dashboard .stat-change {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        .school-dashboard .stat-change.up { color: #10b981; }
        .school-dashboard .chart-card, .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
        }
        .school-dashboard .card-header-custom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .school-dashboard .card-header-custom h5 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .school-dashboard .chart-body { padding: 1.25rem; }
        .school-dashboard .chart-container {
          display: flex;
          align-items: flex-end;
          gap: 4px;
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
        .school-dashboard .chart-bar {
          width: 100%;
          max-width: 28px;
          border-radius: 4px 4px 0 0;
          position: relative;
          transition: height 0.5s ease;
          min-height: 4px;
        }
        .school-dashboard .chart-bar.blue { background: linear-gradient(to top, #3b82f6, #60a5fa); }
        .school-dashboard .chart-bar.green { background: linear-gradient(to top, #10b981, #34d399); }
        .school-dashboard .chart-bar.orange { background: linear-gradient(to top, #f59e0b, #fbbf24); }
        .school-dashboard .chart-tooltip {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.65rem;
          background: rgba(0,0,0,0.8);
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .school-dashboard .chart-bar:hover .chart-tooltip { opacity: 1; }
        .school-dashboard .chart-label {
          font-size: 0.6rem;
          margin-top: 4px;
          opacity: 0.6;
        }
        .school-dashboard .activity-list, .event-list { padding: 0; }
        .school-dashboard .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.8rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }
        .school-dashboard .activity-item:last-child { border-bottom: none; }
        .school-dashboard .activity-item:hover { background: rgba(255,255,255,0.04); }
        .school-dashboard .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .school-dashboard .activity-icon.student { background: rgba(59,130,246,0.2); color: #60a5fa; }
        .school-dashboard .activity-icon.teacher { background: rgba(16,185,129,0.2); color: #34d399; }
        .school-dashboard .activity-icon.timetable { background: rgba(245,158,11,0.2); color: #fbbf24; }
        .school-dashboard .activity-icon.announcement { background: rgba(139,92,246,0.2); color: #a78bfa; }
        .school-dashboard .activity-icon.subject { background: rgba(6,182,212,0.2); color: #22d3ee; }
        .school-dashboard .activity-content { flex: 1; min-width: 0; }
        .school-dashboard .activity-text {
          margin: 0;
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .school-dashboard .activity-time {
          font-size: 0.72rem;
          opacity: 0.5;
        }
        .school-dashboard .event-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .school-dashboard .event-item:last-child { border-bottom: none; }
        .school-dashboard .event-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50px;
          padding: 6px 0;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .school-dashboard .event-date-badge.meeting { background: rgba(59,130,246,0.2); }
        .school-dashboard .event-date-badge.event { background: rgba(16,185,129,0.2); }
        .school-dashboard .event-date-badge.exam { background: rgba(239,68,68,0.2); }
        .school-dashboard .event-day {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1;
        }
        .school-dashboard .event-month {
          font-size: 0.6rem;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .school-dashboard .event-content h6 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .school-dashboard .event-type {
          font-size: 0.72rem;
          opacity: 0.6;
        }
        .school-dashboard .quick-action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          cursor: pointer;
        }
        .school-dashboard .quick-action-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
          text-decoration: none;
          color: inherit;
        }
        .school-dashboard .quick-action-card span {
          font-size: 0.8rem;
          font-weight: 500;
        }
        .school-dashboard .qa-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .school-dashboard .qa-icon.blue { background: rgba(59,130,246,0.2); color: #60a5fa; }
        .school-dashboard .qa-icon.green { background: rgba(16,185,129,0.2); color: #34d399; }
        .school-dashboard .qa-icon.orange { background: rgba(245,158,11,0.2); color: #fbbf24; }
        .school-dashboard .qa-icon.purple { background: rgba(139,92,246,0.2); color: #a78bfa; }
        .school-dashboard .skeleton-card {
          padding: 1.25rem;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .school-dashboard .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: rgba(255,255,255,0.08);
          margin-bottom: 8px;
          animation: pulse 1.5s infinite;
        }
        .school-dashboard .skeleton-title { width: 60%; }
        .school-dashboard .skeleton-value { width: 40%; height: 24px; }
        .school-dashboard .skeleton-subtitle { width: 80%; }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}