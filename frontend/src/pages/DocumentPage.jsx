import React, { useState, useEffect, useCallback } from 'react'
import { DocumentApi, RagApi, CourseApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import { useAuth } from '../context/AuthContext'
import UploadZone from '../components/UploadZone'
import DocumentCard from '../components/DocumentCard'
import DocumentPreview from '../components/DocumentPreview'
import DeleteDialog from '../components/DeleteDialog'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import Pagination from '../components/Pagination'
import ErrorBanner from '../components/ErrorBanner'
import useToast from '../hooks/useToast'

/**
 * Document Management page for the AI Student Management System.
 * Features:
 * - Drag & Drop upload
 * - Document list with search, filter, pagination
 * - Preview, download, delete, reindex actions
 */
export default function DocumentPage() {
  const { user } = useAuth()
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [size] = useState(12)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  // UI state
  const [previewDoc, setPreviewDoc] = useState(null)
  const [previewContent, setPreviewContent] = useState('')
  const [deleteDoc, setDeleteDoc] = useState(null)

  // Available filters
  const documentTypes = [
    { value: 'LECTURE_NOTES', label: 'Lecture Notes' },
    { value: 'ASSIGNMENT', label: 'Assignment' },
    { value: 'REFERENCE', label: 'Reference' },
    { value: 'SYLLABUS', label: 'Syllabus' },
    { value: 'OTHER', label: 'Other' },
  ]

  const [courses, setCourses] = useState([])

  useEffect(() => {
    CourseApi.list({ page: 0, size: 100 })
      .then(res => {
        const data = res?.content || res?.data || res || []
        setCourses(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
  }, [])

  // Fetch documents (uses backend pagination and sorting)
  const [sortBy, setSortBy] = useState('uploadTime')
  const [direction, setDirection] = useState('desc')

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, size, sortBy, direction }
      if (searchQuery) params.search = searchQuery
      if (selectedType) params.documentType = selectedType
      if (selectedCourse) params.courseId = selectedCourse

      const res = await DocumentApi.list(params)
      // res is PagedResponse: { content, page, size, totalElements, totalPages }
      setDocuments(res.content || [])
      setTotalPages(res.totalPages || 0)
      setTotalElements(res.totalElements || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, size, sortBy, direction, searchQuery, selectedType, selectedCourse])

  // Fetch documents when page, filters, or sort change
  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Debounce search/filter/sort to avoid excessive requests
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0)
      fetchDocuments()
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery, selectedType, selectedCourse, sortBy, direction])

  // Upload document
  const handleUpload = async (file, documentType, courseId) => {
    setUploading(true)
    setUploadProgress(0)
    setError('')
    setSuccess('')

    try {
      await DocumentApi.upload(file, courseId || selectedCourse, documentType || selectedType, user?.id, (percent) => {
        setUploadProgress(percent)
      })

      setSuccess('Document uploaded successfully!')
      if (typeof showSuccessToast === 'function') {
        showSuccessToast('Document uploaded successfully!')
      }
      // Refresh documents to include newly uploaded file
      setPage(0)
      fetchDocuments()
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Upload failed'
      setError(errorMessage)
      if (typeof showErrorToast === 'function') {
        showErrorToast(errorMessage)
      }
      if (import.meta.env.DEV) {
        console.error('Upload error:', e)
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Download document
  const handleDownload = async (doc) => {
    try {
      const blob = await DocumentApi.download(doc.id)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.originalFilename || doc.filename)
      document.body.appendChild(link)
      link.click()
      link.remove()

      setSuccess('Download started')
      if (typeof showSuccessToast === 'function') {
        showSuccessToast('Download started')
      }
    } catch (e) {
      let errMsg = 'Failed to download document'
      if (e.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text()
          const json = JSON.parse(text)
          errMsg = json.message || errMsg
        } catch (err) {}
      } else if (e.response?.data?.message) {
        errMsg = e.response.data.message
      } else if (e.message) {
        errMsg = e.message
      }
      setError(errMsg)
      if (typeof showErrorToast === 'function') {
        showErrorToast(errMsg)
      }
    }
  }

  // Preview document
  const handlePreview = async (doc) => {
    setPreviewDoc(doc)
    setPreviewContent('Loading preview...')
    setError('')

    try {
      const res = await DocumentApi.getContent(doc.id)
      // Depending on axios interceptor, res may already be the DTO
      const payload = res && res.data ? res.data : res
      const text = payload && payload.extractedText ? payload.extractedText : ''
      if (!text) {
        setPreviewContent('No preview available for this document.')
      } else {
        setPreviewContent(text)
      }
    } catch (e) {
      setPreviewContent('')
      const errMsg = e.response?.data?.message || e.message || 'Preview not available'
      setError(errMsg)
      if (typeof showErrorToast === 'function') {
        showErrorToast(errMsg)
      }
    }
  }

  // Close preview
  const closePreview = () => {
    setPreviewDoc(null)
    setPreviewContent('')
  }

  // Delete document
  const handleDelete = (doc) => {
    setDeleteDoc(doc)
  }

  const confirmDelete = async () => {
    if (!deleteDoc) return
    setLoading(true)
    try {
      await DocumentApi.remove(deleteDoc.id)
      setSuccess('Document deleted successfully!')
      // refresh current page
      fetchDocuments()
    } catch (e) {
      setError(e.message || 'Failed to delete document')
    } finally {
      setDeleteDoc(null)
      setLoading(false)
    }
  }

  // Reindex document
  const handleReindex = async (doc) => {
    setLoading(true)
    try {
      await RagApi.reindex(doc.id)
      setSuccess('Document reindexed successfully!')
      fetchDocuments()
    } catch (e) {
      setError(e.message || 'Failed to reindex document')
    } finally {
      setLoading(false)
    }
  }

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <div className="document-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Document Management</h4>
      </div>

      {/* Success/Error messages */}
      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4">
          <i className="bi bi-check-circle me-2" />
          {success}
        </div>
      )}
      
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      {/* Upload Section */}
      <div className="panel mb-4">
        <div className="panel-title mb-3">
          <i className="bi bi-upload me-2" />
          Upload New Document
        </div>
        
        <UploadZone 
          onUpload={handleUpload} 
          loading={uploading} 
          documentTypes={documentTypes}
          courses={courses}
        />
        
        {uploading && (
          <div className="mt-3">
            <div className="progress">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-4 d-flex flex-column flex-md-row gap-3 align-items-start">
        <div style={{ flex: 1 }}>
          <SearchBar 
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="d-flex gap-2 align-items-center">
          <div>
            <select className="form-select" value={selectedType || ''} onChange={(e) => setSelectedType(e.target.value || null)}>
              <option value="">All types</option>
              {documentTypes.map(dt => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <select className="form-select" value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>
      </div>

      <FilterPanel
        courses={courses}
        documentTypes={documentTypes}
        selectedCourse={selectedCourse}
        selectedType={selectedType}
        onCourseChange={setSelectedCourse}
        onTypeChange={setSelectedType}
        onClearFilters={() => {
          setSelectedCourse(null)
          setSelectedType(null)
        }}
      />

      {/* Document Grid */}
      <div className="panel mt-4">        {loading ? (
            <LoadingIndicator message="Loading documents..." />
          ) : documents.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-folder2-open display-4 text-muted" />
            <h5 className="mt-3">No documents found</h5>
            <p className="text-muted">
              Upload your first document using the upload area above.
            </p>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {documents.map(doc => (
                <div key={doc.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <DocumentCard
                    document={doc}
                    onDelete={user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_TEACHER') 
                      ? handleDelete : undefined}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                    onReindex={user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_TEACHER')
                      ? handleReindex : undefined}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4 pt-3 border-top">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <DocumentPreview 
        document={previewDoc}
        content={previewContent}
        onClose={closePreview}
      />
      
      <DeleteDialog
        document={deleteDoc}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDoc(null)}
        loading={loading}
      />
    </div>
  )
}