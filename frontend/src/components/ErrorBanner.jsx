import React from 'react'

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="error-banner d-flex align-items-center justify-content-between">
      <span>
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {message}
      </span>
      {onDismiss && (
        <button className="btn-close btn-sm" onClick={onDismiss} aria-label="Close" />
      )}
    </div>
  )
}
