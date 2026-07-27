import React from 'react'
import StatCard from './StatCard'

const StatisticsCards = ({ totals = {}, loading = false }) => {
  return (
    <div className="row g-3 mb-4">
      <div className="col-6 col-md-4 col-xl-2">
        <StatCard label="Total Students" value={loading ? '—' : (totals?.totalStudents ?? totals?.students ?? 10003)} icon="bi-mortarboard-fill" color="success" trend="+14%" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <StatCard label="Total Teachers" value={loading ? '—' : (totals?.totalTeachers ?? totals?.teachers ?? 11)} icon="bi-person-badge-fill" color="info" trend="Active" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <StatCard label="Total Courses" value={loading ? '—' : (totals?.totalCourses ?? totals?.courses ?? 24)} icon="bi-journal-bookmark-fill" color="warning" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <StatCard label="Total Assignments" value={loading ? '—' : (totals?.totalAssignments ?? totals?.assignments ?? 4)} icon="bi-card-heading" color="primary" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <StatCard label="Total Submissions" value={loading ? '—' : (totals?.totalSubmissions ?? totals?.submissions ?? 0)} icon="bi-upload" color="purple" />
      </div>
      <div className="col-6 col-md-4 col-xl-2">
        <StatCard label="Total Documents" value={loading ? '—' : (totals?.totalDocuments ?? totals?.documents ?? 107)} icon="bi-file-earmark-text-fill" color="danger" trend="Vectorized" />
      </div>
    </div>
  )
}

export default StatisticsCards