import React from 'react'
import { formatDate } from '../utils/format'

export default function UserDetails({ user, onClose, onEdit }) {
  return (
    <div className="modal-backdrop">
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <dl className="row">
                <dt className="col-sm-4">Username</dt>
                <dd className="col-sm-8">{user.username}</dd>

                <dt className="col-sm-4">Email</dt>
                <dd className="col-sm-8">{user.email}</dd>

                <dt className="col-sm-4">Roles</dt>
                <dd className="col-sm-8">{(user.roles || []).join(', ')}</dd>

                <dt className="col-sm-4">Status</dt>
                <dd className="col-sm-8">{user.enabled ? 'Enabled' : 'Disabled'}</dd>

                <dt className="col-sm-4">Created</dt>
                <dd className="col-sm-8">{formatDate(user.createdAt)}</dd>

                <dt className="col-sm-4">Updated</dt>
                <dd className="col-sm-8">{formatDate(user.updatedAt)}</dd>
              </dl>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button className="btn btn-primary" onClick={() => onEdit && onEdit(user)}>Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
