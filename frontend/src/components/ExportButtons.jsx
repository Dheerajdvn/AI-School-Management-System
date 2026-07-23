import React from 'react'

const ExportButtons = ({ onExportCsv, onExportPdf, onPrint }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <button className="btn btn-success" onClick={onExportCsv}>
        <i className="bi bi-file-earmark-spreadsheet me-1" />
        Export CSV
      </button>
      <button className="btn btn-danger" onClick={onExportPdf}>
        <i className="bi bi-file-earmark-pdf me-1" />
        Export PDF
      </button>
      <button className="btn btn-secondary" onClick={onPrint}>
        <i className="bi bi-printer me-1" />
        Print
      </button>
    </div>
  )
}

export default ExportButtons