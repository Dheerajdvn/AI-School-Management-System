import React, { useEffect, useState } from 'react'
import { CourseApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import CourseTable from '../components/CourseTable'
import CourseForm from '../components/CourseForm'
import CourseDetails from '../components/CourseDetails'
import CourseSearch from '../components/CourseSearch'
import CourseFilter from '../components/CourseFilter'
import DeleteDialog from '../components/DeleteDialog'

export default function CoursePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await CourseApi.search({ title: q, status, page, size })
      const data = res || {}
      if (data.content) {
        setCourses(data.content)
        setTotal(data.totalElements || data.total || 0)
      } else if (Array.isArray(data)) {
        setCourses(data)
        setTotal(data.length)
      } else {
        setCourses([])
        setTotal(0)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [page, size, q, status])

  const onAdd = () => { setEditing(null); setShowForm(true) }
  const onEdit = (c) => { setEditing(c); setShowForm(true) }
  const onView = (c) => setSelected(c)
  const onDelete = (c) => { setSelected(c); setShowDelete(true) }

  const handleDeleteConfirmed = async (id) => {
    try {
      await CourseApi.remove(id)
      setShowDelete(false)
      fetchCourses()
    } catch (e) { setError(e.message) }
  }

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await CourseApi.update(editing.id, payload)
      } else {
        await CourseApi.create(payload)
      }
      setShowForm(false)
      fetchCourses()
    } catch (e) { setError(e.message); throw e }
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Courses</h1>
          <p className="text-muted">Manage courses, assign teachers and view enrollments</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={onAdd}>Create Course</button>
        </div>
      </div>

      <div className="card mb-3 p-3">
        <div className="row g-2">
          <div className="col-md-6"><CourseSearch value={q} onChange={(v) => { setPage(0); setQ(v) }} /></div>
          <div className="col-md-3"><CourseFilter value={status} onChange={(v) => { setPage(0); setStatus(v) }} /></div>
          <div className="col-md-3 text-end"><small className="text-muted">{total} courses</small></div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? <LoadingIndicator /> : error ? <div className="alert alert-danger">{error}</div> : (
            <CourseTable
              courses={courses}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              page={page}
              size={size}
              total={total}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          )}
        </div>
      </div>

      {showForm && (
        <CourseForm course={editing} onClose={() => setShowForm(false)} onSave={handleSave} />
      )}

      {selected && !showDelete && (
        <CourseDetails course={selected} onClose={() => setSelected(null)} onEdit={() => onEdit(selected)} />
      )}

      {showDelete && selected && (
        <DeleteDialog document={selected} onCancel={() => setShowDelete(false)} onConfirm={() => handleDeleteConfirmed(selected.id)} />
      )}
    </div>
  )
}
