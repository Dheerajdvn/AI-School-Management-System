import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CourseApi, UserApi } from '../services/api'

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [teachers, setTeachers] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    description: '',
    teacherId: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    UserApi.list({ role: 'ROLE_TEACHER', size: 100 })
      .then(r => {
        const pageData = r?.data?.data || r?.data || r
        const list = pageData.content || (Array.isArray(pageData) ? pageData : [])
        setTeachers(list)
      })
      .catch(() => setTeachers([]))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? Number(formData.teacherId) : null
      }
      await CourseApi.create(payload)
      setSuccess(true)
      setTimeout(() => navigate('/admin/courses'), 1500)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Create Course</h3>
          <p className="text-muted m-0">Add a new educational course</p>
        </div>
        <Link to="/admin/courses" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to Courses
        </Link>
      </div>

      {success && (
        <div className="alert alert-success py-2">Course created successfully!</div>
      )}

      {error && (
        <div className="alert alert-danger py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0 fs-6">Course Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Course Code *</label>
                <input
                  type="text"
                  className="form-control"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Teacher</label>
                <select
                  className="form-select"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                >
                  <option value="">Select teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.username} ({t.email})</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Link to="/admin/courses" className="btn btn-secondary btn-sm">Cancel</Link>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
