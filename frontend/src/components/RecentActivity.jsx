import React from 'react'
import { formatDate } from '../utils/format'

export default function RecentActivity({ documents = [], students = [] }) {
  const getAiActivity = () => {
    if (documents && documents.length > 0) {
      return documents.slice(0, 4).map((doc, idx) => {
        let action = 'RAG Document processed';
        let type = 'success';
        if (doc.status === 'PROCESSING') {
          action = 'RAG Embedding processing';
          type = 'primary';
        } else if (doc.status === 'FAILED') {
          action = 'RAG Embedding failed';
          type = 'danger';
        } else if (doc.status === 'PENDING') {
          action = 'RAG Document queued';
          type = 'warning';
        } else if (doc.status === 'COMPLETED') {
          action = 'RAG Embedding generated';
          type = 'success';
        }

        return {
          id: doc.id || idx,
          action: action,
          target: doc.name || 'document.pdf',
          time: doc.uploadTime ? formatDate(doc.uploadTime) : 'Just now',
          type: type
        };
      });
    }
    return [
      { id: 1, action: 'RAG Embedding generated', target: 'Physics_Chapter4.pdf', time: '2 mins ago', type: 'success' },
      { id: 2, action: 'AI Quiz generated', target: 'Calculus Midterm Quiz', time: '12 mins ago', type: 'primary' },
      { id: 3, action: 'Automated Homework Review', target: 'Assignment #3 (Batch B)', time: '35 mins ago', type: 'info' },
      { id: 4, action: 'Vector search query completed', target: 'Query: "Quantum Mechanics"', time: '1 hour ago', type: 'warning' },
    ];
  };

  const activeUsersList = students.length > 0 ? students.slice(0, 4).map((s, idx) => ({
    id: s.id || idx,
    name: s.name || s.username || 'Student',
    role: s.role || 'Student',
    status: s.enabled !== false ? 'Online' : 'Offline'
  })) : [
    { id: 1, name: 'Alex Johnson', role: 'Student', status: 'Online' },
    { id: 2, name: 'Dr. Sarah Connor', role: 'Teacher', status: 'Online' },
    { id: 3, name: 'Michael Smith', role: 'Student', status: 'Active 5m ago' },
    { id: 4, name: 'Principal Skinner', role: 'Principal', status: 'Online' },
  ];

  const aiActivity = getAiActivity();

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title fw-bold m-0" style={{ fontSize: '14px' }}>Recent AI Activity & Active Users</h5>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill small">Live Stream</span>
        </div>

        <div className="row g-3">
          <div className="col-lg-7">
            <h6 className="text-muted small text-uppercase fw-semibold mb-2">Recent AI Processing & RAG Events</h6>
            <div className="list-group list-group-flush rounded-3 border bg-surface overflow-hidden">
              {aiActivity.map((item) => (
                <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-2 px-sm-3 border-bottom gap-2">
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    <div className={`spinner-dot bg-${item.type} flex-shrink-0`} style={{ width: 8, height: 8, borderRadius: '50%' }} />
                    <div className="min-w-0">
                      <div className="fw-semibold small text-dark text-truncate">{item.action}</div>
                      <div className="text-muted text-xs text-truncate">{item.target}</div>
                    </div>
                  </div>
                  <span className="text-muted text-xs flex-shrink-0 text-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <h6 className="text-muted small text-uppercase fw-semibold mb-2">Active Users Online</h6>
            <div className="list-group list-group-flush rounded-3 border bg-surface overflow-hidden">
              {activeUsersList.map((u, idx) => (
                <div key={u.id || idx} className="list-group-item d-flex justify-content-between align-items-center py-2 px-2 px-sm-3 border-bottom gap-2">
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    <div className="avatar-circle flex-shrink-0" style={{ width: 28, height: 28, fontSize: '11px' }}>
                      {(u.name || 'U').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="fw-semibold small text-dark text-truncate">{u.name}</div>
                      <div className="text-muted text-xs text-truncate">{u.role}</div>
                    </div>
                  </div>
                  <span className="badge bg-success-subtle text-success text-xs rounded-pill px-2 flex-shrink-0">{u.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

