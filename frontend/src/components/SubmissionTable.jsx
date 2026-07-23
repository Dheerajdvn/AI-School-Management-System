import React from 'react'
import { formatDate } from '../utils/format'
import SubmissionStatusBadge from './SubmissionStatusBadge'
import Pagination from './Pagination'
import LoadingIndicator from './LoadingIndicator'

const SubmissionTable = ({ 
  submissions = [], 
  page = 0, 
  size = 10, 
  total = 0, 
  totalPages = 1,
  loading = false,
  error = null,
  onPageChange,
  onViewDetails 
}) => {
  if (loading) {
    return <LoadingIndicator message="Loading submissions..." />
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {error}
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }} />
        <p className="text-muted mt-2 mb-0">No submissions found</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <tr key={s.id}>
                <td>{s.studentName || '—'}</td>
                <td>{s.assignmentTitle || s.assignmentCode || '—'}</td>
                <td>{formatDate(s.submittedAt) || '—'}</td>
                <td><SubmissionStatusBadge status={s.status} /></td>
                <td>{s.obtainedMarks !== null ? s.obtainedMarks : '—'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onViewDetails && onViewDetails(s)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="card-footer">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default SubmissionTable