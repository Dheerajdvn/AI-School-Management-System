import React, { useState } from 'react'
import { useToast } from '../../hooks/useToast'

export default function AIQuizGeneratorPage() {
  const { success: showSuccess, error: showError } = useToast()
  const [form, setForm] = useState({ topic: '', difficulty: 'Medium', questionCount: '5', class: 'Class 10-A', subject: 'Mathematics' })
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState([])
  const [saving, setSaving] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const generated = [
        { id: 1, question: `What is the fundamental concept of ${form.topic || 'this topic'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0 },
        { id: 2, question: `Which of the following best describes ${form.topic || 'this concept'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 1 },
        { id: 3, question: `How does ${form.topic || 'this topic'} apply in real-world scenarios?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 2 },
        { id: 4, question: `What is the primary advantage of ${form.topic || 'this concept'}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 1 },
        { id: 5, question: `Which statement about ${form.topic || 'this topic'} is correct?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 3 },
      ]
      setQuestions(generated.slice(0, parseInt(form.questionCount) || 5))
      setGenerating(false)
      showSuccess(`Successfully generated ${form.questionCount} quiz questions using AI!`)
    }, 1200)
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q))
  }

  const updateOption = (qid, idx, value) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, options: q.options.map((o, i) => i === idx ? value : o) } : q))
  }

  const handleCorrectSelect = (qid, idx) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, correct: idx } : q))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      try {
        const payload = {
          topic: form.topic,
          difficulty: form.difficulty,
          class: form.class,
          subject: form.subject,
          questions
        }
        const stored = localStorage.getItem('generated_quizzes')
        const currentList = stored ? JSON.parse(stored) : []
        currentList.unshift(payload)
        localStorage.setItem('generated_quizzes', JSON.stringify(currentList))
        showSuccess('AI Generated Quiz successfully saved and published!')
      } catch (e) {
        showError('Failed to save generated quiz')
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  return (
    <div className="aiqg-page py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-question-circle-fill text-primary me-2" />AI Quiz Generator
          </h4>
          <p className="text-muted small mb-0 font-medium">Draft dynamic question sheets instantly using customizable AI templates.</p>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Quiz Settings</h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-3.5">
                <label className="form-label text-muted small fw-semibold">Topic / Core Concept <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control style-quiz-input" 
                  value={form.topic} 
                  onChange={e => setForm({ ...form, topic: e.target.value })} 
                  placeholder="e.g., Quadratic Equations" 
                />
              </div>

              <div className="row g-3 mb-3.5">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Class Target</label>
                  <select className="form-select style-quiz-input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                    {['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Subject</label>
                  <select className="form-select style-quiz-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    {['Mathematics', 'Physics', 'Chemistry', 'English'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Difficulty</label>
                  <select className="form-select style-quiz-input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-semibold">Question Count</label>
                  <select className="form-select style-quiz-input" value={form.questionCount} onChange={e => setForm({ ...form, questionCount: e.target.value })}>
                    {[3, 5, 10, 15].map(n => <option key={n} value={n}>{n} Questions</option>)}
                  </select>
                </div>
              </div>

              <button 
                className="btn btn-primary w-100 rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-glow" 
                onClick={handleGenerate} 
                disabled={generating || !form.topic.trim()}
              >
                {generating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {questions.length === 0 ? (
            <div className="empty-state text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <i className="bi bi-cpu text-muted display-4 mb-2 d-block" />
              <h6 className="fw-bold text-white mb-1" style={{ color: 'var(--text)' }}>AI Workspace Ready</h6>
              <p className="text-muted small mb-0">Configure settings and click "Generate Quiz" to load questions here.</p>
            </div>
          ) : (
            <div className="questions-list d-flex flex-column gap-3.5">
              {questions.map((q, idx) => (
                <div key={q.id} className="question-card glass-card shadow-sm">
                  <div className="card-header-custom p-3 border-bottom d-flex align-items-center justify-content-between">
                    <span className="small text-muted font-bold">Question {idx + 1}</span>
                    <span className="badge rounded-pill bg-success bg-opacity-15 text-success border border-success border-opacity-25 py-1 px-2.5">
                      Correct Answer: Option {String.fromCharCode(65 + q.correct)}
                    </span>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-3.5">
                      <label className="form-label text-muted small fw-semibold">Question Prompt</label>
                      <input 
                        type="text" 
                        className="form-control style-quiz-input w-100" 
                        value={q.question} 
                        onChange={e => updateQuestion(q.id, 'question', e.target.value)} 
                      />
                    </div>
                    
                    <div className="row g-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className="col-md-6">
                          <div className="input-group input-group-sm">
                            <span 
                              className="input-group-text cursor-pointer transition" 
                              onClick={() => handleCorrectSelect(q.id, i)}
                              style={{ 
                                backgroundColor: q.correct === i ? '#10b981' : 'var(--surface)', 
                                borderColor: 'var(--border)', 
                                color: q.correct === i ? '#ffffff' : 'var(--text)',
                                fontSize: '11px',
                                fontWeight: '700',
                                minWidth: '36px',
                                justifyContent: 'center'
                              }}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <input 
                              type="text" 
                              className="form-control style-quiz-input" 
                              value={opt} 
                              onChange={e => updateOption(q.id, i, e.target.value)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                className="btn btn-primary rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-glow mb-4" 
                onClick={handleSave} 
                disabled={saving}
              >
                {saving ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-cloud-arrow-up-fill" />}
                <span>Save & Publish Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{aiqgStyles}</style>
    </div>
  )
}

const aiqgStyles = `
.aiqg-page .glass-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.aiqg-page .card-header-custom { border-bottom: 1px solid var(--border) !important; }
.aiqg-page .style-quiz-input { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 10px; font-size: 14px; padding: 0.6rem 0.85rem !important; height: auto !important; line-height: 1.5 !important; }
.aiqg-page select.style-quiz-input { padding-right: 2.25rem !important; }
.aiqg-page .style-quiz-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.aiqg-page .question-card { transition: all 0.25s ease; }
.aiqg-page .question-card:hover { border-color: var(--primary); }
`