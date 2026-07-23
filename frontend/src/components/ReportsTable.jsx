import React from 'react'
import { formatDate } from '../utils/format'

const ReportsTable = ({ reports = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-muted">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Reports</h5>
      </div>
      <div className="card-body p-0">
        {reports.length === 0 ? (
          <div className="text-center py-4 text-muted">No reports available</div>
        ) : (
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Report Type</th>
                <th>Date</th>
                <th>Records</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <tr key={idx}>
                  <td>{report.type || '—'}</td>
                  <td>{formatDate(report.date) || '—'}</td>
                  <td>{report.records || '—'}</td>
                  <td>{report.size || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ReportsTable