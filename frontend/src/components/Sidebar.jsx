import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Role constants
const ROLE_ADMIN = 'ROLE_ADMIN'
const ROLE_PRINCIPAL = 'ROLE_PRINCIPAL'
const ROLE_SCHOOL_ADMIN = 'ROLE_SCHOOL_ADMIN'
const ROLE_TEACHER = 'ROLE_TEACHER'
const ROLE_STUDENT = 'ROLE_STUDENT'

// Navigation links for each role
const ROLE_LINKS = {
  [ROLE_ADMIN]: [
    { to: '/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/admin/schools', icon: 'bi-building', label: 'Schools' },
    { to: '/admin/school-admins', icon: 'bi-person-badge', label: 'School Admins' },
    { to: '/admin/users', icon: 'bi-people', label: 'Users' },
    { to: '/admin/subscriptions', icon: 'bi-credit-card', label: 'Subscriptions' },
    { to: '/admin/platform-analytics', icon: 'bi-graph-up-arrow', label: 'Analytics' },
    { to: '/admin/audit-logs', icon: 'bi-file-text', label: 'Audit Logs' },
    { to: '/knowledge', icon: 'bi-lightbulb', label: 'AI Knowledge Center' },
    { to: '/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/settings', icon: 'bi-gear', label: 'Settings' },
    { to: '/admin/documents', icon: 'bi-folder', label: 'Documents' },
    { to: '/admin/assignments', icon: 'bi-card-text', label: 'Assignments' },
    { to: '/admin/submissions', icon: 'bi-upload', label: 'Submissions' },
    { to: '/admin/analytics', icon: 'bi-robot', label: 'AI Analytics' },
    { to: '/admin/reports', icon: 'bi-bar-chart-line', label: 'Reports' },
  ],
  [ROLE_PRINCIPAL]: [
    { to: '/principal', icon: 'bi-speedometer2', label: 'Home' },
    { to: '/principal/documents', icon: 'bi-folder', label: 'Documents' },
    { to: '/principal/ai', icon: 'bi-robot', label: 'AI Dashboard' },
  ],
  [ROLE_TEACHER]: [
    { to: '/teacher/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
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
    { to: '/school', icon: 'bi-speedometer2', label: 'Dashboard' },
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
    { to: '/student', icon: 'bi-speedometer2', label: 'Dashboard' },
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
    { to: '/student/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/student/settings', icon: 'bi-gear', label: 'Settings' },
    { to: '/student/ai', icon: 'bi-chat-dots', label: 'AI Assistant' },
  ],
}

/**
 * Get navigation links based on user's highest priority role
 */
function getNavigationLinks(user) {
  if (!user || !user.roles || user.roles.length === 0) {
    return ROLE_LINKS[ROLE_ADMIN] // Default to admin links
  }

  const rolePriority = {
    [ROLE_ADMIN]: 1,
    [ROLE_PRINCIPAL]: 2,
    [ROLE_SCHOOL_ADMIN]: 3,
    [ROLE_TEACHER]: 4,
    [ROLE_STUDENT]: 5,
  }

  // Sort roles by priority
  const sortedRoles = [...user.roles].sort((a, b) => {
    const priorityA = rolePriority[a] || 999
    const priorityB = rolePriority[b] || 999
    return priorityA - priorityB
  })

  const highestPriorityRole = sortedRoles[0]
  return ROLE_LINKS[highestPriorityRole] || ROLE_LINKS[ROLE_ADMIN]
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const links = getNavigationLinks(user)

  // Get display role name
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

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <i className="bi bi-mortarboard-fill" />
          AI Dashboard
        </div>
        <nav className="nav flex-column mt-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className={`bi ${l.icon}`} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="mt-auto p-3 small" style={{ opacity: 0.8 }}>
            <div className="mb-2">
              <i className="bi bi-person-circle me-1" />
              {user.username}
            </div>
            <div>
              <i className="bi bi-shield-check me-1" />
              {getDisplayRole()}
            </div>
            <div className="mt-2">
              <i className="bi bi-c-circle me-1" />
              AI Student Dashboard v1.0
            </div>
          </div>
        )}
        {!user && (
          <div className="mt-auto p-3 small" style={{ opacity: 0.8 }}>
            <i className="bi bi-c-circle me-1" />
            AI Student Dashboard v1.0
          </div>
        )}
      </aside>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
    </>
  )
}