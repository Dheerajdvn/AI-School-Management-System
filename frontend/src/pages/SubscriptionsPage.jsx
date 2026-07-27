import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SubscriptionApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import Pagination from '../components/Pagination'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscription] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSubscriptions()
  }, [page, size])

  const loadSubscriptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await SubscriptionApi.list({ page, size, sortBy: 'id', direction: 'desc' })
      const data = res?.data || res
      setSubscription(data.content || [])
      setTotal(data.totalElements || 0)
    } catch (e) {
      console.error(e)
      setError('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading subscriptions..." />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ fontSize: '16px' }}>Subscriptions</h3>
          <p className="text-muted m-0" style={{ fontSize: '12px' }}>Manage platform subscriptions and plans</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: '12px' }}>{error}</div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>School</th>
              <th>Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="fw-medium">{sub.schoolName || '—'}</td>
                <td>{sub.plan || 'BASIC'}</td>
                <td>{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '—'}</td>
                <td>{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '—'}</td>
                <td>
                  <span className={`badge ${sub.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                    {sub.status}
                  </span>
                </td>
                <td>{sub.amount ? `$${sub.amount}` : '—'}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Link to={`/admin/schools/${sub.id}`} className="btn btn-sm btn-outline-primary" title="View School Details">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link to={`/admin/schools/${sub.id}/edit`} className="btn btn-sm btn-outline-secondary" title="Edit School / Subscription">
                      <i className="bi bi-pencil"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={total > 0 ? Math.ceil(total / size) : 1}
        totalElements={total}
        onPageChange={setPage}
      />
    </div>
  )
}