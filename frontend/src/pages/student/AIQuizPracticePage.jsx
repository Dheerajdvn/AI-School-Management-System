import React, { useState, useEffect } from 'react'

export default function AIQuizPracticePage() {
  const [settings, setSettings] = useState({ subject: 'Mathematics', topic: 'Algebra', difficulty: 'Medium', questionCount: '5' })
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const generated = [
        { id: 1, question: `What is 2 + 2?`, options: ['3', '4', '5', '6'], correct: 1, explanation: '2 + 2 = 4. This is basic addition.' },
        { id: 2, question: `Solve: x + 5 = 10`, options: ['x = 3', 'x = 5', 'x = 15', 'x = -5'], correct: 1, explanation: 'Subtract 5 from both sides: x = 10 - 5 = 5.' },
        { id: 3, question: `What is 3 × 4?`, options: ['7', '12', '10', '14'], correct: 1, explanation: '3 × 4 = 12. Multiplication is repeated addition.' },
        { id: 4, question: `Simplify: 2x + 3x`, options: ['5x', '6x', 'x', '10x'], correct: 0, explanation: 'Combine like terms: 2x + 3x = 5x.' },
        { id: 5, question: `What is 15 ÷ 3?`, options: ['3', '4', '5', '6'], correct: 2, explanation: '15 ÷ 3 = 5. Division is the inverse of multiplication.' },
      ]
      setQuestions(generated.slice(0, parseInt(settings.questionCount) || 5))
      setQuizStarted(true)
      setIsGenerating(false)
    }, 1000)
  }

  const handleAnswer = (qid, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [qid]: optionIndex }))
    
    // Automatically advance or complete after delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        // Calculate correct count
        // Note: we must use the freshly updated answers including this one
        const finalAnswers = { ...selectedAnswers, [qid]: optionIndex }
        const correct = questions.filter(q => finalAnswers[q.id] === q.correct).length
        setScore(correct)
      }
    }, 800)
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
      <div className="aiqp-page py-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
              <i className="bi bi-question-circle-fill text-primary me-2" />AI Quiz Practice
            </h4>
            <p className="text-muted small mb-0 font-medium">Build self-assessment quizzes generated on demand using advanced RAG models.</p>
          </div>
        </div>

        <div className="glass-card shadow-sm max-w-lg mx-auto">
          <div className="card-header-custom p-3 border-bottom">
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Quiz Settings</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3 mb-3.5">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-semibold">Subject</label>
                <select className="form-select style-quiz-input" value={settings.subject} onChange={e => setSettings({ ...settings, subject: e.target.value })}>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-semibold">Topic / Concept</label>
                <input type="text" className="form-control style-quiz-input" value={settings.topic} onChange={e => setSettings({ ...settings, topic: e.target.value })} placeholder="e.g. Algebra" />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-semibold">Difficulty</label>
                <select className="form-select style-quiz-input" value={settings.difficulty} onChange={e => setSettings({ ...settings, difficulty: e.target.value })}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-semibold">Question Count</label>
                <select className="form-select style-quiz-input" value={settings.questionCount} onChange={e => setSettings({ ...settings, questionCount: e.target.value })}>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary w-100 rounded-3 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-glow" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
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
        <style>{aiqpStyles}</style>
      </div>
    )
  }

  if (score !== null) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="aiqp-page py-4">
        <h4 className="fw-bold mb-4" style={{ color: 'var(--text)' }}><i className="bi bi-trophy-fill text-warning me-2" />Quiz Complete!</h4>
        <div className="glass-card shadow-sm text-center py-5 max-w-lg mx-auto">
          <div className="card-body">
            <i className="bi bi-trophy-fill text-warning mb-3 d-block" style={{ fontSize: '4.5rem' }} />
            <h3 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>Your Score: {score} / {questions.length}</h3>
            <p className="text-muted font-semibold mb-4">{percentage}% Correct Answer Ratio</p>
            <button className="btn btn-primary rounded-3 px-4 py-2 fw-semibold" onClick={resetQuiz}>Try Another Session</button>
          </div>
        </div>
        <style>{aiqpStyles}</style>
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div className="aiqp-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>
          <i className="bi bi-question-circle-fill text-primary me-2" />Question {currentIndex + 1} of {questions.length}
        </h4>
        <span className="badge rounded-pill bg-primary bg-opacity-15 text-primary border border-primary border-opacity-35 px-3 py-1.5 fw-bold">
          Progress: {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="glass-card shadow-sm mb-4 max-w-lg mx-auto">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4" style={{ color: 'var(--text)', lineHeight: '1.4' }}>{q.question}</h5>
          <div className="options-list d-flex flex-column gap-2.5">
            {q.options.map((opt, i) => {
              const hasAnswered = selectedAnswers[q.id] !== undefined
              const isSelected = selectedAnswers[q.id] === i
              const isCorrect = q.correct === i
              
              let btnClass = ''
              if (hasAnswered) {
                if (isCorrect) btnClass = 'correct'
                else if (isSelected) btnClass = 'wrong'
              }

              return (
                <button 
                  key={i} 
                  className={`option-btn ${btnClass}`} 
                  onClick={() => !hasAnswered && handleAnswer(q.id, i)} 
                  disabled={hasAnswered}
                >
                  <span className="option-label">{String.fromCharCode(65 + i)}</span>
                  <span className="option-text">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <style>{aiqpStyles}</style>
    </div>
  )
}

const aiqpStyles = `
.aiqp-page .glass-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.aiqp-page .card-header-custom { border-bottom: 1px solid var(--border) !important; }
.aiqp-page .style-quiz-input { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 10px; font-size: 14px; padding: 0.6rem 0.85rem !important; height: auto !important; line-height: 1.5 !important; }
.aiqp-page select.style-quiz-input { padding-right: 2.25rem !important; }
.aiqp-page .style-quiz-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.aiqp-page .options-list { display: flex; flex-direction: column; gap: 0.75rem; }
.aiqp-page .option-btn { display: flex; align-items: center; gap: 1rem; padding: 0.95rem 1.25rem; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); color: var(--text); text-align: left; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
.aiqp-page .option-btn:hover:not(:disabled) { background: var(--hover); border-color: var(--primary); }
.aiqp-page .option-btn.correct { background: rgba(16, 185, 129, 0.12) !important; border-color: #10b981 !important; color: #10b981 !important; font-weight: 600; }
.aiqp-page .option-btn.wrong { background: rgba(239, 68, 68, 0.12) !important; border-color: #ef4444 !important; color: #ef4444 !important; font-weight: 600; }
.aiqp-page .option-label { width: 28px; height: 28px; border-radius: 6px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.15); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); font-size: 13px; }
.aiqp-page .option-btn.correct .option-label { background: #10b981; color: #ffffff; border-color: #10b981; }
.aiqp-page .option-btn.wrong .option-label { background: #ef4444; color: #ffffff; border-color: #ef4444; }
.aiqp-page .option-text { font-size: 13.5px; font-weight: 500; }
.max-w-lg { max-width: 580px; }
`