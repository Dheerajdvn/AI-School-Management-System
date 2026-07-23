import React from 'react'
import { formatDate } from '../utils/format'

const WelcomeCard = ({ user }) => {
  if (!user) return null

  const getRoleLabel = () => {
    if (!user.roles || user.roles.length === 0) return 'User'
    const roleNames = {
      'ROLE_ADMIN': 'Administrator',
      'ROLE_TEACHER': 'Teacher',
      'ROLE_STUDENT': 'Student',
    }
    return roleNames[user.roles[0]] || user.roles[0]
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="me-3">
            {user.profilePictureUrl ? (
              <img 
                src={user.profilePictureUrl} 
                alt="Profile" 
                className="rounded-circle" 
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}
              >
                {(user.username || user.email || '?')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-1">Welcome, {user.username}!</h4>
            <p className="text-muted mb-0">
              <i className="bi bi-shield-check me-1" />
              {getRoleLabel()}
            </p>
            <p className="text-muted small mb-0">
              <i className="bi bi-calendar-date me-1" />
              {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeCard