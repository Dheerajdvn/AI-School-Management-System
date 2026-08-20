import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * ChatMessage component to display a single chat message.
 * Supports rich markdown, code copy buttons, source badges, and follow-up chips.
 */
export default function ChatMessage({
  role,
  content,
  sources,
  retrievedChunks,
  onDelete,
  onRetry,
  isStreaming,
  onSelectSuggestion,
}) {
  const [copied, setCopied] = useState(false)
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null)

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

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeIndex(index)
    setTimeout(() => setCopiedCodeIndex(null), 2000)
  }

  return (
    <div className={`d-flex ${role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <div className={`chat-bubble ${role}`} style={{ maxWidth: '85%' }}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="text-muted small fw-semibold">
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
            {onRetry && role === 'assistant' && !isStreaming && (
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : ''
                    const codeString = String(children).replace(/\n$/, '')

                    if (!inline) {
                      const codeKey = codeString.slice(0, 20)
                      const isCodeCopied = copiedCodeIndex === codeKey

                      return (
                        <div className="code-block-wrapper my-2 rounded-3 overflow-hidden border border-secondary border-opacity-25 shadow-sm">
                          <div className="d-flex justify-content-between align-items-center px-3 py-1 bg-dark text-light small">
                            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                              {language || 'code'}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-light text-decoration-none p-0"
                              onClick={() => copyCode(codeString, codeKey)}
                              style={{ fontSize: '0.75rem' }}
                            >
                              <i className={`bi ${isCodeCopied ? 'bi-check-lg text-success' : 'bi-clipboard'} me-1`} />
                              {isCodeCopied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <pre className="p-3 m-0 bg-dark text-light overflow-auto" style={{ fontSize: '0.85rem', lineHeight: '1.45' }}>
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      )
                    }
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-secondary bg-opacity-15 font-monospace" style={{ fontSize: '0.88em' }} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
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

        {role === 'assistant' && sources && sources.length > 0 && (
          <div className="mt-3 pt-2 border-top border-secondary border-opacity-10">
            <small className="text-muted fw-semibold">
              <i className="bi bi-bookmark-star me-1 text-primary" />
              Sources ({sources.length}):
            </small>
            <div className="mt-1 d-flex flex-wrap gap-1">
              {sources.map((source, idx) => (
                <span
                  key={`${source.documentId}-${source.chunkId}-${idx}`}
                  className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 d-inline-flex align-items-center gap-1"
                  style={{ fontSize: '0.75rem', fontWeight: '500' }}
                >
                  <i className="bi bi-file-earmark-text" />
                  <span className="text-truncate" style={{ maxWidth: '160px' }}>
                    {source.filename || 'Document'}
                  </span>
                  {source.score !== undefined && (
                    <span className="text-primary fw-bold">
                      {(source.score * 100).toFixed(0)}%
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {role === 'assistant' && !isStreaming && onSelectSuggestion && (
          <div className="mt-3 pt-2 border-top border-secondary border-opacity-10 d-flex flex-wrap gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => onSelectSuggestion('Summarize key points in bullet format')}
            >
              <i className="bi bi-list-stars me-1" /> Summarize
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => onSelectSuggestion('Generate 3 quiz questions based on this')}
            >
              <i className="bi bi-question-circle me-1" /> Quiz Me
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => onSelectSuggestion('Explain this in simpler terms with an example')}
            >
              <i className="bi bi-lightbulb me-1" /> Simplify
            </button>
          </div>
        )}
      </div>
    </div>
  )
}