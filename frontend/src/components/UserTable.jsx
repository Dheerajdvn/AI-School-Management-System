import React from 'react'
import { formatDate } from '../utils/format'

export default function UserTable({ users = [], onEdit, onDelete, onView, onToggleEnabled, page, size, total, onPageChange, onSizeChange }) {
  const totalPages = Math.max(1, Math.ceil((total || users.length) / size))

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Created</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="fw-medium">
                    <a href="#" onClick={(e) => { e.preventDefault(); onView(u) }}>
                      {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : '—'}
                    </a>
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{(u.roles || []).join(', ')}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{u.enabled ? <span className="badge bg-success">Enabled</span> : <span className="badge bg-secondary">Disabled</span>}</td>
                  <td className="text-end">
                    <div className="btn-group" role="group">
                      <button className="btn btn-sm btn-outline-info" onClick={() => onView(u)}>View</button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(u)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(u)}>Delete</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => onToggleEnabled(u)}>{u.enabled ? 'Disable' : 'Enable'}</button>
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
