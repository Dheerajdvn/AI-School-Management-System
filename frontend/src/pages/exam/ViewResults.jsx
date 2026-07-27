import React, { useState } from 'react'
import useToast from '../../hooks/useToast'

export default function ViewResults() {
  const { success: showSuccess } = useToast()
  const [selectedExam, setSelectedExam] = useState('All Exams')

  const results = [
    { id: 1, student: 'John Doe', exam: 'Mid-Term Mathematics', class: 'Class 10-A', marks: 85, total: 100, grade: 'A', percentage: 85 },
    { id: 2, student: 'Jane Smith', exam: 'Mid-Term Mathematics', class: 'Class 10-A', marks: 92, total: 100, grade: 'A+', percentage: 92 },
    { id: 3, student: 'Mike Johnson', exam: 'Mid-Term Mathematics', class: 'Class 10-A', marks: 78, total: 100, grade: 'B+', percentage: 78 },
    { id: 4, student: 'Sarah Williams', exam: 'Physics Unit Test', class: 'Class 11-B', marks: 88, total: 50, grade: 'A', percentage: 88 },
    { id: 5, student: 'Tom Brown', exam: 'Physics Unit Test', class: 'Class 11-B', marks: 45, total: 50, grade: 'A+', percentage: 90 },
  ]

  // Filter list based on select dropdown value
  const filteredResults = selectedExam === 'All Exams'
    ? results
    : results.filter(r => r.exam === selectedExam)

  // Export filtered results to CSV format
  const handleExport = () => {
    const csvContent = [
      ['Student Name', 'Exam', 'Class', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade'],
      ...filteredResults.map(r => [r.student, r.exam, r.class, r.marks, r.total, `${r.percentage}%`, r.grade])
    ].map(e => e.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Exam_Results_${selectedExam.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showSuccess('Filtered results exported successfully!')
  }

  const getGradeBadge = (grade) => {
    const style = {
      'A+': { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
      'A': { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
      'B+': { bg: 'rgba(6, 182, 212, 0.15)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
      'B': { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
      'C': { bg: 'rgba(156, 163, 175, 0.15)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.3)' },
      'F': { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
    }[grade] || { bg: 'rgba(156, 163, 175, 0.15)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.3)' }

    return (
      <span 
        className="badge rounded-pill fw-semibold"
        style={{ 
          backgroundColor: style.bg, 
          color: style.text, 
          border: `1px solid ${style.border}`,
          fontSize: '11px',
          padding: '6px 12px',
          display: 'inline-block'
        }}
      >
        {grade}
      </span>
    )
  }

  return (
    <div className="container-fluid py-2">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-white mb-1"><i className="bi bi-award-fill me-2 text-primary" />View Results</h4>
          <p className="text-muted small mb-0">Monitor and export student performance metric sheets & grades.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select 
            className="form-select w-auto bg-dark border-secondary text-white rounded-3 py-1.5"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            <option value="All Exams">All Exams</option>
            <option value="Mid-Term Mathematics">Mid-Term Mathematics</option>
            <option value="Physics Unit Test">Physics Unit Test</option>
          </select>
          <button className="btn btn-primary rounded-3 px-3 py-1.5 font-semibold shadow-glow d-flex align-items-center gap-2" onClick={handleExport}>
            <i className="bi bi-download" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-2xl" style={{ backgroundColor: 'rgba(17, 18, 23, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px' }}>
        <div className="card-body p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ color: 'inherit' }}>
              <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <tr className="border-bottom border-secondary border-opacity-20">
                  <th className="px-4 py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Student Name</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Exam</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Class</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Marks Obtained</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Total Marks</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Percentage</th>
                  <th className="py-3 text-muted text-uppercase font-semibold" style={{ fontSize: '11px' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted small">No results matching the selected exam filter.</td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <tr key={result.id} className="border-bottom border-secondary border-opacity-10">
                      <td className="px-4 py-3 fw-bold text-white">{result.student}</td>
                      <td>{result.exam}</td>
                      <td>{result.class}</td>
                      <td>{result.marks}</td>
                      <td>{result.total}</td>
                      <td className="fw-semibold text-white">{result.percentage}%</td>
                      <td>{getGradeBadge(result.grade)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}