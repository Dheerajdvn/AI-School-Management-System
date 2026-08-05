import React, { useEffect, useState } from 'react'
import { AiApi, DashboardApi } from '../services/api'

const SystemStatus = () => {
  const [status, setStatus] = useState({
    api: 'healthy',
    database: 'healthy',
    redis: 'healthy',
    ollama: 'healthy',
    qdrant: 'healthy'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch(window.location.origin + '/api/actuator/health')
      const data = await response.json().catch(() => ({}))
      
      const isApiAlive = response.status === 200 || data.components !== undefined
      const apiStatus = isApiAlive ? 'healthy' : 'degraded'
      const dbStatus = data.components?.db?.status === 'UP' ? 'healthy' : 'degraded'
      const redisStatus = data.components?.redis?.status === 'UP' ? 'healthy' : 'degraded'
      const ollamaStatus = data.components?.ollama?.status === 'UP' ? 'healthy' : 'degraded'
      const qdrantStatus = (data.components?.qdrant?.status === 'UP' || data.components?.qdrant?.status === undefined) && isApiAlive ? 'healthy' : 'degraded'
      
      setStatus({
        api: apiStatus,
        database: dbStatus,
        redis: redisStatus,
        ollama: ollamaStatus,
        qdrant: qdrantStatus
      })
    } catch (e) {
      setStatus({
        api: 'degraded',
        database: 'degraded',
        redis: 'degraded',
        ollama: 'degraded',
        qdrant: 'degraded'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (statusValue) => {
    if (statusValue === 'healthy') {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill d-flex align-items-center gap-1 small">
          <span className="spinner-dot bg-success" style={{ width: 6, height: 6, borderRadius: '50%' }} /> Operational
        </span>
      )
    }
    return (
      <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill d-flex align-items-center gap-1 small">
        <span className="bg-danger" style={{ width: 6, height: 6, borderRadius: '50%' }} /> Degraded
      </span>
    )
  }

  const services = [
    { key: 'api', name: 'API Gateway', icon: 'bi-hdd-network' },
    { key: 'database', name: 'Database (PostgreSQL)', icon: 'bi-database' },
    { key: 'redis', name: 'Redis Cache', icon: 'bi-lightning' },
    { key: 'ollama', name: 'Ollama LLM Engine', icon: 'bi-cpu' },
    { key: 'qdrant', name: 'Qdrant Vector DB', icon: 'bi-layers' },
  ]

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3 border-bottom">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-shield-check text-primary" />
          System Health & Services
        </h5>
        <button 
          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
          onClick={checkStatus}
          disabled={loading}
          title="Refresh Status"
        >
          <i className={`bi bi-arrow-clockwise ${loading ? 'spinner-border spinner-border-sm' : ''} me-1`} /> Refresh
        </button>
      </div>
      <div className="card-body p-3">
        <div className="row g-2">
          {services.map((s) => (
            <div key={s.key} className="col-md-12">
              <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-surface border">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${s.icon} text-muted fs-5`} />
                  <span className="fw-medium text-dark">{s.name}</span>
                </div>
                {getStatusBadge(status[s.key])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemStatus