import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

import Hero from '../components/landing/Hero'
import TrustComplianceBar from '../components/landing/TrustComplianceBar'
import InteractiveAiSandbox from '../components/landing/InteractiveAiSandbox'
import FeatureGrid from '../components/landing/FeatureGrid'
import ComparisonTable from '../components/landing/ComparisonTable'
import RoiCalculator from '../components/landing/RoiCalculator'
import RoleShowcase from '../components/landing/RoleShowcase'
import PricingPlans from '../components/landing/PricingPlans'
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

  useEffect(() => {
    const handleOpenDemo = () => setDemoModalOpen(true)
    window.addEventListener('open-demo-modal', handleOpenDemo)
    return () => window.removeEventListener('open-demo-modal', handleOpenDemo)
  }, [])

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
          <Link to="/" className="text-decoration-none fw-bold fs-5 landing-brand-link d-flex align-items-center gap-2.5 my-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: 'var(--home-heading)' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
              <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.85" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <span className="landing-brand-text fw-bold" style={{ letterSpacing: '-0.03em', fontSize: '1.05rem' }}>AI School OS</span>
          </Link>

          {/* Centered Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-3 mx-auto my-auto">
            <a href="#ai-sandbox" className="landing-nav-link">AI Sandbox</a>
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#comparison" className="landing-nav-link">Compare</a>
            <a href="#roi-calculator" className="landing-nav-link">ROI Calculator</a>
            <a href="#pricing" className="landing-nav-link">Pricing</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
          </div>

          {/* Right Action Controls - Equal height & theme adaptive */}
          <div className="d-none d-sm-flex align-items-center gap-2.5 my-auto" style={{ height: '40px' }}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-quick-search'))}
              className="btn btn-secondary d-none d-xl-inline-flex align-items-center gap-2 px-2.5"
              style={{ height: '38px', borderRadius: '10px', fontSize: '0.82rem' }}
              title="Quick Search (Ctrl + K)"
            >
              <i className="bi bi-search text-muted" style={{ fontSize: '0.8rem' }}></i>
              <span className="text-muted">Search</span>
              <kbd className="badge bg-body-secondary text-muted font-monospace border px-1 py-0.5" style={{ fontSize: '0.64rem' }}>Ctrl K</kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="btn btn-secondary d-inline-flex align-items-center justify-content-center p-0 theme-toggle-btn"
              style={{ width: '40px', height: '40px', borderRadius: '10px' }}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-dark'}`}></i>
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
          <a href="#ai-sandbox" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>AI Sandbox</a>
          <a href="#features" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#comparison" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Compare</a>
          <a href="#roles" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Role Portals</a>
          <a href="#roi-calculator" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>ROI Calculator</a>
          <a href="#pricing" className="landing-nav-link text-start py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
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
        <TrustComplianceBar />
        <InteractiveAiSandbox onOpenDemo={openDemo} />
        <div id="features"><FeatureGrid /></div>
        <ComparisonTable onOpenDemo={openDemo} />
        <div id="roles"><RoleShowcase /></div>
        <RoiCalculator onOpenDemo={openDemo} />
        <PricingPlans onOpenDemo={openDemo} />
        <div id="faq"><FAQ /></div>
      </main>

      {/* Footer */}
      <LandingFooter onOpenDemo={openDemo} />

      {/* Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
