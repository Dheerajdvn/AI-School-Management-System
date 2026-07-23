import React, { useState, useEffect } from 'react'

export default function GradebookPage() {
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState('Class 10-A')
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')

  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A']

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents([
        { id: 1, name: 'Rahul Sharma', roll: 'R-1001', marks: [85, 90, 78, 92], average: 86 },
        { id: 2, name: 'Priya Patel', roll: 'R-1002', marks: [92, 88, 95, 90], average: 91 },
        { id: 3, name: 'Amit Kumar', roll: 'R-1003', marks: [70, 75, 68, 72], average: 71 },
        { id: 4, name: 'Sneha Singh', roll: 'R-1004', marks: [88, 92, 85, 90], average: 89 },
        { id: 5, name: 'Vikram Joshi', roll: 'R-1005', marks: [60, 65, 58, 62], average: 61 },
        { id: 6, name: 'Anita Desai', roll: 'R-1006', marks: [95, 98, 92, 96], average: 95 },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedClass])

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase()))

  const getGrade = (avg) => {
    if (avg >= 90) return 'A+'
    if (avg >= 80) return 'A'
    if (avg >= 70) return 'B'
    if (avg >= 60) return 'C'
    if (avg >= 50) return 'D'
    return 'F'
  }

  const getGradeColor = (avg) => {
    if (avg >= 90) return '#34d399'
    if (avg >= 80) return '#60a5fa'
    if (avg >= 70) return '#fbbf24'
    if (avg >= 60) return '#f59e0b'
    if (avg >= 50) return '#f87171'
    return '#ef4444'
  }

  if (loading) {
    return (
      <div className="gbp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{gbpStyles}</style>
      </div>
    )
  }

  return (
    <div className="gbp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-graph-up me-2" />Gradebook</h4>
        <div className="d-flex gap-2">
          <select className="form-select" style={{ width: 'auto' }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-outline-primary btn-sm" onClick={() => alert('Exporting PDF...')}><i className="bi bi-file-pdf me-1" />PDF</button>
          <button className="btn btn-outline-success btn-sm" onClick={() => alert('Exporting Excel...')}><i className="bi bi-file-excel me-1" />Excel</button>
        </div>
      </div>

      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card">
        <div className="table-responsive">
          <table className="table gbp-table">
            <thead><tr><th>Roll</th><th>Name</th><th>Test 1</th><th>Test 2</th><th>Mid Term</th><th>Final</th><th>Average</th><th>Grade</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><code>{s.roll}</code></td>
                  <td><strong>{s.name}</strong></td>
                  {s.marks.map((m, i) => <td key={i}><input type="number" className="form-control form-control-sm" style={{ width: '70px' }} defaultValue={m} /></td>)}
                  <td><strong>{s.average}%</strong></td>
                  <td><span className="badge" style={{ background: `${getGradeColor(s.average)}22`, color: getGradeColor(s.average) }}>{getGrade(s.average)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{gbpStyles}</style>
    </div>
  )
}

const gbpStyles = `
.gbp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.gbp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.gbp-page .search-bar { position: relative; }
.gbp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.gbp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.gbp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.gbp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.gbp-page .table-responsive { overflow-x: auto; }
.gbp-page .gbp-table { margin: 0; color: inherit; }
.gbp-page .gbp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; white-space: nowrap; }
.gbp-page .gbp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.gbp-page .gbp-table tr:last-child td { border-bottom: none; }
.gbp-page .gbp-table tr:hover td { background: rgba(255,255,255,0.03); }
.gbp-page .form-control-sm { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 6px; padding: 0.25rem 0.5rem; }
.gbp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`