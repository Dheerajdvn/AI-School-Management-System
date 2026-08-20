import React from 'react'

export default function StatCard({ icon, label, value, onClick, active = false, trend = null }) {
  return (
    <div
      className={`card border shadow-xs bg-card p-3 h-100 transition-all ${onClick ? 'clickable cursor-pointer' : ''}`}
      style={{
        borderRadius: '14px',
        borderColor: active ? 'var(--primary)' : 'var(--border)',
        boxShadow: active ? '0 0 0 1px var(--primary), var(--shadow)' : 'var(--shadow-xs)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease'
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 border"
          style={{
            width: '42px',
            height: '42px',
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--primary)',
            fontSize: '1.2rem'
          }}
        >
          <i className={`bi ${icon}`} />
        </div>

        <div className="flex-grow-1 min-w-0">
          <div className="text-muted text-truncate fw-semibold mb-1" style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </div>
          <div className="d-flex align-items-baseline justify-content-between gap-2">
            <h4 className="fw-bold mb-0 text-truncate" style={{ fontSize: '1.35rem', letterSpacing: '-0.02em', color: 'var(--text)' }}>
              {value}
            </h4>
            {trend && (
              <span className="badge bg-success-subtle text-success rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
