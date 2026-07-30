import React, { useState, useEffect } from 'react'

export default function MyCoursesPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses([
        { id: 1, name: 'Mathematics', teacher: 'Mr. David Lee', progress: 75, nextClass: 'Mon, Wed, Fri - 8:00 AM', assignments: 3, materials: 12 },
        { id: 2, name: 'Physics', teacher: 'Ms. Emily Chen', progress: 60, nextClass: 'Tue, Thu - 10:00 AM', assignments: 2, materials: 8 },
        { id: 3, name: 'Chemistry', teacher: 'Mr. James Wilson', progress: 85, nextClass: 'Mon, Wed - 2:00 PM', assignments: 1, materials: 10 },
        { id: 4, name: 'English', teacher: 'Mrs. Sarah Parker', progress: 70, nextClass: 'Tue, Thu, Sat - 11:30 AM', assignments: 2, materials: 15 },
        { id: 5, name: 'Computer Science', teacher: 'Mr. James Wilson', progress: 90, nextClass: 'Fri - 3:00 PM', assignments: 0, materials: 20 },
        { id: 6, name: 'Biology', teacher: 'Ms. Emily Chen', progress: 55, nextClass: 'Wed, Fri - 9:00 AM', assignments: 4, materials: 7 },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="mcp-page">
        <div className="row g-3">{[...Array(4)].map((_, i) => <div key={i} className="col-12"><div className="skeleton-row" /></div>)}</div>
        <style>{mcpStyles}</style>
      </div>
    )
  }

  return (
    <div className="mcp-page">
      <div className="page-header-custom">
        <h4><i className="bi bi-book me-2" />My Courses</h4>
      </div>

      <div className="row g-3">
        {courses.map(course => (
          <div className="col-md-6 col-lg-4" key={course.id}>
            <div className="course-card">
              <div className="course-header">
                <div className="course-icon"><i className="bi bi-book" /></div>
                <div className="course-title">
                  <h5>{course.name}</h5>
                  <span>{course.teacher}</span>
                </div>
              </div>
              <div className="course-body">
                <div className="progress-wrapper">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">Progress</span>
                    <span className="small"><strong>{course.progress}%</strong></span>
                  </div>
                  <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--hover)' }}>
                    <div className="progress-bar" style={{ width: `${course.progress}%`, backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
                  </div>
                </div>
                <div className="course-stats">
                  <span><i className="bi bi-clock me-1" />{course.nextClass}</span>
                </div>
                <div className="course-footer">
                  <span className="badge bg-primary">{course.assignments} Assignments</span>
                  <span className="badge bg-info">{course.materials} Materials</span>
                </div>
              </div>
              <div className="course-actions">
                <a href="/student/assignments" className="btn btn-sm btn-outline-primary">Assignments</a>
                <a href="/student/study-materials" className="btn btn-sm btn-outline-success">Materials</a>
                <a href="/student/ai-tutor" className="btn btn-sm btn-outline-info">Ask AI</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}