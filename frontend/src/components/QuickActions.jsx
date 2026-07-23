import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Quick Actions</h5>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={() => navigate('/admin/students')}>Add Student</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/courses')}>Add Course</button>
          <button className="btn btn-outline-primary" onClick={() => navigate('/admin/documents')}>Upload Document</button>
          <button className="btn btn-outline-success" onClick={() => navigate('/admin/chat')}>Open AI Chat</button>
        </div>
      </div>
    </div>
  )
}