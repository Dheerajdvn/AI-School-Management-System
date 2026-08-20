import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { knowledgeService } from '../../services/knowledgeService'
import { useToast } from '../../hooks/useToast'

export default function AISearch() {
  const { success, error } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    collection: '',
    subject: '',
    date: '',
    minSimilarity: 0.5,
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const response = await knowledgeService.searchDocuments(searchQuery)
      setSearchResults(response?.results || response || [])
    } catch (err) {
      error('Search failed: ' + (err.response?.data?.message || err.message))
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>AI Semantic Search</h2>
        <Link to="/knowledge" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Search Interface */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="Ask a question or search for content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={isSearching}>
                {isSearching ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <i className="bi bi-search" />
                )}
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="row g-2">
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.collection}
                onChange={(e) => setFilters({ ...filters, collection: e.target.value })}
              >
                <option value="">All Collections</option>
                <option>Science</option>
                <option>Mathematics</option>
                <option>Social Studies</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="">All Subjects</option>
                <option>Physics</option>
                <option>Mathematics</option>
                <option>Chemistry</option>
              </select>
            </div>
            <div className="col-md-3">
              <input 
                type="date" 
                className="form-control"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Min Similarity" 
                min="0" 
                max="1" 
                step="0.1"
                value={filters.minSimilarity}
                onChange={(e) => setFilters({ ...filters, minSimilarity: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0">Search Results ({searchResults.length})</h5>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column gap-3">
              {searchResults.map((result) => (
                <div key={result.id} className="border rounded p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">{result.document || result.title}</h6>
                    <span className="badge bg-primary">{((result.similarity || 0) * 100).toFixed(1)}% Match</span>
                  </div>
                  <p className="text-muted small mb-2">Page {result.page || 'N/A'} &bull; Score: {result.similarity}</p>
                  <p className="mb-0">{result.chunk || result.content || result.snippet}</p>
                  <div className="mt-2">
                    <Link to={`/knowledge/document/${result.id || result.docId}`} className="btn btn-action-view">
                      <i className="bi bi-eye" /> View Document
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!searchResults.length && searchQuery && !isSearching && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }} />
            <p className="text-muted mt-3">No results found. Try a different search query.</p>
          </div>
        </div>
      )}
    </div>
  )
}