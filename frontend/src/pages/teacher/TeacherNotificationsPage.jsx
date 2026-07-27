import React, { useState, useEffect } from 'react'

export default function TeacherNotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([
        { id: 1, title: 'Parent-Teacher Meeting', message: 'PTM scheduled for Saturday at 10:00 AM.', type: 'Announcement', time: '2 hours ago', read: false },
        { id: 2, title: 'Assignment Due Reminder', message: 'Algebra Worksheet is due tomorrow.', type: 'Assignment', time: '5 hours ago', read: false },
        { id: 3, title: 'Staff Meeting', message: 'Monthly staff meeting at 3:00 PM in Conference Room.', type: 'School', time: '1 day ago', read: true },
        { id: 4, title: 'Gradebook Updated', message: 'Mid-term grades have been published.', type: 'System', time: '2 days ago', read: true },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = notifications.filter(n => filter === 'All' || n.type === filter)

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (loading) {
    return (
      <div className="tnp-page py-4">
        <div className="row g-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="col-12">
              <div className="skeleton-row animate-pulse" style={{ height: '64px', background: 'var(--surface)', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="tnp-page py-4">
      <div className="page-header-custom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-bell-fill text-primary me-2" />Notifications Center
          </h4>
          <p className="text-muted small mb-0 font-medium">Keep track of school notices, assignment timelines, and system alerts.</p>
        </div>
        <select 
          className="form-select bg-dark border-secondary text-white rounded-3 py-1.5" 
          style={{ width: 'auto', minWidth: '160px' }} 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Announcement">Announcements</option>
          <option value="Assignment">Assignments</option>
          <option value="School">School Level</option>
          <option value="System">System Alerts</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <i className="bi bi-bell-slash text-muted display-4 mb-2 d-block" />
          <h6 className="fw-bold text-white mb-1" style={{ color: 'var(--text)' }}>No notifications found</h6>
          <p className="text-muted small mb-0">You're all caught up!</p>
        </div>
      ) : (
        <div className="notifications-list d-flex flex-column gap-3">
          {filtered.map(n => (
            <div 
              key={n.id} 
              className={`notification-card d-flex align-items-center justify-content-between p-3.5 rounded-4 shadow-sm border ${n.read ? 'read' : 'unread'}`} 
              onClick={() => markRead(n.id)}
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: n.read ? 0.65 : 1
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="notification-icon shadow-sm" style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '10px', 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: n.type === 'Announcement' ? '#3b82f6' : n.type === 'Assignment' ? '#f59e0b' : n.type === 'School' ? '#10b981' : '#6b7280',
                  fontSize: '1.15rem'
                }}>
                  <i className={`bi ${n.type === 'Announcement' ? 'bi-megaphone' : n.type === 'Assignment' ? 'bi-card-text' : n.type === 'School' ? 'bi-building' : 'bi-gear'}`} />
                </div>
                <div>
                  <h6 className="fw-semibold mb-1" style={{ color: 'var(--text)' }}>{n.title}</h6>
                  <p className="mb-0 small text-muted font-medium">{n.message}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="small text-muted font-medium" style={{ fontSize: '11px' }}>{n.time}</span>
                <span className="badge rounded-pill text-uppercase font-bold" style={{ 
                  fontSize: '9px',
                  letterSpacing: '0.04em',
                  backgroundColor: n.type === 'Announcement' ? 'rgba(59, 130, 246, 0.12)' : n.type === 'Assignment' ? 'rgba(245, 158, 11, 0.12)' : n.type === 'School' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(107, 114, 128, 0.12)',
                  color: n.type === 'Announcement' ? '#60a5fa' : n.type === 'Assignment' ? '#fbbf24' : n.type === 'School' ? '#34d399' : '#9ca3af',
                  padding: '5px 10px',
                  border: `1px solid ${n.type === 'Announcement' ? 'rgba(59, 130, 246, 0.2)' : n.type === 'Assignment' ? 'rgba(245, 158, 11, 0.2)' : n.type === 'School' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)'}`
                }}>
                  {n.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .notification-card:hover { transform: translateX(4px); border-color: var(--primary) !important; }
      `}</style>
    </div>
  )
}