import React from 'react'

export default function DashboardSkeleton() {
  return (
    <div className="py-2">
      {/* Metric Cards Skeleton */}
      <div className="row g-3 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 p-3 shadow-sm rounded-4 h-100 d-flex flex-row align-items-center gap-3">
              <div className="skeleton-shimmer rounded-3" style={{ width: 44, height: 44, flexShrink: 0 }} />
              <div className="flex-grow-1">
                <div className="skeleton-shimmer mb-2" style={{ height: 12, width: '45%' }} />
                <div className="skeleton-shimmer" style={{ height: 22, width: '70%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content & Chart Skeletons */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card border-0 p-4 shadow-sm rounded-4 h-100" style={{ minHeight: 380 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="skeleton-shimmer" style={{ height: 18, width: 160 }} />
              <div className="skeleton-shimmer rounded-pill" style={{ height: 28, width: 90 }} />
            </div>
            <div className="skeleton-shimmer rounded-3 flex-grow-1" style={{ minHeight: 280 }} />
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 p-4 shadow-sm rounded-4 h-100" style={{ minHeight: 380 }}>
            <div className="skeleton-shimmer mb-4" style={{ height: 18, width: 140 }} />
            <div className="d-flex flex-column gap-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="d-flex align-items-center gap-3">
                  <div className="skeleton-shimmer rounded-circle" style={{ width: 36, height: 36, flexShrink: 0 }} />
                  <div className="flex-grow-1">
                    <div className="skeleton-shimmer mb-1" style={{ height: 12, width: '60%' }} />
                    <div className="skeleton-shimmer" style={{ height: 10, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
