import React from 'react'

/**
 * SearchBar component for searching documents.
 */
export default function SearchBar({ searchQuery, onSearch, onClear }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(e.target.value)
    }
  }

  return (
    <div className="search-bar d-flex gap-2">
      <div className="flex-grow-1 position-relative">
        <i className="bi bi-search position-absolute top-50 start-3 translate-middle-y text-muted" />
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearch?.(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {searchQuery && (
        <button 
          className="btn btn-outline-secondary"
          onClick={onClear}
          title="Clear search"
        >
          <i className="bi bi-x" />
        </button>
      )}
    </div>
  )
}