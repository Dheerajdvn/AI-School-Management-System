import React, { useState, useEffect } from 'react'

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
      <div className="tpd-page">
        <div className="row g-3">{[...Array(6)].map((_, i) => <div key={i} className="col-md-2 col-sm-4"><div className="skeleton-card" /></div>)}</div>
        <style>{tpdStyles}</style>
      </div>
    )
  }

  return (
    <div className="tpd-page">
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card blue"><div className="stat-icon"><i className="bi bi-layers-fill" /></div><div className="stat-content"><span className="stat-label">My Classes</span><span className="stat-value">{stats.myClasses}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card green"><div className="stat-icon"><i className="bi bi-people-fill" /></div><div className="stat-content"><span className="stat-label">Total Students</span><span className="stat-value">{stats.totalStudents}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card orange"><div className="stat-icon"><i className="bi bi-card-text" /></div><div className="stat-content"><span className="stat-label">Assignments</span><span className="stat-value">{stats.assignments}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card purple"><div className="stat-icon"><i className="bi bi-calendar-check-fill" /></div><div className="stat-content"><span className="stat-label">Attendance Today</span><span className="stat-value">{stats.attendanceToday}%</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card red"><div className="stat-icon"><i className="bi bi-pencil-square" /></div><div className="stat-content"><span className="stat-label">Pending Grading</span><span className="stat-value">{stats.pendingGrading}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card cyan"><div className="stat-icon"><i className="bi bi-robot" /></div><div className="stat-content"><span className="stat-label">AI Requests</span><span className="stat-value">{stats.aiRequests}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card teal"><div className="stat-icon"><i className="bi bi-bell-fill" /></div><div className="stat-content"><span className="stat-label">Notifications</span><span className="stat-value">{stats.notifications}</span></div></div></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom"><h5><i className="bi bi-calendar-check me-2" />Attendance Trend</h5></div>
            <div className="chart-body"><div className="chart-container">{stats.attendanceTrend.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar green" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}%</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom"><h5><i className="bi bi-card-text me-2" />Assignment Completion</h5></div>
            <div className="chart-body"><div className="chart-container">{stats.assignmentCompletion.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar blue" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}%</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom"><h5><i className="bi bi-graph-up me-2" />Student Performance</h5></div>
            <div className="chart-body"><div className="chart-container">{stats.studentPerformance.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar orange" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-calendar-event me-2" />Upcoming Classes</h5></div>
            <div className="card-body p-0">
              {stats.upcomingClasses.map(cls => (
                <div key={cls.id} className="upcoming-class-item">
                  <div className="class-time"><i className="bi bi-clock" />{cls.time}</div>
                  <div className="class-info"><strong>{cls.subject}</strong><span>{cls.class}</span></div>
                  <div className="class-room"><i className="bi bi-door-open me-1" />{cls.room}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-lightning-charge-fill me-2" />Quick Actions</h5></div>
            <div className="card-body">
              <div className="row g-2">
                {[
                  { to: '/teacher/attendance', icon: 'bi-calendar-check', label: 'Mark Attendance', color: 'blue' },
                  { to: '/teacher/assignments', icon: 'bi-card-text', label: 'New Assignment', color: 'green' },
                  { to: '/teacher/lesson-planner', icon: 'bi-robot', label: 'AI Lesson Plan', color: 'purple' },
                  { to: '/teacher/quiz-generator', icon: 'bi-question-circle', label: 'Generate Quiz', color: 'orange' },
                ].map((action, i) => (
                  <div className="col-6" key={i}>
                    <a href={action.to} className="quick-action-card"><div className={`qa-icon ${action.color}`}><i className={`bi ${action.icon}`} /></div><span>{action.label}</span></a>
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
.tpd-page .stat-card { display: flex; align-items: center; padding: 1.25rem; border-radius: 16px; background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; gap: 1rem; }
.tpd-page .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
.tpd-page .stat-card.gradient-card.blue { background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1)); border-color: rgba(59,130,246,0.3); }
.tpd-page .stat-card.gradient-card.green { background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1)); border-color: rgba(16,185,129,0.3); }
.tpd-page .stat-card.gradient-card.orange { background: linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1)); border-color: rgba(245,158,11,0.3); }
.tpd-page .stat-card.gradient-card.purple { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1)); border-color: rgba(139,92,246,0.3); }
.tpd-page .stat-card.gradient-card.red { background: linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1)); border-color: rgba(239,68,68,0.3); }
.tpd-page .stat-card.gradient-card.cyan { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.1)); border-color: rgba(6,182,212,0.3); }
.tpd-page .stat-card.gradient-card.teal { background: linear-gradient(135deg, rgba(13,148,136,0.3), rgba(13,148,136,0.1)); border-color: rgba(13,148,136,0.3); }
.tpd-page .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.tpd-page .stat-content { display: flex; flex-direction: column; }
.tpd-page .stat-label { font-size: 0.8rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
.tpd-page .stat-value { font-size: 1.6rem; font-weight: 700; line-height: 1.2; }
.tpd-page .chart-card, .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.tpd-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.tpd-page .card-header-custom h5 { margin: 0; font-size: 0.95rem; font-weight: 600; }
.tpd-page .chart-body { padding: 1.25rem; }
.tpd-page .chart-container { display: flex; align-items: flex-end; gap: 4px; height: 160px; }
.tpd-page .chart-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
.tpd-page .chart-bar { width: 100%; max-width: 28px; border-radius: 4px 4px 0 0; position: relative; transition: height 0.5s ease; min-height: 4px; }
.tpd-page .chart-bar.green { background: linear-gradient(to top, #10b981, #34d399); }
.tpd-page .chart-bar.blue { background: linear-gradient(to top, #3b82f6, #60a5fa); }
.tpd-page .chart-bar.orange { background: linear-gradient(to top, #f59e0b, #fbbf24); }
.tpd-page .chart-tooltip { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 0.65rem; background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 4px; opacity: 0; transition: opacity 0.2s; white-space: nowrap; }
.tpd-page .chart-bar:hover .chart-tooltip { opacity: 1; }
.tpd-page .chart-label { font-size: 0.6rem; margin-top: 4px; opacity: 0.6; }
.tpd-page .upcoming-class-item { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
.tpd-page .upcoming-class-item:last-child { border-bottom: none; }
.tpd-page .upcoming-class-item:hover { background: rgba(255,255,255,0.03); }
.tpd-page .class-time { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; opacity: 0.8; min-width: 100px; }
.tpd-page .class-info { flex: 1; display: flex; flex-direction: column; }
.tpd-page .class-info strong { font-size: 0.9rem; }
.tpd-page .class-info span { font-size: 0.8rem; opacity: 0.7; }
.tpd-page .class-room { font-size: 0.8rem; opacity: 0.7; }
.tpd-page .quick-action-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); text-decoration: none; color: inherit; transition: all 0.3s; cursor: pointer; }
.tpd-page .quick-action-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); text-decoration: none; color: inherit; }
.tpd-page .quick-action-card span { font-size: 0.8rem; font-weight: 500; }
.tpd-page .qa-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.tpd-page .qa-icon.blue { background: rgba(59,130,246,0.2); color: #60a5fa; }
.tpd-page .qa-icon.green { background: rgba(16,185,129,0.2); color: #34d399; }
.tpd-page .qa-icon.purple { background: rgba(139,92,246,0.2); color: #a78bfa; }
.tpd-page .qa-icon.orange { background: rgba(245,158,11,0.2); color: #fbbf24; }
.tpd-page .skeleton-card { height: 80px; border-radius: 16px; background: rgba(255,255,255,0.05); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`