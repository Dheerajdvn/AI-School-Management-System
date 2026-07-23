import React, { useState, useEffect } from 'react'

export default function MyClassesPage() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setClasses([
        { id: 1, name: 'Class 10-A', subject: 'Mathematics', students: 38, schedule: 'Mon, Wed, Fri - 8:00 AM', room: 'Room 101' },
        { id: 2, name: 'Class 10-B', subject: 'Mathematics', students: 36, schedule: 'Tue, Thu, Sat - 10:00 AM', room: 'Room 102' },
        { id: 3, name: 'Class 11-A', subject: 'Physics', students: 32, schedule: 'Mon, Wed, Fri - 10:00 AM', room: 'Lab A' },
        { id: 4, name: 'Class 11-B', subject: 'Physics', students: 30, schedule: 'Tue, Thu - 11:30 AM', room: 'Lab B' },
        { id: 5, name: 'Class 12-A', subject: 'Chemistry', students: 28, schedule: 'Mon, Wed - 2:00 PM', room: 'Lab C' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div className="mcp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{mcpStyles}</style>
      </div>
    )
  }

  return (
    <div className="mcp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-layers me-2" />My Classes</h4>
      </div>
      <div className="search-bar mb-3">
        <i className="bi bi-search search-icon" />
        <input type="text" className="form-control" placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><i className="bi bi-layers" /><h6>{search ? 'No matching classes' : 'No classes assigned'}</h6></div>
      ) : (
        <div className="row g-3">
          {filtered.map(cls => (
            <div className="col-md-6 col-lg-4" key={cls.id}>
              <div className="class-card" onClick={() => setSelected(cls)}>
                <div className="class-header">
                  <div className="class-icon"><i className="bi bi-book" /></div>
                  <div className="class-title"><h5>{cls.name}</h5><span>{cls.subject}</span></div>
                </div>
                <div className="class-body">
                  <div className="class-stat"><i className="bi bi-people" /><span>{cls.students} Students</span></div>
                  <div className="class-stat"><i className="bi bi-clock" /><span>{cls.schedule}</span></div>
                  <div className="class-stat"><i className="bi bi-door-open" /><span>{cls.room}</span></div>
                </div>
                <div className="class-footer">
                  <a href={`/teacher/attendance?class=${cls.id}`} className="btn btn-sm btn-outline-primary">Attendance</a>
                  <a href={`/teacher/assignments?class=${cls.id}`} className="btn btn-sm btn-outline-success">Assignments</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{mcpStyles}</style>
    </div>
  )
}

const mcpStyles = `
.mcp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.mcp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.mcp-page .search-bar { position: relative; }
.mcp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.mcp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.mcp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.mcp-page .class-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.25rem; transition: all 0.3s; cursor: pointer; display: flex; flex-direction: column; height: 100%; }
.mcp-page .class-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); border-color: rgba(59,130,246,0.3); }
.mcp-page .class-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.mcp-page .class-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1)); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #60a5fa; flex-shrink: 0; }
.mcp-page .class-title h5 { margin: 0; font-weight: 600; }
.mcp-page .class-title span { font-size: 0.8rem; opacity: 0.7; }
.mcp-page .class-body { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; flex: 1; }
.mcp-page .class-stat { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; opacity: 0.8; }
.mcp-page .class-stat i { width: 20px; text-align: center; }
.mcp-page .class-footer { display: flex; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); }
.mcp-page .skeleton-row { height: 140px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.mcp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.mcp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`