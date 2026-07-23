import React, { useEffect, useState, useMemo } from 'react'
import { UserApi } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import UserTable from '../components/UserTable'
import UserForm from '../components/UserForm'
import UserDetails from '../components/UserDetails'
import UserSearch from '../components/UserSearch'
import UserFilter from '../components/UserFilter'
import DeleteDialog from '../components/DeleteDialog'

export default function UsersPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const fetchUsers = async (opts = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await UserApi.list({ q, role, page, size })
      const pageData = response.data?.data || response.data || response
      const usersList = pageData.content || []
      const totalElements = pageData.totalElements || 0
      
      setUsers(usersList)
      setTotal(totalElements)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, q, role])

  const onAdd = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const onEdit = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const onView = (user) => setSelectedUser(user)
  const onCloseDetails = () => setSelectedUser(null)

  const onDelete = (user) => {
    setSelectedUser(user)
    setShowDelete(true)
  }

  const handleDeleteConfirmed = async (id) => {
    try {
      await UserApi.remove(id)
      setShowDelete(false)
      fetchUsers()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleSave = async (payload) => {
    try {
      if (editingUser) {
        await UserApi.update(editingUser.id, payload)
      } else {
        await UserApi.create(payload)
      }
      setShowForm(false)
      fetchUsers()
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  const handleToggleEnabled = async (user) => {
    try {
      await UserApi.setEnabled(user.id, !user.enabled)
      fetchUsers()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Users</h1>
          <p className="text-muted">Manage application users, roles and access</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={onAdd}>Add User</button>
        </div>
      </div>

      <div className="card mb-3 p-3">
        <div className="row g-2">
          <div className="col-md-6">
            <UserSearch value={q} onChange={(v) => { setPage(0); setQ(v) }} />
          </div>
          <div className="col-md-3">
            <UserFilter value={role} onChange={(v) => { setPage(0); setRole(v) }} />
          </div>
          <div className="col-md-3 text-end">
            <small className="text-muted">{total} users</small>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <LoadingIndicator />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <UserTable
              users={users}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onToggleEnabled={handleToggleEnabled}
              page={page}
              size={size}
              total={total}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          )}
        </div>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {selectedUser && !showDelete && (
        <UserDetails user={selectedUser} onClose={onCloseDetails} onEdit={() => onEdit(selectedUser)} />
      )}

      {showDelete && selectedUser && (
        <DeleteDialog
          document={selectedUser}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => handleDeleteConfirmed(selectedUser.id)}
        />
      )}
    </div>
  )
}
