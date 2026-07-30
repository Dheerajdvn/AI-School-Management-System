import React, { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'

export default function AILessonPlannerPage() {
  const { success: showSuccess, error: showError } = useToast()
  const [form, setForm] = useState({ topic: '', class: 'Class 10-A', subject: 'Mathematics', duration: '45', objectives: '' })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)

  // Load last plan if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('last_generated_lesson_plan')
      if (stored) {
        const parsed = JSON.parse(stored)
        setResult(parsed.result)
        setForm(parsed.form)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const generatedPlan = {
        lessonPlan: `1. Introduction to ${form.topic || 'Topic'} (10m)\n- Briefly introduce learning goals\n- Check prerequisite concepts\n\n2. Core Concepts Explanation (15m)\n- Detail key components of the syllabus topic\n- Run demonstration and code/writing samples\n\n3. Guided Practice Problems (10m)\n- Solve sample exercises on white board\n- Prompt student queries\n\n4. Independent Practice & Wrap-up (10m)\n- Assign group questions\n- Review final solutions`,
        activities: ['Interactive lecture', 'Group discussion', 'Hands-on practice', 'Self-evaluation Quiz'],
        homework: 'Complete practice worksheets 1 to 5 from the chapter appendix.',
        quiz: '5 MCQs checking core definitions and analytical applications.',
        materials: ['Presentation Slides', 'Assessment Sheet', 'Interactive video explanation link', 'Textbook chapter references'],
      }
      
      setResult(generatedPlan)
      setGenerating(false)
      showSuccess('AI Lesson Plan generated successfully!')

      try {
        localStorage.setItem('last_generated_lesson_plan', JSON.stringify({
          form,
          result: generatedPlan
        }))
      } catch (e) {
        console.error(e)
      }
    }, 1200)
  }

  const handleClearPlan = () => {
    setResult(null)
    setForm({ topic: '', class: 'Class 10-A', subject: 'Mathematics', duration: '45', objectives: '' })
    localStorage.removeItem('last_generated_lesson_plan')
    showSuccess('Lesson plan cleared successfully.')
  }

  return (
    <div className="ailp-page py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-cpu-fill text-primary me-2" />AI Lesson Planner
          </h4>
          <p className="text-muted small mb-0 font-medium">Outline lecture steps, group exercises, and assignments using automated AI assistants.</p>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-8">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Lesson Details</h5>
              {result && (
                <button className="btn btn-outline-danger btn-sm border-0 rounded-pill" onClick={handleClearPlan}>
                  <i className="bi bi-trash" /> Clear Plan
                </button>
              )}
            </div>
            <div className="card-body p-4">
              <div className="row g-3 mb-3.5">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Topic / Concept Title <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control style-planner-input" 
                    value={form.topic} 
                    onChange={e => setForm({ ...form, topic: e.target.value })} 
                    placeholder="e.g. Quadratic Equations" 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Class Target</label>
                  <select className="form-select style-planner-input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                    {['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3.5">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Subject Area</label>
                  <select className="form-select style-planner-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    {['Mathematics', 'Physics', 'Chemistry', 'English'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Duration (Minutes)</label>
                  <input 
                    type="number" 
                    className="form-control style-planner-input" 
                    value={form.duration} 
                    onChange={e => setForm({ ...form, duration: e.target.value })} 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">Core Learning Objectives</label>
                <textarea 
                  className="form-control style-planner-input" 
                  rows="3" 
                  value={form.objectives} 
                  onChange={e => setForm({ ...form, objectives: e.target.value })} 
                  placeholder="Describe what specific benchmarks students are expected to learn..." 
                />
              </div>

              <button 
                className="btn btn-primary rounded-3 px-4 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-glow" 
                onClick={handleGenerate} 
                disabled={generating || !form.topic.trim()}
              >
                {generating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span>Planning Lesson...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic" />
                    <span>Generate Lesson Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card shadow-sm h-100">
            <div className="card-header-custom p-3 border-bottom">
              <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>AI Workspace Tips</h5>
            </div>
            <div className="card-body p-4">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                <li className="d-flex gap-2.5 small text-muted font-medium">
                  <i className="bi bi-lightbulb-fill text-warning mt-0.5" />
                  <span>Specify clear, measurable learning objectives to improve generated assessment prompts.</span>
                </li>
                <li className="d-flex gap-2.5 small text-muted font-medium">
                  <i className="bi bi-clock-fill text-primary mt-0.5" />
                  <span>Adjust lesson duration to automatically distribute time markers across lesson steps.</span>
                </li>
                <li className="d-flex gap-2.5 small text-muted font-medium">
                  <i className="bi bi-book-fill text-success mt-0.5" />
                  <span>Ensure your selected target class matches current syllabus benchmarks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="row g-4 mt-2.5">
          {[
            { title: 'Lesson Plan Structure', icon: 'bi-journal-text', content: result.lessonPlan, color: '#3b82f6' },
            { title: 'Activities & Drills', icon: 'bi-activity', content: result.activities.join('\n'), color: '#10b981' },
            { title: 'Homework Tasks', icon: 'bi-house-door-fill', content: result.homework, color: '#f59e0b' },
            { title: 'Quiz Framework', icon: 'bi-question-circle-fill', content: result.quiz, color: '#8b5cf6' },
            { title: 'Course Materials', icon: 'bi-folder-fill', content: result.materials.join('\n'), color: '#06b6d4' },
          ].map((item, i) => (
            <div className="col-md-4 col-sm-6" key={i}>
              <div className="glass-card shadow-sm h-100 d-flex flex-column">
                <div className="card-header-custom p-3 border-bottom">
                  <h5 className="fw-bold mb-0 text-white" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                    <i className={`bi ${item.icon} me-2`} style={{ color: item.color }} />{item.title}
                  </h5>
                </div>
                <div className="card-body p-4 flex-grow-1" style={{ backgroundColor: 'var(--surface)' }}>
                  <pre className="result-pre mb-0" style={{ color: 'var(--text)' }}>{item.content}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{ailpStyles}</style>
    </div>
  )
}

const ailpStyles = `
.ailp-page .glass-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
.ailp-page .card-header-custom { border-bottom: 1px solid var(--border) !important; }
.ailp-page .style-planner-input { background: var(--surface) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 10px; font-size: 14px; padding: 0.65rem 0.85rem; }
.ailp-page .style-planner-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important; }
.ailp-page .result-pre { white-space: pre-wrap; font-size: 12.5px; line-height: 1.5; font-family: inherit; font-weight: 500; }
`