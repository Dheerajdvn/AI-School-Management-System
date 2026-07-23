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
                  <div className="progress" style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)' }}>
                    <div className="progress-bar" style={{ width: `${course.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '3px' }} />
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

      <style>{mcpStyles}</style>
    </div>
  )
}

const mcpStyles = `
.mcp-page .page-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.mcp-page .page-header-custom h4 { margin: 0; font-weight: 700; }
.mcp-page .course-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.25rem; transition: all 0.3s; display: flex; flex-direction: column; height: 100%; }
.mcp-page .course-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); border-color: rgba(59,130,246,0.3); }
.mcp-page .course-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.mcp-page .course-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1)); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #60a5fa; flex-shrink: 0; }
.mcp-page .course-title h5 { margin: 0; font-weight: 600; }
.mcp-page .course-title span { font-size: 0.8rem; opacity: 0.7; }
.mcp-page .course-body { flex: 1; }
.mcp-page .course-stats { font-size: 0.85rem; opacity: 0.8; margin: 0.75rem 0; }
.mcp-page .course-footer { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.mcp-page .course-actions { display: flex; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); }
.mcp-page .skeleton-row { height: 180px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`