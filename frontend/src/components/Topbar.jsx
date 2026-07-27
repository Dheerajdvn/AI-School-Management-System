import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiChatService } from '../services/aiService'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Topbar({ title, onMenu }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [llmUp, setLlmUp] = useState(null)
  const [provider, setProvider] = useState('Ollama')
  const [model, setModel] = useState('GPT-4o Enterprise')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    let active = true
    const checkHealth = (r) => {
      if (!active) return
      const data = r?.data || r
      setLlmUp(data?.llmAvailable ?? true)
      if (data?.provider) setProvider(data.provider)
      if (data?.model) setModel(data.model)
    }
    aiChatService.health()
      .then(checkHealth)
      .catch(() => { if (active) setLlmUp(false) })
    const t = setInterval(() => {
      aiChatService.health()
        .then(checkHealth)
        .catch(() => { if (active) setLlmUp(false) })
    }, 30000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  const status =
    llmUp === null
      ? { text: 'Checking AI...', cls: 'badge-checking' }
      : llmUp
        ? { text: `${provider} Ready`, cls: 'badge-online' }
        : { text: `${provider} Offline`, cls: 'badge-offline' }

  return (
    <header className="topbar enterprise-topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="hamburger btn btn-link p-0 text-body" onClick={onMenu} aria-label="Toggle menu">
          <i className="bi bi-list fs-5" />
        </button>
        <div className="d-flex flex-column">
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>

      <div className="topbar-search-wrapper d-none d-lg-flex align-items-center flex-grow-1 mx-4 max-w-400">
        <div className="input-group input-group-sm bg-surface rounded-pill border px-3 py-1 w-100 align-items-center">
          <i className="bi bi-search text-muted me-2" />
          <input
            type="text"
            className="form-control border-0 bg-transparent shadow-none p-0 text-body"
            placeholder="Search resources, students, classes, or ask AI..."
          />
          <kbd className="badge bg-dark text-light border-0 ms-2">⌘K</kbd>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* AI Provider Status & Model Badges */}
        <div className="d-none sm-flex align-items-center gap-2">
          <span className={`enterprise-badge ${status.cls}`}>
            <span className="pulse-dot" />
            {status.text}
          </span>
          <span className="enterprise-badge badge-model d-none xl-inline-flex">
            <i className="bi bi-cpu me-1" />
            {model || 'AI Core v2.4'}
          </span>
        </div>

        {/* Notifications button */}
        <button
          className="btn btn-icon rounded-circle position-relative"
          onClick={() => navigate('/notifications')}
          title="Notifications"
        >
          <i className="bi bi-bell fs-6" />
          <span className="position-absolute top-2 start-75 translate-middle p-1 bg-primary border border-light rounded-circle" style={{ width: '8px', height: '8px' }}>
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>

        {/* Theme switcher */}
        <button
          className="btn btn-icon rounded-circle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'} fs-6`} />
        </button>

        {/* User Profile Dropdown Pill - 100% Adaptive Light & Dark Mode */}
        {user && (
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="user-topbar-btn d-flex align-items-center gap-2 p-1 pe-2.5 rounded-pill shadow-xs border"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                borderColor: 'var(--border)'
              }}
            >
              <div
                className="avatar-circle-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  color: '#ffffff'
                }}
              >
                {(user.username || user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="d-none d-md-inline fw-semibold small px-1 text-truncate" style={{ maxWidth: '110px', color: 'var(--text)' }}>
                {user.username || user.name || 'User'}
              </span>
              <i className="bi bi-chevron-down small opacity-75 pe-1" style={{ color: 'var(--text)' }} />
            </button>

            {dropdownOpen && (
              <div
                className="dropdown-menu dropdown-menu-end show shadow-lg p-2 rounded-3 mt-2"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)',
                  borderColor: 'var(--border)',
                  position: 'absolute',
                  right: 0,
                  minWidth: '220px',
                  zIndex: 1050
                }}
              >
                <div className="px-3 py-2 border-bottom mb-1" style={{ borderColor: 'var(--border)' }}>
                  <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{user.username || user.name || 'User'}</div>
                  <div className="text-muted text-xs text-truncate">{user.email || 'enterprise@aischool.io'}</div>
                </div>
                <button className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 px-3" style={{ color: 'var(--text)' }} onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                  <i className="bi bi-person fs-6 text-primary" /> Profile Settings
                </button>
                <button className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 px-3" style={{ color: 'var(--text)' }} onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                  <i className="bi bi-gear fs-6 text-primary" /> Account Settings
                </button>
                <button className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 px-3" style={{ color: 'var(--text)' }} onClick={() => { setDropdownOpen(false); toggleTheme(); }}>
                  <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'} fs-6 text-warning`} /> Toggle Theme
                </button>
                <div className="dropdown-divider my-1" style={{ borderColor: 'var(--border)' }} />
                <button className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2 px-3 text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right fs-6" /> Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
