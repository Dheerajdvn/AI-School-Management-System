import React from 'react'

const AccountSettings = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-gear me-2" />
          Account Settings
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Account Status</label>
          <div>
            <span className="badge bg-success">Active</span>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Account Type</label>
          <div>
            <span className="text-muted">Standard</span>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Two-Factor Authentication</label>
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="twoFactorAuth"
              disabled
            />
            <label className="form-check-label" htmlFor="twoFactorAuth">
              Not configured
            </label>
          </div>
          <small className="text-muted">Two-factor authentication adds an extra layer of security</small>
        </div>

        <hr className="my-3" />

        <div className="mb-3">
          <label className="form-label">Session Management</label>
          <p className="text-muted small mb-2">
            You can log out from all devices to end active sessions.
          </p>
          <button className="btn btn-outline-warning btn-sm" disabled>
            <i className="bi bi-box-arrow-right me-1" />
            Log out from all devices
          </button>
        </div>

        <hr className="my-3" />

        <div className="mb-3">
          <label className="form-label text-danger">Danger Zone</label>
          <p className="text-muted small mb-2">
            Delete your account permanently. This action cannot be undone.
          </p>
          <button className="btn btn-outline-danger btn-sm" disabled>
            <i className="bi bi-trash me-1" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings