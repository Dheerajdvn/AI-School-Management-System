import React, { useEffect, useState } from 'react'
import StatisticsCards from '../components/StatisticsCards'
import ChartsSection from '../components/ChartsSection'
import ReportsTable from '../components/ReportsTable'
import DateRangeFilter from '../components/DateRangeFilter'
import ExportButtons from '../components/ExportButtons'
import DashboardService from '../services/DashboardService'
import LoadingIndicator from '../components/LoadingIndicator'

const AnalyticsPage = () => {
  const [totals, setTotals] = useState(null)
  const [byCourse, setByCourse] = useState([])
  const [documentsByMonth, setDocumentsByMonth] = useState({ labels: [], values: [] })
  const [rolesDistribution, setRolesDistribution] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [reports, setReports] = useState([])

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [t, bc, docsMonthly] = await Promise.all([
        DashboardService.getTotals(),
        DashboardService.getEnrollmentByCourse(),
        DashboardService.getDocumentsUploadedPerMonth(12)
      ])
      setTotals(t)
      setByCourse(bc)
      setDocumentsByMonth(docsMonthly || { labels: [], values: [] })
      
      // Mock roles distribution
      setRolesDistribution(t?.roles || {})
      
      // Mock reports data
      setReports([
        { type: 'Monthly Report', date: new Date().toISOString(), records: 150, size: '24 KB' },
        { type: 'Quarterly Report', date: new Date().toISOString(), records: 450, size: '68 KB' },
      ])
    } catch (e) {
      console.error(e)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const handleExportCsv = () => {
    console.log('Export CSV with filters:', filters)
  }

  const handleExportPdf = () => {
    console.log('Export PDF with filters:', filters)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading && !totals) {
    return <LoadingIndicator message="Loading analytics..." />
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-muted">System usage insights and data reports</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <StatisticsCards totals={totals} loading={loading} />

      <DateRangeFilter onFilter={handleFilter} />

      <ExportButtons
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
      />

      <ChartsSection
        byCourse={byCourse}
        documentsByMonth={documentsByMonth}
        rolesDistribution={rolesDistribution}
        loading={loading}
      />

      <ReportsTable reports={reports} loading={loading} error={error} />
    </div>
  )
}

export default AnalyticsPage