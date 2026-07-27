import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { CourseApi, EnrollmentApi } from '../services/api'
import { formatDate } from '../utils/format'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [students, setStudents] = useState([])
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await CourseApi.get(id)
      const data = res?.data || res
      setCourse(data)
      try {
        const estRes = await EnrollmentApi.getByCourse(id, { page: 0, size: 10 })
        const estData = estRes?.data || estRes
        setStudents(estData.content || [])
        setTotalStudents(estData.totalElements || 0)
      } catch (err) {
        setStudents([])
        setTotalStudents(0)
      }
    } catch (e) {
      console.error(e)
      setError('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading course details..." />

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/admin/courses" className="btn btn-secondary btn-sm">Back to Courses</Link>
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Course Details</h3>
          <p className="text-muted m-0">{course.title} ({course.courseCode})</p>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/admin/courses/${course.id}/edit`} className="btn btn-primary btn-sm">
            <i className="bi bi-pencil me-1"></i> Edit
          </Link>
          <Link to="/admin/courses" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Back to Courses
          </Link>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Title:</strong> {course.title || '—'}
            </div>
            <div className="col-md-6">
              <strong>Course Code:</strong> {course.courseCode || '—'}
            </div>
            <div className="col-md-6">
              <strong>Teacher:</strong> {course.teacherName || '—'}
            </div>
            <div className="col-md-6">
              <strong>Status:</strong>{' '}
              <span className={`badge ${course.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                {course.status || 'ACTIVE'}
              </span>
            </div>
            <div className="col-12">
              <strong>Description:</strong>
              <p className="text-muted mt-1">{course.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0 fs-6">Enrolled Students ({totalStudents})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-3">No students enrolled</td>
                  </tr>
                ) : (
                  students.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.studentName || s.username || '—'}</td>
                      <td>{s.email || '—'}</td>
                      <td>{s.status || 'ACTIVE'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
