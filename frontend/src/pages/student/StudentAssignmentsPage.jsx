import React, { useState, useEffect } from 'react'

export default function StudentAssignmentsPage() {
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignments([
        { id: 1, title: 'Algebra Worksheet', class: 'Mathematics', teacher: 'Mr. David Lee', dueDate: '2026-07-28', status: 'Pending', priority: 'High' },
        { id: 2, title: 'Physics Lab Report', class: 'Physics', teacher: 'Ms. Emily Chen', dueDate: '2026-07-30', status: 'Pending', priority: 'Medium' },
        { id: 3, title: 'Chemistry Equations', class: 'Chemistry', teacher: 'Mr. James Wilson', dueDate: '2026-07-25', status: 'Submitted', priority: 'High' },
        { id: 4, title: 'English Essay', class: 'English', teacher: 'Mrs. Sarah Parker', dueDate: '2026-08-01', status: 'Pending', priority: 'Low' },
        { id: 5, title: 'Math Quiz', class: 'Mathematics', teacher: 'Mr. David Lee', dueDate: '2026-07-20', status: 'Late', priority: 'High' },
        { id: 6, title: 'Biology Project', class: 'Biology', teacher: 'Ms. Emily Chen', dueDate: '2026-07-15', status: 'Graded', priority: 'Medium' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.class.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const getPriorityColor = (p) => p === 'High' ? 'danger' : p === 'Medium' ? 'warning' : 'info'
  const getStatusColor = (s) => s === 'Pending' ? 'warning' : s === 'Submitted' ? 'info' : s === 'Late' ? 'danger' : 'success'

  if (loading) {
    return (
      <div className="sap-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{sapStyles}</style>
      </div>
    )
  }

  return (
    <div className="sap-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-card-text me-2" />Assignments</h4>
      </div>
      <div className="d-flex gap-2 mb-3">
        <div className="search-bar flex-grow-1">
          <i className="bi bi-search search-icon" />
          <input type="text" className="form-control" placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option><option>Pending</option><option>Submitted</option><option>Late</option><option>Graded</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><i className="bi bi-card-text" /><h6>No assignments found</h6></div>
      ) : (
        <div className="table-responsive">
          <table className="table sap-table">
            <thead><tr><th>Title</th><th>Class</th><th>Teacher</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td>{a.class}</td>
                  <td>{a.teacher}</td>
                  <td>{a.dueDate}</td>
                  <td><span className={`badge bg-${getPriorityColor(a.priority)}`}>{a.priority}</span></td>
                  <td><span className={`badge bg-${getStatusColor(a.status)}`}>{a.status}</span></td>
                  <td>
                    {a.status === 'Pending' && (
                      <a href={`/student/submit-assignment/${a.id}`} className="btn btn-sm btn-primary">
                        <i className="bi bi-upload" /> Submit
                      </a>
                    )}
                    {a.status === 'Graded' && (
                      <a href={`/student/submit-assignment/${a.id}`} className="btn btn-action-view">
                        <i className="bi bi-eye" /> View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{sapStyles}</style>
    </div>
  )
}

const sapStyles = `
.sap-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.sap-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.sap-page .d-flex.gap-2 { gap: 0.5rem; }
.sap-page .search-bar { position: relative; }
.sap-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.sap-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.sap-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.sap-page .table-responsive { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.sap-page .sap-table { margin: 0; color: inherit; }
.sap-page .sap-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; }
.sap-page .sap-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sap-page .sap-table tr:last-child td { border-bottom: none; }
.sap-page .sap-table tr:hover td { background: rgba(255,255,255,0.03); }
.sap-page .badge { font-size: 0.7rem; font-weight: 600; }
.sap-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.sap-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.sap-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`