import React, { useState, useCallback } from 'react'

/**
 * File types supported for upload
 */
const SUPPORTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/png', 'image/jpeg']
const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg']

/**
 * UploadZone component for drag & drop file upload and manual file selection.
 * Includes document type & course selection and a Save / Upload button.
 */
export default function UploadZone({ onUpload, loading, documentTypes = [], courses = [] }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [validationError, setValidationError] = useState('')

  const validateFile = (file) => {
    if (!file) return 'Please select a file to upload.'
    if (file.size === 0) {
      return 'The selected file is empty. Please choose a valid non-empty file.'
    }
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      return `Unsupported file extension (${ext}). Please upload PDF, DOCX, TXT, PNG, or JPEG files.`
    }
    return null
  }

  const handleFiles = (files) => {
    const file = files[0]
    if (!file) return

    const error = validateFile(file)
    if (error) {
      setValidationError(error)
      alert(error)
      return
    }

    setValidationError('')
    setSelectedFile(file)
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

  const handleSave = () => {
    if (!selectedFile) return
    onUpload(selectedFile, selectedType || null, selectedCourse || null)
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setSelectedType('')
    setSelectedCourse('')
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
      
      {!selectedFile ? (
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
      ) : (
        <div className="upload-preview text-start p-3 bg-white rounded border">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-file-text text-primary fs-4" />
              <div>
                <h6 className="mb-0 fw-bold">{selectedFile.name}</h6>
                <small className="text-muted">{(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Unknown Type'}</small>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCancel}
              disabled={loading}
              title="Remove file"
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Document Type</label>
              <select 
                className="form-select form-select-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Document Type</option>
                {documentTypes.map(dt => (
                  <option key={dt.value} value={dt.value}>{dt.label}</option>
                ))}
              </select>
            </div>
            {courses.length > 0 && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Course</label>
                <select 
                  className="form-select form-select-sm"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select Course (Optional)</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title || c.name || c.courseCode || c.code || ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-sm"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm px-4"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-1" />
                  Save / Upload
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
