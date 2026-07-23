import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import useToast from '../../hooks/useToast'

export default function Collections() {
  const { success, error } = useToast()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCollection, setNewCollection] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    setLoading(true)
    try {
      const data = await knowledgeService.getCollections()
      setCollections(data || [])
    } catch (err) {
      error('Failed to load collections: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await knowledgeService.createCollection(newCollection)
      success('Collection created successfully!')
      setShowAddModal(false)
      setNewCollection({ name: '', description: '' })
      fetchCollections()
    } catch (err) {
      error('Failed to create collection: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Loading collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Collections</h2>
        <Link to="/knowledge" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 && (
        <div className="row g-3">
          {collections.map((collection) => (
            <div className="col-md-4 col-lg-3" key={collection.id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title">{collection.name}</h5>
                      <p className="text-muted small">{collection.documentCount || collection.documents?.length || 0} documents</p>
                    </div>
                    <span className="badge bg-primary">Active</span>
                  </div>
                  {collection.description && (
                    <p className="card-text small text-muted mb-3">{collection.description}</p>
                  )}
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye" />
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      <i className="bi bi-pencil" />
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Collection */}
          <div className="col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div className="card-body text-center">
                <button 
                  className="btn btn-lg btn-outline-secondary rounded-circle" 
                  style={{ width: '60px', height: '60px' }}
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
                <p className="mt-2 mb-0">Add Collection</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-collection text-muted" style={{ fontSize: '3rem' }} />
            <h5 className="mt-3">No Collections Found</h5>
            <p className="text-muted">Create your first collection to organize documents.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus me-1" />
              Add Collection
            </button>
          </div>
        </div>
      )}

      {/* Add Collection Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Collection</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Collection Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                    placeholder="Enter collection name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreate}>Create Collection</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}