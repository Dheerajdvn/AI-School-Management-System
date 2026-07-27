import React, { useState } from 'react'

const NotificationSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings')
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: true,
      assignmentReminders: true,
      gradeUpdates: true,
      courseAnnouncements: true
    }
  })

  const handleChange = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
  }

  return (
    <div className="card border-0 shadow-sm" style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
      <div className="card-header border-bottom py-3" style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)' }}>
          <i className="bi bi-bell me-2 text-primary" />
          Notification Preferences
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="mb-4">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={() => handleChange('emailNotifications')}
            />
            <label className="form-check-label fw-semibold" htmlFor="emailNotifications" style={{ color: 'var(--text)' }}>
              Email Notifications
            </label>
          </div>
          <small className="text-muted d-block mt-1">Receive notifications via email</small>
        </div>

        <div className="mb-4">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="pushNotifications"
              checked={settings.pushNotifications}
              onChange={() => handleChange('pushNotifications')}
            />
            <label className="form-check-label fw-semibold" htmlFor="pushNotifications" style={{ color: 'var(--text)' }}>
              Push Notifications
            </label>
          </div>
          <small className="text-muted d-block mt-1">Receive push notifications in browser</small>
        </div>

        <hr className="my-4 opacity-10" style={{ borderColor: 'var(--border)' }} />

        <div className="mb-4">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="assignmentReminders"
              checked={settings.assignmentReminders}
              onChange={() => handleChange('assignmentReminders')}
            />
            <label className="form-check-label fw-semibold" htmlFor="assignmentReminders" style={{ color: 'var(--text)' }}>
              Assignment Reminders
            </label>
          </div>
          <small className="text-muted d-block mt-1">Get reminded about upcoming assignments</small>
        </div>

        <div className="mb-4">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="gradeUpdates"
              checked={settings.gradeUpdates}
              onChange={() => handleChange('gradeUpdates')}
            />
            <label className="form-check-label fw-semibold" htmlFor="gradeUpdates" style={{ color: 'var(--text)' }}>
              Grade Updates
            </label>
          </div>
          <small className="text-muted d-block mt-1">Notify when grades are published</small>
        </div>

        <div className="mb-0">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="courseAnnouncements"
              checked={settings.courseAnnouncements}
              onChange={() => handleChange('courseAnnouncements')}
            />
            <label className="form-check-label fw-semibold" htmlFor="courseAnnouncements" style={{ color: 'var(--text)' }}>
              Course Announcements
            </label>
          </div>
          <small className="text-muted d-block mt-1">Receive course announcements</small>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings