import React from 'react'
import { formatDate, formatFileSize } from '../utils/format'

/**
 * File type icons mapping
 */
const FILE_ICONS = {
  'application/pdf': 'bi-file-pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bi-file-word',
  'text/plain': 'bi-file-text',
}

/**
 * DocumentCard component to display a single document in a compact format.
 */
export default function DocumentCard({ document, onDelete, onDownload, onPreview, onReindex }) {
  const getFileIcon = () => {
    return FILE_ICONS[document.contentType] || 'bi-file'
  }

  return (
    <div className="document-card card h-100">
      <div className="card-body d-flex flex-column">
        {/* Document icon and name */}
        <div className="d-flex align-items-start mb-3">
          <div className="me-3">
            <i className={`${getFileIcon()} fs-1 text-primary`} />
          </div>
          <div className="flex-grow-1 min-width-0">
            <h6 className="card-title mb-1 text-truncate" title={document.originalFilename}>
              {document.originalFilename}
            </h6>
            <small className="text-muted">
              {formatFileSize(document.fileSize)} • {formatDate(document.uploadTime)}
            </small>
          </div>
        </div>

        {/* Document metadata */}
        <div className="mb-2">
          <span className="badge bg-light text-dark me-1">
            {document.documentType?.replace(/_/g, ' ') || 'UNKNOWN'}
          </span>
          {document.courseCode && (
            <span className="badge bg-info-subtle text-info">
              {document.courseCode}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <small className="text-muted">
            Status: 
            <span className={`ms-1 fw-medium ${
              document.processingStatus === 'COMPLETED' ? 'text-success' :
              document.processingStatus === 'FAILED' ? 'text-danger' : 'text-warning'
            }`}>
              {document.processingStatus}
            </span>
          </small>
        </div>

        {/* Actions */}
        <div className="mt-auto d-flex gap-2">
          <button 
            aria-label={`Preview ${document.originalFilename}`}
            className="btn btn-sm btn-outline-primary"
            onClick={() => onPreview?.(document)}
            title="Preview"
          >
            <i className="bi bi-eye" />
          </button>
          <button 
            aria-label={`Download ${document.originalFilename}`}
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onDownload?.(document)}
            title="Download"
          >
            <i className="bi bi-download" />
          </button>
          {onReindex && (
            <button 
              aria-label={`Reindex ${document.originalFilename}`}
              className="btn btn-sm btn-outline-info"
              onClick={() => onReindex?.(document)}
              title="Reindex for AI"
              disabled={document.processingStatus !== 'COMPLETED'}
            >
              <i className="bi bi-arrow-clockwise" />
            </button>
          )}
          {onDelete && (
            <button 
              aria-label={`Delete ${document.originalFilename}`}
              className="btn btn-sm btn-outline-danger ms-auto"
              onClick={() => onDelete?.(document)}
              title="Delete"
            >
              <i className="bi bi-trash" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}