import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container-fluid py-5">
      <div className="text-center">
        <h1 className="display-1 text-muted">404</h1>
        <h2>Page Not Found</h2>
        <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house me-1" />
          Go Home
        </Link>
      </div>
    </div>
  )
}