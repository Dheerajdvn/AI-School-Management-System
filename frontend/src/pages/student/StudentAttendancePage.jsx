import React, { useState, useEffect } from 'react'

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    const timer = setTimeout(() => {
      setAttendance([
        { date: '2026-07-01', day: 'Wed', status: 'present', subject: 'Mathematics' },
        { date: '2026-07-02', day: 'Thu', status: 'present', subject: 'Physics' },
        { date: '2026-07-03', day: 'Fri', status: 'absent', subject: 'Mathematics' },
        { date: '2026-07-04', day: 'Sat', status: 'present', subject: 'English' },
        { date: '2026-07-05', day: 'Sun', status: 'leave', subject: '-' },
        { date: '2026-07-06', day: 'Mon', status: 'present', subject: 'Mathematics' },
        { date: '2026-07-07', day: 'Tue', status: 'late', subject: 'Physics' },
        { date: '2026-07-08', day: 'Wed', status: 'present', subject: 'Chemistry' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedMonth])

  const present = attendance.filter(a => a.status === 'present').length
  const absent = attendance.filter(a => a.status === 'absent').length
  const late = attendance.filter(a => a.status === 'late').length
  const leave = attendance.filter(a => a.status === 'leave').length
  const total = attendance.length
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present': return 'bg-success'
      case 'absent': return 'bg-danger'
      case 'late': return 'bg-warning'
      case 'leave': return 'bg-info'
      default: return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <div className="atp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{atpStyles}</style>
      </div>
    )
  }

  return (
    <div className="atp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-calendar-check me-2" />Attendance</h4>
        <input type="month" className="form-control" style={{ width: 'auto' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6"><div className="stat-card green"><i className="bi bi-check-circle" /><div><strong>{present}</strong><span className="d-block small opacity-75">Present</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card red"><i className="bi bi-x-circle" /><div><strong>{absent}</strong><span className="d-block small opacity-75">Absent</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card orange"><i className="bi bi-clock" /><div><strong>{late}</strong><span className="d-block small opacity-75">Late</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card blue"><i className="bi bi-calendar-x" /><div><strong>{percentage}%</strong><span className="d-block small opacity-75">Attendance</span></div></div></div>
      </div>

      <div className="glass-card">
        <div className="card-header-custom"><h5>Attendance Details</h5></div>
        <div className="table-responsive">
          <table className="table atp-table">
            <thead><tr><th>Date</th><th>Day</th><th>Subject</th><th>Status</th></tr></thead>
            <tbody>
              {attendance.map((a, i) => (
                <tr key={i}>
                  <td>{a.date}</td>
                  <td>{a.day}</td>
                  <td>{a.subject}</td>
                  <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{atpStyles}</style>
    </div>
  )
}

const atpStyles = `
.atp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.atp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.atp-page .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 16px; background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
.atp-page .stat-card i { font-size: 2rem; }
.atp-page .stat-card.green i { color: #34d399; }
.atp-page .stat-card.red i { color: #f87171; }
.atp-page .stat-card.orange i { color: #fbbf24; }
.atp-page .stat-card.blue i { color: #60a5fa; }
.atp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.atp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.atp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.atp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.atp-page .atp-table { margin: 0; color: inherit; }
.atp-page .atp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.atp-page .atp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.atp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`