import React from 'react'

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="loader-wrap">
      <div className="spinner-dot" />
      <div>{label}</div>
    </div>
  )
}
