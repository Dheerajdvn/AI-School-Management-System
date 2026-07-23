import React from 'react'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', icon: 'bi-list' },
  { value: 'unread', label: 'Unread', icon: 'bi-envelope' },
  { value: 'ASSIGNMENT_DUE', label: 'Assignments', icon: 'bi-card-text' },
  { value: 'COURSE_ANNOUNCEMENT', label: 'Courses', icon: 'bi-journal-bookmark' },
  { value: 'AI_PROCESSING_COMPLETED', label: 'AI', icon: 'bi-robot' },
  { value: 'SYSTEM', label: 'System', icon: 'bi-gear' },
]

const NotificationFilter = ({ value, onChange }) => {
  return (
    <div className="btn-group" role="group">
      {FILTER_OPTIONS.map(option => (
        <button
          key={option.value}
          type="button"
          className={`btn btn-outline-primary btn-sm ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          <i className={`bi ${option.icon} me-1`} />
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default NotificationFilter