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
          <div className="card">
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
          <div className="card">
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
    </div>
  )
}