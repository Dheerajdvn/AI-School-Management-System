import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTE_TITLES } from '../constants/routes'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function ProtectedLayout({ children }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 992)
  const title = ROUTE_TITLES[pathname] || 'AI Student Dashboard'

  useEffect(() => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && window.innerWidth < 992) {
        setSidebarOpen(false)
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setSidebarOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`main ${!sidebarOpen ? 'expanded' : ''}`}>
        {!sidebarOpen && (
          <button
            type="button"
            className="floating-sidebar-trigger d-none d-lg-flex align-items-center justify-content-center"
            onClick={() => setSidebarOpen(true)}
            title="Show sidebar (Ctrl+B)"
            aria-label="Show sidebar"
          >
            <i className="bi bi-chevron-right" />
          </button>
        )}
        <Topbar title={title} onMenu={() => setSidebarOpen(prev => !prev)} sidebarOpen={sidebarOpen} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}
