import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DashboardSkeleton from '../components/DashboardSkeleton'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import DashboardService from '../services/DashboardService'
import Chart from '../components/Charts'
import LoadingIndicator from '../components/LoadingIndicator'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import useToast from '../hooks/useToast'

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
    showToast(`Selected ${metric}: Displaying live metrics and details`)
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
      {/* Welcome & AI Assistant Banner */}
      <div className="welcome-banner card p-4 mb-4 position-relative overflow-hidden border-0 bg-gradient-primary text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)', borderRadius: 'var(--radius-card)' }}>
        <div className="position-absolute top-0 end-0 p-4 opacity-10 d-none d-md-block">
          <i className="bi bi-cpu display-1 text-white" />
        </div>
        <div className="row align-items-center position-relative z-1">
          <div className="col-lg-8">
            <div className="badge bg-white text-primary mb-2 px-3 py-1 rounded-pill fw-semibold small">
              <i className="bi bi-stars me-1" /> AI-Powered School Management OS
            </div>
            <h2 className="fw-bold mb-2 text-white">Welcome back, {user?.username || user?.name || 'Administrator'}</h2>
            <p className="mb-3 text-white-50 small">
              All systems operational. AI LLM online with real-time analytics and automated grading assistance active.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-light btn-sm text-primary fw-semibold rounded-pill px-3" onClick={handleLaunchAi}>
                <i className="bi bi-robot me-1" /> Launch AI Tutor
              </button>
              <button className="btn btn-outline-light btn-sm fw-semibold rounded-pill px-3" onClick={() => navigate('/knowledge')}>
                <i className="bi bi-lightbulb me-1" /> Knowledge Center
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Enterprise Analytics & Metrics</h3>
          <p className="text-muted small m-0">Real-time overview of platform statistics, enrollments, and system activity</p>
        </div>
        <div className="d-none d-md-block">
          <QuickActions />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      )}

      {selectedMetric && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center rounded-3 mb-4" role="alert">
          <div>
            <i className="bi bi-info-circle-fill me-2" /> Active Filter / Focus: <strong>{selectedMetric}</strong>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedMetric(null)}>Clear Focus</button>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <StatCard 
            label="Total Users" 
            value={totals?.totalUsers ?? totals?.users ?? '—'} 
            icon="bi-people" 
            color="primary" 
            active={selectedMetric === 'Total Users'}
            onClick={() => handleCardClick('Total Users', '/admin/users')}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard 
            label="Total Students" 
            value={totals?.students ?? '—'} 
            icon="bi-mortarboard" 
            color="success" 
            active={selectedMetric === 'Total Students'}
            onClick={() => handleCardClick('Total Students', '/admin/students')}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard 
            label="Total Teachers" 
            value={totals?.teachers ?? '—'} 
            icon="bi-person-badge" 
            color="info" 
            active={selectedMetric === 'Total Teachers'}
            onClick={() => handleCardClick('Total Teachers', '/admin/users')}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard 
            label="Total Courses" 
            value={totals?.courses ?? '—'} 
            icon="bi-journal-bookmark" 
            color="warning" 
            active={selectedMetric === 'Total Courses'}
            onClick={() => handleCardClick('Total Courses', '/admin/courses')}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard 
            label="Total Documents" 
            value={totals?.documents ?? '—'} 
            icon="bi-file-earmark-text" 
            color="danger" 
            active={selectedMetric === 'Total Documents'}
            onClick={() => handleCardClick('Total Documents', '/admin/documents')}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard 
            label="Total AI Chats" 
            value={totals?.aiChats ?? '—'} 
            icon="bi-chat-dots" 
            color="info" 
            active={selectedMetric === 'Total AI Chats'}
            onClick={() => handleCardClick('Total AI Chats', '/admin/chat')}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card h-100 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">Student Enrollment by Course</h5>
                <span className="badge bg-light text-muted border">Live Data (Clickable)</span>
              </div>
              {byCourse && byCourse.length > 0 ? (
                <Chart 
                  type="bar" 
                  labels={byCourse.map((b) => b.courseName || b.label)} 
                  values={byCourse.map((b) => b.count || b.value)} 
                  onClick={(item) => handleChartClick('Course Enrollment', item)}
                />
              ) : (
                <div className="text-muted py-5 text-center">No enrollment data available</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">Uploads (12M)</h5>
                <span className="badge bg-light text-muted border">Trend (Clickable)</span>
              </div>
              {documentsMonthly.labels.length ? (
                <Chart 
                  type="line" 
                  labels={documentsMonthly.labels} 
                  values={documentsMonthly.values} 
                  onClick={(item) => handleChartClick('Uploads Trend', item)}
                />
              ) : (
                <div className="text-muted py-5 text-center">No document data</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Role Distribution */}
      <div className="row g-3">
        <div className="col-lg-8">
          <RecentActivity documents={recentDocuments} students={recentStudents} />
        </div>
        <div className="col-lg-4">
          <div className="card h-100 p-3">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">User Roles Distribution</h5>
              {totals?.roles && Object.keys(totals.roles).length ? (
                <Chart 
                  type="pie" 
                  labels={Object.keys(totals.roles)} 
                  values={Object.values(totals.roles)} 
                  onClick={(item) => handleChartClick('User Roles', item)}
                />
              ) : (
                <div className="text-muted py-5 text-center">No role distribution data</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <LoadingIndicator />
      </div>
    </div>
  )
}

