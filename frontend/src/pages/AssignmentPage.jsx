import React, { useEffect, useState } from 'react'
import AssignmentTable from '../components/AssignmentTable'
import AssignmentForm from '../components/AssignmentForm'
import AssignmentSearch from '../components/AssignmentSearch'
import { AssignmentApi, CourseApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filters, setFilters] = useState({})
  const [courses, setCourses] = useState([])

  const loadAssignments = async (p = page, s = size, f = filters) => {
    setLoading(true)
    try {
      const res = await AssignmentApi.list({ page: p, size: s, sortBy: 'createdAt', direction: 'desc' })
      const data = res?.data || res
      const content = data?.content || data
      setAssignments(content || [])
      setPage(data.page || p)
      setSize(data.size || s)
      setTotal(data.totalElements || (content ? content.length : 0))
    } catch (err) {
      console.error('Failed to load assignments', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments(0, size, filters)
    // load course list for course selector
    CourseApi.list({ page: 0, size: 100 }).then(r => {
      const d = r?.data || r
      setCourses(d.content || d || [])
    }).catch(() => {})
  }, [])

  const onSearch = (searchFilters) => {
    setFilters(searchFilters)
    // call search endpoint when filters provided
    setLoading(true)
    AssignmentApi.search({ ...searchFilters, page: 0, size })
      .then(res => {
        const d = res?.data || res
        setAssignments(d.content || d)
        setPage(d.page || 0)
        setTotal(d.totalElements || 0)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const openCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const onSaved = () => {
    setShowForm(false)
    loadAssignments(0, size, filters)
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Assignments</h3>
        <div>
          <button className="btn btn-primary" onClick={openCreate}>Create Assignment</button>
        </div>
      </div>

      <AssignmentSearch onSearch={onSearch} courses={courses} />

      {loading ? <LoadingIndicator /> : (
        <AssignmentTable assignments={assignments}
                         page={page}
                         size={size}
                         total={total}
                         onRefresh={() => loadAssignments(0, size, filters)}
                         onEdit={(a) => { setEditing(a); setShowForm(true) }}
                         onDelete={() => loadAssignments(0, size, filters)} />
      )}

      {showForm && (
        <AssignmentForm show={showForm}
                        assignment={editing}
                        courses={courses}
                        onClose={() => setShowForm(false)}
                        onSaved={onSaved} />
      )}
    </div>
  )
}

export default AssignmentPage
