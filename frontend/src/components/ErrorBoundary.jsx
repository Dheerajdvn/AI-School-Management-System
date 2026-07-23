import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error reporting service
    if (window.reportError) {
      window.reportError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="container-fluid py-5">
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }} />
            <h2 className="mt-3">Something went wrong</h2>
            <p className="text-muted">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise me-1" />
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}