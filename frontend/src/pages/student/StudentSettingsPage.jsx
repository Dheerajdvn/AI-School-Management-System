import React, { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../hooks/useToast'

export default function StudentSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { success } = useToast()
  const [settings, setSettings] = useState({
    theme: theme || 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    aiSuggestions: true,
    autoSave: true,
    profileVisibility: 'school',
  })

  useEffect(() => {
    setSettings(prev => ({ ...prev, theme }))
  }, [theme])

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    if (field === 'theme' && (value === 'light' || value === 'dark')) {
      setTheme(value)
      success(`Switched to ${value} mode`)
    } else {
      success('Setting updated')
    }
  }

  return (
    <div className="container-fluid p-0 animate-fade">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>Student Settings</h3>
        <p className="text-muted small m-0">Personalize your learning environment and notification preferences.</p>
      </div>

      <div className="row g-4">
        {/* Appearance & Interface */}
        <div className="col-lg-6">
          <div className="card border shadow-xs bg-card h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-bottom py-3 bg-card">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className="bi bi-palette me-2 text-primary" />
                Appearance & Language
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Display Theme</label>
                <select 
                  className="form-select bg-surface border" 
                  value={settings.theme} 
                  onChange={e => handleChange('theme', e.target.value)}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              <div className="mb-0">
                <label className="form-label text-muted small fw-semibold">Preferred Language</label>
                <select 
                  className="form-select bg-surface border" 
                  value={settings.language} 
                  onChange={e => handleChange('language', e.target.value)}
                >
                  <option value="en">English (US)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation Preferences */}
        <div className="col-lg-6">
          <div className="card border shadow-xs bg-card h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-bottom py-3 bg-card">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className="bi bi-robot me-2 text-primary" />
                AI & Study Assistant
              </h5>
            </div>
            <div className="card-body p-4">
              {[
                { key: 'aiSuggestions', label: 'AI Study Recommendations', desc: 'Personalized practice hints and study topics' },
                { key: 'autoSave', label: 'Auto-save Assignment Drafts', desc: 'Periodically save work-in-progress responses' },
              ].map((item, idx) => (
                <div key={item.key} className={`d-flex justify-content-between align-items-center ${idx > 0 ? 'mt-3 pt-3 border-top' : ''}`}>
                  <div>
                    <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{item.label}</div>
                    <small className="text-muted">{item.desc}</small>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={settings[item.key]} 
                      onChange={e => handleChange(item.key, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-lg-6">
          <div className="card border shadow-xs bg-card h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-bottom py-3 bg-card">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className="bi bi-bell me-2 text-primary" />
                Notifications
              </h5>
            </div>
            <div className="card-body p-4">
              {[
                { key: 'emailNotifications', label: 'Email Alerts', desc: 'Receive assignment deadlines & grade reports' },
                { key: 'pushNotifications', label: 'Browser Notifications', desc: 'Instant desktop alerts for class updates' },
              ].map((item, idx) => (
                <div key={item.key} className={`d-flex justify-content-between align-items-center ${idx > 0 ? 'mt-3 pt-3 border-top' : ''}`}>
                  <div>
                    <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{item.label}</div>
                    <small className="text-muted">{item.desc}</small>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={settings[item.key]} 
                      onChange={e => handleChange(item.key, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="col-lg-6">
          <div className="card border shadow-xs bg-card h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-bottom py-3 bg-card">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className="bi bi-shield-lock me-2 text-primary" />
                Privacy & Visibility
              </h5>
            </div>
            <div className="card-body p-4">
              <label className="form-label text-muted small fw-semibold">Profile & Performance Visibility</label>
              <select 
                className="form-select bg-surface border" 
                value={settings.profileVisibility} 
                onChange={e => handleChange('profileVisibility', e.target.value)}
              >
                <option value="school">School & Classmates</option>
                <option value="teachers">Teachers Only</option>
                <option value="private">Private (Only Me & Parents)</option>
              </select>
              <small className="text-muted d-block mt-2">
                Controls who can view your learning progress and public student card.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}