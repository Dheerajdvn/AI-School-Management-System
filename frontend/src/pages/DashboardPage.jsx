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

  return (
    <div className="dashboard-page animate-fade">
      {/* Sleek Top Header & Quick Action Bar */}
      <div className="card p-3.5 mb-3 border shadow-xs bg-card position-relative" style={{ zIndex: 1050 }}>
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h4 className="fw-bold mb-0" style={{ fontSize: '1.15rem', color: 'var(--text)' }}>
                Welcome back, {user?.username || user?.name || 'Administrator'}
              </h4>
              <span className="badge bg-success-subtle text-success border-0 rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                ● Active
              </span>
            </div>
            <p className="mb-0 text-muted small">
              Institutional Command Center • Live analytics and AI services ready.
            </p>
          </div>
          
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button className="btn btn-primary btn-sm px-3" onClick={handleLaunchAi}>
              <i className="bi bi-robot me-1" /> Launch AI Assistant
            </button>
            <button className="btn btn-secondary btn-sm px-3" onClick={() => navigate('/knowledge')}>
              <i className="bi bi-lightbulb me-1" /> Knowledge Base
            </button>

            {/* Quick Actions Dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-secondary btn-sm dropdown-toggle px-3" 
                type="button" 
                id="quickActionsDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-lightning-charge-fill me-1 text-warning" /> Quick Actions
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border p-1" aria-labelledby="quickActionsDropdown" style={{ fontSize: '0.85rem', zIndex: 1060 }}>
                <li>
                  <button className="dropdown-item py-2 rounded-2" onClick={() => navigate('/admin/students')}>
                    <i className="bi bi-person-plus me-2 text-primary" /> Add Student
                  </button>
                </li>
                <li>
                  <button className="dropdown-item py-2 rounded-2" onClick={() => navigate('/admin/courses')}>
                    <i className="bi bi-book me-2 text-primary" /> Add Course
                  </button>
                </li>
                <li>
                  <button className="dropdown-item py-2 rounded-2" onClick={() => navigate('/admin/documents')}>
                    <i className="bi bi-file-earmark-arrow-up me-2 text-primary" /> Upload Document
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-1" />
                </li>
                <li>
                  <button className="dropdown-item py-2 rounded-2" onClick={() => navigate('/admin/chat')}>
                    <i className="bi bi-chat-dots me-2 text-primary" /> Open AI Chat
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="d-flex align-items-baseline gap-2 mb-2">
        <h4 className="fw-bold mb-0" style={{ fontSize: '13.5px', color: 'var(--text)' }}>Analytics & Metrics</h4>
        <span className="text-muted" style={{ fontSize: '11px' }}>— Real-time platform overview</span>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 py-2 mb-2" role="alert" style={{ fontSize: '12px' }}>
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      )}

      {selectedMetric && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center rounded-3 py-2 mb-2" role="alert" style={{ fontSize: '12px' }}>
          <div>
            <i className="bi bi-info-circle-fill me-2" /> Active Filter: <strong>{selectedMetric}</strong>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedMetric(null)} style={{ height: '28px', fontSize: '11px' }}>Clear</button>
        </div>
      )}

      {/* Condense Stat Cards into a neat responsive row */}
      <div className="row g-2 mb-3">
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Users" value={totals?.totalUsers ?? totals?.users ?? '—'} icon="bi-people" color="primary" active={selectedMetric === 'Total Users'} onClick={() => handleCardClick('Total Users', '/admin/users')} />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Students" value={totals?.students ?? '—'} icon="bi-mortarboard" color="success" active={selectedMetric === 'Total Students'} onClick={() => handleCardClick('Total Students', '/admin/students')} />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Teachers" value={totals?.teachers ?? '—'} icon="bi-person-badge" color="info" active={selectedMetric === 'Total Teachers'} onClick={() => handleCardClick('Total Teachers', '/admin/users')} />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Courses" value={totals?.courses ?? '—'} icon="bi-journal-bookmark" color="warning" active={selectedMetric === 'Total Courses'} onClick={() => handleCardClick('Total Courses', '/admin/courses')} />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Documents" value={totals?.documents ?? '—'} icon="bi-file-earmark-text" color="danger" active={selectedMetric === 'Total Documents'} onClick={() => handleCardClick('Total Documents', '/admin/documents')} />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total AI Chats" value={totals?.aiChats ?? '—'} icon="bi-chat-dots" color="info" active={selectedMetric === 'Total AI Chats'} onClick={() => handleCardClick('Total AI Chats', '/admin/chat')} />
        </div>
      </div>

      <div className="row g-2 mb-2">
        <div className="col-lg-8">
          <div className="card h-100 p-2">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="card-title fw-bold mb-0" style={{ fontSize: '13px' }}>Top Courses by Enrollment</h5>
                  <span className="badge bg-primary-subtle text-primary border-0 rounded-pill px-2 py-0.5" style={{ fontSize: '10px' }}>
                    Top {courseLimit}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <div className="btn-group btn-group-sm" role="group" aria-label="Course Limit">
                    {[6, 8, 12].map((lim) => (
                      <button
                        key={lim}
                        type="button"
                        className={`btn py-0 px-2 ${courseLimit === lim ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '10px', height: '22px', lineHeight: '20px' }}
                        onClick={() => setCourseLimit(lim)}
                      >
                        Top {lim}
                      </button>
                    ))}
                  </div>
                  <span className="badge bg-light text-muted border ms-1" style={{ fontSize: '10px' }}>Live Data</span>
                </div>
              </div>
              {displayCourses && displayCourses.length > 0 ? (
                <div style={{ height: '240px' }}>
                  <Chart
                    type="bar"
                    labels={displayCourses.map((b) => b.courseName || b.label)}
                    values={displayCourses.map((b) => b.count || b.value)}
                    onClick={(item) => handleChartClick('Course Enrollment', item)}
                  />
                </div>
              ) : (
                <div className="text-muted py-4 text-center" style={{ fontSize: '12px' }}>No enrollment data available</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="h-100">
            <SystemStatus />
          </div>
        </div>
      </div>

      <div className="row g-2">
        <div className="col-lg-8">
          <RecentActivity documents={recentDocuments} students={recentStudents} />
        </div>
        <div className="col-lg-4">
          <div className="card h-100 p-2">
            <div className="card-body p-0">
              <h5 className="card-title fw-bold mb-2" style={{ fontSize: '13px' }}>User Roles Distribution</h5>
              {totals?.roles && Object.keys(totals.roles).length ? (
                <div style={{ height: '220px' }}>
                  <Chart type="pie" labels={Object.keys(totals.roles)} values={Object.values(totals.roles)} onClick={(item) => handleChartClick('User Roles', item)} />
                </div>
              ) : (
                <div className="text-muted py-4 text-center" style={{ fontSize: '12px' }}>No role distribution data</div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}