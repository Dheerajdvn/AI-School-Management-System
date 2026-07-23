import React from 'react'
import Chart from './Charts'

const ChartsSection = ({ byCourse = [], documentsByMonth = { labels: [], values: [] }, rolesDistribution = {}, loading = false }) => {
  return (
    <div className="row g-3 mb-4">
      <div className="col-lg-6 col-md-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="mb-0">Student Enrollment by Course</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading chart...</div>
            ) : byCourse && byCourse.length > 0 ? (
              <Chart type="bar" labels={byCourse.map((b) => b.courseName || b.label)} values={byCourse.map((b) => b.count || b.value)} />
            ) : (
              <div className="text-muted">No data available</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 col-md-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="mb-0">User Role Distribution</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading chart...</div>
            ) : rolesDistribution && Object.keys(rolesDistribution).length > 0 ? (
              <Chart type="pie" labels={Object.keys(rolesDistribution)} values={Object.values(rolesDistribution)} />
            ) : (
              <div className="text-muted">No data available</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 col-md-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="mb-0">Document Upload Trend</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading chart...</div>
            ) : documentsByMonth.labels && documentsByMonth.labels.length > 0 ? (
              <Chart type="line" labels={documentsByMonth.labels} values={documentsByMonth.values} />
            ) : (
              <div className="text-muted">No data available</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-lg-6 col-md-12">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="mb-0">Assignment Submissions by Month</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading chart...</div>
            ) : documentsByMonth.labels && documentsByMonth.labels.length > 0 ? (
              <Chart type="line" labels={documentsByMonth.labels} values={documentsByMonth.values} />
            ) : (
              <div className="text-muted">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartsSection