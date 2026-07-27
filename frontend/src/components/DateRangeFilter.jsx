import React, { useState } from 'react'

const DateRangeFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    if (onFilter) {
      onFilter({ startDate, endDate })
    }
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    if (onFilter) {
      onFilter({ startDate: '', endDate: '' })
    }
  }

  return (
    <div className="card border-0 shadow-sm bg-card p-3 mb-0" style={{ borderRadius: '14px' }}>
      <form onSubmit={handleApply} className="row g-2 align-items-center">
        <div className="col-12 col-sm-auto me-2">
          <span className="fw-semibold text-body small d-flex align-items-center gap-1">
            <i className="bi bi-calendar-range text-primary" />
            <span>Date Range Filter:</span>
          </span>
        </div>

        <div className="col-12 col-sm-4 col-md-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-surface text-muted border-secondary border-opacity-25 border-end-0">
              <i className="bi bi-calendar-event" />
            </span>
            <input
              type="date"
              className="form-control bg-surface text-body border-secondary border-opacity-25 border-start-0 ps-0 style-input"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-sm-4 col-md-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-surface text-muted border-secondary border-opacity-25 border-end-0">
              <i className="bi bi-calendar-check" />
            </span>
            <input
              type="date"
              className="form-control bg-surface text-body border-secondary border-opacity-25 border-start-0 ps-0 style-input"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-sm-auto d-flex gap-2 ms-auto">
          <button type="submit" className="btn btn-primary btn-sm rounded-3 fw-semibold px-3">
            Apply
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm rounded-3 px-3" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default DateRangeFilter