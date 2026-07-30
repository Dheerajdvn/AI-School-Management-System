import React, { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'

export default function HomeworkReviewPage() {
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [selected, setSelected] = useState(null)
  
  // Persisted state for marks and feedbacks
  const [marks, setMarks] = useState({})
  const [feedback, setFeedback] = useState({})
  const [gradedIds, setGradedIds] = useState(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const defaultSubmissions = [
        { id: 1, student: 'Rahul Sharma', class: '10-A', assignment: 'Algebra Worksheet', submittedAt: '2026-07-24', file: 'rahul_algebra.pdf' },
        { id: 2, student: 'Priya Patel', class: '10-A', assignment: 'Algebra Worksheet', submittedAt: '2026-07-24', file: 'priya_algebra.pdf' },
        { id: 3, student: 'Amit Kumar', class: '10-B', assignment: 'Chemistry Equations', submittedAt: '2026-07-23', file: 'amit_chem.pdf' },
        { id: 4, student: 'Sneha Singh', class: '11-A', assignment: 'Physics Lab Report', submittedAt: '2026-07-22', file: 'sneha_physics.pdf' },
      ]

      try {
        const storedGrading = localStorage.getItem('homework_review_grading')
        if (storedGrading) {
          const parsed = JSON.parse(storedGrading)
          setMarks(parsed.marks || {})
          setFeedback(parsed.feedback || {})
          setGradedIds(new Set(parsed.gradedIds || []))
        }
      } catch (e) {
        console.error(e)
      }

      setSubmissions(defaultSubmissions)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const aiSuggest = (submission) => {
    const suggestedMarks = Math.floor(Math.random() * 20) + 75
    const suggestions = [
      `Excellent attempt. Content accuracy: ${Math.floor(Math.random()*15)+85}%`,
      'Topic coverage is comprehensive',
      'Could improve layout structure',
    ]
    setMarks(prev => ({ ...prev, [submission.id]: suggestedMarks }))
    setFeedback(prev => ({ ...prev, [submission.id]: suggestions.join('. ') }))
    showSuccess('AI feedback suggestions generated successfully!')
  }

  const handleSaveGrading = () => {
    if (!selected) return
    setSaving(true)

    setTimeout(() => {
      try {
        const nextGradedIds = new Set(gradedIds)
        nextGradedIds.add(selected.id)
        setGradedIds(nextGradedIds)

        const payload = {
          marks,
          feedback,
          gradedIds: Array.from(nextGradedIds)
        }
        localStorage.setItem('homework_review_grading', JSON.stringify(payload))
        showSuccess(`Grading for ${selected.student} compiled and saved successfully!`)
      } catch (e) {
        showError('Failed to save grading metrics')
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  const handleDownload = (filename) => {
    showSuccess(`Downloading secure assignment file: ${filename}`)
  }

  if (loading) {
    return (
      <div className="hrp-page py-4">
        <div className="row g-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="col-12">
              <div className="skeleton-row animate-pulse" style={{ height: '56px', background: 'var(--surface)', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="hrp-page py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-file-earmark-check-fill text-primary me-2" />Homework & Assignment Review
          </h4>
          <p className="text-muted small mb-0 font-medium">Verify student submissions, apply grading points, and suggest AI-powered revisions.</p>
        </div>
      </div>

      <div className="row g-3">
        {/* Left Side: Submissions list */}
        <div className="col-md-4">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Submissions Inbox</h5>
              <span className="badge rounded-pill bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30">
                {submissions.length - gradedIds.size} Pending
              </span>
            </div>
            <div className="list-group list-group-flush">
              {submissions.map(sub => {
                const isGraded = gradedIds.has(sub.id)
                const isSelected = selected?.id === sub.id
                return (
                  <button 
                    key={sub.id} 
                    className={`list-group-item text-start d-flex flex-column gap-1.5 transition ${isSelected ? 'active-item' : ''}`} 
                    onClick={() => { setSelected(sub); if (!marks[sub.id]) aiSuggest(sub); }}
                    style={{
                      backgroundColor: isSelected ? 'var(--hover)' : 'transparent',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--text)'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <strong className="text-white" style={{ color: 'var(--text)', fontSize: '13px' }}>{sub.student}</strong>
                      {isGraded ? (
                        <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 rounded-pill x-small px-2 py-0.5">
                          <i className="bi bi-check-circle-fill me-1" />Graded
                        </span>
                      ) : (
                        <span className="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25 rounded-pill x-small px-2 py-0.5">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-muted w-100" style={{ fontSize: '11px' }}>
                      <span>{sub.assignment}</span>
                      <span>Class {sub.class}</span>
                    </div>
                    <small className="text-muted" style={{ fontSize: '10px' }}>Submitted: {sub.submittedAt}</small>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Assignment Review Workspace */}
        <div className="col-md-8">
          {selected ? (
            <div className="glass-card shadow-sm">
              <div className="card-header-custom p-3 border-bottom d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                  Workspace: {selected.student}
                </h5>
                <button className="btn btn-outline-secondary btn-sm rounded-pill text-white border-0" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} onClick={() => aiSuggest(selected)}>
                  <i className="bi bi-robot text-primary me-1.5" />AI Suggest Feedback
                </button>
              </div>
              <div className="card-body p-4">
                <div className="row g-3 mb-3.5">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold">Assignment Title</label>
                    <input type="text" className="form-control style-review-input" value={selected.assignment} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold">Submitted Attachment</label>
                    <div className="input-group">
                      <input type="text" className="form-control style-review-input" value={selected.file} readOnly />
                      <button className="btn btn-outline-secondary border-secondary text-white px-3" onClick={() => handleDownload(selected.file)}>
                        <i className="bi bi-download text-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-3.5">
                  <label className="form-label text-muted small fw-semibold">Award Score (Out of 100)</label>
                  <input 
                    type="number" 
                    className="form-control style-review-input" 
                    placeholder="Enter marks scored..."
                    value={marks[selected.id] || ''} 
                    onChange={e => setMarks(prev => ({ ...prev, [selected.id]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))} 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-semibold">Teacher's Feedback & Comments</label>
                  <textarea 
                    className="form-control style-review-input" 
                    rows="4" 
                    placeholder="Provide constructive feedback..."
                    value={feedback[selected.id] || ''} 
                    onChange={e => setFeedback(prev => ({ ...prev, [selected.id]: e.target.value }))} 
                  />
                </div>

                <button className="btn btn-primary rounded-3 px-4 fw-semibold d-flex align-items-center gap-2" onClick={handleSaveGrading} disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-check-lg" />}
                  <span>Submit & Save Grading</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <i className="bi bi-file-earmark-text text-muted display-4 mb-2 d-block" />
              <h6 className="fw-bold text-white mb-1" style={{ color: 'var(--text)' }}>Select a submission to review</h6>
              <p className="text-muted small mb-0">Choose a student from the inbox panel to start grading.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const hrpStyles = `
.hrp-page .glass-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.hrp-page .card-header-custom { border-bottom: 1px solid var(--border) !important; }
.hrp-page .list-group-item:hover { background-color: var(--hover) !important; }
.hrp-page .list-group-item.active-item { background-color: var(--surface) !important; border-left: 3px solid var(--primary) !important; }
.hrp-page .style-review-input { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 10px; font-size: 14px; padding: 0.65rem 0.85rem; }
.hrp-page .style-review-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.hrp-page .style-review-input[readonly] { opacity: 0.65; cursor: not-allowed; }
`