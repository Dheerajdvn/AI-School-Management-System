import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import useToast from '../../hooks/useToast'

export default function DocumentDetails() {
  const { id } = useParams()
  const { success, error } = useToast()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [extractedText, setExtractedText] = useState('')

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    setLoading(true)
    try {
      const data = await knowledgeService.getDocument(id)
      setDocument(data)
      setExtractedText(data?.content || data?.extractedText || '')
    } catch (err) {
      error('Failed to load document: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await knowledgeService.deleteDocument(id)
      success('Document deleted successfully!')
      window.location.href = '/knowledge/library'
    } catch (err) {
      error('Failed to delete document: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleReindex = async () => {
    try {
      await knowledgeService.reindexDocument(id)
      success('Document reindexing started!')
    } catch (err) {
      error('Failed to reindex document: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Loading document details...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="container-fluid">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-triangle text-muted" style={{ fontSize: '3rem' }} />
            <h5 className="mt-3">Document Not Found</h5>
            <Link to="/knowledge/library" className="btn btn-primary mt-2">
              <i className="bi bi-arrow-left me-1" />
              Back to Library
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Document Details</h2>
        <Link to="/knowledge/library" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1" />
          Back to Library
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Document Metadata */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Document Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Name:</strong> {document.name || document.title}</p>
                  <p className="mb-1"><strong>Type:</strong> <span className="badge bg-secondary">{document.type}</span></p>
                  <p className="mb-1"><strong>Size:</strong> {document.size}</p>
                  <p className="mb-1"><strong>Uploaded By:</strong> {document.uploadedBy || document.uploaded_by}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Subject:</strong> {document.subject}</p>
                  <p className="mb-1"><strong>Collection:</strong> {document.collection}</p>
                  <p className="mb-1"><strong>Status:</strong> 
                    <span className={"badge ms-1 " + 
                      (document.status === 'Indexed' || document.status === 'indexed' ? 'bg-success' : 
                       document.status === 'Processing' ? 'bg-warning text-dark' : 'bg-danger')
                    }>
                      {document.status}
                    </span>
                  </p>
                  <p className="mb-1"><strong>Date:</strong> {document.date || document.createdAt}</p>
                </div>
              </div>
              <div className="mt-3">
                <strong>Tags:</strong>
                {(document.tags || []).map((tag) => (
                  <span key={tag} className="badge bg-info me-1">{tag}</span>
                ))}
              </div>
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-outline-warning" onClick={handleReindex}>
                  <i className="bi bi-arrow-clockwise me-1" />
                  Reindex
                </button>
                <button className="btn btn-outline-danger" onClick={handleDelete}>
                  <i className="bi bi-trash me-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Extracted Text Preview</h5>
            </div>
            <div className="card-body">
              <div className="border rounded p-3" style={{ maxHeight: '300px', overflow: 'auto' }}>
                {extractedText ? (
                  <p className="mb-0">{extractedText}</p>
                ) : (
                  <p className="text-muted mb-0">No extracted text available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Processing Status */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Processing Pipeline</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle text-success me-2" />
                <span>Uploaded</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle text-success me-2" />
                <span>Parsing Complete</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle text-success me-2" />
                <span>Chunking Complete ({document.chunks || 0} chunks)</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle text-success me-2" />
                <span>Embedding Complete ({document.embeddings || document.embeddingCount || 0} vectors)</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle text-success me-2" />
                <span>Vector Storage Complete</span>
              </div>
            </div>
          </div>

          {/* Vector IDs */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Vector Storage</h5>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>Vector IDs:</strong></p>
              <div className="d-flex flex-wrap gap-1">
                {Array.from({ length: document.embeddings || document.embeddingCount || 0 }, (_, i) => (
                  <span key={i} className="badge bg-light text-dark">vec-{id}-{i + 1}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}