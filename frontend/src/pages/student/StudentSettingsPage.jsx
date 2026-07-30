import React, { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function StudentSettingsPage() {
  const { theme, setTheme } = useTheme()
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
    }
  }

  return (
    <div className="ssp-page">
      <h4 className="mb-3"><i className="bi bi-gear me-2" />Settings</h4>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Appearance</h5></div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Theme</label>
              <select className="form-select" value={settings.theme} onChange={e => handleChange('theme', e.target.value)}>
                <option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Language</label>
              <select className="form-select" value={settings.language} onChange={e => handleChange('language', e.target.value)}>
                <option value="en">English</option><option value="hi">Hindi</option><option value="es">Spanish</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Notifications</h5></div>
        <div className="card-body">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
          ].map(item => (
            <div key={item.key} className="d-flex justify-content-between align-items-center mb-3">
              <div><strong>{item.label}</strong><p className="mb-0 small opacity-75">{item.desc}</p></div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={settings[item.key]} onChange={e => handleChange(item.key, e.target.checked)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>AI Preferences</h5></div>
        <div className="card-body">
          {[
            { key: 'aiSuggestions', label: 'AI Suggestions', desc: 'Get AI-powered study suggestions' },
            { key: 'autoSave', label: 'Auto-save Drafts', desc: 'Automatically save assignment drafts' },
          ].map(item => (
            <div key={item.key} className="d-flex justify-content-between align-items-center mb-3">
              <div><strong>{item.label}</strong><p className="mb-0 small opacity-75">{item.desc}</p></div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={settings[item.key]} onChange={e => handleChange(item.key, e.target.checked)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header-custom"><h5>Privacy</h5></div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Profile Visibility</label>
            <select className="form-select" value={settings.profileVisibility} onChange={e => handleChange('profileVisibility', e.target.value)}>
              <option value="school">School Only</option><option value="teachers">Teachers Only</option><option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      <style>{sspStyles}</style>
    </div>
  )
}

const sspStyles = `
.ssp-page h4 { margin: 0; font-weight: 700; }
.ssp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.ssp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.ssp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.ssp-page .card-body { padding: 1.25rem; }
.ssp-page .form-control, .ssp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.ssp-page .form-control:focus, .ssp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.ssp-page .form-check-input { width: 3em; height: 1.5em; }
.ssp-page .form-check-input:checked { background-color: #3b82f6; border-color: #3b82f6; }
`