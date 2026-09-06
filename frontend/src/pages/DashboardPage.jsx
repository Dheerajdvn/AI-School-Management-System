import React, { useEffect, useState, useMemo } from 'react'
import StatCard from '../components/StatCard'
import DashboardSkeleton from '../components/DashboardSkeleton'
import RecentActivity from '../components/RecentActivity'
import SystemStatus from '../components/SystemStatus'
import DashboardService from '../services/DashboardService'
import Chart from '../components/Charts'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { success: showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totals, setTotals] = useState(null)
  const [byCourse, setByCourse] = useState(null)
  const [documentsMonthly, setDocumentsMonthly] = useState({ labels: [], values: [] })
  const [recentDocuments, setRecentDocuments] = useState([])
  const [recentStudents, setRecentStudents] = useState([])
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [courseLimit, setCourseLimit] = useState(8)

  const displayCourses = useMemo(() => {
    if (!byCourse || !byCourse.length) return []
    return [...byCourse]
      .sort((a, b) => (b.count || b.value || 0) - (a.count || a.value || 0))
      .slice(0, courseLimit)
  }, [byCourse, courseLimit])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [t, bc, docsMonthly, recentDocs, recentStuds] = await Promise.all([
          DashboardService.getTotals(),
          DashboardService.getEnrollmentByCourse(),
          DashboardService.getDocumentsUploadedPerMonth(12),
          DashboardService.getRecentDocuments(5),
          DashboardService.getRecentStudents(5),
        ])
        if (!mounted) return
        setTotals(t)
        setByCourse(bc)
        setDocumentsMonthly(docsMonthly || { labels: [], values: [] })
        setRecentDocuments(recentDocs)
        setRecentStudents(recentStuds)
      } catch (e) {
        console.error(e)
        setError('Failed to load dashboard data')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  const handleCardClick = (metric, route) => {
    setSelectedMetric(metric)
    showToast(`Selected ${metric}: Viewing details`)
    if (route) {
      setTimeout(() => navigate(route), 300)
    }
  }

  const handleChartClick = (chartName, item) => {
    showToast(`${chartName} -> ${item.label}: ${item.value}`)
  }

  const handleLaunchAi = () => {
    const roles = user?.roles || []
    if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_PRINCIPAL')) {
      navigate('/admin/chat')
    } else if (roles.includes('ROLE_TEACHER')) {
      navigate('/teacher/ai')
    } else {
      navigate('/student/ai')
    }
  }

  if (loading) return <DashboardSkeleton />

  // Realistic sample students for Directory table (matching Dashdark X Users Table in Screenshot 4)
  const directoryUsers = [
    { id: 1, name: 'John Carter', email: 'john@aischool.io', phone: '+1 (414) 907-1274', dept: 'Senior Faculty', school: 'Science Dept', status: 'Online' },
    { id: 2, name: 'Sophie Moore', email: 'sophie@aischool.io', phone: '+1 (240) 480-4277', dept: 'Grade 12 STEM', school: 'Honors Wing', status: 'Offline' },
    { id: 3, name: 'Matt Cannon', email: 'matt@aischool.io', phone: '+1 (318) 608-9889', dept: 'Grade 11 Tech', school: 'AI Robotics', status: 'Offline' },
    { id: 4, name: 'Graham Hills', email: 'graham@aischool.io', phone: '+1 (540) 627-3890', dept: 'Computer Science', school: 'Faculty Head', status: 'Online' },
    { id: 5, name: 'Sandy Houston', email: 'sandy@aischool.io', phone: '+1 (440) 410-3848', dept: 'Mathematics', school: 'Junior Faculty', status: 'Offline' },
    { id: 6, name: 'Andy Smith', email: 'andy@aischool.io', phone: '+1 (604) 458-3288', dept: 'Grade 10 General', school: 'Secondary School', status: 'Online' }
  ]

  // Monthly submissions chart data
  const monthsLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsValues = [42, 56, 78, 65, 84, 98, 72, 89, 110, 95, 120, 135]

  return (
    <div className="dashboard-page animate-fade">
      {/* 1. Dashdark X Header & Quick Actions */}
      <div className="dashdark-header-bar d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h3 className="fw-bold mb-0 text-light" style={{ fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
              Institutional Analytics
            </h3>
            <span className="dashdark-status-pill online">
              <span className="spinner-dot bg-success" style={{ width: 6, height: 6, borderRadius: '50%' }} />
              Active Core
            </span>
          </div>
          <p className="mb-0 text-muted small">
            AI School OS Command Center • Real-time academic metrics & neural tutoring stream
          </p>
        </div>
        
        <div className="d-flex align-items-center gap-2 flex-wrap w-100 w-md-auto">
          {/* Date Range Selector Pill */}
          <div className="dropdown">
            <button 
              className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-light"
              style={{ background: '#121216', border: '1px solid rgba(255,255,255,0.10)', fontSize: '12px' }}
            >
              <i className="bi bi-calendar3 text-muted" />
              <span>Jan 2026 - Dec 2026</span>
              <i className="bi bi-chevron-down text-muted small ms-1" />
            </button>
          </div>

          <button 
            className="btn btn-sm px-3.5 py-2 rounded-3 text-white fw-semibold d-flex align-items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', border: 'none' }}
            onClick={handleLaunchAi}
          >
            <i className="bi bi-robot" />
            <span>Launch AI Tutor</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 py-2 mb-0" role="alert" style={{ fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#EF4444' }}>
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      )}

      {/* 2. Dashdark X 4-Card Metrics Row */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard 
            label="Total Students" 
            value={totals?.students ? `${totals.students}` : '50.8K'} 
            trend="28.4%" 
            accentColor="#EC4899"
            icon="bi-mortarboard-fill"
            onClick={() => handleCardClick('Total Students', '/admin/students')} 
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard 
            label="Active Courses & Classes" 
            value={totals?.courses ? `${totals.courses}` : '23.6K'} 
            trend="12.8%" 
            trendDown={true}
            accentColor="#00D8F6"
            icon="bi-layers-fill"
            onClick={() => handleCardClick('Active Courses', '/admin/courses')} 
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard 
            label="Submissions & Tasks" 
            value={totals?.documents ? `${totals.documents}` : '756'} 
            trend="3.1%" 
            accentColor="#8B5CF6"
            icon="bi-file-earmark-check-fill"
            onClick={() => handleCardClick('Submissions', '/admin/documents')} 
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard 
            label="Tuition & Fee Revenue" 
            value="₹240.8K" 
            trend="11.3%" 
            accentColor="#10B981"
            icon="bi-cash-stack"
            onClick={() => handleCardClick('Tuition Revenue', '/admin/subscriptions')} 
          />
        </div>
      </div>

      {/* 3. Dashdark X Middle Row: Circular Gauge & Stacked Performance Chart */}
      <div className="row g-3">
        {/* Left Card: Circular Engagement Arc Gauge */}
        <div className="col-12 col-lg-5">
          <div className="dashdark-card d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="dashdark-card-title">Student Attendance & Engagement</h5>
              <button 
                className="btn btn-sm px-2.5 py-1 rounded-2 text-muted"
                style={{ background: '#121216', border: '1px solid rgba(255,255,255,0.10)', fontSize: '11px' }}
                onClick={() => showToast('Exporting Attendance Report...')}
              >
                Export <i className="bi bi-arrow-down-short" />
              </button>
            </div>

            {/* Glowing Concentric Circular Gauge SVG */}
            <div className="dashdark-circular-container my-3">
              <svg className="dashdark-circular-svg" viewBox="0 0 200 160">
                {/* Outer Track & Arc (Violet) */}
                <path d="M 25 130 A 75 75 0 0 1 175 130" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="10" strokeLinecap="round" />
                <path d="M 25 130 A 75 75 0 0 1 155 85" fill="none" stroke="#8B5CF6" strokeWidth="10" strokeLinecap="round" strokeDasharray="235" strokeDashoffset="45" />

                {/* Middle Track & Arc (Magenta) */}
                <path d="M 40 130 A 60 60 0 0 1 160 130" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="10" strokeLinecap="round" />
                <path d="M 40 130 A 60 60 0 0 1 145 100" fill="none" stroke="#EC4899" strokeWidth="10" strokeLinecap="round" strokeDasharray="188" strokeDashoffset="55" />

                {/* Inner Track & Arc (Cyan) */}
                <path d="M 55 130 A 45 45 0 0 1 145 130" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="10" strokeLinecap="round" />
                <path d="M 55 130 A 45 45 0 0 1 125 110" fill="none" stroke="#00D8F6" strokeWidth="10" strokeLinecap="round" strokeDasharray="141" strokeDashoffset="30" />
              </svg>

              <div className="dashdark-circular-center">
                <div className="dashdark-circular-stat">96.4%</div>
                <div className="dashdark-circular-label">150k Active</div>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="mt-2">
              <div className="dashdark-legend-row">
                <div className="d-flex align-items-center">
                  <span className="dashdark-dot" style={{ backgroundColor: '#EC4899' }} />
                  <span className="text-light">On-Campus Lectures</span>
                </div>
                <span className="fw-bold text-light">82%</span>
              </div>
              <div className="dashdark-legend-row">
                <div className="d-flex align-items-center">
                  <span className="dashdark-dot" style={{ backgroundColor: '#00D8F6' }} />
                  <span className="text-light">Practical STEM Labs</span>
                </div>
                <span className="fw-bold text-light">12%</span>
              </div>
              <div className="dashdark-legend-row">
                <div className="d-flex align-items-center">
                  <span className="dashdark-dot" style={{ backgroundColor: '#8B5CF6' }} />
                  <span className="text-light">Remote & AI Tutor</span>
                </div>
                <span className="fw-bold text-light">6%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Academic Performance & Course Growth */}
        <div className="col-12 col-lg-7">
          <div className="dashdark-card d-flex flex-column justify-content-between">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
              <div>
                <span className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Course Activity & Submissions
                </span>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <h3 className="fw-bold text-light mb-0" style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
                    240.8K
                  </h3>
                  <span className="dashdark-trend-badge trend-up">
                    +14.8% <i className="bi bi-arrow-up-right ms-1" />
                  </span>
                </div>
              </div>

              {/* Legend & Period Filter */}
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <span className="d-flex align-items-center gap-1">
                    <span className="dashdark-dot" style={{ backgroundColor: '#EC4899' }} /> Homework
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <span className="dashdark-dot" style={{ backgroundColor: '#00D8F6' }} /> Exams
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <span className="dashdark-dot" style={{ backgroundColor: '#8B5CF6' }} /> AI Quizzes
                  </span>
                </div>
              </div>
            </div>

            {/* High contrast Chart */}
            <div style={{ height: '240px', position: 'relative', width: '100%' }}>
              <Chart
                type="bar"
                labels={displayCourses.length > 0 ? displayCourses.map((c) => c.courseName || c.label) : monthsLabels}
                values={displayCourses.length > 0 ? displayCourses.map((c) => c.count || c.value) : monthsValues}
                onClick={(item) => handleChartClick('Course Enrollment', item)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dashdark X Bottom Section: Students Directory Table (Matching Screenshot 4) */}
      <div className="dashdark-table-card">
        <div className="dashdark-table-header">
          <div className="d-flex align-items-center gap-3">
            <h5 className="dashdark-card-title">Enrolled Students & Faculty Directory</h5>
            <span className="badge px-2.5 py-1 rounded-pill" style={{ background: '#121216', border: '1px solid rgba(255,255,255,0.08)', color: '#A1A1AA', fontSize: '11px' }}>
              Showing 1 - 6 of 256
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-sm text-white px-3 py-1.5 rounded-3 fw-semibold d-flex align-items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', border: 'none', fontSize: '12px' }}
              onClick={() => navigate('/admin/students')}
            >
              <i className="bi bi-plus-lg" /> Add Student
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="dashdark-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" className="dashdark-checkbox" />
                </th>
                <th>Name <i className="bi bi-chevron-expand ms-1" /></th>
                <th>Phone <i className="bi bi-chevron-expand ms-1" /></th>
                <th>Department / Class <i className="bi bi-chevron-expand ms-1" /></th>
                <th>Institution <i className="bi bi-chevron-expand ms-1" /></th>
                <th>Status <i className="bi bi-chevron-expand ms-1" /></th>
                <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {directoryUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <input type="checkbox" className="dashdark-checkbox" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2.5">
                      <div 
                        className="dashdark-avatar"
                        style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-bold text-light" style={{ fontSize: '12.5px' }}>{u.name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{u.phone}</td>
                  <td>
                    <span className="badge px-2 py-1 rounded-2" style={{ background: '#121216', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px' }}>
                      {u.dept}
                    </span>
                  </td>
                  <td className="text-muted">{u.school}</td>
                  <td>
                    <span className={`dashdark-status-pill ${u.status === 'Online' ? 'online' : 'offline'}`}>
                      ● {u.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      <button className="dashdark-action-btn" title="Edit user" onClick={() => navigate('/admin/users')}>
                        <i className="bi bi-pencil" style={{ fontSize: '12px' }} />
                      </button>
                      <button className="dashdark-action-btn" title="Delete record" onClick={() => showToast(`Selected ${u.name}`)}>
                        <i className="bi bi-trash3" style={{ fontSize: '12px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. System Health & Live RAG Activity */}
      <div className="row g-3">
        <div className="col-lg-8">
          <RecentActivity documents={recentDocuments} students={recentStudents} />
        </div>
        <div className="col-lg-4">
          <SystemStatus />
        </div>
      </div>
    </div>
  )
}