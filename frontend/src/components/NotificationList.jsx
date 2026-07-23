import React from 'react'
import NotificationCard from './NotificationCard'
import Pagination from './Pagination'
import LoadingIndicator from './LoadingIndicator'

const NotificationList = ({ 
  notifications = [], 
  page = 0,
  total = 0,
  totalPages = 1,
  loading = false,
  error = null,
  onPageChange,
  onMarkRead,
  onMarkAllRead,
  onDelete
}) => {
  if (loading) {
    return <LoadingIndicator message="Loading notifications..." />
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notifications</h5>
        {onMarkAllRead && notifications.some(n => !n.read) && (
          <button className="btn btn-sm btn-outline-secondary" onClick={onMarkAllRead}>
            Mark All as Read
          </button>
        )}
      </div>
      <div className="list-group list-group-flush">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-bell-slash fs-1" />
            <div>No notifications found</div>
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="card-footer">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default NotificationList