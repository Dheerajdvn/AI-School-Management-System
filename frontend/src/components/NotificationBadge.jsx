import React from 'react'

const NotificationBadge = ({ count = 0 }) => {
  if (count === 0) return null
  
  return (
    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      {count > 99 ? '99+' : count}
      <span className="visually-hidden">unread notifications</span>
    </span>
  )
}

export default NotificationBadge