import React, { useEffect, useState } from 'react'
import { StudentApi } from '../services/api'
import ErrorBanner from '../components/ErrorBanner'

const EMPTY = { name: '', course: '', subject: '', fee: '', address: '', joiningDate: '' }

export default function StudentModal({ open, student, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setError('')
      setForm(
        student
          ? {
              name: student.name || '',
              course: student.course || '',
              subject: student.subject || '',
              fee: student.fee ?? '',
              address: student.address || '',
              joiningDate: student.joiningDate || '',
            }
          : EMPTY,
      )
    }
  }, [open, student])

  if (!open) return null

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      fee: form.fee === '' ? null : Number(form.fee),
    }
    try {
      if (student) await StudentApi.update(student.id, payload)
      else await StudentApi.create(payload)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{student ? 'Edit Student' : 'Add Student'}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={submit}>
            <div className="modal-body">
              {error && <ErrorBanner message={error} />}
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Name</label>
                  <input className="form-control" required value={form.name} onChange={(e) => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Course</label>
                  <input className="form-control" required value={form.course} onChange={(e) => set('course', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <input className="form-control" required value={form.subject} onChange={(e) => set('subject', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fee (₹)</label>
                  <input type="number" min="0" step="0.01" className="form-control" required value={form.fee}
                         onChange={(e) => set('fee', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input className="form-control" value={form.address} onChange={(e) => set('address', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Joining Date</label>
                  <input type="date" className="form-control" required value={form.joiningDate}
                         onChange={(e) => set('joiningDate', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
