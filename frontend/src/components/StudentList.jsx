import React from 'react'
import { formatDate } from '../utils/format'

export default function StudentList({ students = [], page = 0, onPageChange, total = 0 }) {
  const size = 10
  const totalPages = Math.max(1, Math.ceil((total || students.length) / size))

  return (
    <div>
      {students.length === 0 ? (
        <div className="text-muted">No students enrolled</div>
      ) : (
        <ul className="list-group">
          {students.map(s => (
            <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{s.studentName || s.username}</div>
                <div className="small text-muted">{s.studentEmail || s.email}</div>
              </div>
              <div className="small text-muted">{formatDate(s.enrollmentDate)}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex justify-content-end mt-2">
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
  )
}
