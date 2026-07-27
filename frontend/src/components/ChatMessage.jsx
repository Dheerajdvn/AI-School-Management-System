import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * ChatMessage component to display a single chat message.
 * Supports markdown rendering for assistant messages and copy functionality.
 */
export default function ChatMessage({ role, content, sources, retrievedChunks, onDelete, onRetry, isStreaming }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`d-flex ${role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <div className={`chat-bubble ${role}`}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="text-muted small">
            {role === 'assistant' ? (
              <>
                <i className="bi bi-robot me-1 text-primary" />
                Assistant
              </>
            ) : (
              <>
                <i className="bi bi-person me-1 text-secondary" />
                You
              </>
            )}
          </div>
          <div className="d-flex gap-1">
            {onRetry && role === 'assistant' && (
              <button
                className="btn btn-sm text-muted p-0"
                onClick={onRetry}
                title="Regenerate response"
              >
                <i className="bi bi-arrow-clockwise" />
              </button>
            )}
            {role === 'assistant' && content && (
              <button
                className="btn btn-sm text-muted p-0"
                onClick={copyToClipboard}
                title="Copy response"
              >
                <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'}`} />
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm text-muted p-0"
                onClick={onDelete}
                title="Delete message"
              >
                <i className="bi bi-trash" />
              </button>
            )}
          </div>
        </div>
        
        <div className="message-content position-relative">
          {role === 'assistant' ? (
            <div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || ''}
              </ReactMarkdown>
              {isStreaming && (
                <span className="streaming-cursor ms-1 text-primary fw-bold animate-pulse">▌</span>
              )}
            </div>
          ) : (
            <div>{content}</div>
          )}
        </div>
        
        {role === 'assistant' && sources && (
          <div className="mt-2">
            <small className="text-muted">
              <i className="bi bi-bookmark-star me-1" />
              Sources: {sources.length}
            </small>
            <div className="mt-1 d-flex flex-column gap-1">
             {sources.map((source, idx) => (
                 <div key={`${source.documentId}-${source.chunkId}-${idx}`} className="d-flex align-items-center gap-1 small text-muted">
                  <i className="bi bi-file-text" />
                  <span className="text-truncate" style={{ maxWidth: '200px' }}>
                    {source.filename || 'Unknown'}
                  </span>
                  {source.score !== undefined && (
                    <span className="badge bg-light text-dark ms-auto">
                      {(source.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}