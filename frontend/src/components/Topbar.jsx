import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiChatService } from '../services/aiService'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ title, onMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [llmUp, setLlmUp] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    let active = true
    aiChatService.health()
      .then((r) => active && setLlmUp(r?.llmAvailable ?? r?.data?.llmAvailable ?? true))
      .catch(() => active && setLlmUp(false))
    const t = setInterval(() => {
      aiChatService.health()
        .then((r) => active && setLlmUp(r?.llmAvailable ?? r?.data?.llmAvailable ?? true))
        .catch(() => active && setLlmUp(false))
    }, 30000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [])

  // Close dropdown on outside click
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

  const handleProfile = () => {
    setDropdownOpen(false)
    navigate('/profile')
  }

  const handleSettings = () => {
    setDropdownOpen(false)
    navigate('/settings')
  }

  const status =
    llmUp === null
      ? { text: 'Checking…', cls: 'bg-secondary' }
      : llmUp
        ? { text: 'Ollama Online', cls: 'bg-success' }
        : { text: 'Ollama Offline', cls: 'bg-danger' }

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="hamburger" onClick={onMenu} aria-label="Toggle menu">
          <i className="bi bi-list" />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className={`badge ${status.cls}`}>{status.text}</span>
        <span className="badge bg-primary">
          <i className="bi bi-cpu me-1" />
          qwen2.5-coder:3b
        </span>
        {user && (
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <i className="bi bi-person-circle fs-6" />
              <span className="d-none d-md-inline">{user.username || user.name || 'User'}</span>
              <i className={`bi ${dropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'} small`} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu dropdown-menu-end show shadow" style={{ position: 'absolute', right: 0, top: '100%', minWidth: '180px', zIndex: 1050 }}>
                <div className="dropdown-header small text-muted">
                  Signed in as <strong>{user.username || user.name || 'User'}</strong>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleProfile}>
                  <i className="bi bi-person me-2" />Profile
                </button>
                <button className="dropdown-item" onClick={handleSettings}>
                  <i className="bi bi-gear me-2" />Settings
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2" />Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}