import React, { useEffect, useState } from 'react'
import { DocumentApi, CourseApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'
import { useToast } from '../hooks/useToast'

export default function DocumentPage() {
  const { success: showSuccess, error: showError } = useToast()

  // Data State
  const [documents, setDocuments] = useState([])
  const [courses, setCourses] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter State
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  // Modals & Drawers State
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [viewDoc, setViewDoc] = useState(null)
  const [viewContent, setViewContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState(null)

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadCourseId, setUploadCourseId] = useState('')
  const [uploadDocType, setUploadDocType] = useState('SYLLABUS')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    loadDocuments()
    loadCourses()
  }, [page, size, typeFilter])

  const loadCourses = async () => {
    try {
      const res = await CourseApi.list({ page: 0, size: 100 })
      const data = res?.data || res
      setCourses(data.content || [])
    } catch (e) {
      console.error('Failed to load courses for upload dropdown:', e)
    }
  }

  const loadDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, size, sortBy: 'uploadTime', direction: 'desc' }
      if (typeFilter !== 'ALL') {
        params.documentType = typeFilter
      }
      if (search.trim()) {
        params.search = search.trim()
      }
      const res = await DocumentApi.list(params)
      const data = res?.data || res
      setDocuments(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(0)
    loadDocuments()
  }

  // File Upload Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      showError('Please select a file to upload')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      await DocumentApi.upload(
        selectedFile,
        uploadCourseId ? Number(uploadCourseId) : null,
        uploadDocType,
        null,
        (progress) => setUploadProgress(progress)
      )
      showSuccess('Document uploaded successfully!')
      setShowUploadModal(false)
      setSelectedFile(null)
      setUploadProgress(0)
      loadDocuments()
    } catch (err) {
      console.error(err)
      showError('Upload failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  // View Details & Extracted Content Handler
  const handleView = async (doc) => {
    setViewDoc(doc)
    setViewContent(null)
    setContentLoading(true)
    try {
      const contentRes = await DocumentApi.getContent(doc.id)
      const contentData = contentRes?.data || contentRes
      setViewContent(contentData?.extractedText || 'No extracted text available for this document.')
    } catch (e) {
      setViewContent('Failed to load document content snippet.')
    } finally {
      setContentLoading(false)
    }
  }

  // Download Handler
  const handleDownload = async (doc) => {
    try {
      showSuccess(`Initiating download for ${doc.originalFilename || doc.filename || 'document'}...`)
      const blob = await DocumentApi.download(doc.id)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.originalFilename || doc.filename || `document_${doc.id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      console.error(e)
      showError('Failed to download document file')
    }
  }

  // Delete Handler
  const handleDelete = async (id) => {
    try {
      await DocumentApi.delete(id)
      showSuccess('Document deleted successfully!')
      setDeleteConfirmDoc(null)
      loadDocuments()
    } catch (e) {
      console.error(e)
      showError('Failed to delete document')
    }
  }

  // Helper formatting functions
  const getFileName = (doc) => doc.originalFilename || doc.filename || doc.fileName || doc.name || 'Untitled Document'
  
  const getFileType = (doc) => {
    const name = getFileName(doc)
    if (name.includes('.')) {
      const ext = name.split('.').pop().toUpperCase()
      return ext
    }
    if (doc.contentType) {
      if (doc.contentType.includes('pdf')) return 'PDF'
      if (doc.contentType.includes('word') || doc.contentType.includes('docx')) return 'DOCX'
      if (doc.contentType.includes('text')) return 'TXT'
    }
    return doc.documentType || 'DOC'
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (e) {
      return dateStr
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-2.5 py-1">Completed</span>
      case 'PROCESSING':
        return <span className="badge bg-info bg-opacity-25 text-info rounded-pill px-2.5 py-1"><span className="spinner-border spinner-border-sm me-1" style={{ width: '10px', height: '10px' }} />Processing</span>
      case 'PENDING':
        return <span className="badge bg-warning bg-opacity-25 text-warning text-dark rounded-pill px-2.5 py-1">Pending</span>
      case 'FAILED':
        return <span className="badge bg-danger bg-opacity-25 text-danger rounded-pill px-2.5 py-1">Failed</span>
      default:
        return <span className="badge bg-secondary bg-opacity-25 text-secondary rounded-pill px-2.5 py-1">{status || 'Ready'}</span>
    }
  }

  const getExtensionIcon = (ext) => {
    switch (ext) {
      case 'PDF': return <i className="bi bi-file-earmark-pdf text-danger fs-5" />
      case 'DOCX':
      case 'DOC': return <i className="bi bi-file-earmark-word text-primary fs-5" />
      case 'TXT':
      case 'MD': return <i className="bi bi-file-earmark-text text-info fs-5" />
      case 'PPT':
      case 'PPTX': return <i className="bi bi-file-earmark-slides text-warning fs-5" />
      case 'XLS':
      case 'XLSX': return <i className="bi bi-file-earmark-excel text-success fs-5" />
      default: return <i className="bi bi-file-earmark text-muted fs-5" />
    }
  }

  return (
    <div className="container-fluid py-2 animate-fade">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '18px' }}>
            <i className="bi bi-folder2-open text-primary me-2" /> Document Management
          </h3>
          <p className="text-muted m-0 small">Browse, upload, inspect, and manage ingested files & vectors</p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-3 px-3 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-xs"
          onClick={() => setShowUploadModal(true)}
        >
          <i className="bi bi-upload" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card border-0 shadow-sm mb-3 bg-card" style={{ borderRadius: '12px' }}>
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
            <div className="col-md-6 col-lg-7">
              <div className="input-group">
                <span className="input-group-text bg-surface text-muted border-end-0">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 style-input"
                  placeholder="Search documents by filename..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <select
                className="form-select style-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Document Types</option>
                <option value="SYLLABUS">Syllabus</option>
                <option value="LECTURE_NOTES">Lecture Notes</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="EXAM">Exam Paper</option>
              </select>
            </div>

            <div className="col-md-2 col-lg-2 d-grid">
              <button type="submit" className="btn btn-outline-primary fw-semibold rounded-3 btn-sm" style={{ height: '38px' }}>
                Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 py-2 mb-3" style={{ fontSize: '12px' }}>
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      )}

      {/* Main Table */}
      {loading ? (
        <LoadingIndicator message="Loading document repository..." />
      ) : documents.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-card" style={{ borderRadius: '14px' }}>
          <i className="bi bi-folder-x display-4 text-muted mb-2 opacity-50" />
          <h5 className="fw-bold">No Documents Found</h5>
          <p className="text-muted small">Upload a new PDF, DOCX, or text file to populate the database.</p>
          <div>
            <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={() => setShowUploadModal(true)}>
              Upload First Document
            </button>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm bg-card overflow-hidden" style={{ borderRadius: '14px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-surface">
                <tr>
                  <th className="ps-3" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
                  <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Size</th>
                  <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uploaded By</th>
                  <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                  <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th className="pe-3 text-end" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const ext = getFileType(doc)
                  return (
                    <tr key={doc.id}>
                      <td className="ps-3">
                        <div className="d-flex align-items-center gap-2">
                          {getExtensionIcon(ext)}
                          <div>
                            <div className="fw-semibold text-truncate" style={{ maxWidth: '240px' }} title={getFileName(doc)}>
                              {getFileName(doc)}
                            </div>
                            {doc.courseCode && (
                              <span className="badge bg-light text-muted border x-small">
                                {doc.courseCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 rounded">
                          {ext}
                        </span>
                      </td>
                      <td className="small text-muted">{formatFileSize(doc.fileSize)}</td>
                      <td className="small fw-medium">{doc.uploadedByName || doc.uploadedBy || 'System User'}</td>
                      <td className="small text-muted">{formatDate(doc.uploadTime || doc.uploadedAt)}</td>
                      <td>{getStatusBadge(doc.processingStatus)}</td>
                      <td className="pe-3 text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary p-1 px-2 rounded-2"
                            onClick={() => handleView(doc)}
                            title="View Document Details & Extracted Content"
                          >
                            <i className="bi bi-eye" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary p-1 px-2 rounded-2"
                            onClick={() => handleDownload(doc)}
                            title="Download File"
                          >
                            <i className="bi bi-download" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-1 px-2 rounded-2"
                            onClick={() => setDeleteConfirmDoc(doc)}
                            title="Delete Document"
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

          <div className="p-3 border-top bg-surface">
            <Pagination
              currentPage={page}
              totalPages={total > 0 ? Math.ceil(total / size) : 1}
              totalElements={total}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* 1. Upload Document Modal */}
      {showUploadModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-lg" style={{ maxWidth: '540px', width: '100%', borderRadius: '16px' }}>
            <div className="card-header bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-cloud-arrow-up text-primary me-2" /> Upload Document
              </h5>
              <button className="btn-close" onClick={() => setShowUploadModal(false)} />
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleUploadSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Select File <span className="text-danger">*</span></label>
                  <input
                    type="file"
                    className="form-control style-input"
                    accept=".pdf,.docx,.txt,.pptx,.md"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                  />
                  <small className="text-muted x-small mt-1 d-block">Supported formats: PDF, DOCX, TXT, PPTX, Markdown (Max 50MB)</small>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Associated Course (Optional)</label>
                  <select
                    className="form-select style-select"
                    value={uploadCourseId}
                    onChange={(e) => setUploadCourseId(e.target.value)}
                  >
                    <option value="">No Specific Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title || c.courseCode}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Document Type Category</label>
                  <select
                    className="form-select style-select"
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                  >
                    <option value="SYLLABUS">Syllabus</option>
                    <option value="LECTURE_NOTES">Lecture Notes</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="EXAM">Exam Paper</option>
                  </select>
                </div>

                {uploading && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Uploading to Qdrant Vector Pipeline...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light rounded-3 px-3" onClick={() => setShowUploadModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 fw-semibold" disabled={uploading}>
                    {uploading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-cloud-upload me-1" />}
                    Start Ingestion
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. View Document Details & Content Modal */}
      {viewDoc && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-lg" style={{ maxWidth: '640px', width: '100%', borderRadius: '16px' }}>
            <div className="card-header bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-file-earmark-text text-primary" /> Document Details #{viewDoc.id}
              </h5>
              <button className="btn-close" onClick={() => setViewDoc(null)} />
            </div>
            <div className="card-body p-4">
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <span className="text-muted x-small fw-semibold d-block">Filename</span>
                  <span className="fw-bold small">{getFileName(viewDoc)}</span>
                </div>
                <div className="col-md-6">
                  <span className="text-muted x-small fw-semibold d-block">File Size</span>
                  <span className="small">{formatFileSize(viewDoc.fileSize)}</span>
                </div>
                <div className="col-md-6">
                  <span className="text-muted x-small fw-semibold d-block">Content Type</span>
                  <span className="badge bg-light text-muted border">{viewDoc.contentType || viewDoc.documentType || 'PDF'}</span>
                </div>
                <div className="col-md-6">
                  <span className="text-muted x-small fw-semibold d-block">Ingestion Status</span>
                  {getStatusBadge(viewDoc.processingStatus)}
                </div>
              </div>

              <h6 className="fw-bold mb-2 small text-muted">Extracted Text Content Snippet</h6>
              <div className="p-3 rounded-3 bg-surface border overflow-auto" style={{ maxHeight: '200px', fontSize: '12px' }}>
                {contentLoading ? (
                  <div className="text-center py-3 text-muted">
                    <span className="spinner-border spinner-border-sm text-primary me-2" />
                    Fetching parsed content...
                  </div>
                ) : (
                  <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {viewContent}
                  </pre>
                )}
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-secondary rounded-3 px-4" onClick={() => setViewDoc(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Dialog */}
      {deleteConfirmDoc && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-lg p-4 text-center" style={{ maxWidth: '400px', width: '100%', borderRadius: '16px' }}>
            <i className="bi bi-exclamation-triangle-fill text-danger display-5 mb-2" />
            <h5 className="fw-bold mb-1">Confirm Delete</h5>
            <p className="text-muted small mb-4">
              Are you sure you want to delete <strong>{getFileName(deleteConfirmDoc)}</strong>? This will remove vectors from Qdrant.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-light rounded-3 px-3" onClick={() => setDeleteConfirmDoc(null)}>Cancel</button>
              <button className="btn btn-danger rounded-3 px-4 fw-semibold" onClick={() => handleDelete(deleteConfirmDoc.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}