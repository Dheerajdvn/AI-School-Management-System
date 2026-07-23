import React, { useState, useEffect } from 'react'

export default function AIQuizPracticePage() {
  const [settings, setSettings] = useState({ subject: 'Mathematics', topic: 'Algebra', difficulty: 'Medium', questionCount: '5' })
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(null)

  const handleGenerate = () => {
    const generated = [
      { id: 1, question: `What is 2 + 2?`, options: ['3', '4', '5', '6'], correct: 1, explanation: '2 + 2 = 4. This is basic addition.' },
      { id: 2, question: `Solve: x + 5 = 10`, options: ['x = 3', 'x = 5', 'x = 15', 'x = -5'], correct: 1, explanation: 'Subtract 5 from both sides: x = 10 - 5 = 5.' },
      { id: 3, question: `What is 3 × 4?`, options: ['7', '12', '10', '14'], correct: 1, explanation: '3 × 4 = 12. Multiplication is repeated addition.' },
      { id: 4, question: `Simplify: 2x + 3x`, options: ['5x', '6x', 'x', '10x'], correct: 0, explanation: 'Combine like terms: 2x + 3x = 5x.' },
      { id: 5, question: `What is 15 ÷ 3?`, options: ['3', '4', '5', '6'], correct: 2, explanation: '15 ÷ 3 = 5. Division is the inverse of multiplication.' },
    ]
    setQuestions(generated)
    setQuizStarted(true)
  }

  const handleAnswer = (qid, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [qid]: optionIndex }))
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        const correct = questions.filter(q => selectedAnswers[q.id] === q.correct).length
        setScore(correct)
      }
    }, 500)
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswers({})
    setScore(null)
  }

  if (!quizStarted) {
    return (
      <div className="aiqp-page">
        <h4 className="mb-3"><i className="bi bi-question-circle me-2" />AI Quiz Practice</h4>
        <div className="glass-card">
          <div className="card-header-custom"><h5>Quiz Settings</h5></div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Subject</label>
                <select className="form-select" value={settings.subject} onChange={e => setSettings({ ...settings, subject: e.target.value })}>
                  <option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>English</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Topic</label>
                <input type="text" className="form-control" value={settings.topic} onChange={e => setSettings({ ...settings, topic: e.target.value })} />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Difficulty</label>
                <select className="form-select" value={settings.difficulty} onChange={e => setSettings({ ...settings, difficulty: e.target.value })}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Questions</label>
                <select className="form-select" value={settings.questionCount} onChange={e => setSettings({ ...settings, questionCount: e.target.value })}>
                  <option>5</option><option>10</option><option>15</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary w-100" onClick={handleGenerate}><i className="bi bi-magic me-1" />Generate Quiz</button>
          </div>
        </div>
        <style>{aiqpStyles}</style>
      </div>
    )
  }

  if (score !== null) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="aiqp-page">
        <h4 className="mb-3"><i className="bi bi-trophy me-2" />Quiz Complete!</h4>
        <div className="glass-card text-center py-5">
          <div className="card-body">
            <i className="bi bi-trophy-fill" style={{ fontSize: '4rem', color: '#fbbf24', marginBottom: '1rem' }} />
            <h3>Your Score: {score}/{questions.length}</h3>
            <p className="opacity-75">{percentage}% correct</p>
            <button className="btn btn-primary mt-3" onClick={resetQuiz}>Try Again</button>
          </div>
        </div>
        <style>{aiqpStyles}</style>
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div className="aiqp-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4><i className="bi bi-question-circle me-2" />Question {currentIndex + 1}/{questions.length}</h4>
        <span className="badge bg-primary">Progress: {currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="glass-card mb-3">
        <div className="card-body">
          <h5 className="mb-4">{q.question}</h5>
          <div className="options-list">
            {q.options.map((opt, i) => (
              <button key={i} className={`option-btn ${selectedAnswers[q.id] === i ? (i === q.correct ? 'correct' : 'wrong') : ''}`} onClick={() => !selectedAnswers[q.id] && selectedAnswers[q.id] !== q.correct && handleAnswer(q.id, i)} disabled={selectedAnswers[q.id] !== undefined}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{aiqpStyles}</style>
    </div>
  )
}

const aispStyles = `
.aiqp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.aiqp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.aiqp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.aiqp-page .card-body { padding: 1.25rem; }
.aiqp-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.aiqp-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.aiqp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.aiqp-page .options-list { display: flex; flex-direction: column; gap: 0.75rem; }
.aiqp-page .option-btn { padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: inherit; text-align: left; transition: all 0.3s; cursor: pointer; }
.aiqp-page .option-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); border-color: rgba(59,130,246,0.3); }
.aiqp-page .option-btn.correct { background: rgba(16,185,129,0.2); border-color: #34d399; }
.aiqp-page .option-btn.wrong { background: rgba(239,68,68,0.2); border-color: #f87171; }
`

const aihhStyles = `
.aihh-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.aihh-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.aihh-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.aihh-page .card-body { padding: 1.25rem; }
.aihh-page .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.aihh-page .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.aihh-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
`