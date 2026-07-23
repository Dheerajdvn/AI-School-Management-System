import React, { useEffect, useState } from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

/**
 * Audit Logs Page - System audit log viewer
 * Role: ROLE_SUPER_ADMIN
 */
export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    loadLogs()
  }, [page, size])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const mockLogs = [
        { id: 1, timestamp: '2024-07-20 10:30:00', user: 'admin', action: 'SCHOOL_CREATED', details: 'Created Oakwood High School', ip: '192.168.1.100' },
        { id: 2, timestamp: '2024-07-20 09:15:00', user: 'admin', action: 'USER_ACTIVATED', details: 'Activated user admin_ohs', ip: '192.168.1.100' },
        { id: 3, timestamp: '2024-07-19 16:45:00', user: 'teacher1', action: 'ASSIGNMENT_CREATED', details: 'Created Math Assignment', ip: '192.168.1.50' },
        { id: 4, timestamp: '2024-07-19 14:20:00', user: 'student1', action: 'SUBMISSION_CREATED', details: 'Submitted assignment #123', ip: '192.168.1.200' },
      ]
      setLogs(mockLogs)
      setTotal(4)
      setTotalPages(1)
    } catch (e) {
      setError('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Audit Logs</h1>
          <p className="text-muted">System activity and security log</p>
        </div>
      </div>

      <form className="row g-2 mb-3" onSubmit={(e) => e.preventDefault()}>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <option value="">All Actions</option>
            <option value="SCHOOL_CREATED">School Created</option>
            <option value="USER_ACTIVATED">User Activated</option>
            <option value="USER_DEACTIVATED">User Deactivated</option>
            <option value="ASSIGNMENT_CREATED">Assignment Created</option>
            <option value="SUBMISSION_CREATED">Submission Created</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="User..."
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" type="submit">Apply Filters</button>
        </div>
      </form>

      {loading ? (
        <LoadingIndicator message="Loading audit logs..." />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : logs.length === 0 ? (
        <div className="alert alert-info">No audit logs found</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td>{log.user}</td>
                    <td>
                      <span className="badge bg-info">{log.action.replace('_', ' ')}</span>
                    </td>
                    <td>{log.details}</td>
                    <td><code>{log.ip}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}