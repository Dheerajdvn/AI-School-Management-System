import React from 'react'
import { formatDate } from '../utils/format'
import SubmissionStatusBadge from './SubmissionStatusBadge'

const SubmissionDetails = ({ submission, onClose }) => {
  if (!submission) return null

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Submission Details</h5>
        {onClose && (
          <button className="btn-close" onClick={onClose} aria-label="Close" />
        )}
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <h6>Student Information</h6>
            <p className="mb-1"><strong>Name:</strong> {submission.studentName || '—'}</p>
            <p className="mb-1"><strong>ID:</strong> {submission.studentId || '—'}</p>
          </div>
          <div className="col-md-6">
            <h6>Assignment Information</h6>
            <p className="mb-1"><strong>Name:</strong> {submission.assignmentTitle || submission.assignmentCode || '—'}</p>
            <p className="mb-1"><strong>ID:</strong> {submission.assignmentId || '—'}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h6>Submission Date</h6>
            <p className="mb-1">{formatDate(submission.submittedAt) || '—'}</p>
          </div>
          <div className="col-md-6">
            <h6>Status</h6>
            <p className="mb-1"><SubmissionStatusBadge status={submission.status} /></p>
          </div>
        </div>

        <div className="mb-3">
          <h6>Submission Text</h6>
          <p className="mb-1 text-break" style={{ whiteSpace: 'pre-wrap' }}>
            {submission.submissionText || 'No submission text provided'}
          </p>
        </div>

        {submission.attachmentUrl && (
          <div className="mb-3">
            <h6>Attachment</h6>
            <a href={submission.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
              <i className="bi bi-file-earmark-text me-1" />
              View Attachment
            </a>
          </div>
        )}

        <div className="row mb-3">
          <div className="col-md-6">
            <h6>Grade</h6>
            <p className="mb-1">{submission.obtainedMarks !== null ? submission.obtainedMarks : '—'}</p>
          </div>
          <div className="col-md-6">
            <h6>Graded At</h6>
            <p className="mb-1">{formatDate(submission.gradedAt) || '—'}</p>
          </div>
        </div>

        {submission.feedback && (
          <div className="mb-3">
            <h6>Feedback</h6>
            <p className="mb-1 text-break" style={{ whiteSpace: 'pre-wrap' }}>
              {submission.feedback}
            </p>
          </div>
        )}

        {submission.gradedByName && (
          <div className="mb-3">
            <h6>Graded By</h6>
            <p className="mb-1">{submission.gradedByName}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmissionDetails