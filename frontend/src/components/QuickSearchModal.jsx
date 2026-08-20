import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const SEARCH_ITEMS = [
  { name: 'Dashboard', to: '/dashboard', category: 'Navigation', icon: 'bi-grid-1x2-fill' },
  { name: 'Profile Settings', to: '/profile', category: 'Navigation', icon: 'bi-person-fill' },
  { name: 'Platform Settings', to: '/settings', category: 'Navigation', icon: 'bi-gear-fill' },
  { name: 'Notifications Center', to: '/notifications', category: 'Navigation', icon: 'bi-bell-fill' },

  // AI features
  { name: 'Natural Language SQL (Ask AI)', to: '/principal/ai', category: 'AI Tools', icon: 'bi-cpu-fill' },
  { name: 'AI Chat Room', to: '/chat', category: 'AI Tools', icon: 'bi-chat-dots-fill' },
  { name: 'AI Tutor Bot', to: '/student/ai-tutor', category: 'AI Tools', icon: 'bi-robot' },
  { name: 'AI Homework Helper', to: '/student/ai-homework-helper', category: 'AI Tools', icon: 'bi-journal-code' },
  { name: 'AI Lesson Planner', to: '/teacher/lesson-planner', category: 'AI Tools', icon: 'bi-calendar-event' },
  { name: 'AI Quiz Generator', to: '/teacher/quiz-generator', category: 'AI Tools', icon: 'bi-question-circle' },

  { name: 'Manage Schools', to: '/admin/schools', category: 'School OS', icon: 'bi-building' },
  { name: 'Courses Directory', to: '/admin/courses', category: 'School OS', icon: 'bi-book' },
  { name: 'Documents & RAG Upload', to: '/documents', category: 'Knowledge Base', icon: 'bi-file-earmark-arrow-up' },
  { name: 'Knowledge Library', to: '/knowledge/library', category: 'Knowledge Base', icon: 'bi-bookmark-star' },
  { name: 'Active Processing Queue', to: '/knowledge/queue', category: 'Knowledge Base', icon: 'bi-cpu' },
  { name: 'Audit Logs', to: '/admin/audit-logs', category: 'Security', icon: 'bi-shield-check' },

  { name: 'Toggle Light/Dark Theme', action: 'toggle-theme', category: 'Actions', icon: 'bi-palette' }
]

export default function QuickSearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const inputRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true)
    window.addEventListener('open-quick-search', handleOpenEvent)
    return () => window.removeEventListener('open-quick-search', handleOpenEvent)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filtered = React.useMemo(() => {
    const list = [...SEARCH_ITEMS]
    if (query.trim()) {
      list.unshift({
        name: `Ask AI: "${query.trim()}"`,
        to: `/chat?q=${encodeURIComponent(query.trim())}`,
        category: 'AI Assistant',
        icon: 'bi-stars',
        isAiPrompt: true,
      })
    }
    return list.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const handleTrigger = (item) => {
    setIsOpen(false)
    if (item.action === 'toggle-theme') {
      toggleTheme()
    } else if (item.to) {
      navigate(item.to)
    }
  }

  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        handleTrigger(filtered[selectedIndex])
      }
    }
  }

  const grouped = filtered.reduce((groups, item, idx) => {
    const originalIndex = idx
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push({ ...item, originalIndex })
    return groups
  }, {})

  if (!isOpen) return null

  return (
    <div
      className="command-palette-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) setIsOpen(false)
      }}
    >
      <div className="command-palette-card" onKeyDown={handleModalKeyDown}>
        <div className="command-palette-search-wrapper">
          <i className="bi bi-search text-muted me-2" />
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Search pages, actions, AI tools..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
          />
          <button
            className="btn-close ms-2"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          />
        </div>

        <div className="command-palette-results">
          {filtered.length === 0 ? (
            <div className="text-center py-4 text-muted small">No results found for "{query}"</div>
          ) : (
            Object.keys(grouped).map((category) => (
              <div key={category}>
                <div className="command-palette-category-title">{category}</div>
                {grouped[category].map((item) => (
                  <button
                    key={item.name}
                    className={`command-palette-item ${selectedIndex === item.originalIndex ? 'selected' : ''}`}
                    onClick={() => handleTrigger(item)}
                    onMouseEnter={() => setSelectedIndex(item.originalIndex)}
                  >
                    <div className="command-palette-item-icon">
                      <i className={`bi ${item.icon}`} />
                    </div>
                    <span className="command-palette-item-label">{item.name}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <span>
            Use <kbd className="bg-dark text-light px-1 rounded">↑</kbd>{' '}
            <kbd className="bg-dark text-light px-1 rounded">↓</kbd> to navigate
          </span>
          <span>
            Press <kbd className="bg-dark text-light px-1 rounded">Enter</kbd> to select,{' '}
            <kbd className="bg-dark text-light px-1 rounded">Esc</kbd> to dismiss
          </span>
        </div>
      </div>
    </div>
  )
}
