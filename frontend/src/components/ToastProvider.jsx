import React from 'react'
import { useToastContext } from '../context/ToastContext'

export default function ToastProvider() {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      {toasts.map((toast) => {
        const bgClass = {
          success: 'bg-success text-white',
          error: 'bg-danger text-white',
          warning: 'bg-warning text-dark',
          info: 'bg-info text-white',
        }[toast.type] || 'bg-info text-white'

        return (
          <div
            key={toast.id}
            className={"toast show align-items-center " + bgClass}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => removeToast(toast.id)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}