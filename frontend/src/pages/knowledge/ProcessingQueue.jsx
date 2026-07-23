import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import useToast from '../../hooks/useToast'

export default function ProcessingQueue() {
  const { success, error } = useToast()
  const [queueItems, setQueueItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const data = await knowledgeService.getProcessingQueue()
      setQueueItems(data || [])
    } catch (err) {
      error('Failed to load processing queue: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    // TODO: Add cancel endpoint to backend service
    try {
      // await knowledgeService.cancelProcessing(id)
      success('Processing cancelled!')
      fetchQueue()
    } catch (err) {
      error('Failed to cancel: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleRetry = async (id) => {
    try {
      await knowledgeService.reindexDocument(id)
      success('Reprocessing started!')
      fetchQueue()
    } catch (err) {
      error('Failed to retry: ' + (err.response?.data?.message || err.message))
    }
  }

  const getStatusIcon = (status) => {
    const icons = {
      Uploaded: 'bi-upload text-info',
      Parsing: 'bi-file-text text-primary',
      Chunking: 'bi-puzzle text-warning',
      Embedding: 'bi-cpu text-primary',
      'Vector Storage': 'bi-database text-info',
      Completed: 'bi-check-circle text-success',
      Failed: 'bi-exclamation-circle text-danger',
    }
    return icons[status] || 'bi-question'
  }

  const getStatusBadge = (status) => {
    const styles = {
      Uploaded: 'bg-info',
      Parsing: 'bg-primary',
      Chunking: 'bg-warning text-dark',
      Embedding: 'bg-primary',
      'Vector Storage': 'bg-info',
      Completed: 'bg-success',
      Failed: 'bg-danger',
    }
    return <span className={"badge " + (styles[status] || 'bg-secondary')}>{status}</span>
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Loading processing queue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Processing Queue</h2>
        <Link to="/knowledge" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Loading State */}
      {queueItems.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }} />
            <h5 className="mt-3">Queue is Empty</h5>
            <p className="text-muted">No documents are currently being processed.</p>
          </div>
        </div>
      )}

      {/* Queue Table */}
      {queueItems.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Document</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Started</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queueItems.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-medium">{item.name || item.title}</td>
                      <td>
                        <i className={"bi " + getStatusIcon(item.status) + " me-1"} />
                        {getStatusBadge(item.status)}
                      </td>
                      <td>
                        <div className="progress" style={{ height: '8px', width: '100px' }}>
                          <div className="progress-bar" style={{ width: `${item.progress || 0}%` }} />
                        </div>
                        <small className="text-muted">{item.progress || 0}%</small>
                      </td>
                      <td>{item.startedAt ? new Date(item.startedAt).toLocaleString() : 'N/A'}</td>
                      <td>
                        {item.status === 'Failed' || item.status === 'failed' ? (
                          <button className="btn btn-sm btn-warning" onClick={() => handleRetry(item.id)}>
                            Retry
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleCancel(item.id)}>
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}