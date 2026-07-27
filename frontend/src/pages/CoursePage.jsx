import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CourseApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

export default function CoursePage() {
  const [courses, setCourses] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [page, size])

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await CourseApi.list({ page, size, sortBy: 'id', direction: 'desc' })
      const data = res?.data || res
      setCourses(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading courses..." />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>Courses</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>Manage educational courses and curriculum</p>
        </div>
        <Link to="/admin/courses/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>
          Create Course
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Code</th>
              <th>Teacher</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">No courses found</td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="fw-medium">
                    <Link to={`/admin/courses/${course.id}`} className="text-decoration-none">
                      {course.title}
                    </Link>
                  </td>
                  <td>{course.courseCode}</td>
                  <td>{course.teacherName || '—'}</td>
                  <td>
                    <span className={`badge ${course.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                      {course.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/courses/${course.id}`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye"></i>
                      </Link>
                      <Link to={`/admin/courses/${course.id}/edit`} className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-pencil"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={total > 0 ? Math.ceil(total / size) : 1}
        totalElements={total}
        onPageChange={setPage}
      />
    </div>
  )
}
