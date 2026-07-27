import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import LoadingIndicator from '../components/LoadingIndicator'
import Chart from '../components/Charts'
import { DashboardApi } from '../services/api'
import useToast from '../hooks/useToast'

/**
 * Enterprise Platform Analytics Page - System-wide SaaS Intelligence & Metrics
 * Role: ROLE_SUPER_ADMIN / ROLE_ADMIN
 */
export default function AdminAnalyticsPage() {
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('30d')
  const [exportingCsv, setExportingCsv] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [schoolSearch, setSchoolSearch] = useState('')

  const [analytics, setAnalytics] = useState({
    totalSchools: 2,
    activeSchools: 2,
    totalUsers: 119,
    aiRequests: 200,
    documentsUploaded: 107,
    revenue: 1522450
  })

  const [schoolsData, setSchoolsData] = useState([
    { id: 1, name: 'Central High School', code: 'CHS-01', plan: 'Enterprise', users: 5400, docs: 65, status: 'Active', mrr: '$45,000' },
    { id: 2, name: 'St. Mary International School', code: 'SMI-02', plan: 'Premium', users: 4603, docs: 42, status: 'Active', mrr: '$32,500' },
    { id: 3, name: 'Oakridge Global Academy', code: 'OGA-03', plan: 'Enterprise', users: 3800, docs: 88, status: 'Active', mrr: '$55,000' },
    { id: 4, name: 'Springdales Model School', code: 'SMS-04', plan: 'Basic', users: 1200, docs: 15, status: 'Trial', mrr: '$8,500' }
  ])

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DashboardApi.totals()
      setAnalytics({
        totalSchools: data?.totalSchools || 2,
        activeSchools: data?.activeSchools || 2,
        totalUsers: data?.totalUsers || data?.users || 119,
        aiRequests: data?.aiChats || 200,
        documentsUploaded: data?.totalDocuments || data?.documents || 107,
        revenue: data?.revenue || 1522450
      })
    } catch (e) {
      console.error(e)
      setError('Failed to load live platform analytics')
    } finally {
      setLoading(false)
    }
  }

  // Export CSV Handler
  const handleExportCsv = () => {
    setExportingCsv(true)
    try {
      const dateStr = new Date().toISOString().slice(0, 10)
      let csv = 'Platform Metric,Value,Timeframe,Timestamp\n'
      csv += `Total Schools,${analytics.totalSchools},${timeframe},${dateStr}\n`
      csv += `Active Schools,${analytics.activeSchools},${timeframe},${dateStr}\n`
      csv += `Total Users,${analytics.totalUsers},${timeframe},${dateStr}\n`
      csv += `AI Requests,${analytics.aiRequests},${timeframe},${dateStr}\n`
      csv += `Documents Vectorized,${analytics.documentsUploaded},${timeframe},${dateStr}\n`
      csv += `Platform Revenue,$${analytics.revenue},${timeframe},${dateStr}\n\n`

      csv += 'School Name,School Code,Plan Type,Active Users,Documents Ingested,MRR,Status\n'
      schoolsData.forEach(s => {
        csv += `"${s.name}",${s.code},${s.plan},${s.users},${s.docs},${s.mrr},${s.status}\n`
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', `platform_analytics_${dateStr}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showSuccess('Platform Analytics CSV report downloaded!')
    } catch (err) {
      showError('Failed to export CSV report')
    } finally {
      setExportingCsv(false)
    }
  }

  // Export PDF / Print Handler
  const handleExportPdf = () => {
    setExportingPdf(true)
    try {
      window.print()
      showSuccess('PDF print dialog ready!')
    } catch (err) {
      showError('Failed to trigger PDF report')
    } finally {
      setExportingPdf(false)
    }
  }

  const filteredSchools = schoolsData.filter(s =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.code.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.plan.toLowerCase().includes(schoolSearch.toLowerCase())
  )

  if (loading && !analytics.totalUsers) {
    return <LoadingIndicator message="Loading platform analytics & telemetry..." />
  }

  return (
    <div className="container-fluid py-2 animate-fade">
      {/* Header Banner & Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '18px' }}>
            <i className="bi bi-graph-up-arrow text-primary me-2" /> Platform Analytics & Telemetry
          </h3>
          <p className="text-muted m-0 small">System-wide SaaS performance metrics, revenue growth, and usage intelligence</p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Timeframe selector pill */}
          <div className="btn-group bg-surface p-1 rounded-3 border" role="group">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '1y', label: '1 Year' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                className={`btn btn-sm rounded-2 py-1 px-2.5 font-semibold ${timeframe === t.id ? 'btn-primary shadow-xs' : 'btn-light text-muted border-0'}`}
                style={{ fontSize: '11px' }}
                onClick={() => setTimeframe(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-success btn-sm rounded-3 fw-semibold px-3 d-flex align-items-center gap-1 shadow-xs"
            onClick={handleExportCsv}
            disabled={exportingCsv}
          >
            {exportingCsv ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-file-earmark-spreadsheet" />}
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm rounded-3 fw-semibold px-3 d-flex align-items-center gap-1 shadow-xs"
            onClick={handleExportPdf}
            disabled={exportingPdf}
          >
            {exportingPdf ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-file-earmark-pdf" />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 py-2 mb-3" style={{ fontSize: '12px' }}>
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      )}

      {/* 6 Responsive Stat Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Schools" value={analytics.totalSchools} icon="bi-building-fill" color="primary" trend="SaaS" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Active Schools" value={analytics.activeSchools} icon="bi-building-check" color="success" trend="100%" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Total Users" value={analytics.totalUsers} icon="bi-people-fill" color="info" trend="+18%" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="AI Requests" value={analytics.aiRequests} icon="bi-robot" color="warning" trend="LLM Ready" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="Documents" value={analytics.documentsUploaded} icon="bi-folder-fill" color="danger" trend="Qdrant" />
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <StatCard label="ARR Revenue" value={`$${(analytics.revenue || 1522450).toLocaleString()}`} icon="bi-currency-dollar" color="success" trend="ARR" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm bg-card h-100" style={{ borderRadius: '14px' }}>
            <div className="card-header bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-graph-up text-primary" /> Active User & Engagement Growth
              </h6>
              <span className="badge bg-primary bg-opacity-10 text-primary border px-2 py-0.5 x-small">
                Growth Curve
              </span>
            </div>
            <div className="card-body p-3">
              <Chart
                type="line"
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                values={[100, 150, 200, 250, 300, 380, 450]}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-card h-100" style={{ borderRadius: '14px' }}>
            <div className="card-header bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-pie-chart-fill text-info" /> Subscription Plan Distribution
              </h6>
              <span className="badge bg-info bg-opacity-10 text-info border px-2 py-0.5 x-small">
                Tier Allocation
              </span>
            </div>
            <div className="card-body p-3">
              <Chart
                type="pie"
                labels={['Basic Tier', 'Premium Tier', 'Enterprise Tier']}
                values={[5, 15, 8]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Onboarded Schools & Subscriptions Audit Table */}
      <div className="card border-0 shadow-sm bg-card overflow-hidden" style={{ borderRadius: '14px' }}>
        <div className="card-header bg-transparent py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
            <i className="bi bi-buildings text-primary" /> Onboarded School Subscriptions Audit
          </h5>
          <div className="input-group input-group-sm max-w-260">
            <span className="input-group-text bg-surface border-end-0 text-muted">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 style-input"
              placeholder="Search school name or plan..."
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-surface">
              <tr>
                <th className="ps-3" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>School Name</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subscription Plan</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Users</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Docs Ingested</th>
                <th style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly MRR</th>
                <th className="pe-3 text-end" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school.id}>
                  <td className="ps-3 fw-semibold">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                        <i className="bi bi-building" />
                      </div>
                      <span>{school.name}</span>
                    </div>
                  </td>
                  <td className="small text-muted font-monospace">{school.code}</td>
                  <td>
                    <span className={`badge ${school.plan === 'Enterprise' ? 'bg-primary' : school.plan === 'Premium' ? 'bg-info text-dark' : 'bg-secondary'} bg-opacity-20 text-body border px-2.5 py-1 rounded-pill`}>
                      {school.plan}
                    </span>
                  </td>
                  <td className="small fw-medium">{school.users.toLocaleString()}</td>
                  <td className="small text-muted">{school.docs} files</td>
                  <td className="small fw-bold text-success">{school.mrr}</td>
                  <td className="pe-3 text-end">
                    <span className="badge bg-success bg-opacity-20 text-success rounded-pill px-2.5 py-1">
                      {school.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}