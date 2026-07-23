import React, { useState } from 'react'

export default function PracticeTests() {
  const [practiceTests] = useState([
    { id: 1, subject: 'Mathematics', topic: 'Algebra', questions: 25, duration: '30 min', difficulty: 'Medium' },
    { id: 2, subject: 'Physics', topic: 'Mechanics', questions: 20, duration: '25 min', difficulty: 'Easy' },
    { id: 3, subject: 'Chemistry', topic: 'Periodic Table', questions: 30, duration: '40 min', difficulty: 'Hard' },
    { id: 4, subject: 'Biology', topic: 'Cell Structure', questions: 15, duration: '20 min', difficulty: 'Easy' },
    { id: 5, subject: 'English', topic: 'Grammar', questions: 40, duration: '45 min', difficulty: 'Medium' },
  ])

  const getDifficultyBadge = (difficulty) => {
    const style = {
      Easy: 'bg-success',
      Medium: 'bg-warning text-dark',
      Hard: 'bg-danger',
    }[difficulty] || 'bg-secondary'
    return <span className={"badge " + style}>{difficulty}</span>
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Practice Tests</h2>
        <div className="text-muted">
          <i className="bi bi-info-circle me-1" />
          Improve your skills with practice tests
        </div>
      </div>

      <div className="row g-3">
        {practiceTests.map((test) => (
          <div className="col-md-6 col-lg-4" key={test.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title mb-1">{test.subject}</h5>
                    <p className="text-muted small mb-0">{test.topic}</p>
                  </div>
                  <div className="bg-info bg-opacity-10 p-2 rounded">
                    <i className="bi bi-question-circle text-info" style={{ fontSize: '1.25rem' }} />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Questions</span>
                    <span className="fw-medium">{test.questions}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Duration</span>
                    <span className="fw-medium">{test.duration}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Difficulty</span>
                    <span>{getDifficultyBadge(test.difficulty)}</span>
                  </div>
                </div>
                <button className="btn btn-primary w-100">Start Practice</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {practiceTests.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-question-circle text-muted" style={{ fontSize: '3rem' }} />
          <p className="text-muted mt-3">No practice tests available</p>
        </div>
      )}
    </div>
  )
}