import React, { useState } from 'react'

/**
 * DocumentPreview component for previewing document content.
 */
export default function DocumentPreview({ document, content, onClose }) {
  if (!document) return null

  return (
    <div className="document-preview position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3 shadow-lg" style={{ maxWidth: '800px', maxHeight: '80vh', width: '90%' }}>
        {/* Header */}
        <div className="border-bottom p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-truncate" style={{ maxWidth: '600px' }}>
            {document.originalFilename}
          </h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          {content ? (
            <div className="document-content">
              <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {content}
              </pre>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-file-text display-4 text-muted" />
              <p className="text-muted mt-3">No preview available for this document type.</p>
              <p className="small text-muted">You can still download or manage this document.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-top p-3 text-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}