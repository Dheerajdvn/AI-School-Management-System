import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="card h-100">
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div className="mb-2">
          <h5 className="fw-bold mb-1" style={{ fontSize: '14px', color: 'var(--text)' }}>Quick Actions</h5>
          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Deploy resources instantly</p>
        </div>
        <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <button className="btn btn-primary w-100 py-1.5" onClick={() => navigate('/admin/students')} style={{ fontSize: '11px', height: 'auto' }}>
            <i className="bi bi-person-plus me-1" /> Student
          </button>
          <button className="btn btn-secondary w-100 py-1.5" onClick={() => navigate('/admin/courses')} style={{ fontSize: '11px', height: 'auto' }}>
            <i className="bi bi-book me-1" /> Course
          </button>
          <button className="btn btn-outline-primary w-100 py-1.5" onClick={() => navigate('/admin/documents')} style={{ fontSize: '11px', height: 'auto' }}>
            <i className="bi bi-file-earmark-arrow-up me-1" /> Document
          </button>
          <button className="btn btn-outline-success w-100 py-1.5" onClick={() => navigate('/admin/chat')} style={{ fontSize: '11px', height: 'auto' }}>
            <i className="bi bi-chat-text me-1" /> AI Chat
          </button>
        </div>
      </div>
    </div>
  )
}