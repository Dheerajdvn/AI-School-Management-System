import React from 'react'

/**
 * Pagination component for navigating document pages.
 */
export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalElements,
  onPageChange 
}) {
  const pages = []
  const maxVisiblePages = 5

  // Calculate visible page range
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Document pagination">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          Showing {Math.min(totalElements, (currentPage * 10) + 1)} - {Math.min(totalElements, (currentPage + 1) * 10)} of {totalElements} documents
        </div>
        
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <i className="bi bi-chevron-left" />
            </button>
          </li>
          
          {pages.map(page => (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button 
                className="page-link"
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </button>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}