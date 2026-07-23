import React, { useState } from 'react'

export default function AILessonPlannerPage() {
  const [form, setForm] = useState({ topic: '', class: 'Class 10-A', subject: 'Mathematics', duration: '45', objectives: '' })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setResult({
        lessonPlan: `1. Introduction to ${form.topic || 'Topic'}\n2. Explain core concepts with examples\n3. Guided practice problems\n4. Independent practice\n5. Recap and homework assignment`,
        activities: ['Interactive lecture', 'Group discussion', 'Hands-on practice', 'Quiz'],
        homework: 'Complete exercises 1-10 from textbook',
        quiz: '5 MCQs based on today\'s lesson',
        materials: ['Slides', 'Worksheet', 'Video explanation', 'Reference book chapter'],
      })
      setGenerating(false)
    }, 1500)
  }

  return (
    <div className="ailp-page">
      <h4 className="mb-3"><i className="bi bi-robot me-2" />AI Lesson Planner</h4>
      <div className="row g-3">
        <div className="col-md-8">
          <div className="glass-card">
            <div className="card-header-custom"><h5>Lesson Details</h5></div>
            <div className="card-body">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Topic <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Quadratic Equations" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Class</label>
                  <select className="form-select" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                    {['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 12-A'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    {['Mathematics', 'Physics', 'Chemistry', 'English'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Duration (minutes)</label>
                  <input type="number" className="form-control" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Learning Objectives</label>
                <textarea className="form-control" rows="2" value={form.objectives} onChange={e => setForm({ ...form, objectives: e.target.value })} placeholder="What will students learn?" />
              </div>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating || !form.topic.trim()}>
                {generating ? <><span className="spinner-border spinner-border-sm me-1" />Generating...</> : <><i className="bi bi-magic me-1" />Generate Lesson Plan</>}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card">
            <div className="card-header-custom"><h5>Quick Tips</h5></div>
            <div className="card-body">
              <p className="small opacity-75">Enter a topic and let AI generate a complete lesson plan with activities, homework, quiz, and teaching materials.</p>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="row g-3 mt-2">
          {[
            { title: 'Lesson Plan', icon: 'bi-journal-text', content: result.lessonPlan, color: 'blue' },
            { title: 'Activities', icon: 'bi-activity', content: result.activities.join('\n'), color: 'green' },
            { title: 'Homework', icon: 'bi-house', content: result.homework, color: 'orange' },
            { title: 'Quiz', icon: 'bi-question-circle', content: result.quiz, color: 'purple' },
            { title: 'Materials', icon: 'bi-folder', content: result.materials.join('\n'), color: 'cyan' },
          ].map((item, i) => (
            <div className="col-md-4 col-sm-6" key={i}>
              <div className="glass-card h-100">
                <div className="card-header-custom"><h5><i className={`bi ${item.icon} me-2 text-${item.color}`} />{item.title}</h5></div>
                <div className="card-body"><pre className="result-pre">{item.content}</pre></div>
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
.ailp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.ailp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.ailp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.ailp-page .card-body { padding: 1.25rem; }
.ailp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.ailp-page .result-pre { white-space: pre-wrap; font-size: 0.85rem; opacity: 0.9; margin: 0; font-family: inherit; }
`