import React, { useState, useEffect } from 'react'

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setProfile({
        firstName: 'Rahul', lastName: 'Sharma', rollNumber: 'R-1001', admissionNumber: 'ADM-2024-001',
        gender: 'Male', dob: '2008-05-15', email: 'rahul.sharma@school.edu', phone: '+91 98765 43210',
        className: 'Class 10-A', section: 'A', parentName: 'Mr. Rajesh Sharma',
        parentPhone: '+91 98765 43211', emergencyContact: 'Mrs. Sunita Sharma', emergencyPhone: '+91 98765 43212'
      })
      setLoading(false)
    }, 600)
  }, [])

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })

  if (loading) {
    return (
      <div className="splp-page">
        <div className="skeleton-row" />
        <style>{splpStyles}</style>
      </div>
    )
  }

  return (
    <div className="splp-page">
      <h4 className="mb-3"><i className="bi bi-person me-2" />My Profile</h4>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Personal Details</h5></div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">First Name</label><input type="text" className="form-control" defaultValue={profile.firstName} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Last Name</label><input type="text" className="form-control" defaultValue={profile.lastName} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Roll Number</label><input type="text" className="form-control" defaultValue={profile.rollNumber} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Admission Number</label><input type="text" className="form-control" defaultValue={profile.admissionNumber} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Gender</label><input type="text" className="form-control" defaultValue={profile.gender} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Date of Birth</label><input type="text" className="form-control" defaultValue={profile.dob} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" defaultValue={profile.email} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Phone</label><input type="tel" className="form-control" defaultValue={profile.phone} readOnly /></div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Parent/Guardian Details</h5></div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Parent Name</label><input type="text" className="form-control" defaultValue={profile.parentName} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Parent Phone</label><input type="tel" className="form-control" defaultValue={profile.parentPhone} readOnly /></div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-3">
        <div className="card-header-custom"><h5>Emergency Contact</h5></div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Contact Name</label><input type="text" className="form-control" defaultValue={profile.emergencyContact} readOnly /></div>
            <div className="col-md-6"><label className="form-label">Contact Phone</label><input type="tel" className="form-control" defaultValue={profile.emergencyPhone} readOnly /></div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header-custom"><h5>Security</h5></div>
        <div className="card-body">
          <button className="btn btn-outline-primary" onClick={() => setShowPasswordModal(true)}><i className="bi bi-key me-1" />Change Password</button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom"><h5>Change Password</h5><button className="btn-close btn-close-white" onClick={() => setShowPasswordModal(false)} /></div>
            <div className="modal-body">
              <div className="mb-3"><label className="form-label">Current Password</label><input type="password" className="form-control" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">New Password</label><input type="password" className="form-control" value={passwordForm.new} onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Confirm New Password</label><input type="password" className="form-control" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} /></div>
            </div>
            <div className="modal-footer-custom"><button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { alert('Password updated!'); setShowPasswordModal(false); }}>Update Password</button></div>
          </div>
        </div>
      )}

      <style>{splpStyles}</style>
    </div>
  )
}

const splpStyles = `
.splp-page h4 { margin: 0; font-weight: 700; }
.splp-page .glass-card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.splp-page .card-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.splp-page .card-header-custom h5 { margin: 0; font-weight: 600; }
.splp-page .card-body { padding: 1.25rem; }
.splp-page .form-control, .splp-page .form-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; }
.splp-page .form-control:focus, .splp-page .form-select:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.splp-page .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 10px; font-weight: 600; }
.splp-page .btn-outline-primary { border-color: #3b82f6; color: #60a5fa; }
.splp-page .btn-outline-primary:hover { background: rgba(59,130,246,0.1); }
.splp-page .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem; }
.splp-page .modal-content { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; }
.splp-page .modal-header-custom { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.splp-page .modal-header-custom h5 { margin: 0; }
.splp-page .modal-body { padding: 1.25rem; }
.splp-page .modal-footer-custom { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.splp-page .skeleton-row { height: 300px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`