import React, { useEffect, useState } from 'react'
import { CourseApi, EnrollmentApi } from '../services/api'
import { formatDate } from '../utils/format'
import StudentList from './StudentList'

export default function CourseDetails({ course, onClose, onEdit }) {
  const [details, setDetails] = useState(course)
  const [studentsPage, setStudentsPage] = useState(0)
  const [students, setStudents] = useState([])
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    CourseApi.get(course.id).then(r => { if (r) setDetails(r) }).catch(() => {})
    fetchStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id])

  const fetchStudents = async () => {
    try {
      const res = await EnrollmentApi.getByCourse(course.id, { page: studentsPage, size: 10 })
      const data = res || {}
      if (data.content) {
        setStudents(data.content)
        setTotalStudents(data.totalElements || data.total || 0)
      } else {
        setStudents([]); setTotalStudents(0)
      }
    } catch (e) {
      setStudents([]); setTotalStudents(0)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Course Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-8">
                  <h4>{details.title} <small className="text-muted">({details.courseCode})</small></h4>
                  <p>{details.description}</p>
                  <p className="text-muted">Teacher: {details.teacherName}</p>
                  <p className="text-muted">Status: {details.status}</p>
                  <p className="text-muted">Created: {formatDate(details.createdAt)}</p>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <h6>Actions</h6>
                      <div className="d-grid gap-2">
                        <button className="btn btn-primary" onClick={() => onEdit && onEdit(details)}>Edit</button>
                        <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share Link</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr />
              <h5>Enrolled Students ({totalStudents})</h5>
              <StudentList students={students} page={studentsPage} onPageChange={setStudentsPage} total={totalStudents} fetchStudents={fetchStudents} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
