import React from 'react'
import { formatDate } from '../utils/format'

const ProfileCard = ({ user, onEdit, onChangePassword, onUploadPicture }) => {
  if (!user) return null

  const getRoleBadgeClass = () => {
    if (!user.roles || user.roles.length === 0) return 'badge bg-secondary'
    
    const primaryRole = user.roles[0]
    switch (primaryRole) {
      case 'ROLE_ADMIN': return 'badge bg-primary'
      case 'ROLE_TEACHER': return 'badge bg-success'
      case 'ROLE_STUDENT': return 'badge bg-info'
      default: return 'badge bg-secondary'
    }
  }

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
      <div className="card-body text-center">
        <div className="mb-3 position-relative d-inline-block">
          {user.profilePictureUrl ? (
            <img 
              src={user.profilePictureUrl} 
              alt="Profile" 
              className="rounded-circle" 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
            >
              {(user.username || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          {onUploadPicture && (
            <label 
              className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
              style={{ width: '32px', height: '32px' }}
              title="Upload profile picture"
            >
              <i className="bi bi-camera-fill" />
              <input 
                type="file" 
                className="d-none" 
                accept="image/*"
                onChange={onUploadPicture}
              />
            </label>
          )}
        </div>
        
        <h5 className="card-title mb-1">{user.username}</h5>
        <span className={getRoleBadgeClass()}>{getRoleLabel()}</span>
        
        <hr className="my-4" />
        
        <div className="text-start">
          <div className="mb-3">
            <small className="text-muted d-block">Email</small>
            <span>{user.email || '—'}</span>
          </div>
          
          <div className="mb-3">
            <small className="text-muted d-block">Phone</small>
            <span>{user.phone || '—'}</span>
          </div>
          
          <div className="mb-3">
            <small className="text-muted d-block">Last Login</small>
            <span>{formatDate(user.lastLoginAt) || '—'}</span>
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-outline-primary flex-grow-1" onClick={onEdit}>
            <i className="bi bi-pencil me-1" />
            Edit Profile
          </button>
          <button className="btn btn-outline-secondary flex-grow-1" onClick={onChangePassword}>
            <i className="bi bi-key me-1" />
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard