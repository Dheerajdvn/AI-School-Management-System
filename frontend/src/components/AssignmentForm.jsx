import React, { useEffect, useState } from 'react'
import { AssignmentApi, DocumentApi, CourseApi } from '../services/api'
import LoadingIndicator from './LoadingIndicator'

const AssignmentForm = ({ show = true, assignment = null, courses = [], onClose, onSaved }) => {
  const [title, setTitle] = useState(assignment?.title || '')
  const [description, setDescription] = useState(assignment?.description || '')
  const [instructions, setInstructions] = useState(assignment?.instructions || '')
  const [dueDate, setDueDate] = useState(assignment?.dueDate ? assignment.dueDate.substring(0,16) : '')
  const [maxMarks, setMaxMarks] = useState(assignment?.maxMarks || 100)
  const [courseId, setCourseId] = useState(assignment?.courseId || '')
  const [attachmentUrl, setAttachmentUrl] = useState(assignment?.attachmentUrl || '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(assignment?.title || '')
    setDescription(assignment?.description || '')
    setInstructions(assignment?.instructions || '')
    setDueDate(assignment?.dueDate ? assignment.dueDate.substring(0,16) : '')
    setMaxMarks(assignment?.maxMarks || 100)
    setCourseId(assignment?.courseId || '')
    setAttachmentUrl(assignment?.attachmentUrl || '')
  }, [assignment])

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await DocumentApi.upload(file, courseId || null, null, getUserId(), (p) => setProgress(p))
      const doc = res?.data || res
      // set attachmentUrl to download path
      setAttachmentUrl(`/api/documents/${doc.id}/download`)
    } catch (err) {
      console.error('Upload failed', err)
      alert('Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user'))
      return u?.id
    } catch (e) { return null }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title,
      description,
      instructions,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      maxMarks,
      attachmentUrl
    }

    try {
      if (assignment?.id) {
        await AssignmentApi.update(assignment.id, payload)
      } else {
        await AssignmentApi.create(payload, courseId)
      }
      onSaved && onSaved()
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || err.message || 'Failed to save assignment'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{assignment ? 'Edit' : 'Create'} Assignment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Course</label>
                <select className="form-select" value={courseId} onChange={e => setCourseId(e.target.value)} required>
                  <option value="">Select course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title || c.courseCode}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Instructions</label>
                <textarea className="form-control" rows={4} value={instructions} onChange={e => setInstructions(e.target.value)} />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Due Date</label>
                  <input type="datetime-local" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Marks</label>
                  <input type="number" className="form-control" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Attachment</label>
                <div className="d-flex align-items-center">
                  <input type="file" className="form-control" onChange={handleFile} />
                  {uploading && <div className="ms-3"><LoadingIndicator /></div>}
                </div>
                {attachmentUrl && (
                  <div className="mt-2">
                    <a href={attachmentUrl} target="_blank" rel="noreferrer">View attachment</a>
                  </div>
                )}
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AssignmentForm
