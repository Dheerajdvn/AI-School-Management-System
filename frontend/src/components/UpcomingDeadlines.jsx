import React from 'react'
import { formatDate } from '../utils/format'
import DueDateBadge from './DueDateBadge'

const UpcomingDeadlines = ({ assignments = [], loading = false }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-calendar-event me-2" />
            Upcoming Deadlines
          </h5>
        </div>
        <div className="card-body">
          <div className="text-muted">Loading deadlines...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-calendar-event me-2" />
          Upcoming Deadlines
        </h5>
      </div>
      <div className="card-body">
        {assignments.length === 0 ? (
          <div className="text-muted">No upcoming deadlines</div>
        ) : (
          <ul className="list-group list-group-flush">
            {assignments.map(a => (
              <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{a.title}</div>
                  <div className="small text-muted">{a.courseTitle || a.courseCode}</div>
                </div>
                <DueDateBadge dueDate={a.dueDate} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default UpcomingDeadlines