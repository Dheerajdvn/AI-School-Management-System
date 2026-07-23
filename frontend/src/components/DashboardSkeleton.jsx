import React from 'react'

export default function DashboardSkeleton() {
  return (
    <div>
      <div className="row mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-sm-6 col-md-4 mb-3">
            <div className="placeholder-glow p-3 rounded" style={{ height: 96 }}>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-4"></span>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-8 mb-3">
          <div className="placeholder-glow p-3 rounded" style={{ height: 360 }}>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12"></span>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="placeholder-glow p-3 rounded" style={{ height: 360 }}>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12"></span>
          </div>
        </div>
      </div>
    </div>
  )
}
