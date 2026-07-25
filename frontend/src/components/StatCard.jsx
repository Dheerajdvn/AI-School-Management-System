import React from 'react'

const COLORS = {
  primary: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
  success: 'linear-gradient(135deg,#10b981,#059669)',
  warning: 'linear-gradient(135deg,#f59e0b,#d97706)',
  info: 'linear-gradient(135deg,#22d3ee,#0891b2)',
  danger: 'linear-gradient(135deg,#ef4444,#dc2626)',
}

export default function StatCard({ icon, label, value, color = 'primary', onClick, active = false }) {
  return (
    <div 
      className={`stat-card ${active ? 'active' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="icon" style={{ background: COLORS[color] || COLORS.primary }}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  )
}
