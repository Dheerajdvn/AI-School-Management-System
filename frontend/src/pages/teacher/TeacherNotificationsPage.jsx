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
      <div className="tnp-page">
        <div className="row g-3">{[...Array(3)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{tnpStyles}</style>
      </div>
    )
  }

  return (
    <div className="tnp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-bell me-2" />Notifications</h4>
        <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option><option>Announcement</option><option>Assignment</option><option>School</option><option>System</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><i className="bi bi-bell" /><h6>No notifications</h6></div>
      ) : (
        <div className="notifications-list">
          {filtered.map(n => (
            <div key={n.id} className={`notification-card ${n.read ? 'read' : 'unread'}`} onClick={() => markRead(n.id)}>
              <div className="notification-icon"><i className={`bi ${n.type === 'Announcement' ? 'bi-megaphone' : n.type === 'Assignment' ? 'bi-card-text' : n.type === 'School' ? 'bi-building' : 'bi-gear'}`} /></div>
              <div className="notification-content">
                <div className="notification-header">
                  <strong>{n.title}</strong>
                  <span className="notification-time">{n.time}</span>
                </div>
                <p className="mb-0 small opacity-75">{n.message}</p>
              </div>
              <span className={`badge ${n.type === 'Announcement' ? 'bg-primary' : n.type === 'Assignment' ? 'bg-warning' : n.type === 'School' ? 'bg-success' : 'bg-info'}`}>{n.type}</span>
            </div>
          ))}
        </div>
      )}

      <style>{tnpStyles}</style>
    </div>
  )
}

const tnpStyles = `
.tnp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.tnp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.tnp-page .notifications-list { display: flex; flex-direction: column; gap: 0.75rem; }
.tnp-page .notification-card { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; cursor: pointer; }
.tnp-page .notification-card:hover { border-color: rgba(59,130,246,0.3); }
.tnp-page .notification-card.read { opacity: 0.7; }
.tnp-page .notification-card.unread { border-color: rgba(59,130,246,0.3); }
.tnp-page .notification-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #60a5fa; flex-shrink: 0; }
.tnp-page .notification-content { flex: 1; min-width: 0; }
.tnp-page .notification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
.tnp-page .notification-header strong { font-weight: 600; }
.tnp-page .notification-time { font-size: 0.75rem; opacity: 0.6; white-space: nowrap; }
.tnp-page .notification-content p { margin: 0; }
.tnp-page .badge { font-size: 0.7rem; font-weight: 600; }
.tnp-page .skeleton-row { height: 64px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
.tnp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.tnp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`