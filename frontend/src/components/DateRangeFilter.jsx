import React, { useState } from 'react'
import { formatDate } from '../utils/format'

const DateRangeFilter = ({ onFilter, onExport }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    onFilter && onFilter({ startDate, endDate })
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-calendar-range me-2" />
          Date Range Filter
        </h5>
      </div>
      <div className="card-body">
        <form className="row g-3" onSubmit={handleApply}>
          <div className="col-md-4">
            <label className="form-label">Start Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">End Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" className="btn btn-primary me-2">Apply</button>
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={() => { setStartDate(''); setEndDate(''); onFilter && onFilter({}) }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DateRangeFilter