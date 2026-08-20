import React from 'react'
import { formatDate, formatFileSize } from '../utils/format'

export default function DocumentTable({ documents = [], onPreview, onDownload, onDelete, onReindex, user }) {

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Type</th>
            <th>Course</th>
            <th>Size</th>
            <th>Uploaded By</th>
            <th>Uploaded At</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="text-truncate" style={{ maxWidth: 240 }}>{doc.originalFilename || doc.filename}</td>
              <td>{(doc.documentType || 'OTHER').replace(/_/g, ' ')}</td>
              <td>{doc.courseCode || '-'}</td>
              <td>{formatFileSize(doc.fileSize)}</td>
              <td>{doc.uploadedByName || doc.uploadedById}</td>
              <td>{formatDate(doc.uploadTime)}</td>
              <td>
                <span className={`badge ${doc.processingStatus === 'COMPLETED' ? 'bg-success' : doc.processingStatus === 'FAILED' ? 'bg-danger' : 'bg-warning'}`}>
                  {doc.processingStatus}
                </span>
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm" role="group">
                  <button aria-label={`Preview ${doc.originalFilename}`} className="btn btn-action-view" onClick={() => onPreview?.(doc)} title="Preview">
                    <i className="bi bi-eye" />
                  </button>
                  <button aria-label={`Download ${doc.originalFilename}`} className="btn btn-outline-secondary" onClick={() => onDownload?.(doc)} title="Download">
                    <i className="bi bi-download" />
                  </button>
                  {onReindex && (
                    <button aria-label={`Reindex ${doc.originalFilename}`} className="btn btn-outline-secondary" onClick={() => onReindex?.(doc)} title="Reindex" disabled={doc.processingStatus !== 'COMPLETED'}>
                      <i className="bi bi-arrow-clockwise" />
                    </button>
                  )}
                  {onDelete && (
                    <button aria-label={`Delete ${doc.originalFilename}`} className="btn btn-outline-danger" onClick={() => onDelete?.(doc)} title="Delete">
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
