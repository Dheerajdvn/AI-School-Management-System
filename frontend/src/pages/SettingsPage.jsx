import React, { useState } from 'react'
import ThemeSwitcher from '../components/ThemeSwitcher'
import NotificationSettings from '../components/NotificationSettings'
import AccountSettings from '../components/AccountSettings'
import AiSettings from '../components/AiSettings'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('theme')
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')

  const tabs = [
    { key: 'theme', label: 'Appearance & Theme', icon: 'bi-palette', desc: 'Light/Dark display modes' },
    { key: 'language', label: 'Language & Locale', icon: 'bi-translate', desc: 'Regional language selection' },
    { key: 'notifications', label: 'Notifications', icon: 'bi-bell', desc: 'Email and alerts preferences' },
    { key: 'account', label: 'Account & Security', icon: 'bi-shield-check', desc: 'Credentials and 2FA' },
    { key: 'ai', label: 'AI Intelligence', icon: 'bi-robot', desc: 'LLM providers & models' }
  ]

  const languages = [
    { code: 'en', name: 'English', native: 'English (US)', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  ]

  return (
    <div className="container-fluid p-0 animate-fade">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>Settings</h3>
          <p className="text-muted m-0 small">Customize your workspace, security parameters, and platform preferences.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Navigation Sidebar Tabs */}
        <div className="col-lg-3 col-md-4">
          <div className="card border shadow-xs bg-card p-2" style={{ borderRadius: '16px' }}>
            <div className="d-flex flex-column gap-1">
              {tabs.map(tab => {
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`btn text-start rounded-3 p-2.5 d-flex align-items-center gap-3 border-0 transition-all ${
                      isActive 
                        ? 'btn-primary shadow-xs' 
                        : 'btn-ghost text-body bg-surface-hover'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <div 
                      className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${
                        isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-primary-subtle text-primary'
                      }`}
                      style={{ width: '34px', height: '34px' }}
                    >
                      <i className={`bi ${tab.icon} fs-6`} />
                    </div>
                    <div className="min-width-0 flex-grow-1">
                      <div className="fw-semibold small text-truncate">{tab.label}</div>
                      <div 
                        className={`x-small text-truncate ${isActive ? 'text-white text-opacity-75' : 'text-muted'}`}
                        style={{ fontSize: '11px' }}
                      >
                        {tab.desc}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Tab Content Area */}
        <div className="col-lg-9 col-md-8">
          <div className="tab-content">
            {activeTab === 'theme' && <ThemeSwitcher />}
            
            {activeTab === 'language' && (
              <div className="card border shadow-xs bg-card overflow-hidden" style={{ borderRadius: '16px' }}>
                <div className="card-header border-bottom py-3 bg-card">
                  <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                    <i className="bi bi-translate me-2 text-primary" />
                    Language & Regional Settings
                  </h5>
                  <p className="text-muted small mb-0 mt-1">
                    Choose your preferred language for the application interface and automated messages.
                  </p>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {languages.map((lang) => {
                      const isSelected = language === lang.code
                      return (
                        <div className="col-sm-6" key={lang.code}>
                          <div
                            onClick={() => {
                              setLanguage(lang.code)
                              localStorage.setItem('language', lang.code)
                            }}
                            className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center justify-content-between ${
                              isSelected ? 'border-primary bg-primary-subtle' : 'bg-surface border-secondary border-opacity-20'
                            }`}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                              <div>
                                <div className="fw-bold small" style={{ color: 'var(--text)' }}>
                                  {lang.name}
                                </div>
                                <small className="text-muted">{lang.native}</small>
                              </div>
                            </div>

                            {isSelected && (
                              <i className="bi bi-check-circle-fill text-primary fs-5" />
                            )}
                          </div>
                        </div>
                      )
                    })}
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