import React, { useEffect, useState } from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'
import { SchoolApi } from '../services/api'

/**
 * Subscriptions Page - Manage school subscriptions connected to backend schools
 * Role: ROLE_SUPER_ADMIN / ROLE_ADMIN
 */
export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [showModal, setShowModal] = useState(false)
  const [editingSub, setEditingSub] = useState(null)
  const [formPlan, setFormPlan] = useState('BASIC')
  const [formStatus, setFormStatus] = useState('ACTIVE')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSubscriptions()
  }, [page, size])

  const loadSubscriptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await SchoolApi.list({ page, size, sortBy: 'id', direction: 'desc' })
      const data = res?.data || res
      const schools = data.content || []
      setSubscriptions(schools)
      setTotal(data.totalElements || schools.length)
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      console.error(e)
      setError('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (sub) => {
    setEditingSub(sub)
    setFormPlan(sub.subscriptionPlan || 'BASIC')
    setFormStatus(sub.status || 'ACTIVE')
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editingSub) return
    setSaving(true)
    try {
      await SchoolApi.update(editingSub.id, {
        subscriptionPlan: formPlan,
        status: formStatus
      })
      setShowModal(false)
      loadSubscriptions()
    } catch (err) {
      console.error(err)
      alert('Failed to update subscription')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Subscriptions</h1>
          <p className="text-muted">Manage school subscription plans</p>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator message="Loading subscriptions..." />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : subscriptions.length === 0 ? (
        <div className="alert alert-info">No subscriptions found</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Code</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.schoolName}</td>
                    <td>{sub.schoolCode}</td>
                    <td>
                      <span className={`badge ${sub.subscriptionPlan === 'PREMIUM' ? 'bg-primary' : sub.subscriptionPlan === 'ENTERPRISE' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {sub.subscriptionPlan || 'BASIC'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${sub.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1" 
                        onClick={() => handleEditClick(sub)}
                        title="Edit Subscription"
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={total}
            onPageChange={setPage}
          />
        </>
      )}

      {showModal && editingSub && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Subscription: {editingSub.schoolName}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subscription Plan</label>
                    <select 
                      className="form-select" 
                      value={formPlan} 
                      onChange={(e) => setFormPlan(e.target.value)}
                    >
                      <option value="BASIC">Basic</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select" 
                      value={formStatus} 
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
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
