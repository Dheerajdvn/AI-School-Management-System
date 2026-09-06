import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function QuickSearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { toggleTheme } = useTheme()
  const inputRef = useRef(null)
  const overlayRef = useRef(null)

  // Listen for Ctrl+K / Cmd+K and custom event
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

  // Compute dynamic items based on auth status & user role
  const isGuestOrLanding = !user || location.pathname === '/'

  const searchItems = useMemo(() => {
    // 1. GUEST / LANDING PAGE MODE (No private internal admin tools displayed)
    if (isGuestOrLanding) {
      return [
        { name: 'Live AI Academic Sandbox', to: '#ai-sandbox', category: 'Landing Page', icon: 'bi-stars' },
        { name: 'Platform Capabilities (Bento Grid)', to: '#features', category: 'Landing Page', icon: 'bi-grid-fill' },
        { name: 'Legacy ERP vs AI School OS (Compare)', to: '#comparison', category: 'Landing Page', icon: 'bi-arrow-left-right' },
        { name: 'Knowledge Engine & RAG Pipeline', to: '#knowledge-engine', category: 'Landing Page', icon: 'bi-diagram-3-fill' },
        { name: 'Institutional ROI & Time-Savings Calculator', to: '#roi-calculator', category: 'Landing Page', icon: 'bi-calculator' },
        { name: 'Multi-Role Portals Preview', to: '#roles', category: 'Landing Page', icon: 'bi-people-fill' },
        { name: 'Predictable SaaS Pricing Tiers', to: '#pricing', category: 'Landing Page', icon: 'bi-tag-fill' },
        { name: 'Frequently Asked Questions (FAQ)', to: '#faq', category: 'Landing Page', icon: 'bi-question-circle-fill' },
        { name: 'Sign In to Campus Portal', to: '/login', category: 'Account & Access', icon: 'bi-box-arrow-in-right' },
        { name: 'Launch Interactive Demo Accounts', action: 'open-demo', category: 'Account & Access', icon: 'bi-play-circle-fill' },
        { name: 'Toggle Light / Dark Theme', action: 'toggle-theme', category: 'Preferences', icon: 'bi-palette-fill' }
      ]
    }

    // 2. AUTHENTICATED ROLE-BASED MODES
    const roles = user?.roles || []
    const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN')
    const isAdmin = roles.includes('ROLE_ADMIN')
    const isPrincipal = roles.includes('ROLE_PRINCIPAL')
    const isSchoolAdmin = roles.includes('ROLE_SCHOOL_ADMIN')
    const isTeacher = roles.includes('ROLE_TEACHER')
    const isStudent = roles.includes('ROLE_STUDENT')

    const items = []

    // Student Role Tools
    if (isStudent && !isTeacher && !isAdmin && !isSuperAdmin) {
      items.push(
        { name: 'Student Dashboard', to: '/student', category: 'Navigation', icon: 'bi-speedometer2' },
        { name: 'My Enrolled Courses', to: '/student/courses', category: 'Academic', icon: 'bi-book-half' },
        { name: 'My Assignments & Homework', to: '/student/assignments', category: 'Academic', icon: 'bi-journal-text' },
        { name: 'Attendance Records', to: '/student/attendance', category: 'Academic', icon: 'bi-calendar-check' },
        { name: 'Grades & Report Card', to: '/student/grades', category: 'Academic', icon: 'bi-award' },
        { name: 'Academic Calendar', to: '/student/calendar', category: 'Academic', icon: 'bi-calendar3' },
        { name: 'Profile Settings', to: '/student/profile', category: 'Account', icon: 'bi-person-fill' },
        
        { name: 'AI Academic Tutor Bot', to: '/student/ai-tutor', category: 'AI Learning Tools', icon: 'bi-robot' },
        { name: 'AI Homework Helper', to: '/student/ai-homework-helper', category: 'AI Learning Tools', icon: 'bi-journal-code' },
        { name: 'AI Quiz Practice', to: '/student/ai-quiz-practice', category: 'AI Learning Tools', icon: 'bi-question-circle' },
        { name: 'AI Study Chat Room', to: '/chat', category: 'AI Learning Tools', icon: 'bi-chat-dots-fill' }
      )
    }

    // Teacher Role Tools
    if (isTeacher) {
      items.push(
        { name: 'Teacher Dashboard', to: '/teacher', category: 'Navigation', icon: 'bi-speedometer2' },
        { name: 'My Classes & Rosters', to: '/teacher/my-classes', category: 'Teaching', icon: 'bi-people-fill' },
        { name: 'Attendance Management', to: '/teacher/attendance', category: 'Teaching', icon: 'bi-calendar-check' },
        { name: 'Gradebook & Scoring', to: '/teacher/gradebook', category: 'Teaching', icon: 'bi-journal-bookmark-fill' },
        { name: 'Study Materials Hub', to: '/teacher/study-materials', category: 'Teaching', icon: 'bi-folder2-open' },
        { name: 'Profile Settings', to: '/profile', category: 'Account', icon: 'bi-person-fill' },

        { name: 'AI Lesson Planner', to: '/teacher/lesson-planner', category: 'AI Tools for Teachers', icon: 'bi-calendar-event' },
        { name: 'AI Quiz Generator', to: '/teacher/quiz-generator', category: 'AI Tools for Teachers', icon: 'bi-question-circle-fill' },
        { name: 'Homework Review & AI Rubrics', to: '/teacher/homework-review', category: 'AI Tools for Teachers', icon: 'bi-check2-all' },
        { name: 'AI Academic Assistant Chat', to: '/chat', category: 'AI Tools for Teachers', icon: 'bi-chat-dots-fill' }
      )
    }

    // Principal / School Admin Tools
    if (isPrincipal || isSchoolAdmin) {
      items.push(
        { name: 'School Overview Dashboard', to: '/school', category: 'Administration', icon: 'bi-building' },
        { name: 'Teacher Faculty Roster', to: '/school/teachers', category: 'Administration', icon: 'bi-person-badge' },
        { name: 'Student Directory', to: '/school/students', category: 'Administration', icon: 'bi-people' },
        { name: 'Classes & Sections', to: '/school/classes', category: 'Administration', icon: 'bi-grid-3x3' },
        { name: 'School Master Timetable', to: '/school/timetable', category: 'Administration', icon: 'bi-calendar-week' },
        { name: 'School Settings', to: '/school/settings', category: 'Administration', icon: 'bi-gear-fill' },

        { name: 'Natural Language SQL (Ask AI)', to: '/principal/ai', category: 'AI Administrative Tools', icon: 'bi-cpu-fill' },
        { name: 'Curriculum Documents & RAG', to: '/documents', category: 'AI Administrative Tools', icon: 'bi-file-earmark-arrow-up' }
      )
    }

    // Super Admin / System Admin Tools
    if (isSuperAdmin || isAdmin) {
      items.push(
        { name: 'Enterprise Admin Dashboard', to: '/admin', category: 'System Governance', icon: 'bi-speedometer2' },
        { name: 'Manage Schools & Campuses', to: '/admin/schools', category: 'System Governance', icon: 'bi-building' },
        { name: 'School Admins & Principals', to: '/admin/school-admins', category: 'System Governance', icon: 'bi-person-badge' },
        { name: 'Courses Directory', to: '/admin/courses', category: 'System Governance', icon: 'bi-book' },
        { name: 'Users & Permission Access', to: '/admin/users', category: 'System Governance', icon: 'bi-people-fill' },
        { name: 'Security Audit Logs', to: '/admin/audit-logs', category: 'Security & Telemetry', icon: 'bi-shield-check' },
        { name: 'Platform Settings', to: '/settings', category: 'System Governance', icon: 'bi-gear-fill' },

        { name: 'Natural Language SQL (Ask AI)', to: '/principal/ai', category: 'AI Tools', icon: 'bi-cpu-fill' },
        { name: 'Documents & RAG Upload', to: '/documents', category: 'Knowledge Engine', icon: 'bi-file-earmark-arrow-up' },
        { name: 'Knowledge Library', to: '/knowledge/library', category: 'Knowledge Engine', icon: 'bi-bookmark-star' },
        { name: 'Active Processing Queue', to: '/knowledge/queue', category: 'Knowledge Engine', icon: 'bi-cpu' }
      )
    }

    // Common action for all authenticated users
    items.push(
      { name: 'Toggle Light / Dark Theme', action: 'toggle-theme', category: 'Preferences', icon: 'bi-palette-fill' }
    )

    return items
  }, [user, location.pathname, isGuestOrLanding])

  const filtered = useMemo(() => {
    const list = [...searchItems]
    if (query.trim()) {
      if (!isGuestOrLanding) {
        list.unshift({
          name: `Ask AI: "${query.trim()}"`,
          to: `/chat?q=${encodeURIComponent(query.trim())}`,
          category: 'AI Assistant',
          icon: 'bi-stars',
          isAiPrompt: true,
        })
      }
    }
    return list.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, searchItems, isGuestOrLanding])

  const handleTrigger = (item) => {
    setIsOpen(false)
    if (item.action === 'toggle-theme') {
      toggleTheme()
    } else if (item.action === 'open-demo') {
      window.dispatchEvent(new CustomEvent('open-demo-modal'))
    } else if (item.to) {
      if (item.to.startsWith('#')) {
        if (location.pathname === '/') {
          const el = document.querySelector(item.to)
          el?.scrollIntoView({ behavior: 'smooth' })
        } else {
          navigate('/' + item.to)
        }
      } else {
        navigate(item.to)
      }
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
            placeholder={
              isGuestOrLanding
                ? 'Search landing page sections, demo accounts, actions...'
                : 'Search pages, tools, actions...'
            }
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
