import React, { useState, useCallback } from 'react'

/**
 * File types supported for upload
 */
const SUPPORTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt']

/**
 * UploadZone component for drag & drop file upload and manual file selection.
 */
export default function UploadZone({ onUpload, loading }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      return 'Unsupported file type. Please upload PDF, DOCX, or TXT files.'
    }
    if (!SUPPORTED_TYPES.includes(file.type) && ext !== '.txt') {
      // Re-check for text files that might have wrong MIME type
      if (ext === '.txt' && !file.type) return null
      return 'Invalid file type.'
    }
    return null
  }

  const handleFiles = (files) => {
    const file = files[0]
    if (!file) return

    const error = validateFile(file)
    if (error) {
      alert(error)
      return
    }

    setSelectedFile(file)
    onUpload(file)
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const handleChange = (e) => {
    handleFiles(e.target.files)
  }

  return (
    <div 
      className={`upload-zone border border-2 border-dashed rounded-3 p-4 text-center ${dragOver ? 'border-primary bg-light' : 'border-secondary'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      <input
        type="file"
        id="file-upload"
        className="d-none"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        onChange={handleChange}
        disabled={loading}
      />
      
      <label htmlFor="file-upload" className="mb-0 w-100">
        <div className="mb-3">
          <i className="bi bi-cloud-upload" style={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
        </div>
        <h5 className="mb-2">
          {loading ? 'Uploading...' : 'Drag & Drop Files Here'}
        </h5>
        <p className="text-muted mb-3">
          Or click to browse • PDF, DOCX, TXT supported
        </p>
        
        {selectedFile && !loading && (
          <div className="alert alert-info py-2 mb-0">
            <i className="bi bi-file-text me-2" />
            {selectedFile.name}
          </div>
        )}
        
        <button 
          type="button" 
          className="btn btn-primary mt-3"
          disabled={loading}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <i className="bi bi-folder2-open me-2" />
          Choose File
        </button>
      </label>
    </div>
  )
}