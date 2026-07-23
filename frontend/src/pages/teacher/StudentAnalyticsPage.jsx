import React, { useState, useEffect } from 'react'

export default function StudentAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState('Class 10-A')
  const [analytics, setAnalytics] = useState(null)

  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A']

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalytics({
        topStudents: [
          { name: 'Priya Patel', roll: 'R-1002', avg: 94 },
          { name: 'Anita Desai', roll: 'R-1006', avg: 92 },
          { name: 'Rahul Sharma', roll: 'R-1001', avg: 88 },
        ],
        weakStudents: [
          { name: 'Vikram Joshi', roll: 'R-1005', avg: 58 },
          { name: 'Amit Kumar', roll: 'R-1003', avg: 62 },
        ],
        attendanceData: [85, 88, 92, 87, 90, 93, 89],
        assignmentData: [65, 72, 68, 75, 70, 78, 82],
        recommendations: [
          'Focus on missed topics: Quadratic Equations',
          'Schedule extra class for weak students',
          'Provide supplementary materials for Chapter 3',
        ],
      })
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedClass])

  if (loading) {
    return (
      <div className="sap-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{sapStyles}</style>
      </div>
    )
  }

  return (
    <div className="sap-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-graph-up me-2" />Student Analytics</h4>
        <select className="form-select" style={{ width: 'auto' }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {classes.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-trophy me-2 text-warning" />Top Students</h5></div>
            <div className="card-body p-0">
              {analytics.topStudents.map((s, i) => (
                <div key={i} className="student-rank-item">
                  <span className="rank-badge top">{i + 1}</span>
                  <div><strong>{s.name}</strong><span className="small opacity-75">{s.roll}</span></div>
                  <span className="badge bg-success">{s.avg}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-exclamation-triangle me-2 text-danger" />Weak Students</h5></div>
            <div className="card-body p-0">
              {analytics.weakStudents.map((s, i) => (
                <div key={i} className="student-rank-item">
                  <span className="rank-badge weak">{i + 1}</span>
                  <div><strong>{s.name}</strong><span className="small opacity-75">{s.roll}</span></div>
                  <span className="badge bg-danger">{s.avg}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-lightbulb me-2 text-info" />AI Recommendations</h5></div>
            <div className="card-body">
              <ul className="recommendation-list">
                {analytics.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-calendar-check me-2" />Attendance Trend</h5></div>
            <div className="chart-body"><div className="chart-container">{analytics.attendanceData.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar green" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}%</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card">
            <div className="card-header-custom"><h5><i className="bi bi-card-text me-2" />Assignment Completion</h5></div>
            <div className="chart-body"><div className="chart-container">{analytics.assignmentData.map((val, i) => <div key={i} className="chart-bar-wrapper"><div className="chart-bar blue" style={{ height: `${val}%` }}><span className="chart-tooltip">{val}%</span></div><span className="chart-label">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          </div>
        </div>
      </div>

      <style>{sapStyles}</style>
    </div>
  )
}

const sapStyles = `
.sap-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.sap-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.sap-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.sap-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sap-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.sap-page .card-body { padding: 1.25rem; }
.sap-page .chart-body { padding: 1.25rem; }
.sap-page .chart-container { display: flex; align-items: flex-end; gap: 4px; height: 160px; }
.sap-page .chart-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
.sap-page .chart-bar { width: 100%; max-width: 28px; border-radius: 4px 4px 0 0; position: relative; transition: height 0.5s ease; min-height: 4px; }
.sap-page .chart-bar.green { background: linear-gradient(to top, #10b981, #34d399); }
.sap-page .chart-bar.blue { background: linear-gradient(to top, #3b82f6, #60a5fa); }
.sap-page .chart-tooltip { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 0.65rem; background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 4px; opacity: 0; transition: opacity 0.2s; white-space: nowrap; }
.sap-page .chart-bar:hover .chart-tooltip { opacity: 1; }
.sap-page .chart-label { font-size: 0.6rem; margin-top: 4px; opacity: 0.6; }
.sap-page .student-rank-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.sap-page .student-rank-item:last-child { border-bottom: none; }
.sap-page .rank-badge { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
.sap-page .rank-badge.top { background: rgba(245,158,11,0.2); color: #fbbf24; }
.sap-page .rank-badge.weak { background: rgba(239,68,68,0.2); color: #f87171; }
.sap-page .student-rank-item > div { flex: 1; display: flex; flex-direction: column; }
.sap-page .recommendation-list { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; }
.sap-page .recommendation-list li { margin-bottom: 0.5rem; }
.sap-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`