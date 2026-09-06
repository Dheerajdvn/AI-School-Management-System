import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const ROLE_ADMIN = 'ROLE_ADMIN'
const ROLE_PRINCIPAL = 'ROLE_PRINCIPAL'
const ROLE_SCHOOL_ADMIN = 'ROLE_SCHOOL_ADMIN'
const ROLE_TEACHER = 'ROLE_TEACHER'
const ROLE_STUDENT = 'ROLE_STUDENT'

const ROLE_LINKS = {
  [ROLE_ADMIN]: [
    { to: '/admin', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { to: '/admin/schools', icon: 'bi-building', label: 'Schools' },
    { to: '/admin/school-admins', icon: 'bi-person-badge', label: 'School Admins' },
    { to: '/admin/users', icon: 'bi-people', label: 'Users' },
    { to: '/admin/courses', icon: 'bi-journal-bookmark', label: 'Courses' },
    { to: '/admin/subscriptions', icon: 'bi-credit-card', label: 'Subscriptions' },
    { to: '/admin/platform-analytics', icon: 'bi-graph-up-arrow', label: 'Analytics' },
    { to: '/admin/audit-logs', icon: 'bi-file-text', label: 'Audit Logs' },
    { to: '/knowledge', icon: 'bi-lightbulb', label: 'AI Knowledge' },
    { to: '/admin/documents', icon: 'bi-folder', label: 'Documents' },
    { to: '/admin/assignments', icon: 'bi-card-text', label: 'Assignments' },
    { to: '/admin/submissions', icon: 'bi-upload', label: 'Submissions' },
    { to: '/admin/analytics', icon: 'bi-robot', label: 'AI Analytics' },
    { to: '/admin/reports', icon: 'bi-bar-chart-line', label: 'Reports' },
    { to: '/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/settings', icon: 'bi-gear', label: 'Settings' },
  ],
  [ROLE_PRINCIPAL]: [
    { to: '/principal', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { to: '/principal/documents', icon: 'bi-folder', label: 'Documents' },
    { to: '/principal/ai', icon: 'bi-robot', label: 'AI Dashboard' },
  ],
  [ROLE_TEACHER]: [
    { to: '/teacher/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { to: '/teacher/my-classes', icon: 'bi-layers', label: 'My Classes' },
    { to: '/teacher/attendance', icon: 'bi-calendar-check', label: 'Attendance' },
    { to: '/teacher/assignments', icon: 'bi-card-text', label: 'Assignments' },
    { to: '/teacher/lesson-planner', icon: 'bi-robot', label: 'AI Lesson Planner' },
    { to: '/teacher/quiz-generator', icon: 'bi-question-circle', label: 'Quiz Generator' },
    { to: '/teacher/homework-review', icon: 'bi-file-earmark-text', label: 'Homework Review' },
    { to: '/teacher/gradebook', icon: 'bi-graph-up', label: 'Gradebook' },
    { to: '/teacher/study-materials', icon: 'bi-folder', label: 'Study Materials' },
    { to: '/teacher/student-analytics', icon: 'bi-bar-chart', label: 'Student Analytics' },
    { to: '/teacher/notifications', icon: 'bi-bell', label: 'Notifications' },
    { to: '/teacher/documents', icon: 'bi-folder', label: 'Documents' },
    { to: '/teacher/ai', icon: 'bi-chat-dots', label: 'AI Assistant' },
  ],
  [ROLE_SCHOOL_ADMIN]: [
    { to: '/school', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { to: '/exam', icon: 'bi-file-earmark-text', label: 'Exams' },
    { to: '/school/profile', icon: 'bi-building', label: 'School Profile' },
    { to: '/school/academic-years', icon: 'bi-calendar3', label: 'Academic Years' },
    { to: '/school/classes', icon: 'bi-layers', label: 'Classes' },
    { to: '/school/sections', icon: 'bi-columns-gap', label: 'Sections' },
    { to: '/school/subjects', icon: 'bi-book', label: 'Subjects' },
    { to: '/school/teachers', icon: 'bi-person-badge', label: 'Teachers' },
    { to: '/school/students', icon: 'bi-people', label: 'Students' },
    { to: '/school/departments', icon: 'bi-diagram-3', label: 'Departments' },
    { to: '/school/timetable', icon: 'bi-calendar-week', label: 'Timetable' },
    { to: '/school/announcements', icon: 'bi-megaphone', label: 'Announcements' },
    { to: '/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/school/settings', icon: 'bi-gear', label: 'Settings' },
    { to: '/school/documents', icon: 'bi-folder', label: 'Documents' },
  ],
  [ROLE_STUDENT]: [
    { to: '/student', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { to: '/student/courses', icon: 'bi-book', label: 'My Courses' },
    { to: '/student/assignments', icon: 'bi-card-text', label: 'Assignments' },
    { to: '/student/attendance', icon: 'bi-calendar-check', label: 'Attendance' },
    { to: '/student/grades', icon: 'bi-graph-up', label: 'Grades' },
    { to: '/student/study-materials', icon: 'bi-folder', label: 'Study Materials' },
    { to: '/student/ai-tutor', icon: 'bi-robot', label: 'AI Tutor' },
    { to: '/student/ai-homework-helper', icon: 'bi-lightbulb', label: 'Homework Helper' },
    { to: '/student/ai-quiz-practice', icon: 'bi-question-circle', label: 'Quiz Practice' },
    { to: '/student/documents', icon: 'bi-folder', label: 'Documents' },
    { to: '/student/calendar', icon: 'bi-calendar', label: 'Calendar' },
    { to: '/student/notifications', icon: 'bi-bell', label: 'Notifications' },
    { to: '/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/settings', icon: 'bi-gear', label: 'Settings' },
    { to: '/student/ai', icon: 'bi-chat-dots', label: 'AI Assistant' },
  ],
}

function getNavigationLinks(user) {
  if (!user || !user.roles || user.roles.length === 0) {
    return ROLE_LINKS[ROLE_ADMIN]
  }

  const rolePriority = {
    [ROLE_ADMIN]: 1,
    [ROLE_PRINCIPAL]: 2,
    [ROLE_SCHOOL_ADMIN]: 3,
    [ROLE_TEACHER]: 4,
    [ROLE_STUDENT]: 5,
  }

  const sortedRoles = [...user.roles].sort((a, b) => {
    const priorityA = rolePriority[a] || 999
    const priorityB = rolePriority[b] || 999
    return priorityA - priorityB
  })

  const highestPriorityRole = sortedRoles[0]
  return ROLE_LINKS[highestPriorityRole] || ROLE_LINKS[ROLE_ADMIN]
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const links = getNavigationLinks(user)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDisplayRole = () => {
    if (!user?.roles) return 'User'
    const role = user.roles[0]
    const roleNames = {
      [ROLE_ADMIN]: 'Administrator',
      [ROLE_PRINCIPAL]: 'Principal',
      [ROLE_SCHOOL_ADMIN]: 'School Admin',
      [ROLE_TEACHER]: 'Teacher',
      [ROLE_STUDENT]: 'Student',
    }
    return roleNames[role] || role
  }

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <aside className={`sidebar enterprise-sidebar ${open ? 'open' : 'collapsed'}`}>
        <div className="sidebar-brand">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-2.5">
              <div className="dashdark-brand-glyph">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="16" height="16" rx="5" fill="#00D8F6" fillOpacity="0.85" />
                  <rect x="10" y="10" width="16" height="16" rx="5" fill="#EC4899" fillOpacity="0.9" />
                </svg>
              </div>
              <div className="brand-text">
                <span className="brand-title">AI School OS</span>
                <span className="brand-subtitle">ENTERPRISE CORE</span>
              </div>
            </div>
            <button 
              className="btn btn-link p-0 text-muted d-flex align-items-center opacity-75 hover-opacity-100 text-decoration-none"
              title="Toggle view"
              onClick={onClose}
              style={{ fontSize: '13px' }}
            >
              <i className="bi bi-chevron-left d-lg-none" />
              <i className="bi bi-code-slash d-none d-lg-inline" />
            </button>
          </div>
        </div>

        {/* Dashdark X Search Capsule */}
        <div className="sidebar-search-container px-3 pt-2.5 pb-2">
          <div 
            className="dashdark-search-bar d-flex align-items-center"
            onClick={() => window.dispatchEvent(new CustomEvent('open-quick-search'))}
            title="Search for..."
          >
            <i className="bi bi-search text-muted me-2" style={{ fontSize: '12px' }} />
            <span className="text-muted small flex-grow-1" style={{ fontSize: '12px' }}>Search for...</span>
            <kbd className="dashdark-kbd">⌘K</kbd>
          </div>
        </div>

        {/* Categorized Navigation */}
        <nav className="sidebar-nav flex-column px-2 py-1">
          <div className="nav-section-label">COMMAND CENTER</div>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/' || l.to === '/admin' || l.to === '/teacher/dashboard' || l.to === '/student' || l.to === '/school'}
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth < 992 && onClose) {
                  onClose()
                }
              }}
            >
              <span className="active-indicator" />
              <i className={`bi ${l.icon} nav-icon`} />
              <span className="nav-label flex-grow-1">{l.label}</span>
              <i className="bi bi-chevron-right nav-arrow" />
            </NavLink>
          ))}
        </nav>

        {/* Dashdark X Bottom User Profile Card */}
        {user && (
          <div className="sidebar-footer mt-auto p-3 position-relative" ref={userMenuRef}>
            {userMenuOpen && (
              <div className="user-dropdown-popup shadow-2xl">
                <div className="px-3 py-2 border-bottom" style={{ borderColor: 'var(--border)' }}>
                  <div className="fw-bold small text-light">{user.username || 'User'}</div>
                  <div className="text-muted text-xs">{getDisplayRole()}</div>
                </div>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3" onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}>
                  <i className="bi bi-person fs-6 text-primary" /> Profile Settings
                </button>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3" onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}>
                  <i className="bi bi-gear fs-6 text-primary" /> Account & AI Settings
                </button>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3" onClick={() => { setUserMenuOpen(false); toggleTheme(); }}>
                  <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'} fs-6 text-warning`} /> 
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <div className="dropdown-divider my-1" style={{ borderColor: 'var(--border)' }} />
                <button className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right fs-6" /> Log out
                </button>
              </div>
            )}

            <div 
              className="dashdark-user-card d-flex align-items-center gap-2.5 p-2 rounded-3 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title="Click for account options"
            >
              <div className="position-relative flex-shrink-0">
                <div className="dashdark-avatar">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="dashdark-online-dot" title="Online" />
              </div>
              <div className="user-info flex-grow-1 overflow-hidden">
                <div className="user-name text-truncate fw-bold">{user.username || 'Administrator'}</div>
                <div className="user-subtext text-truncate">Account settings</div>
              </div>
              <i className="bi bi-chevron-right user-chevron text-muted" />
            </div>
          </div>
        )}

        {!user && (
          <div className="sidebar-footer mt-auto p-3 text-center small text-muted border-top border-secondary opacity-75">
            <i className="bi bi-shield-lock me-1" /> Enterprise Secure OS
          </div>
        )}
      </aside>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
    </>
  )
}
