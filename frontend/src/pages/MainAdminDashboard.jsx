import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import LoadingIndicator from '../components/LoadingIndicator'
import { DashboardApi } from '../services/api'

/**
 * Main Admin Dashboard - Platform-wide overview
 * Role: ROLE_SUPER_ADMIN
 */
export default function MainAdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    teachers: 0,
    students: 0,
    courses: 0,
    revenue: 0,
    aiRequests: 0,
    documents: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DashboardApi.totals()
      setStats({
        totalSchools: data?.totalSchools || 0,
        activeSchools: data?.activeSchools || 0,
        teachers: data?.teachers || 0,
        students: data?.students || 0,
        courses: data?.courses || 0,
        revenue: data?.revenue || 0,
        aiRequests: data?.aiRequests || 0,
        documents: data?.documents || 0
      })
    } catch (e) {
      console.error(e)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading dashboard..." />

  return (
    <div className="dashboard-page">
      <div className="page-header mb-4">
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Platform overview and key metrics</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <StatCard label="Total Schools" value={stats.totalSchools} icon="bi-building" color="primary" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Active Schools" value={stats.activeSchools} icon="bi-building-check" color="success" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Teachers" value={stats.teachers} icon="bi-person-badge" color="info" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Students" value={stats.students} icon="bi-people" color="warning" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <StatCard label="Courses" value={stats.courses} icon="bi-journal" color="primary" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="bi-currency-dollar" color="success" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="AI Requests" value={stats.aiRequests.toLocaleString()} icon="bi-robot" color="info" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Documents" value={stats.documents} icon="bi-folder" color="danger" />
        </div>
      </div>
    </div>
  )
}