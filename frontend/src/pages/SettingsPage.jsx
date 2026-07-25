import React, { useState } from 'react'
import ThemeSwitcher from '../components/ThemeSwitcher'
import NotificationSettings from '../components/NotificationSettings'
import AccountSettings from '../components/AccountSettings'
import AiSettings from '../components/AiSettings'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('theme')
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')

  const tabs = [
    { key: 'theme', label: 'Theme', icon: 'bi-palette' },
    { key: 'language', label: 'Language', icon: 'bi-translate' },
    { key: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { key: 'account', label: 'Account', icon: 'bi-gear' },
    { key: 'ai', label: 'AI Settings', icon: 'bi-robot' }
  ]

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Settings</h3>
      </div>

      <div className="row">
        <div className="col-lg-3 col-md-4">
          <div className="nav nav-pills flex-column" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`nav-link text-start ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <i className={`bi ${tab.icon} me-2`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="col-lg-9 col-md-8">
          <div className="tab-content">
            {activeTab === 'theme' && <ThemeSwitcher />}
            {activeTab === 'language' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-translate me-2" />
                    Language
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Select Language</label>
                    <select 
                      className="form-select"
                      value={language}
                      onChange={e => {
                        setLanguage(e.target.value)
                        localStorage.setItem('language', e.target.value)
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="hi">हिन्दी</option>
                    </select>
                    <small className="text-muted">Choose your preferred language for the interface</small>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'ai' && <AiSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage