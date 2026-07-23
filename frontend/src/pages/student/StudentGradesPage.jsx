import React, { useState, useEffect } from 'react'

export default function StudentGradesPage() {
  const [loading, setLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState('Semester 1')
  const [grades, setGrades] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setGrades([
        { id: 1, subject: 'Mathematics', teacher: 'Mr. David Lee', test1: 85, test2: 90, midTerm: 78, final: 92, average: 86, grade: 'A' },
        { id: 2, subject: 'Physics', teacher: 'Ms. Emily Chen', test1: 88, test2: 85, midTerm: 82, final: 88, average: 86, grade: 'A' },
        { id: 3, subject: 'Chemistry', teacher: 'Mr. James Wilson', test1: 75, test2: 80, midTerm: 72, final: 85, average: 78, grade: 'B+' },
        { id: 4, subject: 'English', teacher: 'Mrs. Sarah Parker', test1: 90, test2: 88, midTerm: 85, final: 90, average: 88, grade: 'A' },
        { id: 5, subject: 'Computer Science', teacher: 'Mr. James Wilson', test1: 95, test2: 92, midTerm: 88, final: 95, average: 93, grade: 'A+' },
        { id: 6, subject: 'Biology', teacher: 'Ms. Emily Chen', test1: 70, test2: 75, midTerm: 68, final: 80, average: 73, grade: 'B' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedSemester])

  const gpa = grades.length > 0 ? (grades.reduce((acc, g) => acc + g.average, 0) / grades.length / 10).toFixed(2) : 0
  const getGradeColor = (avg) => {
    if (avg >= 90) return '#34d399'
    if (avg >= 80) return '#60a5fa'
    if (avg >= 70) return '#fbbf24'
    if (avg >= 60) return '#f59e0b'
    return '#f87171'
  }

  if (loading) {
    return (
      <div className="rgp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{rgpStyles}</style>
      </div>
    )
  }

  return (
    <div className="rgp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-graph-up me-2" />Grades & Report Card</h4>
        <div className="d-flex gap-2">
          <select className="form-select" style={{ width: 'auto' }} value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
            <option>Semester 1</option><option>Semester 2</option>
          </select>
          <button className="btn btn-outline-primary btn-sm" onClick={() => alert('Downloading PDF...')}><i className="bi bi-file-pdf me-1" />Download PDF</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card green"><div className="stat-icon"><i className="bi bi-trophy" /></div><div className="stat-content"><span className="stat-label">GPA</span><span className="stat-value">{gpa}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card blue"><div className="stat-icon"><i className="bi bi-bar-chart" /></div><div className="stat-content"><span className="stat-label">Average</span><span className="stat-value">{Math.round(grades.reduce((a, g) => a + g.average, 0) / grades.length)}%</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card purple"><div className="stat-icon"><i className="bi bi-trophy-fill" /></div><div className="stat-content"><span className="stat-label">A+ Grades</span><span className="stat-value">{grades.filter(g => g.grade === 'A+').length}</span></div></div></div>
        <div className="col-md-3 col-sm-6"><div className="stat-card gradient-card orange"><div className="stat-icon"><i className="bi bi-journal-text" /></div><div className="stat-content"><span className="stat-label">Subjects</span><span className="stat-value">{grades.length}</span></div></div></div>
      </div>

      <div className="glass-card">
        <div className="table-responsive">
          <table className="table rgp-table">
            <thead><tr><th>Subject</th><th>Teacher</th><th>Test 1</th><th>Test 2</th><th>Mid Term</th><th>Final</th><th>Average</th><th>Grade</th></tr></thead>
            <tbody>
              {grades.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.subject}</strong></td>
                  <td>{g.teacher}</td>
                  <td>{g.test1}</td>
                  <td>{g.test2}</td>
                  <td>{g.midTerm}</td>
                  <td>{g.final}</td>
                  <td><strong>{g.average}%</strong></td>
                  <td><span className="badge" style={{ background: `${getGradeColor(g.average)}22`, color: getGradeColor(g.average) }}>{g.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{rgpStyles}</style>
    </div>
  )
}

const rgpStyles = `
.rgp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.rgp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.rgp-page .d-flex.gap-2 { gap: 0.5rem; }
.rgp-page .stat-card { display: flex; align-items: center; padding: 1.25rem; border-radius: 16px; background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); gap: 1rem; transition: all 0.3s; }
.rgp-page .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
.rgp-page .stat-card.gradient-card.green { background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1)); border-color: rgba(16,185,129,0.3); }
.rgp-page .stat-card.gradient-card.blue { background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1)); border-color: rgba(59,130,246,0.3); }
.rgp-page .stat-card.gradient-card.purple { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1)); border-color: rgba(139,92,246,0.3); }
.rgp-page .stat-card.gradient-card.orange { background: linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1)); border-color: rgba(245,158,11,0.3); }
.rgp-page .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.rgp-page .stat-content { display: flex; flex-direction: column; }
.rgp-page .stat-label { font-size: 0.8rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
.rgp-page .stat-value { font-size: 1.6rem; font-weight: 700; line-height: 1.2; }
.rgp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.rgp-page .table-responsive { overflow-x: auto; }
.rgp-page .rgp-table { margin: 0; color: inherit; }
.rgp-page .rgp-table thead th { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding: 0.75rem 1rem; white-space: nowrap; }
.rgp-page .rgp-table td { padding: 0.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.05); }
.rgp-page .rgp-table tr:last-child td { border-bottom: none; }
.rgp-page .rgp-table tr:hover td { background: rgba(255,255,255,0.03); }
.rgp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`