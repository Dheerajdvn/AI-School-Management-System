import React, { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'

export default function GradebookPage() {
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState('Class 10-A')
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const classes = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A']

  const defaultStudents = [
    { id: 1, name: 'Rahul Sharma', roll: 'R-1001', marks: [85, 90, 78, 92], average: 86 },
    { id: 2, name: 'Priya Patel', roll: 'R-1002', marks: [92, 88, 95, 90], average: 91 },
    { id: 3, name: 'Amit Kumar', roll: 'R-1003', marks: [70, 75, 68, 72], average: 71 },
    { id: 4, name: 'Sneha Singh', roll: 'R-1004', marks: [88, 92, 85, 90], average: 89 },
    { id: 5, name: 'Vikram Joshi', roll: 'R-1005', marks: [60, 65, 58, 62], average: 61 },
    { id: 6, name: 'Anita Desai', roll: 'R-1006', marks: [95, 98, 92, 96], average: 95 },
  ]

  // Load from localStorage or defaults
  useEffect(() => {
    setLoading(true)
    try {
      const stored = localStorage.getItem(`gradebook_data_${selectedClass}`)
      if (stored) {
        setStudents(JSON.parse(stored))
      } else {
        localStorage.setItem(`gradebook_data_${selectedClass}`, JSON.stringify(defaultStudents))
        setStudents(defaultStudents)
      }
    } catch (e) {
      setStudents(defaultStudents)
    }
    setLoading(false)
  }, [selectedClass])

  const handleMarkChange = (studentId, markIndex, newValue) => {
    const parsedVal = Math.min(100, Math.max(0, Number(newValue) || 0))
    
    setStudents(prevStudents => {
      const updated = prevStudents.map(student => {
        if (student.id === studentId) {
          const newMarks = [...student.marks]
          newMarks[markIndex] = parsedVal
          const newAvg = Math.round(newMarks.reduce((a, b) => a + b, 0) / newMarks.length)
          return {
            ...student,
            marks: newMarks,
            average: newAvg
          }
        }
        return student
      })
      
      // Update local storage straight away as state changes
      try {
        localStorage.setItem(`gradebook_data_${selectedClass}`, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  const handleSaveGradebook = () => {
    setSaving(true)
    setTimeout(() => {
      try {
        localStorage.setItem(`gradebook_data_${selectedClass}`, JSON.stringify(students))
        showSuccess(`Gradebook for ${selectedClass} successfully saved and compiled!`)
      } catch (e) {
        showError('Failed to save gradebook to local storage')
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  const handleExport = (format) => {
    const csvHeader = ['Roll', 'Name', 'Test 1', 'Test 2', 'Mid Term', 'Final', 'Average', 'Grade']
    const csvRows = students.map(s => [
      s.roll,
      s.name,
      s.marks[0],
      s.marks[1],
      s.marks[2],
      s.marks[3],
      `${s.average}%`,
      getGrade(s.average)
    ])

    const csvContent = [csvHeader, ...csvRows].map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Gradebook_${selectedClass.replace(/\s+/g, '_')}.${format === 'pdf' ? 'pdf' : 'csv'}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showSuccess(`Gradebook spreadsheet exported successfully as ${format.toUpperCase()}!`)
  }

  const getGrade = (avg) => {
    if (avg >= 90) return 'A+'
    if (avg >= 80) return 'A'
    if (avg >= 70) return 'B'
    if (avg >= 60) return 'C'
    if (avg >= 50) return 'D'
    return 'F'
  }

  const getGradeColor = (avg) => {
    if (avg >= 90) return '#34d399'
    if (avg >= 80) return '#60a5fa'
    if (avg >= 70) return '#fbbf24'
    if (avg >= 60) return '#f59e0b'
    if (avg >= 50) return '#f87171'
    return '#ef4444'
  }

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="gbp-page py-4">
        <div className="row g-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-12">
              <div className="skeleton-row animate-pulse" style={{ height: '56px', background: 'var(--surface)', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
        <style>{gbpStyles}</style>
      </div>
    )
  }

  return (
    <div className="gbp-page py-4">
      <div className="page-header-custom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-journal-bookmark-fill text-primary me-2" />Gradebook Manager
          </h4>
          <p className="text-muted small mb-0 font-medium">Record test scores, calculate class averages, and export score registries.</p>
        </div>
        <div className="d-flex flex-wrap gap-2.5">
          <select 
            className="form-select bg-dark border-secondary text-white rounded-3 py-1.5"
            style={{ width: 'auto', minWidth: '150px' }} 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-outline-secondary rounded-3 border-0 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} onClick={() => handleExport('pdf')}>
            <i className="bi bi-file-earmark-pdf text-danger me-1.5" />PDF
          </button>
          <button className="btn btn-outline-secondary rounded-3 border-0 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} onClick={() => handleExport('excel')}>
            <i className="bi bi-file-earmark-excel text-success me-1.5" />Excel
          </button>
          <button className="btn btn-primary rounded-3 px-3.5 fw-semibold d-flex align-items-center gap-2" onClick={handleSaveGradebook} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-save" />}
            <span>Save Marks</span>
          </button>
        </div>
      </div>

      <div className="search-bar mb-4">
        <i className="bi bi-search search-icon" />
        <input 
          type="text" 
          className="form-control style-search-input" 
          placeholder="Filter students by name or roll number..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      <div className="glass-card shadow-2xl">
        <div className="table-responsive">
          <table className="table gbp-table align-middle mb-0" style={{ color: 'inherit' }}>
            <thead>
              <tr className="border-bottom border-secondary border-opacity-10">
                <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '11px' }}>Roll</th>
                <th className="py-3 text-muted text-uppercase" style={{ fontSize: '11px' }}>Name</th>
                <th className="py-3 text-muted text-uppercase text-center" style={{ fontSize: '11px' }}>Test 1</th>
                <th className="py-3 text-muted text-uppercase text-center" style={{ fontSize: '11px' }}>Test 2</th>
                <th className="py-3 text-muted text-uppercase text-center" style={{ fontSize: '11px' }}>Mid Term</th>
                <th className="py-3 text-muted text-uppercase text-center" style={{ fontSize: '11px' }}>Final Exam</th>
                <th className="py-3 text-muted text-uppercase text-center" style={{ fontSize: '11px' }}>Average</th>
                <th className="py-3 text-muted text-uppercase text-center" style={{ fontSize: '11px' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted small">No students matched the filter search.</td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="border-bottom border-secondary border-opacity-10">
                    <td className="px-4"><code>{s.roll}</code></td>
                    <td><strong className="text-white" style={{ color: 'var(--text)' }}>{s.name}</strong></td>
                    {s.marks.map((m, i) => (
                      <td key={i} className="text-center">
                        <input 
                          type="number" 
                          className="form-control form-control-sm style-mark-input mx-auto" 
                          style={{ width: '72px' }} 
                          value={m} 
                          onChange={(e) => handleMarkChange(s.id, i, e.target.value)}
                          min="0"
                          max="100"
                        />
                      </td>
                    ))}
                    <td className="text-center fw-bold" style={{ color: 'var(--text)' }}>{s.average}%</td>
                    <td className="text-center">
                      <span 
                        className="badge rounded-pill fw-bold" 
                        style={{ 
                          backgroundColor: `${getGradeColor(s.average)}22`, 
                          color: getGradeColor(s.average), 
                          border: `1px solid ${getGradeColor(s.average)}33`,
                          fontSize: '11px',
                          padding: '6px 12px',
                          display: 'inline-block'
                        }}
                      >
                        {getGrade(s.average)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{gbpStyles}</style>
    </div>
  )
}

const gbpStyles = `
.gbp-page .search-bar { position: relative; }
.gbp-page .search-bar .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.55; z-index: 1; color: var(--text); }
.gbp-page .style-search-input { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 12px; padding: 0.65rem 0.65rem 0.65rem 42px; color: var(--text) !important; font-size: 14px; }
.gbp-page .style-search-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.gbp-page .glass-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.gbp-page .gbp-table thead th { background: rgba(255,255,255,0.02) !important; border-bottom: 1px solid var(--border) !important; font-size: 11px; padding: 0.85rem 1rem; }
.gbp-page .gbp-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border) !important; }
.gbp-page .style-mark-input { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; text-align: center; border-radius: 8px; font-weight: 500; font-size: 13px; padding: 0.35rem; }
.gbp-page .style-mark-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`