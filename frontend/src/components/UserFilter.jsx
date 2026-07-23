import React from 'react'

export default function UserFilter({ value, onChange }) {
  return (
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All roles</option>
      <option value="ROLE_ADMIN">Admin</option>
      <option value="ROLE_TEACHER">Teacher</option>
      <option value="ROLE_STUDENT">Student</option>
    </select>
  )
}
