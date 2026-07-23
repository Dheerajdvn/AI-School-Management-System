import React from 'react'
import DueDateBadge from './DueDateBadge'
import { AssignmentApi } from '../services/api'

const AssignmentTable = ({ assignments = [], onEdit, onDelete, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return
      try {
       await AssignmentApi.delete(id)
       onRefresh && onRefresh()
     } catch (err) {
       console.error(err)
       alert('Failed to delete assignment')
     }
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Due</th>
              <th>Max Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4">No assignments found</td></tr>
            )}
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.courseTitle || a.courseCode || '—'}</td>
                <td><DueDateBadge dueDate={a.dueDate} /></td>
                <td>{a.maxMarks}</td>
                <td>{a.status}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-secondary" onClick={() => onEdit && onEdit(a)}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AssignmentTable
