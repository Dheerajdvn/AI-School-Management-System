import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function MyClassesPage() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')

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

  const filtered = classes.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="mcp-page py-4">
        <div className="row g-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="skeleton-row animate-pulse" style={{ height: '180px', background: 'var(--surface)', borderRadius: '16px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mcp-page py-4">
      <div className="page-header-custom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-layers-fill text-primary me-2" />My Assigned Classes
          </h4>
          <p className="text-muted small mb-0 font-medium">Review class schedules, roster statistics, classroom targets, and quick management links.</p>
        </div>
      </div>

      <div className="search-bar mb-4">
        <i className="bi bi-search search-icon" />
        <input 
          type="text" 
          className="form-control style-search-input" 
          placeholder="Filter classes by name or subject..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <i className="bi bi-calendar-x text-muted display-4 mb-2 d-block" />
          <h6 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            {search ? 'No matching classes found' : 'No classes assigned'}
          </h6>
          <p className="text-muted small mb-0">Try checking back with school admin registrations.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(cls => (
            <div className="col-md-6 col-lg-4" key={cls.id}>
              <div className="class-card shadow-sm h-100">
                <div className="class-header d-flex align-items-center gap-3 mb-3">
                  <div className="class-icon shadow-xs">
                    <i className="bi bi-book-half" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>{cls.name}</h5>
                    <span className="text-muted small font-medium">{cls.subject}</span>
                  </div>
                </div>
                <div className="class-body d-flex flex-column gap-2 mb-3.5">
                  <div className="class-stat small text-muted font-medium">
                    <i className="bi bi-people-fill text-primary me-2" />
                    <span>{cls.students} Students</span>
                  </div>
                  <div className="class-stat small text-muted font-medium">
                    <i className="bi bi-clock-fill text-success me-2" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="class-stat small text-muted font-medium">
                    <i className="bi bi-geo-alt-fill text-danger me-2" />
                    <span>{cls.room}</span>
                  </div>
                </div>
                <div className="class-footer d-flex gap-2 pt-3 border-top" style={{ borderColor: 'var(--border)' }}>
                  <Link to={`/teacher/attendance?class=${cls.name}`} className="btn btn-sm btn-outline-primary rounded-pill px-3.5 flex-grow-1 font-semibold">
                    Attendance
                  </Link>
                  <Link to={`/teacher/assignments?class=${cls.name}`} className="btn btn-sm btn-outline-success rounded-pill px-3.5 flex-grow-1 font-semibold">
                    Assignments
                  </Link>
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
.mcp-page .search-bar { position: relative; }
.mcp-page .search-bar .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.55; z-index: 1; color: var(--text); }
.mcp-page .style-search-input { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 12px; padding: 0.55rem 0.55rem 0.55rem 42px; color: var(--text) !important; font-size: 13.5px; }
.mcp-page .style-search-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.mcp-page .class-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; }
.mcp-page .class-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--primary); }
.mcp-page .class-icon { width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.03)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #6366f1; flex-shrink: 0; border: 1px solid rgba(99, 102, 241, 0.18); }
`