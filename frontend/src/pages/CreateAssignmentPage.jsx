import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AssignmentApi, CourseApi } from '../services/api'
import { useToast } from '../hooks/useToast'

export default function CreateAssignmentPage() {
  const navigate = useNavigate()
  const { success: showSuccess, error: showError } = useToast()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    courseId: '',
    dueDate: '',
    maxMarks: 100,
    status: 'PUBLISHED',
    description: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const res = await CourseApi.list({ page: 0, size: 100 })
      const data = res?.data || res
      const courseList = data.content || []
      setCourses(courseList)
      if (courseList.length > 0) {
        setForm(prev => ({ ...prev, courseId: courseList[0].id }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.courseId) errs.courseId = 'Course selection is required'
    if (!form.dueDate) errs.dueDate = 'Due date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await AssignmentApi.create({
        title: form.title,
        courseId: Number(form.courseId),
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        maxMarks: Number(form.maxMarks),
        status: form.status,
        description: form.description
      }, Number(form.courseId))
      showSuccess('Assignment created successfully!')
      navigate('/admin/assignments')
    } catch (err) {
      console.error(err)
      showError('Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid py-2 animate-fade">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '18px' }}>Create New Assignment</h3>
          <p className="text-muted m-0 small">Add a new assignment for student course enrollment</p>
        </div>
        <Link to="/admin/assignments" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i className="bi bi-arrow-left me-1" /> Back to Assignments
        </Link>
      </div>

      <div className="card border-0 shadow-sm bg-card" style={{ borderRadius: '14px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label text-muted small fw-semibold">Assignment Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. Midterm Project & Algebra Worksheet"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Target Course <span className="text-danger">*</span></label>
                <select
                  className={`form-select ${errors.courseId ? 'is-invalid' : ''}`}
                  value={form.courseId}
                  onChange={(e) => handleChange('courseId', e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title || c.courseCode}</option>
                  ))}
                </select>
                {errors.courseId && <div className="invalid-feedback">{errors.courseId}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Due Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                  value={form.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
                {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Max Marks</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.maxMarks}
                  onChange={(e) => handleChange('maxMarks', e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label text-muted small fw-semibold">Description & Instructions</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter assignment requirements and grading rubric..."
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Link to="/admin/assignments" className="btn btn-light px-4 rounded-3">Cancel</Link>
              <button type="submit" className="btn btn-primary px-4 rounded-3 fw-semibold" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check2-circle me-1" />}
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
