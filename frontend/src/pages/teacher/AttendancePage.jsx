import React, { useState, useEffect } from 'react'
import useToast from '../../hooks/useToast'

export default function AttendancePage() {
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('Class 10-A')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 11-B', 'Class 12-A']

  const defaultStudents = [
    { id: 1, name: 'Rahul Sharma', roll: 'R-1001', status: 'present' },
    { id: 2, name: 'Priya Patel', roll: 'R-1002', status: 'present' },
    { id: 3, name: 'Amit Kumar', roll: 'R-1003', status: 'absent' },
    { id: 4, name: 'Sneha Singh', roll: 'R-1004', status: 'late' },
    { id: 5, name: 'Vikram Joshi', roll: 'R-1005', status: 'present' },
    { id: 6, name: 'Anita Desai', roll: 'R-1006', status: 'leave' },
    { id: 7, name: 'Karan Mehta', roll: 'R-1007', status: 'present' },
    { id: 8, name: 'Deepika Rao', roll: 'R-1008', status: 'present' },
  ]

  // Load from LocalStorage when class or date changes
  useEffect(() => {
    setLoading(true)
    try {
      const key = `attendance_data_${selectedClass}_${date}`
      const stored = localStorage.getItem(key)
      if (stored) {
        setStudents(JSON.parse(stored))
      } else {
        // Fall back to default
        setStudents(defaultStudents)
      }
    } catch (e) {
      setStudents(defaultStudents)
    }
    setLoading(false)
  }, [selectedClass, date])

  const setStatus = (id, status) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const bulkSet = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })))
    showSuccess(`All students marked as ${status.toUpperCase()}!`)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      try {
        const key = `attendance_data_${selectedClass}_${date}`
        localStorage.setItem(key, JSON.stringify(students))
        showSuccess(`Attendance registry for ${selectedClass} on ${date} saved successfully!`)
      } catch (e) {
        showError('Failed to save attendance registry')
      } finally {
        setSaving(false)
      }
    }, 650)
  }

  const counts = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    leave: students.filter(s => s.status === 'leave').length
  }

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="atp-page py-4">
        <div className="row g-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="col-12">
              <div className="skeleton-row animate-pulse" style={{ height: '56px', background: 'var(--surface)', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="atp-page py-4">
      <div className="page-header-custom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-calendar-check-fill text-primary me-2" />Attendance Register
          </h4>
          <p className="text-muted small mb-0 font-medium">Record student attendance status daily, run bulk markers, and view metrics graphs.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <input 
            type="date" 
            className="form-control bg-dark border-secondary text-white rounded-3 py-1.5" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            style={{ width: 'auto' }} 
          />
          <select 
            className="form-select bg-dark border-secondary text-white rounded-3 py-1.5" 
            style={{ width: 'auto', minWidth: '150px' }} 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary rounded-3 px-3.5 fw-semibold d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-cloud-arrow-up-fill" />}
            <span>Save Registry</span>
          </button>
        </div>
      </div>

      {/* Counts summary widgets */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="count-card present shadow-sm">
            <i className="bi bi-check-circle-fill" />
            <div>
              <span className="count-label text-muted d-block uppercase tracking-wider">Present</span>
              <strong className="count-value text-white" style={{ color: 'var(--text)' }}>{counts.present}</strong>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="count-card absent shadow-sm">
            <i className="bi bi-x-circle-fill" />
            <div>
              <span className="count-label text-muted d-block uppercase tracking-wider">Absent</span>
              <strong className="count-value text-white" style={{ color: 'var(--text)' }}>{counts.absent}</strong>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="count-card late shadow-sm">
            <i className="bi bi-clock-fill" />
            <div>
              <span className="count-label text-muted d-block uppercase tracking-wider">Late</span>
              <strong className="count-value text-white" style={{ color: 'var(--text)' }}>{counts.late}</strong>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="count-card leave shadow-sm">
            <i className="bi bi-calendar-x-fill" />
            <div>
              <span className="count-label text-muted d-block uppercase tracking-wider">On Leave</span>
              <strong className="count-value text-white" style={{ color: 'var(--text)' }}>{counts.leave}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3.5">
        {/* Bulk Action Controls */}
        <div className="bulk-actions d-flex align-items-center gap-2">
          <span className="bulk-label text-muted small fw-semibold uppercase tracking-wider me-1">Bulk Actions:</span>
          <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => bulkSet('present')}>
            Mark All Present
          </button>
          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => bulkSet('absent')}>
            Mark All Absent
          </button>
          <button className="btn btn-sm btn-outline-warning rounded-pill px-3" onClick={() => bulkSet('late')}>
            Mark All Late
          </button>
        </div>

        {/* Search Filter */}
        <div className="search-bar" style={{ minWidth: '260px' }}>
          <i className="bi bi-search search-icon" />
          <input 
            type="text" 
            className="form-control style-search-input" 
            placeholder="Search student names..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Roster list */}
      <div className="table-responsive shadow-sm">
        <table className="table atp-table align-middle mb-0" style={{ color: 'inherit' }}>
          <thead>
            <tr className="border-bottom border-secondary border-opacity-10">
              <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '11px' }}>Roll</th>
              <th className="py-3 text-muted text-uppercase" style={{ fontSize: '11px' }}>Student Name</th>
              <th className="px-4 py-3 text-muted text-uppercase text-end" style={{ fontSize: '11px' }}>Status Trigger</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-5 text-muted small">No students found matching your search.</td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.id} className="border-bottom border-secondary border-opacity-10">
                  <td className="px-4"><code>{s.roll}</code></td>
                  <td><strong className="text-white" style={{ color: 'var(--text)' }}>{s.name}</strong></td>
                  <td className="px-4 text-end">
                    <div className="btn-group rounded-3 overflow-hidden p-0.5 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                      {[
                        { key: 'present', label: 'Present', color: 'success' },
                        { key: 'absent', label: 'Absent', color: 'danger' },
                        { key: 'late', label: 'Late', color: 'warning' },
                        { key: 'leave', label: 'Leave', color: 'info' }
                      ].map(option => {
                        const isSelected = s.status === option.key
                        return (
                          <button 
                            key={option.key} 
                            className={`btn btn-sm px-3.5 py-1.5 border-0 font-medium transition ${isSelected ? 'btn-' + option.color : 'text-muted'}`}
                            onClick={() => setStatus(s.id, option.key)}
                            style={{
                              fontSize: '11.5px',
                              borderRadius: '6px'
                            }}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{atpStyles}</style>
    </div>
  )
}

const atpStyles = `
.atp-page .search-bar { position: relative; }
.atp-page .search-bar .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.55; z-index: 1; color: var(--text); }
.atp-page .style-search-input { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 12px; padding: 0.55rem 0.55rem 0.55rem 42px; color: var(--text) !important; font-size: 13.5px; }
.atp-page .style-search-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.atp-page .count-card { display: flex; align-items: center; gap: 1rem; padding: 1.15rem; border-radius: 16px; background: var(--card); border: 1px solid var(--border); }
.atp-page .count-card i { font-size: 1.6rem; }
.atp-page .count-card.present i { color: #10b981; }
.atp-page .count-card.absent i { color: #ef4444; }
.atp-page .count-card.late i { color: #fbbf24; }
.atp-page .count-card.leave i { color: #3b82f6; }
.atp-page .count-label { font-size: 10px; font-weight: 600; letter-spacing: 0.05em; }
.atp-page .count-value { font-size: 1.6rem; font-weight: 700; line-height: 1.2; }
.atp-page .table-responsive { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.atp-page .atp-table thead th { background: rgba(255,255,255,0.02) !important; border-bottom: 1px solid var(--border) !important; font-size: 11px; padding: 0.85rem 1rem; }
.atp-page .atp-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border) !important; }
`