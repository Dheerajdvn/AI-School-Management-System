import React from 'react'

/**
 * FilterPanel component for filtering documents by course and document type.
 */
export default function FilterPanel({ 
  courses, 
  documentTypes,
  selectedCourse, 
  selectedType,
  onCourseChange,
  onTypeChange,
  onClearFilters
}) {
  const hasActiveFilters = selectedCourse || selectedType

  return (
    <div className="filter-panel bg-light rounded-3 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          <i className="bi bi-funnel me-2" />
          Filters
        </h6>
        {hasActiveFilters && (
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={onClearFilters}
          >
            <i className="bi bi-x-circle me-1" />
            Clear
          </button>
        )}
      </div>

      <div className="row g-3">
        {/* Course filter */}
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label small">Course</label>
          <select 
            className="form-select"
            value={selectedCourse || ''}
            onChange={(e) => onCourseChange(e.target.value || null)}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseCode || course.code || ''} - {course.title || course.name || ''}
              </option>
            ))}
          </select>
        </div>

        {/* Document type filter */}
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label small">Document Type</label>
          <select 
            className="form-select"
            value={selectedType || ''}
            onChange={(e) => onTypeChange(e.target.value || null)}
          >
            <option value="">All Types</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}