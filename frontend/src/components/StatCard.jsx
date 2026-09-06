import React from 'react'

export default function StatCard({ 
  icon, 
  label, 
  value, 
  onClick, 
  active = false, 
  trend = null,
  trendDown = false,
  accentColor = '#EC4899'
}) {
  return (
    <div
      className={`dashdark-stat-card transition-all ${onClick ? 'clickable cursor-pointer' : ''} ${active ? 'active' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Top row: Icon + Label + Menu */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div 
            className="dashdark-stat-icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ color: accentColor }}
          >
            <i className={`bi ${icon}`} />
          </div>
          <span className="dashdark-stat-label text-truncate">{label}</span>
        </div>
        <button 
          className="btn btn-link p-0 text-muted border-0 opacity-50 hover-opacity-100 flex-shrink-0"
          title="Metric options"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <i className="bi bi-three-dots" style={{ fontSize: '15px' }} />
        </button>
      </div>

      {/* Bottom row: Value + Trend Badge */}
      <div className="d-flex align-items-baseline gap-2.5 flex-wrap">
        <div className="dashdark-stat-val fw-bold">{value}</div>
        {trend && (
          <span 
            className={`dashdark-trend-badge ${trendDown ? 'trend-down' : 'trend-up'}`}
          >
            {trend}
            <i className={`bi ${trendDown ? 'bi-arrow-down-right' : 'bi-arrow-up-right'} ms-1`} />
          </span>
        )}
      </div>
    </div>
  )
}
