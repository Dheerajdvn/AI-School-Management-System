import React from 'react'

const GRADIENTS = {
  primary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  info: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
  danger: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  purple: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
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
            background: GRADIENTS[color] || GRADIENTS.primary,
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
