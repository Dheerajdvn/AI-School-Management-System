import React, { useState, useEffect } from 'react'

export default function StudentDocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocuments([
        { id: 1, name: 'Assignment_Algebra.pdf', type: 'Assignment', category: 'PDF', size: '2.4 MB', date: '2026-07-20' },
        { id: 2, name: 'Physics_Notes.pdf', type: 'Notes', category: 'PDF', size: '1.8 MB', date: '2026-07-18' },
        { id: 3, name: 'Math_Certificate.pdf', type: 'Certificate', category: 'PDF', size: '0.5 MB', date: '2026-07-15' },
        { id: 4, name: 'Biology_Project.docx', type: 'Assignment', category: 'DOCX', size: '1.2 MB', date: '2026-07-12' },
        { id: 5, name: 'Chemistry_Notes.pdf', type: 'Notes', category: 'PDF', size: '3.1 MB', date: '2026-07-10' },
        { id: 6, name: 'Sports_Day.pdf', type: 'Certificate', category: 'PDF', size: '0.8 MB', date: '2026-07-05' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = documents.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || d.type === filter
    return matchSearch && matchFilter
  })

  const getTypeIcon = (cat) => {
    switch (cat) {
      case 'PDF': return 'bi-file-earmark-pdf'
      case 'DOCX': return 'bi-file-earmark-word'
      default: return 'bi-file-earmark'
    }
  }

  const getTypeColor = (cat) => {
    switch (cat) {
      case 'PDF': return '#ef4444'
      case 'DOCX': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="sdp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{sdpStyles}</style>
      </div>
    )
  }

  return (
    <div className="sdp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-folder me-2" />My Documents</h4>
        <button className="btn btn-primary btn-sm" onClick={() => alert('Upload dialog')}><i className="bi bi-upload me-1" />Upload</button>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="search-bar">
            <i className="bi bi-search search-icon" />
            <input type="text" className="form-control" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option><option>Assignment</option><option>Notes</option><option>Certificate</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><i className="bi bi-folder" /><h6>No documents found</h6></div>
      ) : (
        <div className="row g-3">
          {filtered.map(doc => (
            <div className="col-md-6 col-lg-4" key={doc.id}>
              <div className="doc-card">
                <div className="doc-icon" style={{ color: getTypeColor(doc.category) }}><i className={`bi ${getTypeIcon(doc.category)}`} /></div>
                <div className="doc-info">
                  <h6>{doc.name}</h6>
                  <span className="badge bg-secondary">{doc.type}</span>
                  <p className="mb-0 small opacity-75">{doc.size} • {doc.date}</p>
                </div>
                <div className="doc-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => alert('Downloading...')}><i className="bi bi-download" /></button>
                  <button className="btn btn-sm btn-outline-warning" onClick={() => alert('Bookmarked!')}><i className="bi bi-bookmark" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{sdpStyles}</style>
    </div>
  )
}

const sdpStyles = `
.sdp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.sdp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.sdp-page .search-bar { position: relative; }
.sdp-page .search-bar .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; z-index: 1; }
.sdp-page .search-bar .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding-left: 36px; color: inherit; }
.sdp-page .search-bar .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.sdp-page .doc-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; }
.sdp-page .doc-card:hover { transform: translateY(-2px); border-color: rgba(59,130,246,0.3); }
.sdp-page .doc-icon { font-size: 2rem; flex-shrink: 0; }
.sdp-page .doc-info { flex: 1; min-width: 0; }
.sdp-page .doc-info h6 { margin: 0 0 0.25rem 0; font-weight: 600; }
.sdp-page .doc-info p { margin: 0.25rem 0; }
.sdp-page .doc-actions { display: flex; gap: 0.25rem; flex-shrink: 0; }
.sdp-page .skeleton-row { height: 80px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.sdp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.sdp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`