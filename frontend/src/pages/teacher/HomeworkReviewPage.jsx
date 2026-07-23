import React, { useState, useEffect } from 'react'

export default function HomeworkReviewPage() {
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [selected, setSelected] = useState(null)
  const [marks, setMarks] = useState({})
  const [feedback, setFeedback] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubmissions([
        { id: 1, student: 'Rahul Sharma', class: '10-A', assignment: 'Algebra Worksheet', submittedAt: '2026-07-24', file: 'rahul_algebra.pdf' },
        { id: 2, student: 'Priya Patel', class: '10-A', assignment: 'Algebra Worksheet', submittedAt: '2026-07-24', file: 'priya_algebra.pdf' },
        { id: 3, student: 'Amit Kumar', class: '10-B', assignment: 'Chemistry Equations', submittedAt: '2026-07-23', file: 'amit_chem.pdf' },
        { id: 4, student: 'Sneha Singh', class: '11-A', assignment: 'Physics Lab Report', submittedAt: '2026-07-22', file: 'sneha_physics.pdf' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const aiSuggest = (submission) => {
    const suggestedMarks = Math.floor(Math.random() * 20) + 75
    const suggestions = [
      `Good work. Grammar score: ${Math.floor(Math.random()*20)+80}%`,
      'Missing topic: application examples',
      'Consider adding more diagrams',
    ]
    setMarks(prev => ({ ...prev, [submission.id]: suggestedMarks }))
    setFeedback(prev => ({ ...prev, [submission.id]: suggestions.join('. ') }))
  }

  if (loading) {
    return (
      <div className="hrp-page">
        <div className="row g-3">{[...Array(3)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{hrpStyles}</style>
      </div>
    )
  }

  return (
    <div className="hrp-page">
      <h4 className="mb-3"><i className="bi bi-file-earmark-text me-2" />Homework Review</h4>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="glass-card">
            <div className="card-header-custom"><h5>Submissions</h5><span className="badge bg-primary">{submissions.length}</span></div>
            <div className="list-group list-group-flush">
              {submissions.map(sub => (
                <button key={sub.id} className={`list-group-item bg-transparent text-start ${selected?.id === sub.id ? 'active' : ''}`} onClick={() => { setSelected(sub); if (!marks[sub.id]) aiSuggest(sub); }}>
                  <div className="d-flex justify-content-between"><strong>{sub.student}</strong><span className="small opacity-75">{sub.assignment}</span></div>
                  <div className="small opacity-75">{sub.class} - {sub.submittedAt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          {selected ? (
            <div className="glass-card">
              <div className="card-header-custom"><h5>Review: {selected.student}</h5>
                <button className="btn btn-sm btn-outline-info" onClick={() => aiSuggest(selected)}><i className="bi bi-robot me-1" />AI Suggest</button>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Assignment</label>
                    <input type="text" className="form-control" value={selected.assignment} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Submitted File</label>
                    <div className="input-group">
                      <input type="text" className="form-control" value={selected.file} readOnly />
                      <button className="btn btn-outline-primary"><i className="bi bi-download" /></button>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Suggested Marks</label>
                  <input type="number" className="form-control" value={marks[selected.id] || ''} onChange={e => setMarks(prev => ({ ...prev, [selected.id]: parseInt(e.target.value) }))} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea className="form-control" rows="3" value={feedback[selected.id] || ''} onChange={e => setFeedback(prev => ({ ...prev, [selected.id]: e.target.value }))} />
                </div>
                <button className="btn btn-primary" onClick={() => alert('Saved!')}><i className="bi bi-check-lg me-1" />Save Grading</button>
              </div>
            </div>
          ) : (
            <div className="empty-state"><i className="bi bi-file-earmark-text" /><h6>Select a submission to review</h6></div>
          )}
        </div>
      </div>
      <style>{hrpStyles}</style>
    </div>
  )
}

const hrpStyles = `
.hrp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.hrp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.hrp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.hrp-page .card-body { padding: 1.25rem; }
.hrp-page .list-group-item { padding: 0.75rem 1.25rem; border: 1px solid rgba(255,255,255,0.05); color: inherit; }
.hrp-page .list-group-item:hover { background: rgba(255,255,255,0.05); }
.hrp-page .list-group-item.active { background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1)); border-color: rgba(59,130,246,0.3); }
.hrp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.hrp-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.hrp-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.hrp-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.hrp-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
.hrp-page .skeleton-row { height: 56px; border-radius: 12px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`