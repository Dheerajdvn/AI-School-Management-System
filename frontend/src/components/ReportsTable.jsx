import React from 'react'

const ReportsTable = ({ reports = [], loading = false, error = null, onDownloadReport }) => {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm bg-card p-4 text-center">
        <span className="spinner-border spinner-border-sm text-primary me-2" />
        <span className="text-muted">Loading system reports...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger py-2 rounded-3" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="card border-0 shadow-sm bg-card overflow-hidden mt-4" style={{ borderRadius: '14px' }}>
      <div className="card-header bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-file-text text-primary" /> Generated System Reports
        </h5>
        <span className="badge bg-primary bg-opacity-10 text-primary border px-2.5 py-1">
          {reports.length} Reports Ready
        </span>
      </div>
      <div className="table-responsive">
        {reports.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-5 d-block mb-2 opacity-50" />
            No reports generated for the selected date range.
          </div>
        ) : (
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface">
              <tr>
                <th className="ps-3" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Report Name</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Generated Date</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Record Count</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>File Size</th>
                <th className="pe-3 text-end" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <tr key={idx}>
                  <td className="ps-3 fw-semibold">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-file-earmark-bar-graph text-primary fs-5" />
                      <div>
                        <div>{report.type || report.name || 'System Summary Report'}</div>
                        <small className="text-muted x-small">{report.description || 'Automated platform metric audit'}</small>
                      </div>
                    </div>
                  </td>
                  <td className="small text-muted">{report.date ? new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Today'}</td>
                  <td className="small font-monospace">{report.records || 100} rows</td>
                  <td className="small text-muted">{report.size || '32 KB'}</td>
                  <td className="pe-3 text-end">
                    <div className="d-inline-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success p-1 px-2 rounded-2"
                        onClick={() => onDownloadReport && onDownloadReport(report, 'csv')}
                        title="Download CSV"
                      >
                        <i className="bi bi-file-earmark-spreadsheet me-1" /> CSV
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger p-1 px-2 rounded-2"
                        onClick={() => onDownloadReport && onDownloadReport(report, 'pdf')}
                        title="Download PDF"
                      >
                        <i className="bi bi-file-earmark-pdf me-1" /> PDF
                      </button>
                    </div>
                  </td>
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