import React, { useEffect, useState } from 'react'
import { AuditApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLogs()
  }, [page, size])

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await AuditApi.list({ page, size, sortBy: 'timestamp', direction: 'desc' })
      const data = res?.data || res
      setLogs(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading audit logs..." />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>Audit Logs</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>System activity and change history</p>
        </div>
        <div></div>
      </div>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</td>
                <td className="fw-medium">{log.username || log.user?.username || 'System'}</td>
                <td><span className={`badge ${log.action === 'DELETE' ? 'bg-danger' : log.action === 'UPDATE' ? 'bg-warning' : 'bg-success'}`} style={{ fontSize: '10px' }}>{log.action}</span></td>
                <td>{log.entityType || '—'}</td>
                <td style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.description || log.details || '—'}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{log.ipAddress || '—'}</td>
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