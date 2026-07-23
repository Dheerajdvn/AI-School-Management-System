import React, { useState, useEffect } from 'react'

export default function AIHomeworkHelperPage() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) setUploadedFile(file.name)
  }

  const handleGetHelp = () => {
    if (!uploadedFile && !question.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResult({
        solution: 'Step-by-step solution would appear here based on the uploaded homework or question.',
        hints: [
          'Consider the key concepts involved in this problem',
          'Review the relevant formulas and theorems',
          'Break the problem into smaller, manageable steps'
        ],
        concepts: ['Linear Equations', 'Algebraic Manipulation', 'Problem Solving Strategies'],
        commonMistakes: [
          'Forgetting to check units',
          'Incorrect application of formulas',
          'Calculation errors in final step'
        ]
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="aihh-page">
      <h4 className="mb-3"><i className="bi bi-lightbulb me-2" />AI Homework Helper</h4>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Upload Homework</h5></div>
        <div className="card-body">
          <label className="form-label">Upload your homework (PDF, DOCX, Images)</label>
          <input type="file" className="form-control" accept=".pdf,.docx,.doc,.jpg,.png" onChange={handleUpload} />
          {uploadedFile && <div className="mt-2 text-success"><i className="bi bi-check-circle me-1" />{uploadedFile}</div>}
        </div>
      </div>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Or ask a specific question</h5></div>
        <div className="card-body">
          <textarea className="form-control" rows="3" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your homework question here..." />
        </div>
      </div>

      <button className="btn btn-primary w-100 mb-3" onClick={handleGetHelp} disabled={(!uploadedFile && !question.trim()) || loading}>
        {loading ? <><span className="spinner-border spinner-border-sm me-1" />Getting Help...</> : <><i className="bi bi-magic me-1" />Get AI Help</>}
      </button>

      {result && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="glass-card">
              <div className="card-header-custom"><h5><i className="bi bi-journal-text me-2 text-primary" />Solution</h5></div>
              <div className="card-body"><p>{result.solution}</p></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-card mb-3">
              <div className="card-header-custom"><h5><i className="bi bi-lightbulb me-2 text-warning" />Hints</h5></div>
              <div className="card-body">
                <ul className="mb-0">
                  {result.hints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </div>
            <div className="glass-card mb-3">
              <div className="card-header-custom"><h5><i className="bi bi-book me-2 text-info" />Key Concepts</h5></div>
              <div className="card-body">
                {result.concepts.map((c, i) => <span key={i} className="badge bg-primary me-1 mb-1">{c}</span>)}
              </div>
            </div>
            <div className="glass-card">
              <div className="card-header-custom"><h5><i className="bi bi-exclamation-triangle me-2 text-danger" />Common Mistakes</h5></div>
              <div className="card-body">
                <ul className="mb-0">
                  {result.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{aihhStyles}</style>
    </div>
  )
}

const aihhStyles = `
.aihh-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.aihh-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.aihh-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.aihh-page .card-body { padding: 1.25rem; }
.aihh-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.aihh-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.aihh-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
`