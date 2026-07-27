import React from 'react'

const ExportButtons = ({ onExportCsv, onExportPdf, onPrint, exportingCsv = false, exportingPdf = false }) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
      <button
        type="button"
        className="btn btn-success shadow-xs rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2"
        onClick={onExportCsv}
        disabled={exportingCsv}
        title="Export analytics and system report to CSV format"
      >
        {exportingCsv ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          <i className="bi bi-file-earmark-spreadsheet-fill fs-6" />
        )}
        <span>Export CSV</span>
      </button>

      <button
        type="button"
        className="btn btn-danger shadow-xs rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2"
        onClick={onExportPdf}
        disabled={exportingPdf}
        title="Export analytics report to PDF document"
      >
        {exportingPdf ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          <i className="bi bi-file-earmark-pdf-fill fs-6" />
        )}
        <span>Export PDF</span>
      </button>

      <button
        type="button"
        className="btn btn-outline-secondary shadow-xs rounded-3 fw-semibold px-3 py-2 d-flex align-items-center gap-2"
        onClick={onPrint}
        title="Open browser print dialog for this page"
      >
        <i className="bi bi-printer-fill fs-6" />
        <span>Print Report</span>
      </button>
    </div>
  )
}

export default ExportButtons