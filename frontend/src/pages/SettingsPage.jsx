import React, { useState } from 'react'
import ThemeSwitcher from '../components/ThemeSwitcher'
import NotificationSettings from '../components/NotificationSettings'
import AccountSettings from '../components/AccountSettings'

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
            {activeTab === 'ai' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-robot me-2" />
                    AI Settings
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">AI Model</label>
                    <select className="form-select">
                      <option>Default Model</option>
                      <option>GPT-4</option>
                      <option>Claude</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Response Length</label>
                    <input type="range" className="form-range" min="1" max="10" defaultValue="5" />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Creativity Level</label>
                    <input type="range" className="form-range" min="0" max="100" defaultValue="50" />
                  </div>
                  
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="aiSuggestions" defaultChecked />
                    <label className="form-check-label" htmlFor="aiSuggestions">
                      Show AI suggestions automatically
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage