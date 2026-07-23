import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DashboardSkeleton from '../components/DashboardSkeleton'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import DashboardService from '../services/DashboardService'
import Chart from '../components/Charts'
import LoadingIndicator from '../components/LoadingIndicator'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totals, setTotals] = useState(null)
  const [byCourse, setByCourse] = useState(null)
  const [documentsMonthly, setDocumentsMonthly] = useState({ labels: [], values: [] })
  const [recentDocuments, setRecentDocuments] = useState([])
  const [recentStudents, setRecentStudents] = useState([])

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

  if (loading) return <DashboardSkeleton />

  return (
    <div className="dashboard-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">Overview of system metrics and recent activity</p>
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4">
          <StatCard label="Total Users" value={totals?.totalUsers ?? totals?.users ?? '—'} icon="bi-people" color="primary" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard label="Total Students" value={totals?.students ?? '—'} icon="bi-mortarboard" color="success" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard label="Total Teachers" value={totals?.teachers ?? '—'} icon="bi-person-badge" color="info" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard label="Total Courses" value={totals?.courses ?? '—'} icon="bi-journal-bookmark" color="warning" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard label="Total Documents" value={totals?.documents ?? '—'} icon="bi-file-earmark-text" color="danger" />
        </div>
        <div className="col-sm-6 col-md-4">
          <StatCard label="Total AI Chats" value={totals?.aiChats ?? '—'} icon="bi-chat-dots" color="info" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Student Enrollment by Course</h5>
              {byCourse && byCourse.length > 0 ? (
                <Chart type="bar" labels={byCourse.map((b) => b.courseName || b.label)} values={byCourse.map((b) => b.count || b.value)} />
              ) : (
                <div className="text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Documents Uploaded (Last 12 months)</h5>
              {documentsMonthly.labels.length ? (
                <Chart type="line" labels={documentsMonthly.labels} values={documentsMonthly.values} />
              ) : (
                <div className="text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <RecentActivity documents={recentDocuments} students={recentStudents} />
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User Roles Distribution</h5>
              {totals?.roles && Object.keys(totals.roles).length ? (
                <Chart type="pie" labels={Object.keys(totals.roles)} values={Object.values(totals.roles)} />
              ) : (
                <div className="text-muted">No role distribution data</div>
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
