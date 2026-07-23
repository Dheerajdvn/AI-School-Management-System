import React, { useEffect, useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import EditProfileDialog from '../components/EditProfileDialog'
import ChangePasswordDialog from '../components/ChangePasswordDialog'
import LoadingIndicator from '../components/LoadingIndicator'
import { UserApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { user: authUser, loading: authLoading } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (authUser) {
      loadUser(authUser.id)
    }
  }, [authUser])

  const loadUser = async (id) => {
    setLoading(true)
    try {
      const res = await UserApi.get(id)
      setUser(res)
    } catch (err) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data) => {
    await UserApi.update(user.id, data)
    setUser({ ...user, ...data })
  }

  const handlePasswordChange = async (data) => {
    // Backend would need to support this, for now just show success
    await UserApi.resetPassword(user.id, data.newPassword)
  }

  const handleUploadPicture = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Would need backend endpoint for profile picture upload
    console.log('Profile picture upload:', file)
  }

  if (authLoading || loading) {
    return <LoadingIndicator message="Loading profile..." />
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <ProfileCard 
            user={user}
            onEdit={() => setShowEdit(true)}
            onChangePassword={() => setShowPassword(true)}
            onUploadPicture={handleUploadPicture}
          />
        </div>
      </div>

      <EditProfileDialog 
        show={showEdit}
        user={user}
        onClose={() => setShowEdit(false)}
        onSave={handleEdit}
      />

      <ChangePasswordDialog 
        show={showPassword}
        onClose={() => setShowPassword(false)}
        onSave={handlePasswordChange}
      />
    </div>
  )
}

export default ProfilePage