import React, { useState } from 'react'

export default function AIQuizGeneratorPage() {
  const [form, setForm] = useState({ topic: '', difficulty: 'Medium', questionCount: '5', class: 'Class 10-A', subject: 'Mathematics' })
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState([])
  const [saved, setSaved] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const difficulty = form.difficulty
      const generated = [
        { id: 1, question: `What is the fundamental concept of ${form.topic || 'this topic'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0 },
        { id: 2, question: `Which of the following best describes ${form.topic || 'this concept'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 1 },
        { id: 3, question: `How does ${form.topic || 'this topic'} apply in real-world scenarios?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 2 },
        { id: 4, question: `What is the primary advantage of ${form.topic || 'this concept'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 1 },
        { id: 5, question: `Which statement about ${form.topic || 'this topic'} is correct?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 3 },
      ]
      setQuestions(generated)
      setGenerating(false)
    }, 1500)
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q))
  }

  const updateOption = (qid, idx, value) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, options: q.options.map((o, i) => i === idx ? value : o) } : q))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="aiqg-page">
      <h4 className="mb-3"><i className="bi bi-question-circle me-2" />AI Quiz Generator</h4>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="glass-card">
            <div className="card-header-custom"><h5>Quiz Settings</h5></div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Topic <span className="text-danger">*</span></label>
                <input type="text" className="form-control" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Quadratic Equations" />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Class</label>
                  <select className="form-select" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                    {['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    {['Mathematics', 'Physics', 'Chemistry', 'English'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Questions</label>
                  <select className="form-select" value={form.questionCount} onChange={e => setForm({ ...form, questionCount: e.target.value })}>
                    {[3, 5, 10, 15].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary w-100" onClick={handleGenerate} disabled={generating || !form.topic.trim()}>
                {generating ? <><span className="spinner-border spinner-border-sm me-1" />Generating...</> : <><i className="bi bi-magic me-1" />Generate Quiz</>}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          {questions.length === 0 ? (
            <div className="empty-state"><i className="bi bi-question-circle" /><h6>Configure settings and generate quiz</h6></div>
          ) : (
            <div className="questions-list">
              {saved && <div className="alert alert-success"><i className="bi bi-check-circle-fill me-2" />Quiz saved successfully.</div>}
              {questions.map((q, idx) => (
                <div key={q.id} className="question-card glass-card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">Q{idx + 1}. <input type="text" className="form-control d-inline-block w-auto" value={q.question} onChange={e => updateQuestion(q.id, 'question', e.target.value)} /></h6>
                      <span className="badge bg-primary rounded-pill">Correct: {q.correct + 1}</span>
                    </div>
                    {q.options.map((opt, i) => (
                      <div key={i} className="input-group mb-2">
                        <span className={`input-group-text ${q.correct === i ? 'bg-success text-white' : ''}`}>{String.fromCharCode(65 + i)}</span>
                        <input type="text" className="form-control" value={opt} onChange={e => updateOption(q.id, i, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn btn-primary w-100" onClick={handleSave}><i className="bi bi-check-lg me-1" />Save Quiz</button>
            </div>
          )}
        </div>
      </div>
      <style>{aiqgStyles}</style>
    </div>
  )
}

const aiqgStyles = `
.aiqg-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.aiqg-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.aiqg-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.aiqg-page .card-body { padding: 1.25rem; }
.aiqg-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.aiqg-page .question-card { transition: all 0.3s; }
.aiqg-page .question-card:hover { border-color: rgba(59,130,246,0.3); }
.aiqg-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.aiqg-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.aiqg-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; background: rgba(255,255,255,0.06); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.aiqg-page .empty-state i { font-size: 3rem; opacity: 0.3; margin-bottom: 0.5rem; }
`