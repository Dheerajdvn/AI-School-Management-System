import React from 'react'

const SOLID_COLORS = {
  primary: 'var(--primary)',
  success: '#10b981',
  warning: '#f59e0b',
  info: 'var(--accent)',
  danger: '#ef4444',
  purple: '#8b5cf6'
}

export default function StatCard({ icon, label, value, color = 'primary', onClick, active = false, trend = null }) {
  return (
    <div
      className={`card border-0 shadow-sm bg-card p-3 h-100 transition-all ${onClick ? 'clickable cursor-pointer' : ''}`}
      style={{
        borderRadius: '14px',
        border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm"
          style={{
            width: '46px',
            height: '46px',
            background: SOLID_COLORS[color] || SOLID_COLORS.primary,
            fontSize: '1.25rem'
          }}
        >
          <i className={`bi ${icon}`} />
        </div>

        <div className="flex-grow-1 min-w-0">
          <div className="text-muted text-truncate fw-semibold mb-1" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </div>
          <div className="d-flex align-items-baseline justify-content-between gap-2">
            <h4 className="fw-bold mb-0 text-truncate" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
              {value}
            </h4>
            {trend && (
              <span className="badge bg-success bg-opacity-15 text-success rounded-pill x-small px-2 py-0.5">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
