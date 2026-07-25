import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import useToast from '../../hooks/useToast'

export default function KnowledgeLibrary() {
  const { success, error } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    collection: '',
    status: '',
  })

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const params = { ...filters }
      if (searchQuery) params.search = searchQuery
      const data = await knowledgeService.getDocuments(params)
      const list = data?.content || data?.data || (Array.isArray(data) ? data : [])
      setDocuments(Array.isArray(list) ? list : [])
    } catch (err) {
      error('Failed to load documents: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDocuments()
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await knowledgeService.deleteDocument(id)
      success('Document deleted successfully!')
      setDocuments(documents.filter(d => d.id !== id))
    } catch (err) {
      error('Failed to delete document: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleReindex = async (id) => {
    try {
      await knowledgeService.reindexDocument(id)
      success('Document reindexing started!')
    } catch (err) {
      error('Failed to reindex document: ' + (err.response?.data?.message || err.message))
    }
  }

  const getStatusBadge = (status) => {
    const st = String(status || 'Indexed')
    const styles = {
      Indexed: 'bg-success',
      indexed: 'bg-success',
      COMPLETED: 'bg-success',
      Processing: 'bg-warning text-dark',
      PROCESSING: 'bg-warning text-dark',
      Failed: 'bg-danger',
      FAILED: 'bg-danger',
    }
    return <span className={"badge " + (styles[st] || 'bg-secondary')}>{st}</span>
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Knowledge Library</h2>
        <div className="d-flex gap-2">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <div className="input-group" style={{ width: '250px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="submit">
                <i className="bi bi-search" />
              </button>
            </div>
          </form>
          <Link to="/admin/documents" className="btn btn-primary">
            <i className="bi bi-upload me-1" />
            Upload
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option>PDF</option>
                <option>DOCX</option>
                <option>TXT</option>
                <option>PPTX</option>
                <option>MD</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="">All Subjects</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>History</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.collection}
                onChange={(e) => setFilters({ ...filters, collection: e.target.value })}
              >
                <option value="">All Collections</option>
                <option>Science</option>
                <option>Mathematics</option>
                <option>Social Studies</option>
                <option>Formulas</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option>Indexed</option>
                <option>Processing</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Loading documents...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && documents.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-folder-x text-muted" style={{ fontSize: '3rem' }} />
            <h5 className="mt-3">No Documents Found</h5>
            <p className="text-muted">Upload your first document to get started.</p>
            <Link to="/admin/documents" className="btn btn-primary">
              <i className="bi bi-upload me-1" />
              Upload Documents
            </Link>
          </div>
        </div>
      )}

      {/* Documents Table */}
      {!loading && documents.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded By</th>
                    <th>Subject</th>
                    <th>Collection</th>
                    <th>Status</th>
                    <th>Chunks</th>
                    <th>Embeddings</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const docName = doc.originalFilename || doc.filename || doc.name || doc.title || 'Untitled'
                    const docType = doc.documentType || doc.type || 'OTHER'
                    const docSize = doc.fileSize ? (doc.fileSize / 1024).toFixed(1) + ' KB' : doc.size || '—'
                    const uploadedBy = doc.uploadedByName || doc.uploadedBy || doc.uploaded_by || 'Admin'
                    const statusVal = doc.processingStatus || doc.status || 'Indexed'
                    const dateVal = doc.uploadTime ? new Date(doc.uploadTime).toLocaleDateString() : doc.date || doc.createdAt || 'N/A'
                    return (
                      <tr key={doc.id}>
                        <td className="fw-medium">{docName}</td>
                        <td><span className="badge bg-secondary">{docType}</span></td>
                        <td>{docSize}</td>
                        <td>{uploadedBy}</td>
                        <td>{doc.subject || 'General'}</td>
                        <td>{doc.collection || 'General'}</td>
                        <td>{getStatusBadge(statusVal)}</td>
                        <td>{doc.chunks || 0}</td>
                        <td>{doc.embeddings || doc.embeddingCount || 0}</td>
                        <td>{dateVal}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link to={`/knowledge/document/${doc.id}`} className="btn btn-outline-primary" title="View">
                              <i className="bi bi-eye" />
                            </Link>
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => handleReindex(doc.id)}
                              title="Reindex document"
                            >
                              <i className="bi bi-arrow-clockwise" />
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(doc.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
