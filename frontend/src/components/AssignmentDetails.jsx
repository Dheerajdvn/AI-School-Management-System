import React, { useEffect, useState } from 'react'
import { AssignmentApi, SubmissionApi } from '../services/api'
import LoadingIndicator from './LoadingIndicator'

const AssignmentDetails = ({ id }) => {
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submissionsCount, setSubmissionsCount] = useState(0)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    AssignmentApi.get(id).then(r => {
      const d = r?.data || r
      setAssignment(d)
    }).catch(console.error).finally(() => setLoading(false))

    // load submissions count
    SubmissionApi.getByAssignment(id, { page: 0, size: 1 }).then(r => {
      const d = r?.data || r
      setSubmissionsCount(d?.totalElements || 0)
    }).catch(() => {})
  }, [id])

  if (loading) return <LoadingIndicator />
  if (!assignment) return <div className="alert alert-warning">Assignment not found</div>

  return (
    <div className="card">
      <div className="card-body">
        <h5>{assignment.title}</h5>
        <p className="text-muted">Course: {assignment.courseTitle || assignment.courseCode}</p>
        <p>{assignment.description}</p>
        <div className="mb-3">
          <h6>Instructions</h6>
          <div>{assignment.instructions}</div>
        </div>
        <div className="mb-2">Due: {assignment.dueDate}</div>
        <div className="mb-2">Max Marks: {assignment.maxMarks}</div>
        <div className="mb-2">Submissions: {submissionsCount}</div>
        {assignment.attachmentUrl && (
          <div><a href={assignment.attachmentUrl} target="_blank" rel="noreferrer">Download attachment</a></div>
        )}
      </div>
    </div>
  )
}

export default AssignmentDetails
