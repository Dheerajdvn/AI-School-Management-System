import React from 'react'
import { formatDate } from '../utils/format'

export default function CourseTable({ courses = [], onEdit, onDelete, onView, page, size, total, onPageChange, onSizeChange }) {
  const totalPages = Math.max(1, Math.ceil((total || courses.length) / size))

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Teacher</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">No courses found</td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.courseCode}</td>
                  <td><a href="#" onClick={(e) => { e.preventDefault(); onView(c) }}>{c.title}</a></td>
                  <td>{c.teacherName}</td>
                  <td>{c.status}</td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm" role="group">
                      <button className="btn btn-action-view" onClick={() => onView(c)}>
                        <i className="bi bi-eye" /> View
                      </button>
                      <button className="btn btn-outline-secondary" onClick={() => onEdit(c)}>
                        <i className="bi bi-pencil" /> Edit
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => onDelete(c)}>
                        <i className="bi bi-trash" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <label className="small text-muted">Show
            <select value={size} onChange={(e) => onSizeChange(Number(e.target.value))} className="form-select d-inline-block ms-2" style={{ width: 100 }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            entries
          </label>
        </div>
        <div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${page <= 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(Math.max(0, page - 1))}>Previous</button>
              </li>
              <li className="page-item disabled"><span className="page-link">Page {page + 1} of {totalPages}</span></li>
              <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
