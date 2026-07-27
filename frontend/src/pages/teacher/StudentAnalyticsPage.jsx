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
      <div className="sap-page py-4">
        <div className="row g-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-12">
              <div className="skeleton-row animate-pulse" style={{ height: '56px', background: 'var(--surface)', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="sap-page py-4">
      <div className="page-header-custom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-bar-chart-line-fill text-primary me-2" />Student Analytics
          </h4>
          <p className="text-muted small mb-0 font-medium">Track performance standings, flag students needing support, and review class attendance curves.</p>
        </div>
        <select 
          className="form-select bg-dark border-secondary text-white rounded-3 py-1.5" 
          style={{ width: 'auto', minWidth: '160px' }} 
          value={selectedClass} 
          onChange={e => setSelectedClass(e.target.value)}
        >
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="row g-4 mb-4.5">
        <div className="col-md-4">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-trophy-fill text-warning me-2" />Top Performers
              </h5>
            </div>
            <div className="card-body p-0">
              {analytics.topStudents.map((s, i) => (
                <div key={i} className="student-rank-item d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-10">
                  <div className="d-flex align-items-center gap-2.5">
                    <span className="rank-badge top">{i + 1}</span>
                    <div>
                      <strong className="text-white" style={{ color: 'var(--text)' }}>{s.name}</strong>
                      <span className="small text-muted d-block" style={{ fontSize: '11px' }}>{s.roll}</span>
                    </div>
                  </div>
                  <span className="badge rounded-pill bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-2.5 py-1 fw-bold">
                    {s.avg}% Avg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-exclamation-triangle-fill text-danger me-2" />Needs Support
              </h5>
            </div>
            <div className="card-body p-0">
              {analytics.weakStudents.map((s, i) => (
                <div key={i} className="student-rank-item d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-10">
                  <div className="d-flex align-items-center gap-2.5">
                    <span className="rank-badge weak">{i + 1}</span>
                    <div>
                      <strong className="text-white" style={{ color: 'var(--text)' }}>{s.name}</strong>
                      <span className="small text-muted d-block" style={{ fontSize: '11px' }}>{s.roll}</span>
                    </div>
                  </div>
                  <span className="badge rounded-pill bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25 px-2.5 py-1 fw-bold">
                    {s.avg}% Avg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-cpu text-info me-2" />AI Guidance Insights
              </h5>
            </div>
            <div className="card-body p-3">
              <ul className="recommendation-list list-unstyled mb-0 d-flex flex-column gap-2.5">
                {analytics.recommendations.map((r, i) => (
                  <li key={i} className="small d-flex align-items-start gap-2 text-muted font-medium">
                    <i className="bi bi-check-circle-fill text-primary mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-calendar-check-fill text-success me-2" />Attendance Trend
              </h5>
            </div>
            <div className="chart-body p-4">
              <div className="chart-container">
                {analytics.attendanceData.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar green" style={{ height: `${val}%` }}>
                        <span className="chart-tooltip">{val}% Attendance</span>
                      </div>
                    </div>
                    <span className="chart-label">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card shadow-sm">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                <i className="bi bi-file-earmark-check-fill text-primary me-2" />Assignment Completion
              </h5>
            </div>
            <div className="chart-body p-4">
              <div className="chart-container">
                {analytics.assignmentData.map((val, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-track">
                      <div className="chart-bar blue" style={{ height: `${val}%` }}>
                        <span className="chart-tooltip">{val}% Completed</span>
                      </div>
                    </div>
                    <span className="chart-label">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{sapStyles}</style>
    </div>
  )
}

const sapStyles = `
.sap-page .glass-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.sap-page .card-header-custom { border-bottom: 1px solid var(--border) !important; }
.sap-page .student-rank-item:last-child { border-bottom: none !important; }
.sap-page .rank-badge { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.sap-page .rank-badge.top { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
.sap-page .rank-badge.weak { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
.sap-page .chart-container { display: flex; align-items: flex-end; gap: 8px; height: 160px; }
.sap-page .chart-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
.sap-page .chart-bar-track { width: 100%; height: calc(100% - 20px); background-color: var(--surface); border-radius: 6px; display: flex; align-items: flex-end; justify-content: center; border: 1px solid var(--border); overflow: visible; }
.sap-page .chart-bar { width: 100%; max-width: 22px; border-radius: 6px; position: relative; transition: height 0.5s ease; min-height: 4px; }
.sap-page .chart-bar.green { background: linear-gradient(to top, #059669, #34d399); box-shadow: 0 0 8px rgba(5,150,105,0.15); }
.sap-page .chart-bar.blue { background: linear-gradient(to top, #2563eb, #60a5fa); box-shadow: 0 0 8px rgba(37,99,235,0.15); }
.sap-page .chart-tooltip { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 10px; background: var(--surface); color: var(--text); border: 1px solid var(--border); padding: 3px 8px; border-radius: 6px; opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; white-space: nowrap; z-index: 10; box-shadow: var(--shadow); }
.sap-page .chart-bar:hover { transform: scaleY(1.02); }
.sap-page .chart-bar:hover .chart-tooltip { opacity: 1; transform: translateX(-50%) translateY(-2px); }
.sap-page .chart-label { font-size: 11px; margin-top: 6px; font-weight: 500; color: var(--muted); }
`