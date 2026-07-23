import React, { useState } from 'react'

const AssignmentSearch = ({ onSearch, courses = [] }) => {
  const [q, setQ] = useState('')
  const [courseId, setCourseId] = useState('')
  const [status, setStatus] = useState('')

  const submit = (e) => {
    e && e.preventDefault()
    onSearch && onSearch({ title: q, courseId: courseId || null, status: status || null })
  }

  return (
    <form className="row g-2 mb-3" onSubmit={submit}>
      <div className="col-md-5">
        <input className="form-control" placeholder="Search by title..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="col-md-3">
        <select className="form-select" value={courseId} onChange={e => setCourseId(e.target.value)}>
          <option value="">All courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title || c.courseCode}</option>)}
        </select>
      </div>
      <div className="col-md-2">
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <div className="col-md-2">
        <div className="d-flex">
          <button className="btn btn-primary me-2" type="submit">Search</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setQ(''); setCourseId(''); setStatus(''); onSearch && onSearch({}) }}>Reset</button>
        </div>
      </div>
    </form>
  )
}

export default AssignmentSearch
