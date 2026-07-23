import React, { useState, useEffect } from 'react'

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        myCourses: 6,
        assignmentsDue: 4,
        completedAssignments: 12,
        attendance: 92,
        gpa: 3.8,
        aiQuestions: 15,
        studyHours: 28,
        notifications: 5,
        upcomingDeadlines: [
          { id: 1, title: 'Math Assignment', due: '2026-07-28', class: 'Mathematics' },
          { id: 2, title: 'Physics Lab Report', due: '2026-07-30', class: 'Physics' },
          { id: 3, title: 'English Essay', due: '2026-08-01', class: 'English' },
        ],
        todayClasses: [
          { id: 1, subject: 'Mathematics', time: '8:00 AM', room: 'Room 101' },
          { id: 2, subject: 'Physics', time: '10:00 AM', room: 'Lab A' },
          { id: 3, subject: 'English', time: '12:00 PM', room: 'Room 204' },
        ],
        attendanceTrend: [90, 92, 88, 94, 91, 93, 92],
        assignmentProgress: [60, 65, 70, 68, 72, 75, 78],
        gradesTrend: [85, 88, 82, 90, 87, 92, 89],
      })
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="sp-page">
        <div className="row g-3">{[...Array(6)].map((_, i) => <div key={i} className="col-xl-2 col-md-4 col-sm-6"><div className="skeleton-card" /></div>)}</div>
        <style>{spStyles}</style>
      </div>
    )
  }

  return (
    <div className="sp-page">
      <div className="row g-3 mb-4">
        <div className="col-xl-2 col-md-4 col-sm-6"><div className="stat-card gradient-card blue"><div className="stat-icon"><i className="bi bi-book" /></div><div className="stat-content"><span className="stat-label">My Courses</span><span className="stat-value">{stats.myCourses}</span></div></div></div>
        <div className="col-xl-2 col-md-4 col-sm-6"><div className="stat-card gradient-card orange"><div className="stat-icon"><i className="bi bi-card-text" /></div><div className="stat-content"><span className="stat-label">Assignments Due</span><span className="stat-value">{stats.assignmentsDue}</span></div></div></div>
        <div className="col-xl-2 col-md-4 col-sm-6"><div className="stat-card gradient-card green"><div className="stat-icon"><i className="bi bi-check-circle" /></div><div className="stat-content"><span className="stat-label">Completed</span><span className="stat-value">{stats.completedAssignments}</span></div></div></div>
        <div className="col-xl-2 col-md-4 col-sm-6"><div className="stat-card gradient-card purple"><div className="stat-icon"><i className="bi bi-calendar-check" /></div><div className="stat-content"><span className="stat-label">Attendance</span><span className="stat-value">{stats.attendance}%</span></div></div></div>
        <div className="col-xl-2 col-md-4 col-sm-6"><div className="stat-card gradient-card red"><div className="stat-icon"><i className="bi bi-graph-up" /></div><div className="stat-content"><span className="stat-label">GPA</span><span className="stat-value">{stats.gpa}</span></div></div></div>
        <div className="col-xl-2 col-md-4 col-sm-6"><div className="stat-card gradient-card cyan"><div className="stat-icon"><i className="bi bi-robot" /></div><div className="stat-content"><span className="stat-label">AI Questions</span><span className="stat-value">{stats.aiQuestions}</span></div></div></div>
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
            <div className="card-header-custom"><h5><i className="bi bi-card-text me-2" />Assignment Progress</h5></div>
            <div className="chart-body"><div className="chart-container">{stats.assignmentProgress.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar blue" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}%</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-card">
            <div className="card-header-custom"><h5><i className="bi bi-graph-up me-2" />Grades Trend</h5></div>
            <div className="chart-body"><div className="chart-container">{stats.gradesTrend.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar orange" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-calendar-event me-2" />Upcoming Deadlines</h5></div>
            <div className="card-body p-0">
              {stats.upcomingDeadlines.map(d => (
                <div key={d.id} className="deadline-item">
                  <div className="deadline-info"><strong>{d.title}</strong><span>{d.class}</span></div>
                  <div className="deadline-date"><i className="bi bi-calendar3 me-1" />{d.due}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-clock me-2" />Today's Classes</h5></div>
            <div className="card-body p-0">
              {stats.todayClasses.map(cls => (
                <div key={cls.id} className="class-item">
                  <div className="class-time"><i className="bi bi-clock" />{cls.time}</div>
                  <div className="class-info"><strong>{cls.subject}</strong></div>
                  <div className="class-room"><i className="bi bi-door-open me-1" />{cls.room}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{spStyles}</style>
    </div>
  )
}

const spStyles = `
.sp-page .stat-card { display: flex; align-items: center; padding: 1.25rem; border-radius: 16px; background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; gap: 1rem; }
.sp-page .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
.sp-page .stat-card.gradient-card.blue { background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1)); border-color: rgba(59,130,246,0.3); }
.sp-page .stat-card.gradient-card.green { background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1)); border-color: rgba(16,185,129,0.3); }
.sp-page .stat-card.gradient-card.orange { background: linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1)); border-color: rgba(245,158,11,0.3); }
.sp-page .stat-card.gradient-card.purple { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1)); border-color: rgba(139,92,246,0.3); }
.sp-page .stat-card.gradient-card.red { background: linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1)); border-color: rgba(239,68,68,0.3); }
.sp-page .stat-card.gradient-card.cyan { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.1)); border-color: rgba(6,182,212,0.3); }
.sp-page .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.sp-page .stat-content { display: flex; flex-direction: column; }
.sp-page .stat-label { font-size: 0.8rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
.sp-page .stat-value { font-size: 1.6rem; font-weight: 700; line-height: 1.2; }
.sp-page .chart-card, .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.sp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sp-page .card-header-custom h5 { margin: 0; font-size: 0.95rem; font-weight: 600; }
.sp-page .chart-body { padding: 1.25rem; }
.sp-page .chart-container { display: flex; align-items: flex-end; gap: 4px; height: 160px; }
.sp-page .chart-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
.sp-page .chart-bar { width: 100%; max-width: 28px; border-radius: 4px 4px 0 0; position: relative; transition: height 0.5s ease; min-height: 4px; }
.sp-page .chart-bar.green { background: linear-gradient(to top, #10b981, #34d399); }
.sp-page .chart-bar.blue { background: linear-gradient(to top, #3b82f6, #60a5fa); }
.sp-page .chart-bar.orange { background: linear-gradient(to top, #f59e0b, #fbbf24); }
.sp-page .chart-tooltip { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 0.65rem; background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 4px; opacity: 0; transition: opacity 0.2s; white-space: nowrap; }
.sp-page .chart-bar:hover .chart-tooltip { opacity: 1; }
.sp-page .chart-label { font-size: 0.6rem; margin-top: 4px; opacity: 0.6; }
.sp-page .deadline-item, .class-item { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sp-page .deadline-item:last-child, .class-item:last-child { border-bottom: none; }
.sp-page .deadline-info, .class-info { flex: 1; display: flex; flex-direction: column; }
.sp-page .deadline-info strong, .class-info strong { font-size: 0.9rem; }
.sp-page .deadline-info span, .class-info span { font-size: 0.8rem; opacity: 0.7; }
.sp-page .deadline-date, .class-time { font-size: 0.8rem; opacity: 0.8; }
.sp-page .class-room { font-size: 0.8rem; opacity: 0.7; }
.sp-page .skeleton-card { height: 80px; border-radius: 16px; background: rgba(255,255,255,0.05); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`