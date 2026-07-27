import React, { useEffect, useState } from 'react'
import knowledgeService from '../../services/knowledgeService'
import StatCard from '../../components/StatCard'
import Chart from '../../components/Charts'
import LoadingIndicator from '../../components/LoadingIndicator'

export default function KnowledgeDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await knowledgeService.getDashboard()
        if (isMounted) {
          setData(res || {})
        }
      } catch (e) {
        if (isMounted) {
          console.error('Failed to load knowledge dashboard:', e)
          setError('Failed to load knowledge dashboard statistics. Please try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <LoadingIndicator message="Loading AI Knowledge Dashboard..." />
  }

  const {
    totalDocuments = 0,
    totalCollections = 0,
    indexedDocuments = 0,
    pendingDocuments = 0,
    failedDocuments = 0,
    recentUploads = [],
    uploadsPerDay = [],
    documentsByCollection = [],
    documentsByType = [],
  } = data || {}

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success'
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-warning text-dark'
      case 'FAILED':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '18px' }}>AI Knowledge Dashboard</h3>
          <p className="text-muted m-0" style={{ fontSize: '13px' }}>Real-time overview of AI knowledge base, collections, and vector ingestion</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center mb-3 py-2" style={{ fontSize: '13px' }}>
          <span><i className="bi bi-exclamation-triangle-fill me-2" />{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Empty State Banner */}
      {!error && totalDocuments === 0 && (
        <div className="alert alert-info mb-3 py-2" style={{ fontSize: '13px' }}>
          <i className="bi bi-info-circle-fill me-2" />
          No documents found in knowledge base. Upload documents in the Knowledge Library to populate AI analytics.
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="row g-2 mb-3">
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Documents" value={totalDocuments} icon="bi-file-earmark-text" color="primary" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Collections" value={totalCollections} icon="bi-folder" color="info" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Indexed" value={indexedDocuments} icon="bi-check-circle" color="success" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Pending" value={pendingDocuments} icon="bi-hourglass-split" color="warning" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Failed" value={failedDocuments} icon="bi-exclamation-triangle" color="danger" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Recent Uploads" value={recentUploads.length} icon="bi-clock-history" color="primary" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-3">
        {/* Uploads Trend */}
        <div className="col-lg-8">
          <div className="card h-100 p-3">
            <h5 className="fw-bold mb-3" style={{ fontSize: '14px' }}>
              <i className="bi bi-graph-up me-2 text-primary" />
              Uploads Trend (Last 7 Days)
            </h5>
            {uploadsPerDay.length > 0 ? (
              <Chart
                type="line"
                title="Uploads Count"
                labels={uploadsPerDay.map(u => u.date || '')}
                values={uploadsPerDay.map(u => u.count || 0)}
              />
            ) : (
              <div className="text-muted py-5 text-center" style={{ fontSize: '13px' }}>No upload activity recorded in the last 7 days</div>
            )}
          </div>
        </div>

        {/* Document Types */}
        <div className="col-lg-4">
          <div className="card h-100 p-3">
            <h5 className="fw-bold mb-3" style={{ fontSize: '14px' }}>
              <i className="bi bi-pie-chart me-2 text-info" />
              Documents by Type
            </h5>
            {documentsByType.length > 0 ? (
              <Chart
                type="pie"
                title="File Types"
                labels={documentsByType.map(t => t.name || t.type || 'Other')}
                values={documentsByType.map(t => t.count || 0)}
              />
            ) : (
              <div className="text-muted py-5 text-center" style={{ fontSize: '13px' }}>No document types categorized</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Collections & Recent Uploads Table */}
      <div className="row g-3">
        {/* Documents by Collection */}
        <div className="col-lg-6">
          <div className="card h-100 p-3">
            <h5 className="fw-bold mb-3" style={{ fontSize: '14px' }}>
              <i className="bi bi-bar-chart me-2 text-success" />
              Documents by Collection
            </h5>
            {documentsByCollection.length > 0 ? (
              <Chart
                type="bar"
                title="Collection Breakdown"
                labels={documentsByCollection.map(c => c.name || 'General')}
                values={documentsByCollection.map(c => c.count || 0)}
              />
            ) : (
              <div className="text-muted py-5 text-center" style={{ fontSize: '13px' }}>No collections found</div>
            )}
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div className="col-lg-6">
          <div className="card h-100 p-3">
            <h5 className="fw-bold mb-3" style={{ fontSize: '14px' }}>
              <i className="bi bi-clock me-2 text-warning" />
              Recent Uploads
            </h5>
            {recentUploads.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-borderless align-middle mb-0" style={{ fontSize: '12px' }}>
                  <thead className="table-dark text-muted">
                    <tr>
                      <th>Document</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.map((doc) => (
                      <tr key={doc.id || doc.originalFilename}>
                        <td>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: '180px' }} title={doc.originalFilename || doc.filename}>
                            {doc.originalFilename || doc.filename || `Document #${doc.id}`}
                          </div>
                          {doc.courseCode && (
                            <small className="text-muted">{doc.courseCode}</small>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-dark border text-uppercase" style={{ fontSize: '10px' }}>
                            {doc.documentType || 'File'}
                          </span>
                        </td>
                        <td className="text-muted">{formatFileSize(doc.fileSize)}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(doc.processingStatus)}`} style={{ fontSize: '10px' }}>
                            {doc.processingStatus || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted py-5 text-center" style={{ fontSize: '13px' }}>No recent document uploads</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}