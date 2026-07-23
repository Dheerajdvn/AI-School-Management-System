import React, { useState, useEffect } from 'react'

export default function StudyMaterialsPage() {
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials([
        { id: 1, title: 'Algebra Basics', type: 'PDF', class: 'Class 10-A', subject: 'Mathematics', size: '2.4 MB', uploadedAt: '2026-07-20' },
        { id: 2, title: 'Physics Lab Manual', type: 'PDF', class: 'Class 11-A', subject: 'Physics', size: '5.1 MB', uploadedAt: '2026-07-19' },
        { id: 3, title: 'Chemistry Presentation', type: 'PPT', class: 'Class 10-B', subject: 'Chemistry', size: '8.3 MB', uploadedAt: '2026-07-18' },
        { id: 4, title: 'English Essay Guide', type: 'DOCX', class: 'Class 12-A', subject: 'English', size: '1.2 MB', uploadedAt: '2026-07-17' },
        { id: 5, title: 'Math Tutorial Video', type: 'Video', class: 'Class 10-A', subject: 'Mathematics', size: '45 MB', uploadedAt: '2026-07-16' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || m.type === typeFilter
    return matchSearch && matchType
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return 'bi-file-earmark-pdf'
      case 'DOCX': return 'bi-file-earmark-word'
      case 'PPT': return 'bi-file-earmark-slides'
      case 'Video': return 'bi-file-earmark-play'
      default: return 'bi-file-earmark'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return '#ef4444'
      case 'DOCX': return '#3b82f6'
      case 'PPT': return '#f59e0b'
      case 'Video': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="smp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{smpStyles}</style>
      </div>
    )
  }

  return (
    <div className="smp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-folder me-2" />Study Materials</h4>
        <button className="btn btn-primary btn-sm" onClick={() => alert('Upload dialog')}><i className="bi bi-upload me-1" />Upload</button>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="search-bar">
            <i className="bi bi-search search-icon" />
            <input type="text" className="form-control" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>All</option><option>PDF</option><option>DOCX</option><option>PPT</option><option>Video</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><i className="bi bi-folder" /><h6>No study materials found</h6></div>
      ) : (
        <div className="row g-3">
          {filtered.map(mat => (
            <div className="col-md-6 col-lg-4" key={mat.id}>
              <div className="material-card">
                <div className="material-icon" style={{ color: getTypeColor(mat.type) }}><i className={`bi ${getTypeIcon(mat.type)}`} /></div>
                <div className="material-info">
                  <h6>{mat.title}</h6>
                  <span className="badge bg-secondary">{mat.type}</span>
                  <p className="mb-0 small opacity-75">{mat.subject} - {mat.class}</p>
                  <span className="small opacity-75">{mat.size} • {mat.uploadedAt}</span>
                </div>
                <button className="btn btn-sm btn-outline-primary" onClick={() => alert('Downloading...')}><i className="bi bi-download" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{smpStyles}</style>
    </div>
  )
}

const smpStyles = `
.smp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.smp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.smp-page .search-bar { position: relative; }
.smp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.smp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.smp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.smp-page .material-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; }
.smp-page .material-card:hover { transform: translateY(-2px); border-color: rgba(59,130,246,0.3); }
.smp-page .material-icon { font-size: 2rem; flex-shrink: 0; }
.smp-page .material-info { flex: 1; min-width: 0; }
.smp-page .material-info h6 { margin: 0 0 0.25rem 0; font-weight: 600; }
.smp-page .material-info p { margin: 0.25rem 0; }
.smp-page .skeleton-row { height: 80px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.smp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.smp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`