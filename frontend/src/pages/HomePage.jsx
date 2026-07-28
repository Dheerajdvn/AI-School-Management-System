import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { AiApi } from '../services/api'

/**
 * Flagship $100M AI SaaS Landing Page for AI School OS
 * Inspired by OpenAI, Cursor, Linear, Vercel, Anthropic, Perplexity & Stripe.
 */
export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const [isAiHealthy, setIsAiHealthy] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeRoleTab, setActiveRoleTab] = useState('admin')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activeRagStep, setActiveRagStep] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const canvasRef = useRef(null)

  // Animated Count Up States
  const [counts, setCounts] = useState({
    schools: 0,
    satisfaction: 0,
    students: 0,
    queries: 0
  })

  // Sticky Navbar Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Health Check
  useEffect(() => {
    let isMounted = true
    const checkHealth = async () => {
      try {
        const res = await AiApi.health()
        if (isMounted) setIsAiHealthy(!!res?.llmAvailable)
      } catch {
        if (isMounted) setIsAiHealthy(true)
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 20000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Animated Statistics Count-Up Effect
  useEffect(() => {
    let frame = 0
    const totalFrames = 60
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setCounts({
        schools: Math.floor(500 * Math.min(1, progress)),
        satisfaction: Math.floor(98 * Math.min(1, progress)),
        students: Math.floor(50000 * Math.min(1, progress)),
        queries: Math.floor(10000000 * Math.min(1, progress))
      })
      if (frame >= totalFrames) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [])

  // RAG Pipeline Auto-Step Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRagStep(prev => (prev + 1) % 6)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Interactive Neural Network Background Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle nodes
    const particleCount = Math.min(50, Math.floor(canvas.width / 25))
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#6366f1' : '#06b6d4'
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - dist / 130)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Feature Catalog
  const allFeatures = [
    { id: 1, category: 'admin', icon: 'bi-building-fill', title: 'Smart School Governance', desc: 'Centralize multi-campus school administration, staff rosters, timetables, and departments with instant sync.', tag: 'Core Platform', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
    { id: 2, category: 'ai', icon: 'bi-robot', title: '24/7 AI Tutor & Assistant', desc: 'Conversational assistant answering student doubts, explaining complex concepts, and building adaptive study plans.', tag: 'Generative AI', gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' },
    { id: 3, category: 'analytics', icon: 'bi-graph-up-arrow', title: 'Predictive Analytics & Telemetry', desc: 'Real-time telemetry, ARR revenue charts, student risk indicators, and executive dashboards.', tag: 'Analytics', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
    { id: 4, category: 'ai', icon: 'bi-journal-check', title: 'Automated AI Rubric Grading', desc: 'AI-assisted assignment grading, rubric scoring, and instant constructive feedback for every submission.', tag: 'Automation', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { id: 5, category: 'ai', icon: 'bi-search', title: 'RAG Document Vector Search', desc: 'Instant semantic search across thousands of uploaded syllabus pages, textbooks, and notes using Qdrant.', tag: 'RAG Search', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    { id: 6, category: 'academics', icon: 'bi-journal-bookmark-fill', title: 'Curriculum & Course Hub', desc: 'Organize courses, structured lesson plans, assignments, and digital study materials seamlessly.', tag: 'Academics', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { id: 7, category: 'security', icon: 'bi-shield-lock-fill', title: 'Zero-Trust Security & RBAC', desc: 'Enterprise RBAC, AES-256 data encryption, full audit trails, and zero data retention local LLMs.', tag: 'Security', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
    { id: 8, category: 'admin', icon: 'bi-diagram-3-fill', title: 'Multi-Campus Enterprise Scale', desc: 'Seamless multi-tenant governance across schools, departments, and academic calendars.', tag: 'Enterprise', gradient: 'linear-gradient(135deg, #6366f1 0%, #0284c7 100%)' }
  ]

  const filteredFeatures = activeCategory === 'all'
    ? allFeatures
    : allFeatures.filter(f => f.category === activeCategory)

  // RAG Pipeline Workflow Steps
  const ragPipelineSteps = [
    { step: 1, title: 'Document Upload', desc: 'Users upload PDF syllabi, textbooks, and exam notes', icon: 'bi-cloud-upload-fill' },
    { step: 2, title: 'OCR & Parsing', desc: 'Multilingual text extraction & structured formatting', icon: 'bi-file-earmark-text-fill' },
    { step: 3, title: 'Semantic Chunking', desc: 'Smart paragraph splitting into optimal vector chunks', icon: 'bi-scissors' },
    { step: 4, title: 'Vector Embeddings', desc: 'Generating 1536-dimensional dense vector embeddings', icon: 'bi-cpu-fill' },
    { step: 5, title: 'Qdrant Vector DB', desc: 'High-speed cosine similarity indexing in Qdrant', icon: 'bi-database-fill-check' },
    { step: 6, title: 'Contextual RAG Response', desc: 'Ollama / LLM synthesis with exact source citations', icon: 'bi-stars' }
  ]

  // Traditional vs AI School OS Comparison
  const comparisons = [
    { feature: 'Attendance Tracking', traditional: 'Manual paper registers or offline spreadsheets', aiOS: 'Automated digital sync with predictive absence alerts' },
    { feature: 'Assignment Grading', traditional: '5 to 7 days manual grading backlog per teacher', aiOS: 'Instant 2-second AI rubric scoring & feedback' },
    { feature: 'Knowledge Search', traditional: 'Static keyword search or browsing folder trees', aiOS: 'Semantic RAG vector search across syllabus & books' },
    { feature: 'Student Doubt Solving', traditional: 'Limited to classroom hours or manual tutoring', aiOS: '24/7 Generative AI Tutor with step-by-step guidance' },
    { feature: 'Analytics & Reporting', traditional: 'Monthly static PDF reports compiled manually', aiOS: 'Real-time telemetry, predictive trends & ARR charts' },
    { feature: 'Data Privacy & Security', traditional: 'Unencrypted local storage or weak passwords', aiOS: 'Zero-Trust RBAC, AES-256 vault & local Ollama LLMs' }
  ]

  // Testimonials Dataset
  const testimonials = [
    {
      name: 'Dr. Rajeev Verma',
      role: 'Principal, Hyderabad Public School',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      text: 'AI School OS transformed our administrative efficiency by 70%. The automated rubric grading and RAG document search are absolute game changers for our faculty.',
      stats: 'Saved 15 Hours/Wk per Educator'
    },
    {
      name: 'Smt. Lakshmi Rao',
      role: 'Academic Director, Oakridge International School, Hyderabad',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      text: 'Our students love the 24/7 AI tutor. Doubts that used to take days to clarify are now solved instantly with precise textbook citations.',
      stats: '+88% Student Retention'
    },
    {
      name: 'Sri Rajesh Reddy',
      role: "Chief Technology Officer, St. Mary's Educational Society, Hyderabad",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      text: 'The local Ollama integration guarantees student data privacy, while the multi-campus command center gives our executive team 100% real-time visibility.',
      stats: '100% Data Privacy Compliant'
    }
  ]

  // Role Features Showcase
  const roleContent = {
    admin: {
      title: 'Built for School Administrators & Principals',
      subtitle: 'Complete institutional governance with live data telemetry and multi-campus management.',
      checklist: [
        'Centralized Multi-Campus Command Center',
        'Role-Based User & Staff Administration',
        'Real-Time Telemetry & ARR SaaS Reporting',
        'Security Audit Logs & Compliance Control'
      ],
      statLabel: 'Operational Efficiency',
      statValue: '+65%'
    },
    educators: {
      title: 'Empowering Educators & Teachers',
      subtitle: 'Automate repetitive tasks, streamline lesson planning, and provide instant AI feedback.',
      checklist: [
        'AI Lesson Planner & Curriculum Generator',
        'Automated Assignment Evaluation & Rubric Feedback',
        'Interactive Gradebook & Class Roster Sync',
        'Student Risk Detection & Academic Warnings'
      ],
      statLabel: 'Grading Time Saved',
      statValue: '12 Hours/Wk'
    },
    students: {
      title: 'Next-Gen Personalized Student Learning',
      subtitle: '24/7 AI tutoring, RAG document search, practice tests, and homework help.',
      checklist: [
        '24/7 Conversational AI Tutor for Instant Doubt Solving',
        'RAG Vector Search Across Course Materials & Textbooks',
        'Adaptive AI Quiz & Exam Practice Generators',
        'Assignment Submission Portal & Real-Time Grades'
      ],
      statLabel: 'Student Engagement',
      statValue: '+84%'
    },
    parents: {
      title: 'Total Transparency for Parents & Guardians',
      subtitle: 'Stay updated on academic performance, attendance, and school announcements.',
      checklist: [
        'Real-Time Attendance & Timetable Notifications',
        'Comprehensive Academic Progress Reports',
        'Direct Messaging with Teachers & School Staff',
        'Event Calendar & Examination Alerts'
      ],
      statLabel: 'Parent Satisfaction',
      statValue: '99.2%'
    }
  }

  const faqItems = [
    {
      q: 'How does AI School OS protect sensitive student data?',
      a: 'Data security is our highest priority. AI School OS enforces end-to-end TLS 1.3 encryption, AES-256 storage encryption, strict Role-Based Access Control (RBAC), and supports air-gapped local LLMs via Ollama with zero data retention.'
    },
    {
      q: 'Can AI School OS integrate with our existing school software?',
      a: 'Yes! The platform provides robust REST APIs and database connectors to sync student rosters, grades, timetables, and courses seamlessly.'
    },
    {
      q: 'What AI models power the platform?',
      a: 'AI School OS features a pluggable multi-model architecture. You can connect local Ollama instances, OpenAI GPT-4o, Anthropic Claude, or Google Gemini with automated RAG vector search via Qdrant.'
    },
    {
      q: 'Is multi-campus or multi-school management supported?',
      a: 'Absolutely. Super Administrators and Principals can oversee multiple schools, academic years, departments, and classes from a unified command center.'
    }
  ]

  const currentRole = roleContent[activeRoleTab]

  return (
    <div className="landing-page font-sans" style={{ backgroundColor: '#08090C', color: '#F3F4F6', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. Header Navigation Bar */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top py-3 transition-all ${scrolled ? 'backdrop-blur border-bottom shadow-lg' : ''}`}
        style={{
          backgroundColor: scrolled ? 'rgba(8, 9, 12, 0.92)' : 'transparent',
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          zIndex: 1040,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="container px-4">
          <Link className="navbar-brand d-flex align-items-center gap-2.5" to="/">
            <div
              className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center glow-brand-icon"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', width: '36px', height: '36px' }}
            >
              <i className="bi bi-cpu-fill fs-5" />
            </div>
            <span className="fs-5 fw-bold text-white tracking-tight">AI School OS</span>
            <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 rounded-pill px-2.5 py-0.5 x-small d-none d-sm-inline">
              Enterprise AI
            </span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="navbar-toggler border-0 d-lg-none" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Desktop Navigation Menu (hidden on mobile) */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navContent">
            <ul className="navbar-menu mx-auto d-flex align-items-center gap-4 list-unstyled mb-0 py-2 py-lg-0 small fw-medium">
              <li><a href="#features" className="nav-link text-white-50 text-white-hover">Features</a></li>
              <li><a href="#rag-pipeline" className="nav-link text-white-50 text-white-hover">AI Architecture</a></li>
              <li><a href="#comparison" className="nav-link text-white-50 text-white-hover">Why AI School OS</a></li>
              <li><a href="#testimonials" className="nav-link text-white-50 text-white-hover">Testimonials</a></li>
              <li><a href="#faq" className="nav-link text-white-50 text-white-hover">FAQ</a></li>
            </ul>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <button
                className="btn btn-outline-light btn-sm rounded-pill px-3 py-1.5 font-semibold"
                onClick={() => setDemoModalOpen(true)}
                style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                Book a Demo
              </button>

              <Link
                to="/login"
                className="btn btn-primary btn-sm rounded-pill px-4 py-1.5 font-semibold text-white d-flex align-items-center gap-1.5 shadow-glow"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)', border: 'none' }}
              >
                <span>Get Started</span>
                <i className="bi bi-arrow-right small" />
              </Link>
            </div>
          </div>

          {/* Custom Slide-In Mobile Drawer */}
          <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
              <span className="fw-bold text-white fs-5">Menu</span>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              />
            </div>
            
            <ul className="navbar-menu flex-column d-flex gap-3 list-unstyled mb-0 py-2 small fw-medium">
              <li>
                <a 
                  href="#features" 
                  className="nav-link text-white-50 text-white-hover fs-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#rag-pipeline" 
                  className="nav-link text-white-50 text-white-hover fs-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Architecture
                </a>
              </li>
              <li>
                <a 
                  href="#comparison" 
                  className="nav-link text-white-50 text-white-hover fs-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Why AI School OS
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  className="nav-link text-white-50 text-white-hover fs-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="nav-link text-white-50 text-white-hover fs-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
              </li>
            </ul>

            <div className="d-flex flex-column gap-3 mt-auto">
              <button
                className="btn btn-outline-light rounded-pill px-3 py-2.5 font-semibold w-100"
                onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true); }}
                style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                Book a Demo
              </button>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary rounded-pill px-4 py-2.5 font-semibold text-white d-flex align-items-center justify-content-center gap-1.5 shadow-glow w-100"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)', border: 'none' }}
              >
                <span>Get Started</span>
                <i className="bi bi-arrow-right small" />
              </Link>
            </div>
          </div>
          
          {/* Mobile Drawer Backdrop */}
          <div 
            className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setMobileMenuOpen(false)} 
          />
        </div>
      </nav>

      {/* 2. Hero Section with Interactive Neural Canvas Background */}
      <section className="position-relative pt-7 pb-6 text-center z-1 overflow-hidden" style={{ paddingTop: '130px' }}>
        {/* Animated Canvas Background */}
        <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0 }}>
          <canvas ref={canvasRef} className="w-100 h-100" />
        </div>

        <div className="container px-4 position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '880px' }}>
            {/* Top Glowing Pill */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill mb-4 border hover-glow-pill cursor-pointer"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span className="pulse-dot" style={{ backgroundColor: '#10b981' }} />
              <span className="small text-white-50 font-medium">Enterprise AI School OS Platform v2.4</span>
              <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 rounded-pill x-small">
                Qdrant & Ollama
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="display-3 fw-extrabold mb-4 tracking-tight text-white" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)', lineHeight: '1.12' }}>
              The AI Operating System for <br />
              <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 40%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Next-Gen Educational Institutions
              </span>
            </h1>

            {/* Subheadline */}
            <p className="lead text-muted mb-5 mx-auto fs-5" style={{ maxWidth: '740px', lineHeight: '1.6', color: '#9CA3AF' }}>
              AI School OS unifies multi-campus administration, 24/7 AI tutoring, automated rubric grading, and RAG document search into one flagship SaaS platform.
            </p>

            {/* CTA Action Buttons - Stripe / OpenAI / Vercel Premium Design */}
            <div className="hero-cta-wrapper">
              <Link
                to="/login"
                className="hero-btn-primary"
              >
                <span>Get Started Free</span>
                <i className="bi bi-arrow-right ms-2 fs-5" />
              </Link>

              <button
                type="button"
                className="hero-btn-secondary"
                onClick={() => setDemoModalOpen(true)}
              >
                <i className="bi bi-play-circle-fill text-white me-2 fs-5" />
                <span>Watch Interactive Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Mockup Box with Live Indicator */}
          <div className="mx-auto mt-4 position-relative" style={{ maxWidth: '1080px' }}>
            <div
              className="p-2 p-md-3 rounded-4 border overflow-hidden shadow-2xl"
              style={{
                backgroundColor: 'rgba(17, 18, 23, 0.9)',
                borderColor: 'rgba(99, 102, 241, 0.35)',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.25)',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Window Bar Header */}
              <div className="d-flex align-items-center justify-content-between pb-3 px-3 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle bg-danger opacity-75" style={{ width: 10, height: 10 }} />
                  <span className="rounded-circle bg-warning opacity-75" style={{ width: 10, height: 10 }} />
                  <span className="rounded-circle bg-success opacity-75" style={{ width: 10, height: 10 }} />
                  <span className="small text-muted font-monospace ms-2" style={{ fontSize: '11px' }}>app.aischoolos.io/command-center</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 rounded-pill x-small">
                    <span className="pulse-dot me-1" style={{ backgroundColor: '#10b981' }} />
                    Live System Status: Operational
                  </span>
                </div>
              </div>

              {/* Window Body Mockup Content */}
              <div className="p-3 text-start">
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 border bg-dark bg-opacity-50">
                      <small className="text-muted x-small d-block mb-1">TOTAL SCHOOLS</small>
                      <h4 className="fw-bold text-white mb-0">24</h4>
                      <span className="badge bg-primary bg-opacity-20 text-primary mt-2 x-small">+14% Growth</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 border bg-dark bg-opacity-50">
                      <small className="text-muted x-small d-block mb-1">ACTIVE USERS</small>
                      <h4 className="fw-bold text-white mb-0">54,620</h4>
                      <span className="badge bg-success bg-opacity-20 text-success mt-2 x-small">99.8% Active</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 border bg-dark bg-opacity-50">
                      <small className="text-muted x-small d-block mb-1">AI DOUBTS SOLVED</small>
                      <h4 className="fw-bold text-white mb-0">1,245,800</h4>
                      <span className="badge bg-info bg-opacity-20 text-info mt-2 x-small">Ollama & RAG</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 border bg-dark bg-opacity-50">
                      <small className="text-muted x-small d-block mb-1">DOCUMENTS VECTORIZED</small>
                      <h4 className="fw-bold text-white mb-0">107,450</h4>
                      <span className="badge bg-warning bg-opacity-20 text-warning mt-2 x-small">Qdrant Vector DB</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-4 rounded-3 border text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
                  <div className="row align-items-center">
                    <div className="col-md-8 text-start">
                      <span className="badge bg-white text-dark font-semibold mb-2">Autonomous AI Core</span>
                      <h4 className="fw-bold text-white mb-1">Real-Time SaaS Telemetry & Knowledge Engine</h4>
                      <p className="text-muted small mb-0">Automating attendance, homework evaluation, RAG semantic search, and predictive student risk detection.</p>
                    </div>
                    <div className="col-md-4 text-end mt-3 mt-md-0">
                      <Link to="/login" className="btn btn-primary rounded-pill px-4 font-semibold shadow-glow">
                        Launch Command Center →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Statistics Counter Bar */}
          <div className="row g-4 mt-5 pt-3 justify-content-center text-center">
            {[
              { num: `${counts.schools}+`, label: 'Educational Institutions' },
              { num: `${counts.satisfaction}%`, label: 'User Satisfaction Rate' },
              { num: `${counts.students.toLocaleString()}+`, label: 'Active Students & Staff' },
              { num: `${(counts.queries / 1000000).toFixed(0)}M+`, label: 'AI Queries Processed' }
            ].map((st, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="fw-extrabold fs-2 text-white" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {st.num}
                </div>
                <div className="x-small text-muted uppercase tracking-wider mt-1">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. University & Institutional Trust Section */}
      <section className="py-4 border-top border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(13, 14, 19, 0.6)' }}>
        <div className="container px-4 text-center">
          <p className="x-small text-muted text-uppercase tracking-widest fw-semibold mb-3">
            Trusted by leading educational institutions & enterprise systems worldwide
          </p>
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 gap-md-5 opacity-75">
            {['IIT HYDERABAD', 'BITS PILANI', 'IIIT HYDERABAD', 'HPS BEGUMPET', 'OAKRIDGE', 'CHIREC'].map((uni, idx) => (
              <span key={idx} className="fw-extrabold font-monospace text-muted fs-5 text-white-hover transition-all cursor-pointer" style={{ letterSpacing: '2px' }}>
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dedicated AI RAG Pipeline Architecture Showcase */}
      <section id="rag-pipeline" className="apple-section border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(13, 14, 19, 0.4)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto" style={{ maxWidth: '760px' }}>
            <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 rounded-pill px-3 py-1 x-small apple-badge">
              High-Speed Vector RAG Architecture
            </span>
            <h2 className="display-6 fw-bold text-white apple-heading">How AI School OS RAG Knowledge Engine Works</h2>
            <p className="text-muted fs-6 apple-description">From raw PDF syllabus upload to instant Qdrant vector retrieval and Ollama LLM synthesis with exact page citations.</p>
          </div>

          {/* Interactive RAG Workflow Grid */}
          <div className="row cards-grid-32 justify-content-center">
            {ragPipelineSteps.map((step, idx) => (
              <div key={step.step} className="col-md-6 col-lg-4">
                <div
                  className={`card h-100 p-4 border rounded-4 transition-all cursor-pointer ${activeRagStep === idx ? 'border-primary shadow-glow' : ''}`}
                  onClick={() => setActiveRagStep(idx)}
                  style={{
                    backgroundColor: activeRagStep === idx ? 'rgba(30, 27, 75, 0.6)' : 'rgba(23, 24, 27, 0.7)',
                    borderColor: activeRagStep === idx ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 rounded-circle p-2" style={{ width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.step}
                    </span>
                    <i className={`bi ${step.icon} fs-4 ${activeRagStep === idx ? 'text-primary' : 'text-muted'}`} />
                  </div>
                  <h6 className="fw-bold text-white mb-2" style={{ fontSize: '16px' }}>{step.title}</h6>
                  <p className="x-small text-muted mb-0" style={{ lineHeight: '1.5' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. "One Platform. Unlimited Possibilities" Interactive Feature Catalog */}
      <section id="features" className="apple-section border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto" style={{ maxWidth: '720px' }}>
            <span className="badge bg-info bg-opacity-20 text-info border border-info border-opacity-30 rounded-pill px-3 py-1 x-small apple-badge">
              Everything You Need
            </span>
            <h2 className="display-6 fw-bold text-white apple-heading">One Platform. Unlimited Possibilities.</h2>
            <p className="text-muted fs-6 apple-description">AI School OS combines administrative governance, academic tools, generative AI, and security into a single cohesive system.</p>

            {/* Category Filter Pills */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
              {[
                { id: 'all', label: 'All Features' },
                { id: 'admin', label: 'Administration' },
                { id: 'academics', label: 'Academics' },
                { id: 'ai', label: 'AI-Powered' },
                { id: 'security', label: 'Security & Compliance' }
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`btn btn-sm rounded-pill px-3.5 py-1.5 font-semibold ${activeCategory === cat.id ? 'btn-primary shadow-sm' : 'btn-outline-secondary text-white-50 border-0'}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={activeCategory !== cat.id ? { backgroundColor: 'rgba(255, 255, 255, 0.04)' } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 8 Feature Cards Grid */}
          <div className="row cards-grid-32">
            {filteredFeatures.map(f => (
              <div key={f.id} className="col-md-6 col-lg-3">
                <div
                  className="card h-100 p-4 border rounded-4 shadow-sm hover-lift-glow position-relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(23, 24, 27, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    minHeight: '230px'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div
                      className="p-2.5 rounded-3 text-white d-flex align-items-center justify-content-center shadow-xs"
                      style={{ background: f.gradient, width: '44px', height: '44px' }}
                    >
                      <i className={`bi ${f.icon} fs-5`} />
                    </div>
                    <span className="badge bg-secondary bg-opacity-20 text-muted border border-secondary border-opacity-20 rounded-pill x-small">{f.tag}</span>
                  </div>

                  <h5 className="fw-bold text-white mb-2" style={{ fontSize: '16px' }}>{f.title}</h5>
                  <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why AI School OS vs Traditional Software Comparison */}
      <section id="comparison" className="py-6 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(13, 14, 19, 0.5)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '740px' }}>
            <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 rounded-pill px-3 py-1 x-small mb-2">
              Competitive Advantage
            </span>
            <h2 className="display-6 fw-bold text-white mb-3">Traditional School Software vs AI School OS</h2>
            <p className="text-muted fs-6">See how AI-first automation outperforms outdated legacy school management systems.</p>
          </div>

          <div className="card border-0 rounded-4 shadow-2xl overflow-hidden bg-card" style={{ backgroundColor: 'rgba(23, 24, 27, 0.85)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="table-responsive">
              <table className="table align-middle mb-0 text-start">
                <thead className="bg-dark bg-opacity-50">
                  <tr>
                    <th className="ps-4 py-3 text-muted x-small text-uppercase tracking-wider">Feature Domain</th>
                    <th className="py-3 text-muted x-small text-uppercase tracking-wider">Traditional School Software</th>
                    <th className="pe-4 py-3 text-primary x-small text-uppercase tracking-wider">AI School OS (Flagship AI)</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((c, i) => (
                    <tr key={i} className="border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <td className="ps-4 fw-bold text-white small">{c.feature}</td>
                      <td className="small text-muted">
                        <i className="bi bi-x-circle text-danger me-2" />
                        {c.traditional}
                      </td>
                      <td className="pe-4 small fw-semibold text-white">
                        <i className="bi bi-check-circle-fill text-success me-2" />
                        {c.aiOS}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Role-Based Platform Interactive Showcase */}
      <section className="py-6 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '720px' }}>
            <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 rounded-pill px-3 py-1 x-small mb-2">
              Role-Based Experience
            </span>
            <h2 className="display-6 fw-bold text-white mb-3">Tailored Experience for Every Stakeholder</h2>
            <p className="text-muted fs-6">Customized workspaces designed specifically for administrators, teachers, students, and parents.</p>

            {/* Role Tabs */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              {[
                { id: 'admin', label: 'For Administrators', icon: 'bi-shield-check' },
                { id: 'educators', label: 'For Educators', icon: 'bi-person-badge' },
                { id: 'students', label: 'For Students', icon: 'bi-mortarboard' },
                { id: 'parents', label: 'For Parents', icon: 'bi-people' }
              ].map(r => (
                <button
                  key={r.id}
                  className={`btn btn-sm rounded-pill px-3.5 py-2 font-semibold d-flex align-items-center gap-2 ${activeRoleTab === r.id ? 'btn-primary shadow-sm' : 'btn-outline-light text-white-50 border-0'}`}
                  onClick={() => setActiveRoleTab(r.id)}
                  style={activeRoleTab !== r.id ? { backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
                >
                  <i className={`bi ${r.icon}`} />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Role Card Showcase */}
          <div className="card border-0 rounded-4 shadow-2xl p-4 p-md-5 bg-card overflow-hidden" style={{ backgroundColor: 'rgba(23, 24, 27, 0.85)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <span className="badge bg-primary bg-opacity-20 text-primary mb-3 px-3 py-1 rounded-pill x-small">
                  Role Highlights
                </span>
                <h3 className="fw-bold text-white mb-3" style={{ fontSize: '26px' }}>{currentRole.title}</h3>
                <p className="text-muted mb-4">{currentRole.subtitle}</p>

                <div className="d-flex flex-column gap-3 mb-4">
                  {currentRole.checklist.map((chk, i) => (
                    <div key={i} className="d-flex align-items-center gap-2.5">
                      <div className="p-1 rounded-circle bg-success bg-opacity-20 text-success d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px' }}>
                        <i className="bi bi-check-lg small fw-bold" />
                      </div>
                      <span className="small text-white-50">{chk}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex align-items-center gap-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div>
                    <div className="fw-bold text-white fs-4">{currentRole.statValue}</div>
                    <small className="text-muted x-small">{currentRole.statLabel}</small>
                  </div>
                  <Link to="/login" className="btn btn-primary rounded-pill px-4 font-semibold shadow-glow ms-auto">
                    Explore Dashboard →
                  </Link>
                </div>
              </div>

              {/* Right Side Live Interactive Workspace Frame */}
              <div className="col-lg-6">
                <div className="p-4 rounded-4 border bg-dark bg-opacity-60 shadow-lg">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-speedometer2 text-primary" />
                      <span className="fw-semibold small text-white">{currentRole.title.split(' ')[2]} Workspace</span>
                    </div>
                    <span className="badge bg-success bg-opacity-20 text-success x-small">Live Workspace</span>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-card border text-start">
                        <small className="text-muted x-small">COMPLIANCE RATE</small>
                        <div className="fw-bold text-white fs-5">99.8% Passed</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-card border text-start">
                        <small className="text-muted x-small">RESPONSE LATENCY</small>
                        <div className="fw-bold text-success fs-5">&lt; 120ms</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 border bg-card text-center">
                    <i className="bi bi-robot display-4 text-primary d-block mb-2" />
                    <h6 className="fw-bold text-white mb-1">AI Assistant Ready</h6>
                    <p className="x-small text-muted mb-0">RAG query engine connected with active school vector indexes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Carousel Section */}
      <section id="testimonials" className="py-6 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(13, 14, 19, 0.4)' }}>
        <div className="container px-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '720px' }}>
            <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 rounded-pill px-3 py-1 x-small mb-2">
              Customer Success
            </span>
            <h2 className="display-6 fw-bold text-white mb-3">Trusted by Leading Educators & Admins</h2>
            <p className="text-muted fs-6">Read how principals, teachers, and IT directors achieve excellence with AI School OS.</p>
          </div>

          <div className="mx-auto" style={{ maxWidth: '820px' }}>
            <div className="card border rounded-4 p-4 p-md-5 bg-card shadow-2xl position-relative" style={{ backgroundColor: 'rgba(23, 24, 27, 0.85)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <div className="d-flex align-items-center gap-1 mb-3 text-warning">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill" />
                ))}
              </div>

              <blockquote className="blockquote text-white fs-5 font-italic mb-4" style={{ lineHeight: '1.6' }}>
                "{testimonials[activeTestimonial].text}"
              </blockquote>

              <div className="d-flex align-items-center justify-content-between border-top pt-3" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="rounded-circle object-fit-cover border"
                    style={{ width: '48px', height: '48px', borderColor: 'var(--primary)' }}
                  />
                  <div>
                    <div className="fw-bold text-white small">{testimonials[activeTestimonial].name}</div>
                    <div className="text-muted x-small">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm rounded-circle p-0 ${activeTestimonial === i ? 'bg-primary' : 'bg-secondary bg-opacity-40'}`}
                      style={{ width: '10px', height: '10px', border: 'none' }}
                      onClick={() => setActiveTestimonial(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="py-6 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="container px-4" style={{ maxWidth: '840px' }}>
          <div className="text-center mb-5">
            <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 rounded-pill px-3 py-1 x-small mb-2">
              Got Questions?
            </span>
            <h2 className="display-6 fw-bold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-muted">Everything you need to know about AI School OS architecture and deployment.</p>
          </div>

          <div className="d-flex flex-column gap-3">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="card border rounded-4 p-4 cursor-pointer transition-all"
                style={{
                  backgroundColor: 'rgba(23, 24, 27, 0.7)',
                  borderColor: openFaq === idx ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)'
                }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold text-white mb-0" style={{ fontSize: '16px' }}>{item.q}</h6>
                  <i className={`bi ${openFaq === idx ? 'bi-chevron-up text-primary' : 'bi-chevron-down text-muted'} transition-all`} />
                </div>
                {openFaq === idx && (
                  <p className="small text-muted mt-3 mb-0" style={{ lineHeight: '1.6' }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final Unforgettable CTA Banner */}
      <section className="text-center position-relative" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)', padding: '120px 0', overflow: 'visible' }}>
        <div className="container px-4 position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '780px' }}>
            <h2 className="display-5 fw-extrabold text-white mb-3">Ready to Modernize Your Campus?</h2>
            <p className="lead mb-5 fs-5" style={{ color: '#FFFFFF', opacity: 0.95, lineHeight: '1.6', fontWeight: 400 }}>Join hundreds of educational institutions leveraging AI School OS for automated management, intelligent analytics, and personalized AI tutoring.</p>

            <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
              <Link
                to="/login"
                className="cta-banner-btn-primary"
              >
                <span>Get Started Free</span>
                <i className="bi bi-arrow-right ms-2 fs-5" />
              </Link>
              <button
                type="button"
                className="cta-banner-btn-secondary"
                onClick={() => setDemoModalOpen(true)}
              >
                <i className="bi bi-play-circle-fill text-white me-2 fs-5" />
                <span>Book a Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Enterprise SaaS Footer */}
      <footer className="py-5 border-top" style={{ backgroundColor: '#08090C', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="container px-4">
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2.5 mb-3">
                <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', width: '32px', height: '32px' }}>
                  <i className="bi bi-cpu-fill fs-6" />
                </div>
                <span className="fs-5 fw-bold text-white">AI School OS</span>
              </div>
              <p className="small text-muted mb-3" style={{ maxWidth: '320px', lineHeight: '1.6' }}>
                Next-generation enterprise AI platform for school management, automated grading, RAG document search, and executive analytics.
              </p>
              <div className="d-flex gap-3 text-muted">
                <a href="https://github.com/Dheerajdvn" target="_blank" rel="noreferrer" className="text-muted text-white-hover fs-5"><i className="bi bi-github" /></a>
                <a href="https://www.linkedin.com/in/dheerajdvn/" target="_blank" rel="noreferrer" className="text-muted text-white-hover fs-5"><i className="bi bi-linkedin" /></a>
              </div>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="fw-bold text-white mb-3 x-small text-uppercase tracking-wider">Platform</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-0">
                <li><a href="#features" className="text-muted text-decoration-none text-white-hover">Features</a></li>
                <li><a href="#rag-pipeline" className="text-muted text-decoration-none text-white-hover">RAG Engine</a></li>
                <li><a href="#comparison" className="text-muted text-decoration-none text-white-hover">Why AI OS</a></li>
                <li><Link to="/knowledge" className="text-muted text-decoration-none text-white-hover">Knowledge Center</Link></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="fw-bold text-white mb-3 x-small text-uppercase tracking-wider">Resources</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-0">
                <li><Link to="/knowledge" className="text-muted text-decoration-none text-white-hover">Documentation</Link></li>
                <li><a href="#faq" className="text-muted text-decoration-none text-white-hover">FAQ</a></li>
                <li><Link to="/login" className="text-muted text-decoration-none text-white-hover">API Docs</Link></li>
                <li><Link to="/login" className="text-muted text-decoration-none text-white-hover">Status</Link></li>
              </ul>
            </div>

            <div className="col-lg-4">
              <h6 className="fw-bold text-white mb-3 x-small text-uppercase tracking-wider">Contact & Support</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-0">
                <li><i className="bi bi-envelope me-2 text-primary" /> dheerajdvn@gmail.com</li>
                <li><i className="bi bi-telephone me-2 text-primary" /> +91 XXXXXXXXXX</li>
                <li><i className="bi bi-geo-alt me-2 text-primary" /> Madhapur, Hyderabad, India</li>
              </ul>
            </div>
          </div>

          <div className="border-top pt-4 text-center text-muted small d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} AI School OS. All rights reserved. Enterprise Flagship Edition.</p>
            <p className="mb-0">Powered by React + Spring Boot + Qdrant & Ollama AI</p>
          </div>
        </div>
      </footer>

      {/* 12. Interactive Demo Request Modal */}
      {demoModalOpen && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
          <div className="modal-dialog-custom bg-card card border-0 shadow-2xl p-4" style={{ maxWidth: '480px', width: '100%', borderRadius: '16px', backgroundColor: '#17181B', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-play-circle-fill text-primary" /> Book Live AI Demo
              </h5>
              <button className="btn-close btn-close-white" onClick={() => setDemoModalOpen(false)} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setDemoModalOpen(false); alert('Demo request submitted! Our enterprise team will contact you shortly.'); }}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Work Email Address</label>
                <input type="email" className="form-control style-input" placeholder="admin@school.edu" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Institution Name</label>
                <input type="text" className="form-control style-input" placeholder="e.g. Hyderabad Public School" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Role</label>
                <select className="form-select style-select">
                  <option>Principal / School Admin</option>
                  <option>Educator / Teacher</option>
                  <option>IT Administrator</option>
                  <option>Student / Parent</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-semibold mt-2 shadow-glow">
                Schedule Demo Session →
              </button>
            </form>
          </div>

          <style>{`
            .modal-backdrop-custom {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0, 0, 0, 0.8);
              backdrop-filter: blur(8px);
              z-index: 1060;
              padding: 1rem;
            }
          `}</style>
        </div>
      )}

      {/* Global Landing Page Micro-Animations & Glow FX */}
      <style>{`
        .hero-cta-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 24px;
          margin-bottom: 3rem;
        }
        .hero-btn-primary {
          height: 58px;
          padding: 0 32px;
          border-radius: 16px;
          background: linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%);
          color: #FFFFFF !important;
          font-weight: 500;
          font-size: 16px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.45), 0 2px 6px rgba(14, 165, 233, 0.3);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        .hero-btn-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 16px 36px -4px rgba(99, 102, 241, 0.65), 0 4px 12px rgba(14, 165, 233, 0.45);
          color: #FFFFFF !important;
        }
        .hero-btn-primary:active {
          transform: translateY(0px) scale(0.98);
          box-shadow: 0 4px 16px -2px rgba(99, 102, 241, 0.4);
        }
        .hero-btn-secondary {
          height: 58px;
          padding: 0 28px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF !important;
          font-weight: 500;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px) scale(1.03);
          color: #FFFFFF !important;
        }
        .hero-btn-secondary:active {
          transform: translateY(0px) scale(0.98);
          background: rgba(255, 255, 255, 0.06);
        }

        /* Prevent accidental text highlight selection on UI components */
        .navbar,
        .navbar-brand,
        .nav-link,
        .hero-cta-wrapper,
        .hero-btn-primary,
        .hero-btn-secondary,
        .btn,
        .card,
        .badge,
        .bi,
        i,
        .table thead,
        .modal-dialog-custom {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Keep text content selectable for reading & accessibility */
        #faq p,
        #faq .small,
        .faq-answer,
        .selectable-text,
        footer p {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        /* Apple Product Design Spatial Rhythm Guidelines */
        .apple-section {
          padding-top: 140px !important;
          padding-bottom: 140px !important;
        }
        .apple-badge {
          margin-bottom: 28px !important;
        }
        .apple-heading {
          margin-bottom: 20px !important;
        }
        .apple-description {
          margin-bottom: 40px !important;
        }
        .cards-grid-32 {
          --bs-gutter-x: 32px !important;
          --bs-gutter-y: 32px !important;
        }

        /* CTA Banner Button Styles */
        .cta-banner-btn-primary {
          height: 56px;
          padding: 0 34px;
          border-radius: 16px;
          background: #FFFFFF;
          color: #4F46E5 !important;
          font-weight: 600;
          font-size: 16px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
          cursor: pointer;
        }
        .cta-banner-btn-primary span,
        .cta-banner-btn-primary i {
          color: #4F46E5 !important;
          background: transparent !important;
          background-color: transparent !important;
        }
        .cta-banner-btn-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
          color: #4F46E5 !important;
        }
        .cta-banner-btn-primary:active {
          transform: translateY(0px) scale(0.98);
        }

        .cta-banner-btn-secondary {
          height: 56px;
          padding: 0 28px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF !important;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .cta-banner-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-3px) scale(1.03);
          color: #FFFFFF !important;
        }
        .cta-banner-btn-secondary:active {
          transform: translateY(0px) scale(0.98);
        }
      `}</style>
    </div>
  )
}
