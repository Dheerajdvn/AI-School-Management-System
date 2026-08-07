import React, { useState, useEffect } from 'react'
import { DocumentApi } from '../services/api'
import { formatDate, formatFileSize } from '../utils/format'

/**
 * DocumentPreview component with tabbed switching between Exact PDF View (via iframe Blob URL) and Extracted Text.
 */
export default function DocumentPreview({ document, content, onClose }) {
  if (!document) return null

  const [pdfUrl, setPdfUrl] = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  const isPdf = document.contentType === 'application/pdf' || document.originalFilename?.toLowerCase().endsWith('.pdf')
  
  const [activeTab, setActiveTab] = useState(isPdf ? 'pdf' : 'text')

  useEffect(() => {
    let objectUrl = null
    if (isPdf) {
      setLoadingPdf(true)
      setDownloadError(false)
      DocumentApi.download(document.id)
        .then(blob => {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' })
          objectUrl = window.URL.createObjectURL(pdfBlob)
          setPdfUrl(objectUrl)
        })
        .catch(err => {
          setDownloadError(true)
          if (import.meta.env.DEV) {
            console.error('Failed to load PDF for preview', err)
          }
        })
        .finally(() => {
          setLoadingPdf(false)
        })
    }
    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl)
      }
    }
  }, [document, isPdf])

  const handleDownloadOriginal = async () => {
    try {
      const blob = await DocumentApi.download(document.id)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = window.document.createElement('a')
      link.href = url
      link.setAttribute('download', document.originalFilename || document.filename)
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Download error:', e)
      }
      alert('Failed to download document')
    }
  }

  return (
    <div className="document-preview position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3 shadow-lg d-flex flex-column" style={{ maxWidth: '950px', maxHeight: '90vh', width: '92%', height: '88vh' }}>
        {/* Header */}
        <div className="border-bottom p-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0 text-truncate" style={{ maxWidth: '400px' }}>
              {document.originalFilename}
            </h5>
            {isPdf && (
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn ${activeTab === 'pdf' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('pdf')}
                >
                  <i className="bi bi-file-pdf me-1" /> PDF View
                </button>
                <button
                  type="button"
                  className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('text')}
                >
                  <i className="bi bi-file-text me-1" /> Extracted Text
                </button>
              </div>
            )}
          </div>
          <button className="btn-close" onClick={onClose} />
        </div>

        {/* Content Body */}
        <div className="p-3 flex-grow-1 overflow-auto bg-light d-flex flex-column">
          {isPdf && activeTab === 'pdf' ? (
            <div className="w-100 h-100 d-flex flex-column flex-grow-1 position-relative bg-white rounded border">
              {loadingPdf ? (
                <div className="text-center py-5 my-auto">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="text-muted mt-2">Loading exact PDF view...</p>
                </div>
              ) : pdfUrl && !downloadError ? (
                <div className="w-100 h-100 d-flex flex-column flex-grow-1">
                  <div className="p-2 border-bottom bg-light text-end">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      <i className="bi bi-box-arrow-up-right me-1" /> Open Full Screen PDF
                    </a>
                  </div>
                  <iframe
                    src={pdfUrl}
                    title={document.originalFilename}
                    className="w-100 flex-grow-1 bg-white border-0"
                    style={{ minHeight: '500px', height: '100%' }}
                  />
                </div>
              ) : (
                <div className="text-center py-5 bg-white rounded border my-auto">
                  <i className="bi bi-file-pdf display-4 text-danger" />
                  <p className="text-muted mt-3">Unable to load exact PDF view (file may be a demo record).</p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handleDownloadOriginal}
                  >
                    <i className="bi bi-download me-1" /> Download File
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="document-content bg-white p-4 rounded border flex-grow-1 overflow-auto shadow-sm">
              {content && content !== 'Loading preview...' ? (
                <pre className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.95rem' }}>
                  {content}
                </pre>
              ) : (
                <div className="text-center py-5 my-auto text-muted">
                  <i className="bi bi-file-text display-4 mb-2" />
                  <p>No extracted text preview available for this document.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-top p-3 d-flex justify-content-between align-items-center bg-white">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleDownloadOriginal}
          >
            <i className="bi bi-download me-1" /> Download Original File
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
