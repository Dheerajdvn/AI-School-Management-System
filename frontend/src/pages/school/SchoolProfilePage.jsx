import React, { useState, useEffect } from 'react'

/**
 * School Profile Management Page
 * Role: ROLE_SCHOOL_ADMIN
 * Redesigned with OpenAI/Stripe premium aesthetics, high-fidelity UI, real LocalStorage persistence, and complete light/dark mode adaptability.
 */
export default function SchoolProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  // Load profile from LocalStorage or default to mock
  useEffect(() => {
    const timer = setTimeout(() => {
      const defaultProfile = {
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

      let saved = null
      try {
        const stored = localStorage.getItem('school_profile_data')
        if (stored) {
          saved = JSON.parse(stored)
        }
      } catch (e) {
        console.error('Error reading school profile from localStorage', e)
      }

      const activeProfile = saved || defaultProfile
      setProfile(activeProfile)
      setForm({ ...activeProfile, socialLinks: { ...activeProfile.socialLinks } })
      setLoading(false)
    }, 600)
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

  // Save profile to LocalStorage to ensure real persistence
  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      try {
        localStorage.setItem('school_profile_data', JSON.stringify(form))
      } catch (e) {
        console.error('Error saving school profile to localStorage', e)
      }
      setProfile({ ...form })
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 800)
  }

  const handleCancel = () => {
    setForm({ ...profile, socialLinks: { ...profile.socialLinks } })
    setErrors({})
    setSuccess(false)
  }

  if (loading) {
    return (
      <div className="school-profile-page py-4">
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
    <div className="school-profile-page py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>
            <i className="bi bi-building me-2 text-primary" />School Profile
          </h4>
          <p className="text-muted small mb-0">Configure metadata, logos, contact info, and branding elements for your institution.</p>
        </div>
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible fade show border-0 rounded-3 shadow-lg mb-4" role="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <i className="bi bi-check-circle-fill me-2" />
          <span className="small font-semibold">School profile saved & synchronized successfully!</span>
          <button type="button" className="btn-close" onClick={() => setSuccess(false)} />
        </div>
      )}

      {/* Cover Image Banner */}
      <div className="cover-image-section shadow-sm">
        {form.coverImage ? (
          <img src={form.coverImage} alt="School Cover" className="cover-preview" />
        ) : (
          <div className="cover-placeholder">
            <i className="bi bi-image-fill mb-1" />
            <span>Upload School Banner Image</span>
          </div>
        )}
        <label className="cover-upload-btn">
          <i className="bi bi-camera-fill" />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('coverImage', e)} hidden />
        </label>
      </div>

      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-wrapper shadow-lg">
          {form.logo ? (
            <img src={form.logo} alt="School Logo" className="logo-preview" />
          ) : (
            <div className="logo-placeholder">
              <i className="bi bi-building-fill text-muted" />
            </div>
          )}
          <label className="logo-upload-btn">
            <i className="bi bi-camera-fill" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} hidden />
          </label>
        </div>
        {errors.logo && <span className="error-text mt-1 d-block">{errors.logo}</span>}
      </div>

      {/* Main Profile Fields Form */}
      <div className="profile-form-section shadow-2xl">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">School Name <span className="required">*</span></label>
              <input
                type="text"
                className={`form-control style-profile-input ${errors.schoolName ? 'is-invalid' : ''}`}
                value={form.schoolName || ''}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder="Oakwood International School"
              />
              {errors.schoolName && <div className="invalid-feedback">{errors.schoolName}</div>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Principal Name <span className="required">*</span></label>
              <input
                type="text"
                className={`form-control style-profile-input ${errors.principalName ? 'is-invalid' : ''}`}
                value={form.principalName || ''}
                onChange={(e) => handleChange('principalName', e.target.value)}
                placeholder="Dr. Sarah Mitchell"
              />
              {errors.principalName && <div className="invalid-feedback">{errors.principalName}</div>}
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">School Code</label>
              <input type="text" className="form-control style-profile-input" value={form.schoolCode || ''} readOnly />
              <small className="text-muted mt-1" style={{ fontSize: '11px' }}>Auto-generated, cannot be changed</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Board Affiliation</label>
              <input
                type="text"
                className="form-control style-profile-input"
                value={form.board || ''}
                onChange={(e) => handleChange('board', e.target.value)}
                placeholder="e.g. CBSE, ICSE, IB"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">School Operating Hours</label>
              <input
                type="text"
                className="form-control style-profile-input"
                value={form.schoolTiming || ''}
                onChange={(e) => handleChange('schoolTiming', e.target.value)}
                placeholder="e.g. 8:00 AM - 2:30 PM"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Contact Phone <span className="required">*</span></label>
              <input
                type="text"
                className={`form-control style-profile-input ${errors.phone ? 'is-invalid' : ''}`}
                value={form.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91-22-23456789"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Contact Email <span className="required">*</span></label>
              <input
                type="email"
                className={`form-control style-profile-input ${errors.email ? 'is-invalid' : ''}`}
                value={form.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="admin@school.edu.in"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Website Address</label>
              <input
                type="url"
                className={`form-control style-profile-input ${errors.website ? 'is-invalid' : ''}`}
                value={form.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.school.edu.in"
              />
              {errors.website && <div className="invalid-feedback">{errors.website}</div>}
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">Address</label>
              <textarea
                className="form-control style-profile-input"
                rows="2"
                value={form.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter physical address"
              />
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label className="form-label text-muted small fw-semibold uppercase tracking-wider mb-1.5">School Description & Bio</label>
              <textarea
                className="form-control style-profile-input"
                rows="3"
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your school's vision, philosophy, and features"
                maxLength={500}
              />
              <div className="d-flex justify-content-between mt-1">
                <small className="text-muted">Max 500 characters</small>
                <small className="text-muted">{(form.description || '').length}/500</small>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="social-links-section mt-4.5 p-4 rounded-3 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h5 className="fw-bold mb-3 small d-flex align-items-center gap-2" style={{ color: 'var(--text)' }}>
            <i className="bi bi-share-fill text-primary" /> Social Media Links
          </h5>
          <div className="row g-3">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
              <div className="col-md-3 col-sm-6" key={platform}>
                <div className="form-group">
                  <label className="form-label text-muted uppercase tracking-wider mb-1" style={{ fontSize: '11px' }}>
                    <i className={`bi bi-${platform} me-1`} /> {platform}
                  </label>
                  <input
                    type="url"
                    className={`form-control style-profile-input ${errors[`social_${platform}`] ? 'is-invalid' : ''}`}
                    value={form.socialLinks?.[platform] || ''}
                    onChange={(e) => handleSocialChange(platform, e.target.value)}
                    placeholder={`https://${platform}.com/`}
                  />
                  {errors[`social_${platform}`] && <div className="invalid-feedback">{errors[`social_${platform}`]}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-outline-secondary rounded-3 px-4 font-semibold border-0" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }} onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary rounded-3 px-4 font-semibold shadow-glow d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-lg" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{profileStyles}</style>
    </div>
  )
}

const profileStyles = `
.school-profile-page { position: relative; }
.skeleton-cover { height: 220px; border-radius: 16px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; margin-bottom: 1rem; }
.skeleton-field { height: 40px; border-radius: 8px; background: rgba(255,255,255,0.06); animation: pulse 1.5s infinite; margin-bottom: 12px; }
.cover-image-section { position: relative; height: 220px; border-radius: 16px; overflow: hidden; margin-bottom: 60px; background: var(--surface); border: 1px solid var(--border); }
.cover-preview { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 0.5rem; opacity: 0.45; font-size: 1.6rem; color: var(--muted); }
.cover-upload-btn { position: absolute; bottom: 12px; right: 12px; width: 42px; height: 42px; border-radius: 50%; background: var(--card); display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid var(--border); color: var(--text); font-size: 1.1rem; transition: all 0.2s ease; }
.cover-upload-btn:hover { background: rgba(99, 102, 241, 0.9); transform: scale(1.05); color: #ffffff; }
.logo-section { position: absolute; top: 170px; left: 32px; z-index: 2; }
.logo-wrapper { width: 100px; height: 100px; border-radius: 16px; overflow: hidden; border: 3px solid rgba(99, 102, 241, 0.35); position: relative; background: var(--card); }
.logo-preview { width: 100%; height: 100%; object-fit: cover; }
.logo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; opacity: 0.5; }
.logo-upload-btn { position: absolute; bottom: 6px; right: 6px; width: 28px; height: 28px; border-radius: 50%; background: #4f46e5; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s ease; }
.logo-upload-btn:hover { background: #6366f1; transform: scale(1.08); }
.profile-form-section { background: var(--card); border-radius: 16px; border: 1px solid var(--border); padding: 2rem; margin-top: 1rem; }
.form-group { display: flex; flex-direction: column; }
.form-group .required { color: #f87171; }
.style-profile-input { background-color: var(--input-bg) !important; border: 1px solid var(--input-border) !important; color: var(--text) !important; border-radius: 10px !important; padding: 0.65rem 0.95rem; font-size: 0.9rem; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.style-profile-input:focus { background-color: var(--input-bg) !important; border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25) !important; color: var(--text) !important; }
.style-profile-input.is-invalid { border-color: #f87171 !important; }
.style-profile-input[readonly] { opacity: 0.55; cursor: not-allowed; background-color: var(--hover) !important; }
.error-text { color: #f87171; font-size: 0.75rem; }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
`