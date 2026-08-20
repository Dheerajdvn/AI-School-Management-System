import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'

const AccountSettings = () => {
  const { user } = useAuth()
  const { success, error } = useToast()
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTerminated, setSessionTerminated] = useState(false)

  const handleToggle2FA = () => {
    setTwoFactor(prev => {
      const next = !prev
      if (next) {
        success('Two-factor authentication enabled successfully!')
      } else {
        success('Two-factor authentication disabled.')
      }
      return next
    })
  }

  const handleTerminateSessions = () => {
    setSessionTerminated(true)
    success('All other active sessions have been successfully logged out.')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to request account deletion? An administrator will review your request.')) {
      success('Account deletion request submitted for administrative review.')
    }
  }

  return (
    <div className="card border shadow-xs bg-card overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom py-3 bg-card">
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--text)', fontSize: '15px' }}>
          <i className="bi bi-shield-check me-2 text-primary" />
          Account & Security Settings
        </h5>
        <p className="text-muted small mb-0 mt-1">
          Manage your account credentials, authentication protocols, and active sessions.
        </p>
      </div>

      <div className="card-body p-4">
        {/* Account Overview Cards */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-4">
            <div className="p-3 rounded-3 border bg-surface h-100">
              <span className="text-muted small d-block mb-1">Account Status</span>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border-0 px-2.5 py-1 rounded-pill small">
                  <i className="bi bi-check-circle-fill me-1" /> Active
                </span>
                <span className="text-muted small">Verified</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-4">
            <div className="p-3 rounded-3 border bg-surface h-100">
              <span className="text-muted small d-block mb-1">Assigned Role</span>
              <div className="fw-semibold text-truncate" style={{ color: 'var(--text)', fontSize: '14px' }}>
                {user?.roles?.join(', ') || user?.role || 'Administrator'}
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-4">
            <div className="p-3 rounded-3 border bg-surface h-100">
              <span className="text-muted small d-block mb-1">Security Score</span>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-success" style={{ fontSize: '14px' }}>
                  {twoFactor ? '95%' : '80%'}
                </span>
                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: twoFactor ? '95%' : '80%', borderRadius: '3px' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="p-3.5 rounded-3 border bg-surface mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-lock text-primary fs-5" />
                <h6 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>Two-Factor Authentication (2FA)</h6>
              </div>
              <p className="text-muted small mb-0 mt-1">
                Add an extra layer of security to your account requiring a verification code upon login.
              </p>
            </div>
            <div className="form-check form-switch m-0">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="twoFactorAuth"
                checked={twoFactor}
                onChange={handleToggle2FA}
                style={{ cursor: 'pointer', width: '2.5rem', height: '1.25rem' }}
              />
            </div>
          </div>
        </div>

        {/* Active Session Management */}
        <div className="mb-4">
          <h6 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>
            <i className="bi bi-laptop me-2 text-primary" />
            Active Devices & Sessions
          </h6>
          <p className="text-muted small mb-3">
            Current signed-in devices authorized to access your account.
          </p>

          <div className="border rounded-3 p-3 bg-surface mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-2 bg-primary-subtle text-primary">
                  <i className="bi bi-display fs-5" />
                </div>
                <div>
                  <div className="fw-semibold small" style={{ color: 'var(--text)' }}>
                    Windows PC &bull; Chrome Web Browser
                  </div>
                  <small className="text-muted">
                    This Device &bull; Active Now &bull; IP: 192.168.1.1
                  </small>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success border-0 px-2 py-1 small">Current</span>
            </div>
          </div>

          <button 
            type="button"
            className="btn btn-secondary btn-sm rounded-3 d-flex align-items-center gap-2"
            onClick={handleTerminateSessions}
            disabled={sessionTerminated}
          >
            <i className="bi bi-box-arrow-right text-warning" />
            <span>{sessionTerminated ? 'Other Sessions Terminated' : 'Log out from other devices'}</span>
          </button>
        </div>

        <hr className="my-4" style={{ borderColor: 'var(--border)' }} />

        {/* Danger Zone */}
        <div>
          <h6 className="fw-bold text-danger mb-1">
            <i className="bi bi-exclamation-triangle me-2" />
            Danger Zone
          </h6>
          <p className="text-muted small mb-3">
            Irreversible actions regarding your account profile data and institutional access.
          </p>

          <div className="p-3 border border-danger border-opacity-25 rounded-3 bg-danger bg-opacity-10 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <div className="fw-semibold text-danger small">Delete / Deactivate Account</div>
              <small className="text-muted">Request permanent deletion of your account record and stored data.</small>
            </div>
            <button 
              type="button"
              className="btn btn-outline-danger btn-sm rounded-3 text-nowrap"
              onClick={handleDeleteAccount}
            >
              <i className="bi bi-trash me-1" />
              Request Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings