import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import LoadingIndicator from '../components/LoadingIndicator'
import Chart from '../components/Charts'
import { DashboardApi } from '../services/api'

/**
 * Platform Analytics Page - System-wide analytics
 * Role: ROLE_SUPER_ADMIN
 */
export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalUsers: 0,
    aiRequests: 0,
    documentsUploaded: 0,
    revenue: 0
  })

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await DashboardApi.totals()
      setAnalytics({
        totalSchools: data?.totalSchools || 0,
        activeSchools: data?.activeSchools || 0,
        totalUsers: data?.users || 0,
        aiRequests: data?.aiChats || 0,
        documentsUploaded: data?.documents || 0,
        revenue: data?.revenue || 0
      })
    } catch (e) {
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading analytics..." />

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <h1>Platform Analytics</h1>
        <p className="text-muted">System-wide metrics and insights</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <StatCard label="Total Schools" value={analytics.totalSchools} icon="bi-building" color="primary" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Active Schools" value={analytics.activeSchools} icon="bi-building-check" color="success" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Total Users" value={analytics.totalUsers} icon="bi-people" color="info" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="AI Requests" value={analytics.aiRequests} icon="bi-robot" color="warning" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <StatCard label="Documents" value={analytics.documentsUploaded} icon="bi-folder" color="danger" />
        </div>
        <div className="col-sm-6 col-md-3">
          <StatCard label="Revenue" value={`$${analytics.revenue.toLocaleString()}`} icon="bi-currency-dollar" color="success" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">User Growth</h5>
            </div>
            <div className="card-body">
              <Chart type="line" labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} values={[100, 150, 200, 250, 300, 450]} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Plan Distribution</h5>
            </div>
            <div className="card-body">
              <Chart type="pie" labels={['Basic', 'Premium', 'Enterprise']} values={[5, 15, 3]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}