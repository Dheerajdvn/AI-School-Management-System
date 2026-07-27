import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AssignmentApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAssignments()
  }, [page, size])

  const loadAssignments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await AssignmentApi.list({ page, size, sortBy: 'id', direction: 'desc' })
      const data = res?.data || res
      setAssignments(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading assignments..." />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>Assignments</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>Manage student assignments and submissions</p>
        </div>
        <Link to="/admin/assignments/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>
          Create Assignment
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td className="fw-medium">{a.title}</td>
                <td>{a.courseName || '—'}</td>
                <td>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</td>
                <td>{a.submissionCount ?? 0}</td>
                <td>
                  <span className={`badge ${a.status === 'PUBLISHED' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Link to={`/admin/assignments/${a.id}`} className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link to={`/admin/assignments/${a.id}/edit`} className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-pencil"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={total > 0 ? Math.ceil(total / size) : 1}
        totalElements={total}
        onPageChange={setPage}
      />
    </div>
  )
}