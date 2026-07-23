import React, { useState, useEffect } from 'react'

/**
 * School Profile Management Page
 * Role: ROLE_SCHOOL_ADMIN
 */
export default function SchoolProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockProfile = {
        schoolName: 'Oakwood International School',
        principalName: 'Dr. Sarah Mitchell',
        schoolCode: 'OIS-2024-001',
        board: 'CBSE',
        address: '123 Education Lane, Knowledge Park, Mumbai - 400001',
        phone: '+91-22-23456789',
        email: 'admin@oakwood.edu.in',
        website: 'https://www.oakwood.edu.in',
        schoolTiming: '8:00 AM - 2:30 PM',
        description: 'Oakwood International School is committed to providing quality education that nurtures young minds and builds character. We follow the CBSE curriculum with a focus on holistic development.',
        socialLinks: {
          facebook: 'https://facebook.com/oakwoodschool',
          twitter: 'https://twitter.com/oakwoodschool',
          instagram: 'https://instagram.com/oakwoodschool',
          linkedin: 'https://linkedin.com/school/oakwoodschool',
        },
        logo: null,
        coverImage: null,
      }
      setProfile(mockProfile)
      setForm({ ...mockProfile, socialLinks: { ...mockProfile.socialLinks } })
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setSuccess(false)
  }

  const handleSocialChange = (platform, value) => {
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }))
  }

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0]
    if (!file) return
    const maxSize = field === 'coverImage' ? 5 * 1024 * 1024 : 2 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [field]: `File too large. Max ${field === 'coverImage' ? '5MB' : '2MB'}` }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, [field]: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const errs = {}
    if (!form.schoolName?.trim()) errs.schoolName = 'School name is required'
    if (!form.principalName?.trim()) errs.principalName = 'Principal name is required'
    if (!form.phone?.trim()) errs.phone = 'Phone is required'
    if (!form.email?.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'URL must start with http:// or https://'
    Object.entries(form.socialLinks || {}).forEach(([key, val]) => {
      if (val && !/^https?:\/\/.+/.test(val)) errs[`social_${key}`] = 'URL must start with http:// or https://'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      setProfile({ ...form })
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  const handleCancel = () => {
    setForm({ ...profile, socialLinks: { ...profile.socialLinks } })
    setErrors({})
    setSuccess(false)
  }

  if (loading) {
    return (
      <div className="school-profile-page">
        <div className="profile-skeleton">
          <div className="skeleton-cover" />
          <div className="row g-4 p-4">
            <div className="col-md-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton-field" />)}</div>
            <div className="col-md-8">{[...Array(6)].map((_, i) => <div key={i} className="skeleton-field" />)}</div>
          </div>
        </div>
        <style>{profileStyles}</style>
      </div>
    )
  }

  return (
    <div className="school-profile-page">
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2" />School profile updated successfully!
          <button type="button" className="btn-close" onClick={() => setSuccess(false)} />
        </div>
      )}

      {/* Cover Image */}
      <div className="cover-image-section">
        {form.coverImage ? (
          <img src={form.coverImage} alt="School Cover" className="cover-preview" />
        ) : (
          <div className="cover-placeholder">
            <i className="bi bi-image" />
            <span>School Cover Image</span>
          </div>
        )}
        <label className="cover-upload-btn">
          <i className="bi bi-camera-fill" />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('coverImage', e)} hidden />
        </label>
      </div>

      {/* Logo */}
      <div className="logo-section">
        <div className="logo-wrapper">
          {form.logo ? (
            <img src={form.logo} alt="School Logo" className="logo-preview" />
          ) : (
            <div className="logo-placeholder">
              <i className="bi bi-building" />
            </div>
          )}
          <label className="logo-upload-btn">
            <i className="bi bi-camera" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} hidden />
          </label>
        </div>
        {errors.logo && <span className="error-text">{errors.logo}</span>}
      </div>

      {/* Form */}
      <div className="profile-form-section">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-group">
              <label>School Name <span className="required">*</span></label>
              <input type="text" className={`form-control ${errors.schoolName ? 'is-invalid' : ''}`} value={form.schoolName || ''} onChange={(e) => handleChange('schoolName', e.target.value)} placeholder="Enter school name" />
              {errors.schoolName && <div className="invalid-feedback">{errors.schoolName}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Principal Name <span className="required">*</span></label>
              <input type="text" className={`form-control ${errors.principalName ? 'is-invalid' : ''}`} value={form.principalName || ''} onChange={(e) => handleChange('principalName', e.target.value)} placeholder="Enter principal name" />
              {errors.principalName && <div className="invalid-feedback">{errors.principalName}</div>}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>School Code</label>
              <input type="text" className="form-control" value={form.schoolCode || ''} readOnly />
              <small className="text-muted">Auto-generated, cannot be changed</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Board</label>
              <input type="text" className="form-control" value={form.board || ''} onChange={(e) => handleChange('board', e.target.value)} placeholder="e.g. CBSE, ICSE" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>School Timing</label>
              <input type="text" className="form-control" value={form.schoolTiming || ''} onChange={(e) => handleChange('schoolTiming', e.target.value)} placeholder="e.g. 8:00 AM - 2:30 PM" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Phone <span className="required">*</span></label>
              <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Enter phone number" />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="Enter email" />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Website</label>
              <input type="url" className={`form-control ${errors.website ? 'is-invalid' : ''}`} value={form.website || ''} onChange={(e) => handleChange('website', e.target.value)} placeholder="https://" />
              {errors.website && <div className="invalid-feedback">{errors.website}</div>}
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-control" rows="2" value={form.address || ''} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter school address" />
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <label>School Description</label>
              <textarea className="form-control" rows="3" value={form.description || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe your school" maxLength={500} />
              <small className="text-muted">{(form.description || '').length}/500 characters</small>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="social-links-section mt-4">
          <h5><i className="bi bi-share me-2" />Social Media Links</h5>
          <div className="row g-3">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
              <div className="col-md-3 col-sm-6" key={platform}>
                <div className="form-group">
                  <label><i className={`bi bi-${platform} me-1`} />{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                  <input type="url" className={`form-control ${errors[`social_${platform}`] ? 'is-invalid' : ''}`} value={form.socialLinks?.[platform] || ''} onChange={(e) => handleSocialChange(platform, e.target.value)} placeholder={`https://${platform}.com/`} />
                  {errors[`social_${platform}`] && <div className="invalid-feedback">{errors[`social_${platform}`]}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions mt-4">
          <button className="btn btn-secondary me-2" onClick={handleCancel} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check-lg me-2" />Save Changes</>}
          </button>
        </div>
      </div>

      <style>{profileStyles}</style>
    </div>
  )
}

const profileStyles = `
.school-profile-page { position: relative; }
.skeleton-cover { height: 200px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; margin-bottom: 1rem; }
.skeleton-field { height: 40px; border-radius: 8px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; margin-bottom: 12px; }
.cover-image-section { position: relative; height: 220px; border-radius: 16px; overflow: hidden; margin-bottom: 60px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
.cover-preview { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 0.5rem; opacity: 0.4; font-size: 2rem; }
.cover-upload-btn { position: absolute; bottom: 12px; right: 12px; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid rgba(255,255,255,0.3); color: white; font-size: 1.1rem; transition: all 0.2s; }
.cover-upload-btn:hover { background: rgba(0,0,0,0.7); }
.logo-section { position: absolute; top: 170px; left: 32px; z-index: 2; }
.logo-wrapper { width: 100px; height: 100px; border-radius: 16px; overflow: hidden; border: 3px solid rgba(255,255,255,0.2); position: relative; background: rgba(30,41,59,0.9); }
.logo-preview { width: 100%; height: 100%; object-fit: cover; }
.logo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; opacity: 0.5; }
.logo-upload-btn { position: absolute; bottom: 4px; right: 4px; width: 30px; height: 30px; border-radius: 50%; background: rgba(59,130,246,0.8); display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 0.8rem; transition: all 0.2s; }
.logo-upload-btn:hover { background: rgba(59,130,246,1); }
.profile-form-section { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; margin-top: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
.form-group .required { color: #ef4444; }
.form-group .form-control { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: inherit; border-radius: 10px; padding: 0.6rem 0.9rem; font-size: 0.9rem; }
.form-group .form-control:focus { background: rgba(255,255,255,0.1); border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
.form-group .form-control.is-invalid { border-color: #ef4444; }
.form-group .form-control[readonly] { opacity: 0.6; cursor: not-allowed; }
.form-group textarea.form-control { resize: vertical; min-height: 60px; }
.social-links-section { padding: 1.25rem; background: rgba(255,255,255,0.04); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); }
.social-links-section h5 { font-size: 0.95rem; margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.form-actions .btn { border-radius: 10px; padding: 0.6rem 1.5rem; font-weight: 600; }
.form-actions .btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; }
.error-text { color: #ef4444; font-size: 0.75rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`