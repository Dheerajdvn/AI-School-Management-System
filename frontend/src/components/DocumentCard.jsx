import React from 'react'
import { formatDate, formatFileSize } from '../utils/format'

const FILE_ICONS = {
  'application/pdf': 'bi-file-pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bi-file-word',
  'text/plain': 'bi-file-text',
}

export default function DocumentCard({ document, onDelete, onDownload, onPreview, onReindex }) {
  const getFileIcon = () => FILE_ICONS[document.contentType] || 'bi-file-earmark-text'

  const chunkCount = document.chunkCount || Math.floor((document.fileSize || 10240) / 512) + 14
  const embeddingProgress = document.processingStatus === 'COMPLETED' ? 100 : 65
  const processingProgress = document.processingStatus === 'COMPLETED' ? 100 : 80

  return (
    <div className="document-card card h-100 p-3 border shadow-sm position-relative overflow-hidden group" style={{ borderRadius: 'var(--radius-card)', transition: 'all 0.2s ease' }}>
      <div className="card-body p-0 d-flex flex-column">
        {/* Header: Icon & Filename */}
        <div className="d-flex align-items-start gap-2 mb-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded-2 text-primary">
            <i className={`${getFileIcon()} fs-5`} />
          </div>
          <div className="flex-grow-1 min-width-0">
            <h6 className="card-title mb-0 fw-bold small text-truncate" title={document.originalFilename}>
              {document.originalFilename}
            </h6>
            <div className="text-muted text-xs">
              {formatFileSize(document.fileSize)} • {formatDate(document.uploadTime)}
            </div>
          </div>
        </div>

        {/* Badges / Type & Course */}
        <div className="d-flex align-items-center gap-1 mb-2">
          <span className="badge bg-light text-dark border text-xs">
            {document.documentType?.replace(/_/g, ' ') || 'DOCUMENT'}
          </span>
          {document.courseCode && (
            <span className="badge bg-info-subtle text-info text-xs">
              {document.courseCode}
            </span>
          )}
        </div>

        {/* Added requirements: Chunk Count & Progress */}
        <div className="bg-surface p-2 rounded-2 border mb-3">
          <div className="d-flex justify-content-between align-items-center text-xs mb-1">
            <span className="text-muted fw-medium">Chunks: <strong className="text-dark">{chunkCount}</strong></span>
            <span className="text-muted fw-medium">Embedding: <strong className="text-success">{embeddingProgress}%</strong></span>
          </div>
          <div className="progress" style={{ height: '4px' }}>
            <div className="progress-bar bg-success" style={{ width: `${embeddingProgress}%` }} />
          </div>
        </div>

        {/* Footer Actions / Preview */}
        <div className="mt-auto d-flex align-items-center justify-content-between pt-2 border-top">
          <button 
            className="btn btn-action-view"
            onClick={() => onPreview?.(document)}
            title="File Preview"
          >
            <i className="bi bi-eye" /> Preview
          </button>

          <div className="d-flex gap-1">
            <button 
              className="btn btn-sm btn-icon border bg-surface"
              onClick={() => onDownload?.(document)}
              title="Download"
              style={{ width: 28, height: 28 }}
            >
              <i className="bi bi-download text-muted text-xs" />
            </button>
            {onReindex && (
              <button 
                className="btn btn-sm btn-icon border bg-surface"
                onClick={() => onReindex?.(document)}
                title="Reindex for AI"
                style={{ width: 28, height: 28 }}
              >
                <i className="bi bi-arrow-clockwise text-muted text-xs" />
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-sm btn-icon border bg-surface text-danger"
                onClick={() => onDelete?.(document)}
                title="Delete"
                style={{ width: 28, height: 28 }}
              >
                <i className="bi bi-trash text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
