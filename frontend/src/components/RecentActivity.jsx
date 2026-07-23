import React from 'react'
import { formatDate } from '../utils/format'

export default function RecentActivity({ documents = [], students = [] }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Recent Activity</h5>
        <div className="row">
          <div className="col-md-6">
            <h6>Recent Documents</h6>
            {documents.length === 0 ? (
              <div className="text-muted">No recent documents</div>
            ) : (
              <ul className="list-group list-group-flush">
                {documents.map((d) => (
                  <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-semibold">{d.originalFilename}</span>
                      <div className="text-muted small">{d.uploaderName || d.uploader || 'Unknown'} • {formatDate(d.uploadTime)}</div>
                    </div>
                    <div className="text-muted small">{d.size ? `${(d.size / 1024).toFixed(1)} KB` : ''}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-md-6">
            <h6>Recent Students</h6>
            {students.length === 0 ? (
              <div className="text-muted">No recent student registrations</div>
            ) : (
              <ul className="list-group list-group-flush">
                {students.map((s) => (
                  <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-semibold">{s.name || s.username || 'Unnamed'}</span>
                      <div className="text-muted small">{s.email}</div>
                    </div>
                    <div className="text-muted small">{formatDate(s.createdAt || s.registeredAt || s.created)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
