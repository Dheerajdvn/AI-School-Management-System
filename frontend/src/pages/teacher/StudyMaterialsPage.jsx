import React, { useState, useEffect } from 'react'
import useToast from '../../hooks/useToast'

export default function StudyMaterialsPage() {
  const { success: showSuccess } = useToast()
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'PDF',
    class: 'Class 10-A',
    subject: 'Mathematics',
    size: '1.5 MB'
  })

  const defaultMaterials = [
    { id: 1, title: 'Algebra Basics', type: 'PDF', class: 'Class 10-A', subject: 'Mathematics', size: '2.4 MB', uploadedAt: '2026-07-20' },
    { id: 2, title: 'Physics Lab Manual', type: 'PDF', class: 'Class 11-A', subject: 'Physics', size: '5.1 MB', uploadedAt: '2026-07-19' },
    { id: 3, title: 'Chemistry Presentation', type: 'PPT', class: 'Class 10-B', subject: 'Chemistry', size: '8.3 MB', uploadedAt: '2026-07-18' },
    { id: 4, title: 'English Essay Guide', type: 'DOCX', class: 'Class 12-A', subject: 'English', size: '1.2 MB', uploadedAt: '2026-07-17' },
    { id: 5, title: 'Math Tutorial Video', type: 'Video', class: 'Class 10-A', subject: 'Mathematics', size: '45 MB', uploadedAt: '2026-07-16' },
  ]

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('study_materials_list')
      if (stored) {
        setMaterials(JSON.parse(stored))
      } else {
        localStorage.setItem('study_materials_list', JSON.stringify(defaultMaterials))
        setMaterials(defaultMaterials)
      }
    } catch (e) {
      setMaterials(defaultMaterials)
    }
    setLoading(false)
  }, [])

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || m.type === typeFilter
    return matchSearch && matchType
  })

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    
    // Auto-compute current date
    const today = new Date().toISOString().split('T')[0]
    const createdItem = {
      id: Date.now(),
      title: newMaterial.title,
      type: newMaterial.type,
      class: newMaterial.class,
      subject: newMaterial.subject,
      size: newMaterial.size || '2.0 MB',
      uploadedAt: today
    }

    const updated = [createdItem, ...materials]
    setMaterials(updated)
    localStorage.setItem('study_materials_list', JSON.stringify(updated))
    setShowUploadModal(false)
    setNewMaterial({
      title: '',
      type: 'PDF',
      class: 'Class 10-A',
      subject: 'Mathematics',
      size: '1.5 MB'
    })
    showSuccess('Study material uploaded and published successfully!')
  }

  const handleDownload = (title) => {
    showSuccess(`Initiating secure local download for: ${title}`)
  }

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
      <div className="smp-page py-4">
        <div className="row g-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-12">
              <div className="skeleton-row animate-pulse" style={{ height: '80px', background: 'var(--surface)', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="smp-page py-4">
      <div className="page-header-custom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-folder-fill text-primary me-2" />Study Materials
          </h4>
          <p className="text-muted small mb-0 font-medium">Upload, organize, and share documents, slide decks, or lesson videos with classes.</p>
        </div>
        <button className="btn btn-primary rounded-3 px-3.5 fw-semibold d-flex align-items-center gap-2" onClick={() => setShowUploadModal(true)}>
          <i className="bi bi-upload" />
          <span>Upload Material</span>
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="search-bar">
            <i className="bi bi-search search-icon" />
            <input 
              type="text" 
              className="form-control style-search-input" 
              placeholder="Search materials by title or subject..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select style-search-input" 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="All">All Document Types</option>
            <option value="PDF">PDF Documents</option>
            <option value="DOCX">Word Sheets (DOCX)</option>
            <option value="PPT">PowerPoint Slides (PPT)</option>
            <option value="Video">Video Tutorials</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <i className="bi bi-folder-x text-muted display-4 mb-2 d-block" />
          <h6 className="fw-bold text-white mb-1" style={{ color: 'var(--text)' }}>No study materials found</h6>
          <p className="text-muted small mb-0">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(mat => (
            <div className="col-md-6 col-lg-4" key={mat.id}>
              <div className="material-card shadow-sm d-flex align-items-center justify-content-between p-3.5">
                <div className="d-flex align-items-center gap-3">
                  <div className="material-icon" style={{ color: getTypeColor(mat.type) }}>
                    <i className={`bi ${getTypeIcon(mat.type)}`} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-white mb-1" style={{ color: 'var(--text)' }}>{mat.title}</h6>
                    <div className="d-flex flex-wrap gap-1.5 align-items-center mt-1">
                      <span className="badge rounded-pill x-small px-2 py-0.5" style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                        {mat.type}
                      </span>
                      <small className="text-muted text-truncate" style={{ fontSize: '11px' }}>
                        {mat.subject} • {mat.class}
                      </small>
                    </div>
                    <small className="text-muted d-block mt-1.5" style={{ fontSize: '10px' }}>
                      Size: {mat.size} • Uploaded: {mat.uploadedAt}
                    </small>
                  </div>
                </div>
                <button className="btn btn-outline-secondary rounded-circle p-2 border-0" style={{ backgroundColor: 'var(--surface)' }} onClick={() => handleDownload(mat.title)}>
                  <i className="bi bi-download text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Material Dialog Modal */}
      {showUploadModal && (
        <div className="modal-overlay-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-2xl p-4" style={{ maxWidth: '480px', width: '100%', borderRadius: '16px', backgroundColor: '#17181B', borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <h5 className="fw-bold text-white mb-0"><i className="bi bi-upload text-primary me-2" />Upload Study Material</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowUploadModal(false)} />
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Material Title</label>
                <input
                  type="text"
                  className="form-control style-modal-input"
                  placeholder="e.g., Algebra Basics Part 2"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Type</label>
                  <select
                    className="form-select style-modal-input"
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="PPT">PPT</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">File Size</label>
                  <input
                    type="text"
                    className="form-control style-modal-input"
                    placeholder="e.g., 2.5 MB"
                    value={newMaterial.size}
                    onChange={(e) => setNewMaterial({ ...newMaterial, size: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control style-modal-input"
                    placeholder="e.g., Mathematics"
                    value={newMaterial.subject}
                    onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Class Target</label>
                  <select
                    className="form-select style-modal-input"
                    value={newMaterial.class}
                    onChange={(e) => setNewMaterial({ ...newMaterial, class: e.target.value })}
                  >
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 10-B">Class 10-B</option>
                    <option value="Class 11-A">Class 11-A</option>
                    <option value="Class 12-A">Class 12-A</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button type="button" className="btn btn-secondary rounded-3 px-3.5" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4 shadow-glow">Publish Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{smpStyles}</style>
    </div>
  )
}

const smpStyles = `
.smp-page .search-bar { position: relative; }
.smp-page .search-bar .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.55; z-index: 1; color: var(--text); }
.smp-page .style-search-input { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 12px; padding: 0.65rem 0.65rem 0.65rem 42px; color: var(--text) !important; font-size: 14px; }
.smp-page .style-search-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.smp-page .material-card { display: flex; align-items: center; justify-content: space-between; border-radius: 16px; background: var(--card); border: 1px solid var(--border); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.smp-page .material-card:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
.smp-page .material-icon { font-size: 1.85rem; flex-shrink: 0; line-height: 1; }
.modal-overlay-custom { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); z-index: 1060; padding: 1rem; }
.style-modal-input { background-color: rgba(255, 255, 255, 0.04) !important; border: 1px solid rgba(255, 255, 255, 0.12) !important; color: #ffffff !important; font-size: 14px; border-radius: 8px !important; padding: 0.6rem 0.85rem; }
.style-modal-input:focus { background-color: rgba(255, 255, 255, 0.07) !important; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important; color: #ffffff !important; }
.style-modal-input option { background-color: #17181b; color: #ffffff; }
`