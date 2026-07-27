import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AssignmentApi, SubmissionApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'

export default function AssignmentDetailsPage() {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAssignment()
  }, [id])

  const loadAssignment = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await AssignmentApi.get(id)
      const data = res?.data || res
      setAssignment(data)

      try {
        const subRes = await SubmissionApi.getByAssignment(id, { page: 0, size: 20 })
        const subData = subRes?.data || subRes
        setSubmissions(subData.content || [])
      } catch (err) {
        setSubmissions([])
      }
    } catch (e) {
      console.error(e)
      setError('Failed to load assignment details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading assignment details..." />

  if (error || !assignment) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error || 'Assignment not found'}</div>
        <Link to="/admin/assignments" className="btn btn-secondary btn-sm rounded-pill px-3">Back to Assignments</Link>
      </div>
    )
  }

  return (
    <div className="container-fluid py-2 animate-fade">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '18px' }}>Assignment Details</h3>
          <p className="text-muted m-0 small">{assignment.title}</p>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/admin/assignments/${id}/edit`} className="btn btn-primary btn-sm rounded-pill px-3">
            <i className="bi bi-pencil me-1" /> Edit
          </Link>
          <Link to="/admin/assignments" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-arrow-left me-1" /> Back
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm bg-card mb-4" style={{ borderRadius: '14px' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <span className="text-muted small fw-semibold d-block">Assignment Title</span>
              <span className="fw-bold fs-6">{assignment.title || '—'}</span>
            </div>
            <div className="col-md-6">
              <span className="text-muted small fw-semibold d-block">Course</span>
              <span className="fw-semibold">{assignment.courseName || '—'}</span>
            </div>
            <div className="col-md-4">
              <span className="text-muted small fw-semibold d-block">Due Date</span>
              <span>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}</span>
            </div>
            <div className="col-md-4">
              <span className="text-muted small fw-semibold d-block">Max Marks</span>
              <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-1 rounded-pill">{assignment.maxMarks ?? 100} Points</span>
            </div>
            <div className="col-md-4">
              <span className="text-muted small fw-semibold d-block">Status</span>
              <span className={`badge ${assignment.status === 'PUBLISHED' ? 'bg-success' : 'bg-secondary'} px-3 py-1 rounded-pill`}>
                {assignment.status || 'PUBLISHED'}
              </span>
            </div>
            <div className="col-12 mt-3 pt-3 border-top">
              <span className="text-muted small fw-semibold d-block mb-1">Instructions & Description</span>
              <p className="text-body-secondary mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {assignment.description || 'No detailed instructions provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm bg-card" style={{ borderRadius: '14px' }}>
        <div className="card-header bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0" style={{ fontSize: '15px' }}>
            <i className="bi bi-file-earmark-check me-2 text-primary" />
            Student Submissions ({submissions.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-surface">
                <tr>
                  <th className="ps-3">Student Name</th>
                  <th>Submitted At</th>
                  <th>Obtained Marks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4 small">
                      No submissions recorded for this assignment yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="ps-3 fw-medium">{sub.studentName || sub.username || '—'}</td>
                      <td className="small text-muted">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '—'}</td>
                      <td>
                        <span className="fw-bold text-primary">{sub.obtainedMarks ?? '—'}</span> / {assignment.maxMarks ?? 100}
                      </td>
                      <td>
                        <span className={`badge ${sub.status === 'GRADED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {sub.status || 'SUBMITTED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
