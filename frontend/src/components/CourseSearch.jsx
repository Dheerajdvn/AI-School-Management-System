import React from 'react'

export default function CourseSearch({ value, onChange }) {
  return (
    <div className="input-group">
      <input className="form-control" placeholder="Search courses by title or code" value={value} onChange={(e) => onChange(e.target.value)} />
      <button className="btn btn-outline-secondary" onClick={() => onChange('')}>Clear</button>
    </div>
  )
}
