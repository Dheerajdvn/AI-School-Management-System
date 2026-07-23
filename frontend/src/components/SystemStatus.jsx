import React, { useEffect, useState } from 'react'
import { AiApi, DashboardApi } from '../services/api'

const SystemStatus = () => {
  const [status, setStatus] = useState({
    backend: 'unknown',
    ai: 'unknown',
    database: 'unknown'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setLoading(true)
    try {
      const backendRes = await fetch(window.location.origin + '/api/actuator/health')
        .then(r => r.ok ? 'healthy' : 'unhealthy')
        .catch(() => 'unhealthy')
      const aiRes = await AiApi.health()
        .then(() => 'healthy')
        .catch(() => 'unhealthy')
      const dbRes = await DashboardApi.totals()
        .then(() => 'healthy')
        .catch(() => 'unhealthy')
      
      setStatus({
        backend: backendRes,
        ai: aiRes,
        database: dbRes
      })
    } catch (e) {
      setStatus({
        backend: 'unhealthy',
        ai: 'unhealthy',
        database: 'unhealthy'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (statusValue) => {
    if (statusValue === 'healthy') {
      return <span className="badge bg-success">Online</span>
    }
    return <span className="badge bg-danger">Offline</span>
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-hdd-network me-2" />
          System Status
        </h5>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={checkStatus}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise" />
        </button>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Backend Server</span>
          {getStatusBadge(status.backend)}
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>AI Service</span>
          {getStatusBadge(status.ai)}
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Database</span>
          {getStatusBadge(status.database)}
        </div>
      </div>
    </div>
  )
}

export default SystemStatus