import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import knowledgeService from '../../services/knowledgeService'
import LoadingIndicator from '../../components/LoadingIndicator'
import Pagination from '../../components/Pagination'

export default function KnowledgeLibrary() {
  const [items, setItems] = useState([])
  const [collections, setCollections] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLibrary()
    loadCollections()
  }, [page, size])

  const loadLibrary = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await knowledgeService.getDocuments({ page, size })
      const data = res?.data || res
      setItems(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load knowledge library')
    } finally {
      setLoading(false)
    }
  }

  const loadCollections = async () => {
    try {
      const res = await knowledgeService.getCollections()
      const data = res?.data || res
      setCollections(data.content || data || [])
    } catch (e) {
      console.error(e)
    }
  }

  if (loading && page === 0) return <LoadingIndicator message="Loading knowledge library..." />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>Knowledge Library</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>Curated documents and learning resources</p>
        </div>
        <Link to="/knowledge/upload" className="btn btn-primary btn-sm">
          <i className="bi bi-upload me-1"></i>
          Upload Document
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      )}

      <div className="row mb-2">
        {collections.map((col) => (
          <div key={col.id} className="col-md-4 mb-2">
            <div className="card h-100">
              <div className="card-body py-2">
                <h6 className="fw-bold mb-1" style={{ fontSize: '13px' }}>{col.name}</h6>
                <p className="text-muted m-0" style={{ fontSize: '11px' }}>{col.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Collection</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="fw-medium">{item.fileName || item.title || 'Untitled'}</td>
                <td>{item.fileType || item.mimeType || '—'}</td>
                <td>{item.collectionName || '—'}</td>
                <td>{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : '—'}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={total > 0 ? Math.ceil(total / size) : 1}
        totalElements={total}
        onPageChange={setPage}
      />
    </div>
  )
}