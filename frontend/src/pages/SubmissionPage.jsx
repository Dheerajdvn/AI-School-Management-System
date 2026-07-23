import React, { useEffect, useState } from 'react'
import SubmissionTable from '../components/SubmissionTable'
import SubmissionDetails from '../components/SubmissionDetails'
import LoadingIndicator from '../components/LoadingIndicator'
import { SubmissionApi, AssignmentApi } from '../services/api'

const SubmissionPage = () => {
  const [submissions, setSubmissions] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [assignments, setAssignments] = useState([])

  const loadSubmissions = async (p = page, s = size, f = filters) => {
    setLoading(true)
    setError(null)
    try {
      const res = await SubmissionApi.search({ ...f, page: p, size: s })
      const data = res?.data || res
      const content = data?.content || data
      setSubmissions(content || [])
      setPage(data.page ?? p)
      setSize(data.size ?? s)
      setTotal(data.totalElements ?? (content ? content.length : 0))
      setTotalPages(data.totalPages ?? 1)
    } catch (err) {
      console.error('Failed to load submissions', err)
      setError(err.message || 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmissions(0, size, filters)
    // Load assignments for filter
    AssignmentApi.list({ page: 0, size: 100 }).then(r => {
      const d = r?.data || r
      setAssignments(d.content || d || [])
    }).catch(() => {})
  }, [])

  const onSearch = (searchFilters) => {
    setFilters(searchFilters)
    loadSubmissions(0, size, searchFilters)
  }

  const handlePageChange = (newPage) => {
    loadSubmissions(newPage, size, filters)
  }

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission)
  }

  const handleCloseDetails = () => {
    setSelectedSubmission(null)
  }

  const handleResetFilters = () => {
    setFilters({})
    loadSubmissions(0, size, {})
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Submissions</h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <form className="row g-2 mb-3" onSubmit={(e) => { e.preventDefault(); onSearch(filters) }}>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filters.assignmentId || ''} 
            onChange={e => setFilters({ ...filters, assignmentId: e.target.value || null })}
          >
            <option value="">All assignments</option>
            {assignments.map(a => (
              <option key={a.id} value={a.id}>{a.title || a.courseCode}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={filters.status || ''} 
            onChange={e => setFilters({ ...filters, status: e.target.value || null })}
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="LATE">Late</option>
            <option value="GRADED">Graded</option>
          </select>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={filters.graded === '' ? '' : filters.graded || ''} 
            onChange={e => setFilters({ ...filters, graded: e.target.value === '' ? null : e.target.value === 'true' })}
          >
            <option value="">All graded</option>
            <option value="false">Not graded</option>
            <option value="true">Graded</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">Search</button>
        </div>
      </form>

      <SubmissionTable 
        submissions={submissions}
        page={page}
        size={size}
        total={total}
        totalPages={totalPages}
        loading={loading}
        error={error}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />

      {selectedSubmission && (
        <div className="mt-4">
          <SubmissionDetails 
            submission={selectedSubmission} 
            onClose={handleCloseDetails}
          />
        </div>
      )}
    </div>
  )
}

export default SubmissionPage