import React from 'react'

export default function UserSearch({ value, onChange }) {
  return (
    <div className="input-group">
      <input
        className="form-control"
        placeholder="Search users by name or email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="btn btn-outline-secondary" onClick={() => onChange('')}>Clear</button>
    </div>
  )
}
