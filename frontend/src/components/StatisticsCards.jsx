import React from 'react'
import StatCard from './StatCard'

const StatisticsCards = ({ totals = {}, loading = false }) => {
  return (
    <div className="row g-3">
      <div className="col-sm-6 col-md-4 col-lg-2">
        <StatCard label="Total Students" value={loading ? '—' : (totals?.students ?? '—')} icon="bi-mortarboard" color="success" />
      </div>
      <div className="col-sm-6 col-md-4 col-lg-2">
        <StatCard label="Total Teachers" value={loading ? '—' : (totals?.teachers ?? '—')} icon="bi-person-badge" color="info" />
      </div>
      <div className="col-sm-6 col-md-4 col-lg-2">
        <StatCard label="Total Courses" value={loading ? '—' : (totals?.courses ?? '—')} icon="bi-journal-bookmark" color="warning" />
      </div>
      <div className="col-sm-6 col-md-4 col-lg-2">
        <StatCard label="Total Assignments" value={loading ? '—' : (totals?.assignments ?? '—')} icon="bi-card-text" color="primary" />
      </div>
      <div className="col-sm-6 col-md-4 col-lg-2">
        <StatCard label="Total Submissions" value={loading ? '—' : (totals?.submissions ?? '—')} icon="bi-upload" color="info" />
      </div>
      <div className="col-sm-6 col-md-4 col-lg-2">
        <StatCard label="Total Documents" value={loading ? '—' : (totals?.documents ?? '—')} icon="bi-file-earmark-text" color="danger" />
      </div>
    </div>
  )
}

export default StatisticsCards