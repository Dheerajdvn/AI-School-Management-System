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
      {/* Sticky Header Navbar */}
      <header className={`sticky-top transition-all ${scrolled ? 'bg-surface border-bottom shadow-sm' : 'bg-transparent'}`}
              style={{ background: scrolled ? 'var(--surface)' : 'transparent', borderColor: 'var(--border)', zIndex: 1000 }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="d-flex align-items-center justify-content-between py-3">
            <Link to="/" className="text-decoration-none fw-bold fs-5 text-primary d-flex align-items-center gap-2">
              <i className="bi bi-mortarboard-fill fs-4"></i>
              <span>AI School OS</span>
            </Link>

            <div className="d-none d-sm-flex align-items-center gap-3">
              <button onClick={toggleTheme} className="btn btn-icon rounded-circle" title="Toggle theme" aria-label="Toggle theme">
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'}`}></i>
              </button>

              <Link to="/login" className="btn btn-secondary btn-sm px-3 fw-semibold">
                Sign In
              </Link>
              <button onClick={openDemo} className="btn btn-primary btn-sm px-3 fw-semibold">
                Try Demo
              </button>
            </div>

            <div className="d-flex d-sm-none align-items-center gap-2">
              <button onClick={toggleTheme} className="btn btn-icon rounded-circle" title="Toggle theme" aria-label="Toggle theme">
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'}`}></i>
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
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-bold text-primary d-inline-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill"></i>
            AI School OS
          </span>
          <button type="button" className="btn btn-icon" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
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
        <FeatureGrid />
        <RagPipelineShowcase />
        <RoleShowcase />
        <FAQ />
      </main>

      {/* Footer */}
      <LandingFooter onOpenDemo={openDemo} />

      {/* Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
