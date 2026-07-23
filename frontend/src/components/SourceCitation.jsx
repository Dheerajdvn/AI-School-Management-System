import React, { useState } from 'react'

/**
 * SourceCitation component to display document sources used for RAG response.
 */
export default function SourceCitation({ sources, retrievedChunks }) {
  const [expandedSourceId, setExpandedSourceId] = useState(null)

  if (!sources || sources.length === 0) {
    return null
  }

  const toggleSource = (id) => {
    setExpandedSourceId(expandedSourceId === id ? null : id)
  }

  const formatScore = (score) => {
    if (score === undefined || score === null) return '-'
    return (score * 100).toFixed(1) + '%'
  }

  return (
    <div className="mt-3">
      <div className="small text-muted mb-2">
        <i className="bi bi-bookmark-star me-1" />
        Sources ({sources.length})
      </div>
      <div className="d-flex flex-column gap-2">
        {sources.map((source, index) => (
          <div 
            key={`${source.documentId}-${source.chunkId}`}
            className="source-citation bg-light rounded-3 p-2"
            style={{ cursor: retrievedChunks ? 'pointer' : 'default' }}
            onClick={() => retrievedChunks && toggleSource(index)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-file-text text-primary" />
                <span className="small fw-medium text-truncate" style={{ maxWidth: '200px' }}>
                  {source.filename || 'Unknown document'}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-secondary small">
                  {formatScore(source.score)}
                </span>
                {retrievedChunks && (
                  <button 
                    className="btn btn-sm text-muted p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSource(index)
                    }}
                  >
                    <i className={`bi bi-chevron-${expandedSourceId === index ? 'up' : 'down'}`} />
                  </button>
                )}
              </div>
            </div>
            {expandedSourceId === index && retrievedChunks && (
              <div className="mt-2 pt-2 border-top small text-muted">
                <div className="text-truncate-3" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                  {retrievedChunks[index]}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}