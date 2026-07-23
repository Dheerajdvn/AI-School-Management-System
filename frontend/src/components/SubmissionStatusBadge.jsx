import React from 'react'

const SubmissionStatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'DRAFT':
        return 'badge bg-secondary'
      case 'SUBMITTED':
        return 'badge bg-success'
      case 'LATE':
        return 'badge bg-warning text-dark'
      case 'GRADED':
        return 'badge bg-primary'
      default:
        return 'badge bg-light text-dark'
    }
  }

  return <span className={getStatusClass()}>{status || 'UNKNOWN'}</span>
}

export default SubmissionStatusBadge