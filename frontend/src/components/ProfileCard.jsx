import React from 'react'
import { formatDate } from '../utils/format'

const ProfileCard = ({ user, onEdit, onChangePassword, onUploadPicture, onRemovePicture }) => {
  if (!user) return null

  const getRoleBadgeClass = () => {
    if (!user.roles || user.roles.length === 0) return 'badge bg-secondary-subtle text-secondary'
    
    const primaryRole = user.roles[0]
    switch (primaryRole) {
      case 'ROLE_ADMIN': return 'badge bg-primary-subtle text-primary'
      case 'ROLE_TEACHER': return 'badge bg-success-subtle text-success'
      case 'ROLE_STUDENT': return 'badge bg-info-subtle text-info'
      default: return 'badge bg-secondary-subtle text-secondary'
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
    <div className="card border shadow-xs bg-card overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-body text-center p-4">
        <div className="mb-3 position-relative d-inline-block">
          {user.profilePictureUrl ? (
            <img 
              src={user.profilePictureUrl} 
              alt="Profile" 
              className="rounded-circle shadow-xs" 
              style={{ width: '96px', height: '96px', objectFit: 'cover', border: '3px solid var(--border)' }}
            />
          ) : (
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto shadow-xs"
              style={{ width: '96px', height: '96px', fontSize: '2.4rem', border: '3px solid var(--border)' }}
            >
              {(user.username || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          {user.profilePictureUrl && onRemovePicture && (
            <button 
              className="btn btn-sm btn-danger position-absolute bottom-0 start-0 rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{ width: '28px', height: '28px', border: '2px solid var(--card)' }}
              title="Remove profile picture"
              onClick={onRemovePicture}
            >
              <i className="bi bi-trash-fill" style={{ fontSize: '11px' }} />
            </button>
          )}
          {onUploadPicture && (
            <label 
              className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{ width: '28px', height: '28px', border: '2px solid var(--card)', cursor: 'pointer' }}
              title="Upload profile picture"
            >
              <i className="bi bi-camera-fill" style={{ fontSize: '11px' }} />
              <input 
                type="file" 
                className="d-none" 
                accept="image/*"
                onChange={onUploadPicture}
              />
            </label>
          )}
        </div>
        
        <h5 className="card-title mb-1 fw-bold" style={{ color: 'var(--text)' }}>
          {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username}
        </h5>
        {(user.firstName || user.lastName) && (
          <p className="text-muted small mb-1">@{user.username}</p>
        )}
        <span className={`${getRoleBadgeClass()} px-2.5 py-1 rounded-pill small`}>{getRoleLabel()}</span>
        
        <hr className="my-3" style={{ borderColor: 'var(--border)' }} />
        
        <div className="text-start">
          <div className="mb-2.5">
            <small className="text-muted d-block">Email</small>
            <span className="small fw-medium" style={{ color: 'var(--text)' }}>{user.email || '—'}</span>
          </div>
          
          <div className="mb-2.5">
            <small className="text-muted d-block">Phone</small>
            <span className="small fw-medium" style={{ color: 'var(--text)' }}>{user.phone || '—'}</span>
          </div>
          
          <div className="mb-0">
            <small className="text-muted d-block">Last Login</small>
            <span className="small fw-medium" style={{ color: 'var(--text)' }}>{formatDate(user.lastLoginAt) || '—'}</span>
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-secondary btn-sm flex-grow-1 rounded-3" onClick={onEdit}>
            <i className="bi bi-pencil me-1" />
            Edit Profile
          </button>
          <button className="btn btn-secondary btn-sm flex-grow-1 rounded-3" onClick={onChangePassword}>
            <i className="bi bi-key me-1" />
            Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard