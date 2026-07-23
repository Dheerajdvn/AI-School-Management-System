import React from 'react'
import { formatDate } from '../utils/format'

const NOTIFICATION_ICONS = {
  ASSIGNMENT_DUE: 'bi-card-text text-warning',
  GRADE_PUBLISHED: 'bi-check-circle text-success',
  COURSE_ANNOUNCEMENT: 'bi-megaphone text-info',
  DOCUMENT_UPLOADED: 'bi-file-earmark-text text-primary',
  AI_PROCESSING_COMPLETED: 'bi-robot text-success',
  SYSTEM: 'bi-gear text-secondary',
}

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const type = notification.type || 'SYSTEM'
  const isRead = notification.read || false

  return (
    <div className={`list-group-item ${!isRead ? 'list-group-item-light' : ''}`}>
      <div className="d-flex align-items-start">
        <div className="me-3">
          <i className={`bi ${NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.SYSTEM} fs-4`} />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between">
            <h6 className={`mb-1 ${!isRead ? 'fw-bold' : ''}`}>
              {notification.title || 'Notification'}
            </h6>
            <small className="text-muted">
              {formatDate(notification.createdAt) || '—'}
            </small>
          </div>
          <p className="mb-1">{notification.message || '—'}</p>
          <div className="d-flex gap-2">
            {!isRead && onMarkRead && (
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => onMarkRead(notification.id)}
              >
                Mark Read
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(notification.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard