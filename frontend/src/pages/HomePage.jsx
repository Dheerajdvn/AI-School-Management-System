import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

import Hero from '../components/landing/Hero'
import FeatureGrid from '../components/landing/FeatureGrid'
import RagPipelineShowcase from '../components/landing/RagPipelineShowcase'
import RoleShowcase from '../components/landing/RoleShowcase'
import FAQ from '../components/landing/FAQ'
import LandingFooter from '../components/landing/LandingFooter'
import DemoModal from '../components/landing/DemoModal'
import LandingBgCanvas from '../components/landing/LandingBgCanvas'

/**
 * Clean, Grounded Landing Page for AI School OS.
 * Full-stack educational management platform with RAG vector search.
 */
export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Sticky Navbar Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const openDemo = () => {
    setMobileMenuOpen(false)
    setDemoModalOpen(true)
  }

  return (
    <div className="home-page min-vh-100 d-flex flex-column">
      <LandingBgCanvas />
      {/* Theme-Adaptive Floating Glass Navbar */}
      <header className="sticky-top transition-all px-2 px-sm-3" style={{ top: 0, zIndex: 1000 }}>
        <div className="landing-floating-nav container-fluid d-flex align-items-center justify-content-between">
          <Link to="/" className="text-decoration-none fw-bold fs-5 landing-brand-link d-flex align-items-center gap-2 my-auto">
            <div className="d-flex align-items-center justify-content-center rounded-3 px-2 py-1 brand-icon-badge" style={{ background: 'linear-gradient(135deg, #6D7CFF, #8B7CFF)', color: '#fff' }}>
              <i className="bi bi-mortarboard-fill fs-5"></i>
            </div>
            <span className="landing-brand-text">AI School OS</span>
          </Link>

          {/* Centered Desktop Navigation Links */}
          <div className="d-none d-md-flex align-items-center gap-3 mx-auto my-auto">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#knowledge-engine" className="landing-nav-link">Knowledge Engine</a>
            <a href="#roles" className="landing-nav-link">Role Portals</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
          </div>

          {/* Right Action Controls - Equal height & theme adaptive */}
          <div className="d-none d-sm-flex align-items-center gap-2.5 my-auto" style={{ height: '40px' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary d-inline-flex align-items-center justify-content-center p-0 theme-toggle-btn"
              style={{ width: '40px', height: '40px', borderRadius: '10px' }}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}`}></i>
            </button>

            <Link
              to="/login"
              className="btn btn-secondary fw-semibold d-inline-flex align-items-center justify-content-center px-3"
              style={{ height: '38px', borderRadius: '10px', fontSize: '0.85rem' }}
            >
              Sign In
            </Link>
            
            <button
              onClick={openDemo}
              className="btn btn-primary fw-semibold d-inline-flex align-items-center justify-content-center px-3.5"
              style={{ height: '38px', borderRadius: '10px', fontSize: '0.85rem' }}
            >
              Try Demo
            </button>
          </div>

          <div className="d-flex d-sm-none align-items-center gap-2 my-auto">
            <button
              onClick={toggleTheme}
              className="btn btn-secondary d-inline-flex align-items-center justify-content-center p-0"
              style={{ width: '36px', height: '36px', borderRadius: '8px' }}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}`}></i>
            </button>
            <button
              type="button"
              className="hamburger"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="landing-mobile-menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="landing-mobile-menu"
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="fw-bold text-primary d-inline-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill"></i>
            AI School OS
          </span>
          <button type="button" className="btn btn-icon" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="d-flex flex-column gap-2 mb-3">
          <a href="#features" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#knowledge-engine" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Knowledge Engine</a>
          <a href="#roles" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Role Portals</a>
          <a href="#faq" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
        </div>
        <div className="d-flex flex-column gap-2">
          <Link to="/login" className="btn btn-secondary fw-semibold" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
          <button type="button" className="btn btn-primary fw-semibold" onClick={openDemo}>
            Try Demo
          </button>
        </div>
      </nav>

      {/* Main Page Sections */}
      <main className="flex-grow-1">
        <Hero onOpenDemo={openDemo} />
        <div id="features"><FeatureGrid /></div>
        <div id="knowledge-engine"><RagPipelineShowcase /></div>
        <div id="roles"><RoleShowcase /></div>
        <div id="faq"><FAQ /></div>
      </main>

      {/* Footer */}
      <LandingFooter onOpenDemo={openDemo} />

      {/* Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
