import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import useToast from '../../hooks/useToast'

export default function UploadDocuments() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [formData, setFormData] = useState({
    subject: '',
    className: '',
    teacher: '',
    visibility: 'school',
    tags: '',
  })

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    
    try {
      for (const file of files) {
        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('subject', formData.subject)
        uploadData.append('className', formData.className)
        uploadData.append('teacher', formData.teacher)
        uploadData.append('visibility', formData.visibility)
        if (tagsArray.length > 0) {
          uploadData.append('tags', JSON.stringify(tagsArray))
        }
        
        setUploadProgress((prev) => ({ ...prev, [file.name]: 50 }))
        
        await knowledgeService.uploadDocument(uploadData)
        
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
      }
      
      success('Documents uploaded successfully!')
      setTimeout(() => navigate('/knowledge/library'), 1500)
    } catch (err) {
      error('Upload failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upload Documents</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/knowledge')}>
          <i className="bi bi-arrow-left me-1" />
          Back to Dashboard
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* File Upload Area */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Document Upload</h5>
            </div>
            <div className="card-body">
              <div className="border border-2 border-dashed rounded p-5 text-center mb-3">
                <i className="bi bi-cloud-upload text-primary mb-3" style={{ fontSize: '3rem' }} />
                <h5>Drag & Drop Files Here</h5>
                <p className="text-muted mb-3">Supported formats: PDF, DOCX, TXT, PPTX, Markdown</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.pptx,.md"
                  onChange={handleFileChange}
                  className="d-none"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="btn btn-primary">
                  Select Files
                </label>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-3">
                  <h6>Selected Files ({files.length})</h6>
                  <div className="list-group">
                    {files.map((file) => (
                      <div key={file.name} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <i className="bi bi-file-earmark me-2" />
                          {file.name}
                        </div>
                        <div>
                          {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                            <div className="progress me-3" style={{ width: '100px', height: '6px' }}>
                              <div className="progress-bar" style={{ width: `${uploadProgress[file.name]}%` }} />
                            </div>
                          )}
                          {uploadProgress[file.name] === 100 && (
                            <span className="badge bg-success">Completed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary mt-3" onClick={handleUpload}>
                    <i className="bi bi-upload me-1" />
                    Start Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Metadata Form */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Document Metadata</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>English</option>
                  <option>History</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Class</label>
                <select
                  className="form-select"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                >
                  <option value="">Select Class</option>
                  <option>Class 9-A</option>
                  <option>Class 9-B</option>
                  <option>Class 10-A</option>
                  <option>Class 10-B</option>
                  <option>Class 11-A</option>
                  <option>Class 11-B</option>
                  <option>Class 12-A</option>
                  <option>Class 12-B</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Teacher</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Teacher name"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Visibility</label>
                <select
                  className="form-select"
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                >
                  <option value="school">School Wide</option>
                  <option value="class">Class Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="comma separated tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}