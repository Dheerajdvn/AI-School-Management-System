import React, { useState, useEffect } from 'react'

export default function AssignmentSubmissionPage() {
  const [loading, setLoading] = useState(true)
  const [assignment, setAssignment] = useState(null)
  const [history, setHistory] = useState([])
  const [comment, setComment] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignment({
        id: 1,
        title: 'Algebra Worksheet',
        class: 'Mathematics',
        teacher: 'Mr. David Lee',
        dueDate: '2026-07-28',
        instructions: 'Complete all problems from Chapter 5. Show all steps.'
      })
      setHistory([
        { id: 1, fileName: 'algebra_v1.pdf', submittedAt: '2026-07-20', status: 'Submitted' },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedFile(file.name)
  }

  const handleSubmit = () => {
    if (!selectedFile) return alert('Please select a file')
    const newSubmission = {
      id: history.length + 1,
      fileName: selectedFile,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Submitted'
    }
    setHistory(prev => [...prev, newSubmission])
    setSelectedFile(null)
    setComment('')
  }

  if (loading) {
    return (
      <div className="asp-page">
        <div className="skeleton-row" />
        <style>{aspStyles}</style>
      </div>
    )
  }

  return (
    <div className="asp-page">
      <h4 className="mb-3"><i className="bi bi-upload me-2" />Submit Assignment</h4>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>{assignment.title}</h5></div>
        <div className="card-body">
          <p className="mb-2"><strong>Class:</strong> {assignment.class} | <strong>Teacher:</strong> {assignment.teacher}</p>
          <p className="mb-0"><strong>Due Date:</strong> {assignment.dueDate}</p>
          <div className="mt-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>Instructions:</strong>
            <p className="mb-0 mt-1">{assignment.instructions}</p>
          </div>
        </div>
      </div>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Upload Submission</h5></div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Select File (PDF, DOCX, Images, ZIP)</label>
            <input type="file" className="form-control" accept=".pdf,.docx,.doc,.jpg,.png,.zip" onChange={handleFileChange} />
            {selectedFile && <div className="mt-2 text-success"><i className="bi bi-check-circle me-1" />{selectedFile}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Comments (optional)</label>
            <textarea className="form-control" rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add any comments for your teacher..." />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!selectedFile}>
            <i className="bi bi-check-lg me-1" />Submit Assignment
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header-custom"><h5>Submission History</h5></div>
        <div className="card-body p-0">
          {history.map(h => (
            <div key={h.id} className="history-item">
              <div className="history-icon"><i className="bi bi-file-earmark" /></div>
              <div className="history-info">
                <strong>{h.fileName}</strong>
                <span className="small opacity-75">Submitted on {h.submittedAt}</span>
              </div>
              <span className="badge bg-success">{h.status}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{aspStyles}</style>
    </div>
  )
}

const aspStyles = `
.asp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.asp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.asp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.asp-page .card-body { padding: 1.25rem; }
.asp-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.asp-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.asp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.asp-page .history-item { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.asp-page .history-item:last-child { border-bottom: none; }
.asp-page .history-icon { font-size: 1.5rem; color: #60a5fa; }
.asp-page .history-info { flex: 1; display: flex; flex-direction: column; }
.asp-page .skeleton-row { height: 200px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`