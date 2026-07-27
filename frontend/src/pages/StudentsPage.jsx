import React, { useEffect, useState, useCallback } from 'react'
import { StudentApi } from '../services/api'
import { formatCurrency, formatDate, formatNumber } from '../utils/format'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'
import StudentModal from './StudentModal'

const PAGE_SIZES = [10, 20, 50, 100]

export default function StudentsPage() {
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 })
  const [params, setParams] = useState({ page: 0, size: 20, sortBy: 'id', direction: 'asc' })
  const [filters, setFilters] = useState({ name: '', course: '', city: '', minFee: '', maxFee: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState({ open: false, student: null })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const active = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null),
      )
      const res =
        Object.keys(active).length > 0
          ? await StudentApi.search({ ...params, ...active })
          : await StudentApi.list(params)
      setData(res || { content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [params, filters])

  useEffect(() => {
    load()
  }, [load])

  const goToPage = (p) => setParams((s) => ({ ...s, page: p }))

  const sortBy = (col) =>
    setParams((s) => ({
      ...s,
      sortBy: col,
      direction: s.sortBy === col && s.direction === 'asc' ? 'desc' : 'asc',
      page: 0,
    }))

  const applyFilters = (e) => {
    e.preventDefault()
    setParams((s) => ({ ...s, page: 0 }))
    load()
  }

  const resetFilters = () => {
    setFilters({ name: '', course: '', city: '', minFee: '', maxFee: '' })
    setParams({ page: 0, size: 20, sortBy: 'id', direction: 'asc' })
  }

  const onSaved = () => {
    setModal({ open: false, student: null })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this student?')) return
    try {
      await StudentApi.remove(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const sortIcon = (col) =>
    params.sortBy === col ? (params.direction === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill') : 'bi-arrow-down-up'

  const from = data.totalElements === 0 ? 0 : data.page * data.size + 1
  const to = Math.min((data.page + 1) * data.size, data.totalElements)

  return (
    <div>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      {/* Filters */}
      <form className="panel mb-3" onSubmit={applyFilters}>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small">Name</label>
            <input className="form-control" value={filters.name}
                   onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Course</label>
            <input className="form-control" value={filters.course}
                   onChange={(e) => setFilters({ ...filters, course: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small">City</label>
            <input className="form-control" value={filters.city}
                   onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          </div>
          <div className="col-md-1">
            <label className="form-label small">Min ₹</label>
            <input className="form-control" value={filters.minFee}
                   onChange={(e) => setFilters({ ...filters, minFee: e.target.value })} />
          </div>
          <div className="col-md-1">
            <label className="form-label small">Max ₹</label>
            <input className="form-control" value={filters.maxFee}
                   onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })} />
          </div>
          <div className="col-md-1 d-grid gap-1">
            <button className="btn btn-primary btn-sm" type="submit"><i className="bi bi-funnel" /></button>
            <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetFilters}>
              <i className="bi bi-arrow-counterclockwise" />
            </button>
          </div>
        </div>
      </form>

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="text-muted small">
          Showing {from}–{to} of {formatNumber(data.totalElements)} students
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ open: true, student: null })}>
          <i className="bi bi-plus-lg me-1" /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="panel p-0 overflow-hidden">
        {loading ? (
          <Spinner label="Loading students…" />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  {['id', 'name', 'course', 'subject', 'fee', 'address', 'joiningDate'].map((c) => (
                    <th key={c} onClick={() => sortBy(c)} style={{ cursor: 'pointer' }}>
                      {labelFor(c)} <i className={`bi ${sortIcon(c)} small`} />
                    </th>
                  ))}
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td><span className="badge badge-soft bg-primary-subtle text-primary">{s.course}</span></td>
                    <td>{s.subject}</td>
                    <td>{formatCurrency(s.fee)}</td>
                    <td>{s.address}</td>
                    <td>{formatDate(s.joiningDate)}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setModal({ open: true, student: s })}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(s.id)}>
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!data.content.length && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <div>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={params.size}
            onChange={(e) => setParams({ ...params, size: Number(e.target.value), page: 0 })}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </div>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${data.first ? 'disabled' : ''}`}>
              <span className="page-link" onClick={() => goToPage(0)}>«</span>
            </li>
            <li className={`page-item ${data.first ? 'disabled' : ''}`}>
              <span className="page-link" onClick={() => goToPage(data.page - 1)}>‹ Prev</span>
            </li>
            <li className="page-item active"><span className="page-link">Page {data.page + 1} / {data.totalPages || 1}</span></li>
            <li className={`page-item ${data.last ? 'disabled' : ''}`}>
              <span className="page-link" onClick={() => goToPage(data.page + 1)}>Next ›</span>
            </li>
            <li className={`page-item ${data.last ? 'disabled' : ''}`}>
              <span className="page-link" onClick={() => goToPage(data.totalPages - 1)}>»</span>
            </li>
          </ul>
        </nav>
      </div>

      <StudentModal
        open={modal.open}
        student={modal.student}
        onClose={() => setModal({ open: false, student: null })}
        onSaved={onSaved}
      />
    </div>
  )
}

function labelFor(key) {
  return {
    id: 'ID',
    name: 'Name',
    course: 'Course',
    subject: 'Subject',
    fee: 'Fee',
    address: 'City',
    joiningDate: 'Joined',
  }[key] || key
}
