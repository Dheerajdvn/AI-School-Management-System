import React from 'react'

export default function OfflinePage() {
  return (
    <div className="container-fluid py-5">
      <div className="text-center">
        <i className="bi bi-wifi-off text-muted" style={{ fontSize: '4rem' }} />
        <h2 className="mt-3">You're Offline</h2>
        <p className="text-muted mb-4">Check your internet connection and try again.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          <i className="bi bi-arrow-clockwise me-1" />
          Retry
        </button>
      </div>
    </div>
  )
}