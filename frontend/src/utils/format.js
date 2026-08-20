// Formatting helpers shared across the UI.

export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return new Intl.NumberFormat('en-IN').format(Number(value))
}

export const formatDate = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

// Convert '#RRGGBB' into an rgba() string with given alpha.
export const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const PALETTE = [
  '#6366f1', // Indigo (Primary)
  '#8b5cf6', // Soft Violet
  '#3b82f6', // Slate Blue
  '#0d9488', // Muted Teal
  '#d97706', // Warm Muted Amber
  '#64748b', // Slate Grey
  '#0284c7', // Deep Sky Blue
  '#059669', // Muted Emerald
  '#7c3aed', // Deep Violet
  '#475569', // Cool Slate
]

/**
 * Format file size human readable
 */
export const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
