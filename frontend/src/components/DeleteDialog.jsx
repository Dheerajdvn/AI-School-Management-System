import React from 'react'

/**
 * DeleteDialog component for confirming document deletion.
 */
export default function DeleteDialog({ document, onConfirm, onCancel, loading }) {
  if (!document) return null

  return (
    <div className="delete-dialog position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ zIndex: 1056, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3 shadow-lg p-4" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-exclamation-triangle text-warning display-4" />
          <h5 className="mt-3 mb-2">Delete Document?</h5>
          <p className="text-muted mb-0">
            Are you sure you want to delete "<strong>{document.originalFilename}</strong>"?
            This action cannot be undone.
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-secondary flex-grow-1"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger flex-grow-1"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}