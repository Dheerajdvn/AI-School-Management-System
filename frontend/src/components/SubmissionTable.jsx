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
      <div className="alert alert-danger rounded-3 py-2" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="card border-0 shadow-sm bg-card overflow-hidden" style={{ borderRadius: '14px' }}>
      <div className="table-responsive">
        {submissions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-4 d-block mb-2 opacity-50" />
            No submissions found for the selected filters.
          </div>
        ) : (
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface">
              <tr>
                <th className="ps-3" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assignment Title</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission Date</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade</th>
                <th className="pe-3 text-end" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-circle bg-primary bg-opacity-20 text-primary fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {(s.studentName || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold small">{s.studentName || 'Student'}</div>
                        <small className="text-muted x-small">{s.studentEmail || 'student@school.edu'}</small>
                      </div>
                    </div>
                  </td>
                  <td className="fw-medium small">{s.assignmentTitle || s.assignmentCode || 'Assignment Item'}</td>
                  <td className="small text-muted">{formatDate(s.submittedAt) || 'Recent'}</td>
                  <td><SubmissionStatusBadge status={s.status} /></td>
                  <td className="small fw-bold">
                    {s.obtainedMarks !== null && s.obtainedMarks !== undefined ? (
                      <span className="text-success">{s.obtainedMarks} / 100</span>
                    ) : (
                      <span className="text-muted font-monospace">— / 100</span>
                    )}
                  </td>
                  <td className="pe-3 text-end">
                    <button 
                      className="btn btn-sm btn-outline-primary rounded-3 px-3 py-1 fw-semibold"
                      onClick={() => onViewDetails && onViewDetails(s)}
                    >
                      <i className="bi bi-eye me-1" /> View & Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-top bg-surface">
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