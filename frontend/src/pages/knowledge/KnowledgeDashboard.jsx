import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import useToast from '../../hooks/useToast'

export default function KnowledgeDashboard() {
  const { success, error } = useToast()
  const [stats, setStats] = useState({
    totalDocuments: 0,
    indexedDocuments: 0,
    collections: 0,
    aiSearches: 0,
  })
  const [recentUploads, setRecentUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [documentsByType, setDocumentsByType] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch documents
      const res = await knowledgeService.getDocuments({ limit: 5, sortBy: 'date' })
      const docs = res?.content || res?.data || (Array.isArray(res) ? res : [])
      const docList = Array.isArray(docs) ? docs : []
      setRecentUploads(docList)
      
      // Fetch collections
      const collections = await knowledgeService.getCollections()
      
      // Calculate stats
      const totalDocs = docList.length
      const indexedDocs = docList.filter(d => d.status === 'Indexed' || d.status === 'indexed' || d.processingStatus === 'COMPLETED').length
      
      // Calculate documents by type
      const typeCount = {}
      docList.forEach(doc => {
        const type = (doc.documentType || doc.type)?.toUpperCase() || 'UNKNOWN'
        typeCount[type] = (typeCount[type] || 0) + 1
      })
      const typeArray = Object.entries(typeCount).map(([type, count]) => ({
        type,
        count,
        percentage: totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0
      }))
      
      setStats({
        totalDocuments: totalDocs,
        indexedDocuments: indexedDocs > 0 ? indexedDocs : totalDocs,
        collections: collections?.length || 0,
        aiSearches: 0,
      })
      setDocumentsByType(typeArray.length > 0 ? typeArray : [
        { type: 'PDF', count: 0, percentage: 0 },
        { type: 'DOCX', count: 0, percentage: 0 },
        { type: 'TXT', count: 0, percentage: 0 },
        { type: 'PPTX', count: 0, percentage: 0 },
        { type: 'MD', count: 0, percentage: 0 },
      ])
    } catch (err) {
      error('Failed to load dashboard data: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>AI Knowledge Center</h2>
        <div className="text-muted">
          <i className="bi bi-clock me-1" />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Documents</p>
                  <h3 className="mb-0">{stats.totalDocuments}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Documents Indexed</p>
                  <h3 className="mb-0">{stats.indexedDocuments}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Collections</p>
                  <h3 className="mb-0">{stats.collections}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-collection text-info" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">AI Searches Today</p>
                  <h3 className="mb-0">{stats.aiSearches}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-search text-warning" style={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Uploads */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Recent Uploads</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Type</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.map((doc) => {
                      const docName = doc.originalFilename || doc.filename || doc.name || doc.title || 'Untitled'
                      const docType = doc.documentType || doc.type || 'OTHER'
                      const dateVal = doc.uploadTime ? new Date(doc.uploadTime).toLocaleDateString() : doc.date || doc.createdAt || 'N/A'
                      return (
                        <tr key={doc.id}>
                          <td className="fw-medium">{docName}</td>
                          <td><span className="badge bg-secondary">{docType}</span></td>
                          <td><small>{dateVal}</small></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Link to="/knowledge/library" className="btn btn-outline-primary btn-sm mt-2">
                View All Documents
              </Link>
            </div>
          </div>
        </div>

        {/* Documents by Type */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Documents by Type</h5>
            </div>
            <div className="card-body">
              {documentsByType.map((item) => (
                <div key={item.type} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{item.type}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/knowledge/upload" className="btn btn-primary">
                  <i className="bi bi-upload me-1" />
                  Upload Documents
                </Link>
                <Link to="/knowledge/search" className="btn btn-outline-primary">
                  <i className="bi bi-search me-1" />
                  AI Search
                </Link>
                <Link to="/knowledge/collections" className="btn btn-outline-primary">
                  <i className="bi bi-collection me-1" />
                  Manage Collections
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
