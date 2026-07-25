import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { AiApi } from '../services/api'

/**
 * Modern SaaS-style landing page for the AI School Management Platform.
 * Premium design inspired by Vercel, Linear, Cursor, and Google AI Studio.
 */
export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const [isAiHealthy, setIsAiHealthy] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkHealth = async () => {
      try {
        const res = await AiApi.health()
        if (isMounted) {
          setIsAiHealthy(!!res?.llmAvailable)
        }
      } catch (err) {
        if (isMounted) setIsAiHealthy(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 10000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const features = [
    { icon: 'bi-building-fill', title: 'School Management', description: 'Centralize multi-campus school operations and administration with real-time sync.' },
    { icon: 'bi-people-fill', title: 'Student Intelligence', description: 'Track student records, automated attendance, and predictive academic progress.' },
    { icon: 'bi-person-badge-fill', title: 'Educator Workspace', description: 'Empower teachers with lesson planning assistants, automated grading, and gradebooks.' },
    { icon: 'bi-book-fill', title: 'Curriculum & Courses', description: 'Organize structured syllabi, study materials, and interactive course catalogs.' },
    { icon: 'bi-journal-text', title: 'Smart Assignments', description: 'Deploy assignments, track live submissions, and provide AI-driven rubric feedback.' },
    { icon: 'bi-robot', title: 'AI Tutor & Assistant', description: 'Provide students 24/7 personalized tutoring and RAG-powered document question answering.' },
    { icon: 'bi-graph-up-arrow', title: 'Executive Analytics', description: 'Gain actionable insights with real-time dashboards and predictive performance charts.' },
    { icon: 'bi-shield-lock', title: 'Enterprise Security', description: 'Robust role-based access control, encrypted data stores, and comprehensive audit logs.' },
  ]

  const aiCapabilities = [
    { icon: 'bi-chat-dots-fill', title: 'Generative AI Tutor', desc: 'Conversational assistant providing adaptive explanations for every student.' },
    { icon: 'bi-search', title: 'RAG Document Search', desc: 'Instant semantic search across thousands of uploaded syllabus & textbook pages.' },
    { icon: 'bi-journal-check', title: 'Automated Grading', desc: 'AI-assisted homework grading and constructive feedback generation.' },
    { icon: 'bi-cpu-fill', title: 'Multi-Model Support', desc: 'Seamlessly switch between Ollama local LLMs and OpenAI-compatible endpoints.' },
  ]

  const faqItems = [
    { q: 'How does AI School OS secure student data?', a: 'We employ enterprise-grade encryption at rest and in transit, strict RBAC, and zero-data-retention local LLM options via Ollama.' },
    { q: 'Can we connect custom AI models?', a: 'Yes! The platform supports pluggable LLM provider strategies including OpenAI, Anthropic, Google Gemini, and local Ollama instances.' },
    { q: 'Is there multi-campus support?', a: 'Absolutely. Principals and main administrators can manage multiple schools, academic years, and departments from a unified command center.' },
  ]

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-card border-bottom py-3 sticky-top shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="container px-4">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="brand-icon-wrapper">
              <i className="bi bi-cpu-fill text-white" />
            </div>
            <span className="fs-5 fw-bold" style={{ color: 'var(--text)' }}>AI School OS</span>
          </Link>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <button
              className="btn btn-icon rounded-circle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'} fs-6`} />
            </button>
            <Link to="/login" className="btn btn-primary px-4 rounded-pill">
              <i className="bi bi-box-arrow-in-right me-1" />
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section py-5 py-md-6 text-center position-relative overflow-hidden">
        <div className="container py-5 position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <div className="badge enterprise-badge mb-3 px-3 py-2 rounded-pill shadow-sm" style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }}>
              <span className="pulse-dot me-1" /> Enterprise AI School Management Platform v2.4
            </div>
            <h1 className="display-3 fw-bold mb-4 tracking-tight" style={{ color: 'var(--text)' }}>
              The AI-First Operating System for <span className="text-primary">Modern Education</span>
            </h1>
            <p className="lead text-muted mb-5 fs-5">
              Transform campus administration, empower educators with generative AI, and deliver personalized learning at scale with enterprise security.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/login" className="btn btn-primary btn-lg px-5 rounded-pill shadow-lg">
                <i className="bi bi-rocket-takeoff me-2" /> Get Started
              </Link>
              <button className="btn btn-outline-secondary btn-lg px-4 rounded-pill" onClick={() => scrollToSection('features')}>
                Explore Capabilities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Theme-Aware Cards */}
      <section id="features" className="py-5 py-md-6 border-top" style={{ borderColor: 'var(--border)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
            <h2 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Engineered for Excellence</h2>
            <p className="text-muted">Designed following principles from Linear, Vercel, and Cursor to deliver lightning-fast response and pristine user experience.</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div 
                  className="card h-100 p-4 border rounded-4 shadow-sm hover-lift" 
                  style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)', minHeight: '220px' }}
                >
                  <div className="icon-box mb-3 fs-2 text-primary bg-primary bg-opacity-10 rounded-3 d-inline-flex p-2 align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>{f.title}</h5>
                  <p className="small mb-0 text-muted">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Powered Features Section with Theme-Aware Cards */}
      <section id="ai-section" className="py-5 py-md-6 border-top" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
            <h2 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Generative AI at Your Fingertips</h2>
            <p className="text-muted">Equipped with state-of-the-art RAG engines and multi-provider model routing.</p>
          </div>
          <div className="row g-4">
            {aiCapabilities.map((ai, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div 
                  className="card h-100 p-4 border rounded-4 shadow-sm hover-lift"
                  style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)', minHeight: '220px' }}
                >
                  <div className="fs-2 mb-3 text-primary bg-primary bg-opacity-10 rounded-3 d-inline-flex p-2 align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className={`bi ${ai.icon}`} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>{ai.title}</h5>
                  <p className="small mb-0 text-muted">{ai.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 py-md-6 border-top" style={{ borderColor: 'var(--border)' }}>
        <div className="container px-4" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Frequently Asked Questions</h2>
            <p className="text-muted">Everything you need to know about AI School OS.</p>
          </div>
          <div className="accordion d-flex flex-column gap-3" id="faqAccordion">
            {faqItems.map((item, index) => (
              <div key={index} className="card p-4 border rounded-4 shadow-sm" style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
                <h5 className="fw-bold mb-2 text-primary">{item.q}</h5>
                <p className="text-muted small mb-0">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-5 bg-gradient-primary text-white text-center" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)' }}>
        <div className="container py-4">
          <h2 className="fw-bold mb-3 text-white">Ready to Modernize Your Campus?</h2>
          <p className="lead text-white-50 mb-4">Join leading educational institutions using AI School OS.</p>
          <Link to="/login" className="btn btn-light btn-lg text-primary fw-semibold px-5 rounded-pill shadow">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Professional SaaS Footer */}
      <footer className="py-5 border-top" style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--text)' }}>
        <div className="container px-4">
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="brand-icon-wrapper">
                  <i className="bi bi-cpu-fill text-white" />
                </div>
                <span className="fs-5 fw-bold" style={{ color: 'var(--text)' }}>AI School OS</span>
              </div>
              <p className="text-muted small mb-3">
                The premier enterprise AI-powered platform for multi-campus school management, automated grading, and intelligent tutoring.
              </p>
              <div className="d-flex gap-3 text-muted">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-github" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-linkedin" /></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-twitter" /></a>
              </div>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
                <li><a href="#home" className="text-muted text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>About Us</a></li>
                <li><a href="#features" className="text-muted text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                <li><a href="#ai-section" className="text-muted text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('ai-section'); }}>AI Architecture</a></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Resources</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
                <li><Link to="/knowledge" className="text-muted text-decoration-none">Documentation</Link></li>
                <li><a href="#faqAccordion" className="text-muted text-decoration-none">API Reference</a></li>
                <li><Link to="/login" className="text-muted text-decoration-none">System Status</Link></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Support & Contact</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
                <li><i className="bi bi-envelope me-2" /> support@aischoolos.io</li>
                <li><i className="bi bi-telephone me-2" /> +1 (800) 555-AI-OS</li>
                <li><i className="bi bi-geo-alt me-2" /> Silicon Valley, CA, USA</li>
              </ul>
            </div>
          </div>
          <div className="border-top pt-4 text-center text-muted small d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ borderColor: 'var(--border)' }}>
            <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} AI School OS. All rights reserved. Enterprise SaaS Edition.</p>
            <p className="mb-0">Built with React + Spring Boot + AI (Ollama & OpenAI RAG)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
