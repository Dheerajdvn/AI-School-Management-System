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
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-bell me-2" />
          Notification Preferences
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={() => handleChange('emailNotifications')}
            />
            <label className="form-check-label" htmlFor="emailNotifications">
              Email Notifications
            </label>
          </div>
          <small className="text-muted">Receive notifications via email</small>
        </div>

        <div className="mb-3">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="pushNotifications"
              checked={settings.pushNotifications}
              onChange={() => handleChange('pushNotifications')}
            />
            <label className="form-check-label" htmlFor="pushNotifications">
              Push Notifications
            </label>
          </div>
          <small className="text-muted">Receive push notifications in browser</small>
        </div>

        <hr className="my-3" />

        <div className="mb-3">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="assignmentReminders"
              checked={settings.assignmentReminders}
              onChange={() => handleChange('assignmentReminders')}
            />
            <label className="form-check-label" htmlFor="assignmentReminders">
              Assignment Reminders
            </label>
          </div>
          <small className="text-muted">Get reminded about upcoming assignments</small>
        </div>

        <div className="mb-3">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="gradeUpdates"
              checked={settings.gradeUpdates}
              onChange={() => handleChange('gradeUpdates')}
            />
            <label className="form-check-label" htmlFor="gradeUpdates">
              Grade Updates
            </label>
          </div>
          <small className="text-muted">Notify when grades are published</small>
        </div>

        <div className="mb-3">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="courseAnnouncements"
              checked={settings.courseAnnouncements}
              onChange={() => handleChange('courseAnnouncements')}
            />
            <label className="form-check-label" htmlFor="courseAnnouncements">
              Course Announcements
            </label>
          </div>
          <small className="text-muted">Receive course announcements</small>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings