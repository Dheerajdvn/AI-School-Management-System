import React, { useEffect, useState } from 'react'
import { UserApi } from '../services/api'

export default function TeacherSelector({ value, onChange }) {
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    UserApi.list({ role: 'ROLE_TEACHER', size: 200 })
      .then(r => {
        const pageData = r?.data?.data || r?.data || r
        const list = pageData.content || (Array.isArray(pageData) ? pageData : [])
        setTeachers(list)
      })
      .catch(() => setTeachers([]))
  }, [])

  return (
    <select className="form-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select teacher</option>
      {teachers.map(t => <option key={t.id} value={t.id}>{t.username} ({t.email})</option>)}
    </select>
  )
}
