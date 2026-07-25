import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'
import useToast from '../hooks/useToast'

/**
 * School Admins Page - Manage school administrators
 * Role: ROLE_SUPER_ADMIN
 */
export default function SchoolAdminsPage() {
  const { success: showToast } = useToast()
  const [admins, setAdmins] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [actionType, setActionType] = useState(null) // 'view' | 'edit' | 'delete'
  const [editForm, setEditForm] = useState({ username: '', email: '', school: '', status: 'ACTIVE' })

  useEffect(() => {
    loadAdmins()
  }, [page, size])

  const loadAdmins = async () => {
    setLoading(true)
    try {
      const mockAdmins = [
        { id: 1, username: 'admin_ohs', email: 'admin@oakwood.edu', school: 'Oakwood High School', status: 'ACTIVE' },
        { id: 2, username: 'admin_ra', email: 'admin@riverside.edu', school: 'Riverside Academy', status: 'ACTIVE' },
        { id: 3, username: 'admin_mge', email: 'admin@maplegrove.edu', school: 'Maple Grove Elementary', status: 'INACTIVE' },
      ]
      setAdmins(mockAdmins)
      setTotal(mockAdmins.length)
      setTotalPages(1)
    } catch (e) {
      setError('Failed to load school admins')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (admin) => {
    setSelectedAdmin(admin)
    setActionType('view')
    showToast(`Viewing details for ${admin.username} (${admin.school})`)
  }

  const handleEdit = (admin) => {
    setSelectedAdmin(admin)
    setEditForm({ username: admin.username, email: admin.email, school: admin.school, status: admin.status })
    setActionType('edit')
  }

  const handleDelete = (admin) => {
    setSelectedAdmin(admin)
    setActionType('delete')
  }

  const confirmDelete = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter(a => a.id !== selectedAdmin.id))
      setTotal(total - 1)
      showToast(`Deleted administrator ${selectedAdmin.username} successfully`)
      setSelectedAdmin(null)
      setActionType(null)
    }
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (selectedAdmin) {
      setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, ...editForm } : a))
      showToast(`Updated administrator ${editForm.username} successfully`)
      setSelectedAdmin(null)
      setActionType(null)
    }
  }

  return (
    <div className="container-fluid animate-fade">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>School Admins</h1>
          <p className="text-muted">Manage school administrator accounts</p>
        </div>
        <Link to="/admin/schools/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Create New School
        </Link>
      </div>

      {loading ? (
        <LoadingIndicator message="Loading school admins..." />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : admins.length === 0 ? (
        <div className="alert alert-info">No school admins found</div>
      ) : (
        <>
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>School</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="fw-semibold">{admin.username}</td>
                      <td>{admin.email}</td>
                      <td>{admin.school}</td>
                      <td>
                        <span className={`badge ${admin.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-info" title="View Details" onClick={() => handleView(admin)}>
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-primary" title="Edit Admin" onClick={() => handleEdit(admin)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" title="Delete Admin" onClick={() => handleDelete(admin)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={total}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {/* View Modal */}
      {selectedAdmin && actionType === 'view' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card bg-dark text-light border">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title"><i className="bi bi-person-badge me-2" />School Admin Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setSelectedAdmin(null); setActionType(null); }}></button>
              </div>
              <div className="modal-body">
                <p><strong>Username:</strong> {selectedAdmin.username}</p>
                <p><strong>Email:</strong> {selectedAdmin.email}</p>
                <p><strong>School:</strong> {selectedAdmin.school}</p>
                <p><strong>Status:</strong> <span className={`badge ${selectedAdmin.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>{selectedAdmin.status}</span></p>
              </div>
              <div className="modal-footer border-top border-secondary">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setSelectedAdmin(null); setActionType(null); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedAdmin && actionType === 'edit' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card bg-dark text-light border">
              <form onSubmit={handleSaveEdit}>
                <div className="modal-header border-bottom border-secondary">
                  <h5 className="modal-title"><i className="bi bi-pencil me-2" />Edit School Admin</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => { setSelectedAdmin(null); setActionType(null); }}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">School</label>
                    <input type="text" className="form-control" value={editForm.school} onChange={e => setEditForm({...editForm, school: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-top border-secondary">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setSelectedAdmin(null); setActionType(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedAdmin && actionType === 'delete' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card bg-dark text-light border">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title"><i className="bi bi-exclamation-triangle text-danger me-2" />Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setSelectedAdmin(null); setActionType(null); }}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete school administrator <strong>{selectedAdmin.username}</strong> ({selectedAdmin.school})?</p>
              </div>
              <div className="modal-footer border-top border-secondary">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setSelectedAdmin(null); setActionType(null); }}>Cancel</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}