import React from 'react'

const DueDateBadge = ({ dueDate }) => {
  if (!dueDate) return <span className="text-muted">—</span>
  const d = new Date(dueDate)
  const now = new Date()
  const diff = d - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const cls = diff < 0 ? 'badge bg-danger' : days <= 3 ? 'badge bg-warning text-dark' : 'badge bg-success'
  return <span className={cls}>{d.toLocaleString()}</span>
}

export default DueDateBadge
