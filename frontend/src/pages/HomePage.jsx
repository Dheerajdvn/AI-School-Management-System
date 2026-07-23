import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * Modern SaaS-style landing page for the AI School Management Platform.
 * Premium design with gradient cards and animated elements.
 */
export default function HomePage() {
  const [isAiHealthy, setIsAiHealthy] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkHealth = async () => {
      try {
        const res = await fetch('/api/actuator/health')
        if (!res.ok) {
          if (isMounted) setIsAiHealthy(false)
          return
        }
        const data = await res.json()
        const up = data.status === 'UP' && data.components?.ollama?.status === 'UP'
        if (isMounted) setIsAiHealthy(up)
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
    { icon: 'bi-building-fill', title: 'School Management', color: 'school', description: 'Centralize school operations and administration' },
    { icon: 'bi-people-fill', title: 'Student Management', color: 'student', description: 'Track student records, enrollments, and academic progress' },
    { icon: 'bi-person-badge-fill', title: 'Teacher Management', color: 'teacher', description: 'Manage teacher profiles, courses, and performance' },
    { icon: 'bi-book-fill', title: 'Courses', color: 'course', description: 'Create and organize course curriculum and materials' },
    { icon: 'bi-journal-text', title: 'Assignments', color: 'assignment', description: 'Assign tasks, track submissions and provide feedback' },
    { icon: 'bi-upload', title: 'Submissions', color: 'submission', description: 'Collect, review and grade student work' },
    { icon: 'bi-folder-fill', title: 'Document Management', color: 'document', description: 'Store and share educational resources securely' },
    { icon: 'bi-graph-up-arrow', title: 'Analytics', color: 'analytics', description: 'Gain insights with comprehensive reporting' },
    { icon: 'bi-robot', title: 'AI Assistant', color: 'ai', description: 'AI-powered tutoring and automated assistance' },
    { icon: 'bi-shield-lock', title: 'Security', color: 'security', description: 'Enterprise-grade authentication and data protection' },
  ]

  const roles = [
    {
      icon: 'bi-person-gear',
      title: 'Main Admin',
      color: 'admin',
      description: 'System-wide administrator with full access to manage schools, users, and platform settings.',
    },
    {
      icon: 'bi-building-gear',
      title: 'School Admin',
      color: 'admin2',
      description: 'Manages a specific school - handles teachers, students, courses, and documents.',
    },
    {
      icon: 'bi-person-workspace',
      title: 'Teacher',
      color: 'teacher',
      description: 'Creates assignments, grades submissions, and uses AI assistant for teaching support.',
    },
    {
      icon: 'bi-person-video2',
      title: 'Student',
      color: 'student',
      description: 'Views courses, submits assignments, and interacts with AI tutor for learning assistance.',
    },
  ]

  const aiFeatures = [
    {
      icon: 'bi-robot',
      title: 'AI Tutor',
      color: 'ai1',
      description: 'Personalized AI-powered tutoring for students 24/7',
    },
    {
      icon: 'bi-search-heart',
      title: 'AI Document Search',
      color: 'ai2',
      description: 'Intelligent search through educational materials using RAG',
    },
    {
      icon: 'bi-pencil-square',
      title: 'AI Assignment Assistant',
      color: 'ai3',
      description: 'Smart assignment creation and grading assistance',
    },
    {
      icon: 'bi-chat-dots',
      title: 'AI Question Answering',
      color: 'ai4',
      description: 'Natural language interface for instant answers',
    },
  ]

  // Smooth scroll helper
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-white shadow-sm py-3 sticky-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-mortarboard-fill text-primary fs-3 me-2" />
            <span className="fs-4 fw-bold text-dark">AI School Platform</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-dark" href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home') }}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features') }}>Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#ai-section" onClick={(e) => { e.preventDefault(); scrollToSection('ai-section') }}>AI Assistant</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#roles" onClick={(e) => { e.preventDefault(); scrollToSection('roles') }}>Roles</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about') }}>About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}>Contact</a>
              </li>
            </ul>
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary">
                <i className="bi bi-box-arrow-in-right me-1" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium AI SaaS Design */}
      <section id="home" className="hero-section text-white py-5 py-md-6">
        <div className="container py-5 position-relative">
          {/* Animated Background Shapes */}
          <div className="hero-shapes">
            <div className="hero-shape shape-1" />
            <div className="hero-shape shape-2" />
            <div className="hero-shape shape-3" />
          </div>
          
          <div className="row align-items-center py-4">
            <div className="col-lg-6 position-relative" style={{ zIndex: 2 }}>
              <h1 className="display-4 fw-bold mb-3 lh-sm">
                Transform Education with <span className="text-gradient">AI Excellence</span>
              </h1>
              <p className="lead mb-4 opacity-90 fs-5">
                The future of school management is here. Streamline operations, enhance learning, 
                and empower educators with our intelligent platform powered by RAG and Ollama.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button 
                  className="btn btn-light btn-lg px-4 shadow-sm hover-lift"
                  onClick={() => scrollToSection('features')}
                >
                  <i className="bi bi-stars me-2" />
                  Explore Platform
                </button>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block mt-5 mt-lg-0 position-relative" style={{ zIndex: 2 }}>
              {/* Floating Glassmorphism Cards */}
              <div className="hero-visual">
                <div className="glass-card card-1">
                  <i className="bi bi-graph-up-arrow fs-1 text-primary mb-2" />
                  <h6 className="mb-0">AI Analytics</h6>
                </div>
                <div className="glass-card card-2 position-relative">
                  <i className="bi bi-robot fs-1 text-info mb-2" />
                  <h6 className="mb-0">AI Assistant</h6>
                  <span className={`ai-pulse-dot ${isAiHealthy ? 'healthy' : 'unhealthy'}`} />
                </div>
                <div className="glass-card card-3">
                  <i className="bi bi-people fs-1 text-success mb-2" />
                  <h6 className="mb-0">Student Portal</h6>
                </div>
                <div className="glass-card card-4">
                  <i className="bi bi-building-fill fs-1 text-warning mb-2" />
                  <h6 className="mb-0">School Management</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai-section" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">AI-Powered Learning</h2>
            <p className="text-muted fs-5">Transform education with intelligent assistance</p>
          </div>
          <div className="row g-4">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className={`ai-card ai-card-${feature.color} h-100 border-0 shadow-sm hover-lift`}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className={`${feature.icon} fs-1 ai-icon-${feature.color}`} />
                    </div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted mb-0 small">{feature.description}</p>
                    <a href="#" className="stretched-link text-decoration-none small d-inline-flex align-items-center mt-2">
                      Learn more <i className="bi bi-arrow-right ms-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <small className="text-muted">Powered by RAG + Ollama technology</small>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Powerful Features</h2>
            <p className="text-muted">Everything you need for modern school management</p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4 col-xl-3">
                <div className={`feature-card feature-card-${feature.color} h-100 border-0 shadow-sm hover-lift`}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className={`${feature.icon} fs-1 feature-icon-${feature.color}`} />
                    </div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted mb-0 small">{feature.description}</p>
                    <a href="#" className="stretched-link text-decoration-none small d-inline-flex align-items-center mt-2">
                      Learn more <i className="bi bi-arrow-right ms-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section id="roles" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Who Can Use This Platform</h2>
            <p className="text-muted">Role-based access for everyone in your institution</p>
          </div>
          <div className="row g-4">
            {roles.map((role, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className={`role-card role-card-${role.color} h-100 border-0 shadow-sm hover-lift`}>
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <i className={`${role.icon} fs-1 role-icon-${role.color}`} />
                    </div>
                    <h5 className="role-title mb-3">{role.title}</h5>
                    <p className="role-description small mb-0">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">How It Works</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-center">
                <div className="step-item mb-4 mb-md-0">
                  <div className="step-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-person-gear fs-4" />
                  </div>
                  <p className="mb-0 fw-medium">Main Admin</p>
                </div>
                <div className="d-none d-md-block mx-2">
                  <i className="bi bi-arrow-right text-primary fs-3" />
                </div>
                <div className="step-item mb-4 mb-md-0">
                  <div className="step-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-building-add fs-4" />
                  </div>
                  <p className="mb-0 fw-medium">Create School</p>
                </div>
                <div className="d-none d-md-block mx-2">
                  <i className="bi bi-arrow-right text-primary fs-3" />
                </div>
                <div className="step-item mb-4 mb-md-0">
                  <div className="step-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-building-gear fs-4" />
                  </div>
                  <p className="mb-0 fw-medium">School Admin</p>
                </div>
                <div className="d-none d-md-block mx-2">
                  <i className="bi bi-arrow-right text-primary fs-3" />
                </div>
                <div className="step-item mb-4 mb-md-0">
                  <div className="step-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-person-workspace fs-4" />
                  </div>
                  <p className="mb-0 fw-medium">Teachers</p>
                </div>
                <div className="d-none d-md-block mx-2">
                  <i className="bi bi-arrow-right text-primary fs-3" />
                </div>
                <div className="step-item mb-4 mb-md-0">
                  <div className="step-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-people fs-4" />
                  </div>
                  <p className="mb-0 fw-medium">Students</p>
                </div>
                <div className="d-none d-md-block mx-2">
                  <i className="bi bi-arrow-right text-primary fs-3" />
                </div>
                <div className="step-item">
                  <div className="step-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-robot fs-4" />
                  </div>
                  <p className="mb-0 fw-medium">AI Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Premium AI Dashboard Preview */}
      <section id="about" className="py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3">About AI School Platform</h2>
              <p className="text-muted mb-3">
                Our AI-powered school management platform revolutionizes education by combining 
                traditional administrative tools with cutting-edge artificial intelligence. 
                We help educational institutions streamline their operations while providing 
                personalized learning experiences for students.
              </p>
              <p className="text-muted mb-3">
                Built with modern technology stack including React, Spring Boot, and AI models 
                like RAG (Retrieval-Augmented Generation) and Ollama, our platform ensures 
                reliability, scalability, and intelligent assistance at every step.
              </p>
              <div className="d-flex gap-3 mt-4">
                <div className="text-center">
                  <i className="bi bi-shield-check text-primary fs-2" />
                  <p className="small mb-0 mt-2">Secure & Reliable</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-lightning-charge text-primary fs-2" />
                  <p className="small mb-0 mt-2">Lightning Fast</p>
                </div>
                <div className="text-center">
                  <i className="bi bi-gear text-primary fs-2" />
                  <p className="small mb-0 mt-2">Highly Customizable</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="dashboard-preview shadow-lg">
                {/* Dashboard Header */}
                <div className="dashboard-header d-flex align-items-center justify-content-between p-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-mortarboard-fill text-primary fs-4 me-2" />
                    <span className="fw-bold">AI Dashboard</span>
                  </div>
                  <span className="ai-badge">AI Powered</span>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-3">
                  {/* Stats Row */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="stat-mini stat-mini-blue">
                        <div className="stat-value">1,248</div>
                        <div className="stat-label">Students</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-mini stat-mini-green">
                        <div className="stat-value">86</div>
                        <div className="stat-label">New Submissions</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-mini stat-mini-purple">
                        <div className="stat-value">94%</div>
                        <div className="stat-label">Completion Rate</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-mini stat-mini-orange">
                        <div className="stat-value">AI</div>
                        <div className="stat-label">Active Tutor</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Mockup */}
                  <div className="chart-container mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                      <small className="text-muted fw-medium">Performance Analytics</small>
                      <small className="text-primary">This Week</small>
                    </div>
                    <div className="chart-bars d-flex align-items-end justify-content-between px-3">
                      <div className="chart-bar" style={{ height: '30%' }} />
                      <div className="chart-bar" style={{ height: '45%' }} />
                      <div className="chart-bar" style={{ height: '60%' }} />
                      <div className="chart-bar" style={{ height: '40%' }} />
                      <div className="chart-bar" style={{ height: '75%' }} />
                      <div className="chart-bar" style={{ height: '55%' }} />
                      <div className="chart-bar" style={{ height: '48%' }} />
                    </div>
                    <div className="d-flex justify-content-between px-2 mt-1">
                      <small className="text-muted">Mon</small>
                      <small className="text-muted">Tue</small>
                      <small className="text-muted">Wed</small>
                      <small className="text-muted">Thu</small>
                      <small className="text-muted">Fri</small>
                      <small className="text-muted">Sat</small>
                      <small className="text-muted">Sun</small>
                    </div>
                  </div>
                  
                  {/* Activity Feed */}
                  <div className="activity-feed">
                    <small className="text-muted fw-medium d-block mb-2">Recent Activity</small>
                    <div className="activity-item">
                      <span className="activity-dot bg-success" />
                      <small>Assignment submitted by John D.</small>
                    </div>
                    <div className="activity-item">
                      <span className="activity-dot bg-primary" />
                      <small>AI tutor answered 42 queries</small>
                    </div>
                    <div className="activity-item">
                      <span className="activity-dot bg-warning" />
                      <small>Course grades updated</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Contact Us</h2>
            <p className="text-muted">Have questions? We're here to help!</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift contact-card">
                <div className="card-body text-center p-4">
                  <i className="bi bi-envelope text-primary fs-1 mb-3" />
                  <h5 className="fw-bold mb-2">Email</h5>
                  <p className="text-muted mb-0">support@aischoolplatform.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift contact-card">
                <div className="card-body text-center p-4">
                  <i className="bi bi-telephone text-primary fs-1 mb-3" />
                  <h5 className="fw-bold mb-2">Phone</h5>
                  <p className="text-muted mb-0">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift contact-card">
                <div className="card-body text-center p-4">
                  <i className="bi bi-geo-alt text-primary fs-1 mb-3" />
                  <h5 className="fw-bold mb-2">Location</h5>
                  <p className="text-muted mb-0">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-mortarboard-fill text-primary fs-2 me-2" />
                <span className="fs-4 fw-bold">AI School Platform</span>
              </div>
              <p className="text-white-50">
                Modern AI-powered school management solution for educational institutions.
              </p>
            </div>
            <div className="col-lg-2">
              <h6 className="text-white mb-3">Product</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#features" className="text-white-50 text-decoration-none footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('features') }}>Features</a></li>
                <li className="mb-2"><a href="#ai-section" className="text-white-50 text-decoration-none footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('ai-section') }}>AI Assistant</a></li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h6 className="text-white mb-3">Company</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#about" className="text-white-50 text-decoration-none footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('about') }}>About</a></li>
                <li className="mb-2"><a href="#contact" className="text-white-50 text-decoration-none footer-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}>Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h6 className="text-white mb-3">Legal</h6>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link text-white-50 px-0 py-1" href="#privacy">Privacy Policy</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white-50 px-0 py-1" href="#terms">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="my-4 opacity-25" />
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-white-50">
              &copy; {new Date().getFullYear()} AI School Platform. All rights reserved.
            </small>
          </div>
        </div>
      </footer>
    </div>
  )
}