import React, { useState, useEffect } from 'react'

export default function AttendancePage() {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('Class 10-A')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 11-B', 'Class 12-A']

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents([
        { id: 1, name: 'Rahul Sharma', roll: 'R-1001', status: 'present' },
        { id: 2, name: 'Priya Patel', roll: 'R-1002', status: 'present' },
        { id: 3, name: 'Amit Kumar', roll: 'R-1003', status: 'absent' },
        { id: 4, name: 'Sneha Singh', roll: 'R-1004', status: 'late' },
        { id: 5, name: 'Vikram Joshi', roll: 'R-1005', status: 'present' },
        { id: 6, name: 'Anita Desai', roll: 'R-1006', status: 'leave' },
        { id: 7, name: 'Karan Mehta', roll: 'R-1007', status: 'present' },
        { id: 8, name: 'Deepika Rao', roll: 'R-1008', status: 'present' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedClass])

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase()))

  const setStatus = (id, status) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const bulkSet = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 800)
  }

  const counts = { present: students.filter(s => s.status === 'present').length, absent: students.filter(s => s.status === 'absent').length, late: students.filter(s => s.status === 'late').length, leave: students.filter(s => s.status === 'leave').length }

  if (loading) {
    return (
      <div className="atp-page">
        <div className="row g-3">{[...Array(6)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{atpStyles}</style>
      </div>
    )
  }

  return (
    <div className="atp-page">
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2" />Attendance saved successfully.
          <button type="button" className="btn-close" onClick={() => setSuccess(false)} />
        </div>
      )}

      <div className="page-header-custom">
        <h4><i className="bi bi-calendar-check me-2" />Attendance</h4>
        <div className="d-flex gap-2">
          <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} style={{ width: 'auto' }} />
          <select className="form-select" style={{ width: 'auto' }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : <><i className="bi bi-check-lg me-1" />Save Attendance</>}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-3 col-sm-6"><div className="count-card present"><i className="bi bi-check-circle" /><span>Present: <strong>{counts.present}</strong></span></div></div>
        <div className="col-md-3 col-sm-6"><div className="count-card absent"><i className="bi bi-x-circle" /><span>Absent: <strong>{counts.absent}</strong></span></div></div>
        <div className="col-md-3 col-sm-6"><div className="count-card late"><i className="bi bi-clock" /><span>Late: <strong>{counts.late}</strong></span></div></div>
        <div className="col-md-3 col-sm-6"><div className="count-card leave"><i className="bi bi-calendar-x" /><span>Leave: <strong>{counts.leave}</strong></span></div></div>
      </div>

      <div className="bulk-actions mb-3">
        <span className="bulk-label">Bulk Actions:</span>
        <button className="btn btn-sm btn-outline-success me-1" onClick={() => bulkSet('present')}>All Present</button>
        <button className="btn btn-sm btn-outline-danger me-1" onClick={() => bulkSet('absent')}>All Absent</button>
        <button className="btn btn-sm btn-outline-warning me-1" onClick={() => bulkSet('late')}>All Late</button>
      </div>

      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-responsive">
        <table className="table atp-table">
          <thead><tr><th>Roll</th><th>Name</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><code>{s.roll}</code></td>
                <td><strong>{s.name}</strong></td>
                <td>
                  <div className="btn-group">
                    {['present', 'absent', 'late', 'leave'].map(status => (
                      <button key={status} className={`btn btn-sm ${s.status === status ? 'btn-' + (status === 'present' ? 'success' : status === 'absent' ? 'danger' : status === 'late' ? 'warning' : 'info') : 'btn-outline-secondary'}`} onClick={() => setStatus(s.id, status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{atpStyles}</style>
    </div>
  )
}

const atpStyles = `
.atp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.atp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.atp-page .d-flex.gap-2 { gap: 0.5rem; }
.atp-page .search-bar { position: relative; }
.atp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.atp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.atp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.atp-page .count-card { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
.atp-page .count-card i { font-size: 1.5rem; }
.atp-page .count-card.present i { color: #34d399; }
.atp-page .count-card.absent i { color: #f87171; }
.atp-page .count-card.late i { color: #fbbf24; }
.atp-page .count-card.leave i { color: #60a5fa; }
.atp-page .count-card span { font-size: 0.9rem; }
.atp-page .bulk-actions { display: flex; align-items: center; gap: 0.5rem; }
.atp-page .bulk-label { font-size: 0.85rem; opacity: 0.7; }
.atp-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.atp-page .atp-table { margin: 0; color: inherit; }
.atp-page .atp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.atp-page .atp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.atp-page .atp-table tr:last-child td { border-bottom: none; }
.atp-page .atp-table .btn-group { display: flex; gap: 0.25rem; }
.atp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`