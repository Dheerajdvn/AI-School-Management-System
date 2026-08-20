import React, { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'
import LoadingIndicator from '../../components/LoadingIndicator'

export default function StudentProfilePage() {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({
        firstName: 'Rahul', 
        lastName: 'Sharma', 
        rollNumber: 'R-1001', 
        admissionNumber: 'ADM-2024-001',
        gender: 'Male', 
        dob: '2008-05-15', 
        email: 'rahul.sharma@school.edu', 
        phone: '+91 98765 43210',
        className: 'Class 10-A', 
        section: 'A', 
        parentName: 'Mr. Rajesh Sharma',
        parentPhone: '+91 98765 43211', 
        emergencyContact: 'Mrs. Sunita Sharma', 
        emergencyPhone: '+91 98765 43212'
      })
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!passwordForm.current) {
      error('Please enter your current password')
      return
    }
    if (passwordForm.new.length < 6) {
      error('New password must be at least 6 characters')
      return
    }
    if (passwordForm.new !== passwordForm.confirm) {
      error('Passwords do not match')
      return
    }
    success('Password updated successfully!')
    setShowPasswordModal(false)
    setPasswordForm({ current: '', new: '', confirm: '' })
  }

  if (loading) {
    return <LoadingIndicator message="Loading profile details..." />
  }

  return (
    <div className="container-fluid p-0 animate-fade">
      {/* Profile Header Card */}
      <div className="card mb-4 border shadow-xs bg-card overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-xs"
              style={{
                width: '84px',
                height: '84px',
                fontSize: '2rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: '3px solid var(--border)'
              }}
            >
              {profile.firstName.charAt(0)}
            </div>
            <div className="text-center text-sm-start flex-grow-1">
              <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>
                  {profile.firstName} {profile.lastName}
                </h3>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-2.5 py-1 small">
                  {profile.className}
                </span>
              </div>
              <p className="text-muted small mb-2 d-flex align-items-center justify-content-center justify-content-sm-start gap-3 flex-wrap">
                <span><i className="bi bi-person-badge me-1 text-primary" />Roll: {profile.rollNumber}</span>
                <span><i className="bi bi-card-text me-1 text-primary" />Adm: {profile.admissionNumber}</span>
                <span><i className="bi bi-envelope me-1 text-primary" />{profile.email}</span>
              </p>
            </div>
            <button 
              type="button"
              className="btn btn-secondary btn-sm rounded-3 d-flex align-items-center gap-2"
              onClick={() => setShowPasswordModal(true)}
            >
              <i className="bi bi-key" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div className="row g-4 mb-4">
        {/* Personal Details */}
        <div className="col-lg-6">
          <div className="card border shadow-xs bg-card h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-bottom py-3 bg-card">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                <i className="bi bi-person-lines-fill me-2 text-primary" />
                Personal Details
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label text-muted small fw-semibold">First Name</label>
                  <input type="text" className="form-control bg-surface border" value={profile.firstName} readOnly />
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-muted small fw-semibold">Last Name</label>
                  <input type="text" className="form-control bg-surface border" value={profile.lastName} readOnly />
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-muted small fw-semibold">Gender</label>
                  <input type="text" className="form-control bg-surface border" value={profile.gender} readOnly />
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-muted small fw-semibold">Date of Birth</label>
                  <input type="text" className="form-control bg-surface border" value={profile.dob} readOnly />
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-muted small fw-semibold">Email Address</label>
                  <input type="email" className="form-control bg-surface border" value={profile.email} readOnly />
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-muted small fw-semibold">Phone Number</label>
                  <input type="tel" className="form-control bg-surface border" value={profile.phone} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent & Emergency Details */}
        <div className="col-lg-6">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Parent Details */}
            <div className="card border shadow-xs bg-card flex-grow-1" style={{ borderRadius: '16px' }}>
              <div className="card-header border-bottom py-3 bg-card">
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                  <i className="bi bi-people me-2 text-primary" />
                  Parent / Guardian
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label text-muted small fw-semibold">Guardian Name</label>
                    <input type="text" className="form-control bg-surface border" value={profile.parentName} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-muted small fw-semibold">Guardian Contact</label>
                    <input type="tel" className="form-control bg-surface border" value={profile.parentPhone} readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card border shadow-xs bg-card flex-grow-1" style={{ borderRadius: '16px' }}>
              <div className="card-header border-bottom py-3 bg-card">
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                  <i className="bi bi-telephone-plus me-2 text-danger" />
                  Emergency Contact
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label text-muted small fw-semibold">Contact Person</label>
                    <input type="text" className="form-control bg-surface border" value={profile.emergencyContact} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-muted small fw-semibold">Emergency Number</label>
                    <input type="tel" className="form-control bg-surface border" value={profile.emergencyPhone} readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content border shadow-2xl bg-card" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
                  <i className="bi bi-shield-lock me-2 text-primary" />
                  Change Password
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPasswordModal(false)} 
                />
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordForm.current} 
                      onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} 
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordForm.new} 
                      onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} 
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordForm.confirm} 
                      onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} 
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top py-3">
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}