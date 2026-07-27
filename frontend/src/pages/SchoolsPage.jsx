import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'
import { SchoolApi } from '../services/api'

export default function SchoolsPage() {
  const [schools, setSchools] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadSchools()
  }, [page, size, statusFilter])

  const loadSchools = async (searchTerm = search) => {
    setLoading(true)
    setError(null)
    try {
      const res = await SchoolApi.list({
        page,
        size,
        search: searchTerm,
        status: statusFilter,
        sortBy: 'id',
        direction: 'desc'
      })
      const data = res?.data || res
      setSchools(data.content || [])
      setTotal(data.totalElements || 0)
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      console.error(e)
      setError('Failed to load schools from database')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    loadSchools(search)
  }

  const handleToggleStatus = async (schoolId) => {
    try {
      await SchoolApi.toggleStatus(schoolId)
      loadSchools()
    } catch (e) {
      console.error(e)
      alert('Failed to toggle school status')
    }
  }

  const handleDelete = async (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        await SchoolApi.delete(schoolId)
        loadSchools()
      } catch (e) {
        console.error(e)
        alert('Failed to delete school')
      }
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>Schools</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>Manage live schools on the platform</p>
        </div>
        <Link to="/admin/schools/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Create School
        </Link>
      </div>

      <form className="row g-2 mb-2" onSubmit={handleSearch}>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search schools by name, code, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {loading ? (
        <LoadingIndicator message="Loading schools..." />
      ) : error ? (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      ) : schools.length === 0 ? (
        <div className="alert alert-info py-2" style={{ fontSize: '12px' }}>No schools found in database</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>School Name</th>
                  <th>Code</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Subscription</th>
                  <th>AI</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school.id}>
                    <td>
                      <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        {school.logoUrl ? (
                          <img src={school.logoUrl} alt="Logo" className="rounded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <i className="bi bi-building text-primary" style={{ fontSize: '12px' }}></i>
                        )}
                      </div>
                    </td>
                    <td className="fw-medium">{school.schoolName}</td>
                    <td>{school.schoolCode}</td>
                    <td>{school.city || '—'}</td>
                    <td>
                      <span className={`badge ${school.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                        {school.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${school.subscriptionPlan === 'PREMIUM' ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                        {school.subscriptionPlan || 'BASIC'}
                      </span>
                    </td>
                    <td>
                      {school.aiEnabled ? (
                        <span className="badge bg-success" style={{ fontSize: '10px' }}>Yes</span>
                      ) : (
                        <span className="badge bg-secondary" style={{ fontSize: '10px' }}>No</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/admin/schools/${school.id}`} className="btn btn-sm btn-outline-primary" title="View Details">
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Link to={`/admin/schools/${school.id}/edit`} className="btn btn-sm btn-outline-secondary" title="Edit School">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(school.id)}
                          title="Delete School"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          className={`btn btn-sm ${school.status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(school.id)}
                          title={school.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {school.status === 'ACTIVE' ? <i className="bi bi-pause"></i> : <i className="bi bi-play"></i>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}