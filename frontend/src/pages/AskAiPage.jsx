import React, { useState } from 'react'
import { AiApi } from '../services/api'
import AiResultView from '../components/AiResultView'
import ErrorBanner from '../components/ErrorBanner'
import Spinner from '../components/Spinner'

const SUGGESTIONS = [
  { label: 'Show all Java students', icon: 'bi-code-slash' },
  { label: 'Students joined in January 2024', icon: 'bi-calendar-event' },
  { label: 'Average fee', icon: 'bi-calculator' },
  { label: 'Highest fee student', icon: 'bi-award' },
  { label: 'Students from Hyderabad', icon: 'bi-geo-alt' },
  { label: 'Top five courses', icon: 'bi-book' },
  { label: 'Total students per city', icon: 'bi-building' },
  { label: 'Count of students by subject', icon: 'bi-journal-text' },
  { label: 'Students who paid more than 30000', icon: 'bi-cash-coin' },
  { label: 'Youngest joiners this year', icon: 'bi-people' },
]

export default function AskAiPage() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [showSql, setShowSql] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const ask = async (q) => {
    const query = (q ?? question).trim()
    if (!query) return
    setLoading(true)
    setError('')
    setResponse(null)
    setQuestion(query)
    try {
      const res = await AiApi.ask(query)
      setResponse(res.data)
    } catch (e) {
      setError(e.message || 'Failed to process AI query')
    } finally {
      setLoading(false)
    }
  }

  const handleCopySql = () => {
    if (response?.sql) {
      navigator.clipboard.writeText(response.sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container-fluid px-0 py-2">
      {/* Hero AI Banner */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-5 rounded-4 shadow-lg text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="position-absolute top-0 end-0 p-4 opacity-10 d-none d-md-block">
              <i className="bi bi-cpu" style={{ fontSize: '8rem' }} />
            </div>
            <div className="position-relative z-1" style={{ maxWidth: '800px' }}>
              <div className="d-inline-flex align-items-center bg-white bg-opacity-10 px-3 py-1 rounded-pill mb-3 backdrop-blur">
                <span className="spinner-grow spinner-grow-sm text-success me-2" role="status" />
                <span className="small fw-semibold text-uppercase tracking-wider">Natural Language to SQL Engine</span>
              </div>
              <h1 className="display-6 fw-bold mb-2">Ask AI in Plain English</h1>
              <p className="lead mb-4 text-white-50">
                Type any analytical query about your student database. Our enterprise AI instantly converts your question into optimized SQL, executes it securely, and visualizes results.
              </p>

              <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden bg-white p-1">
                <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none fs-5"
                  placeholder="e.g. Show average fee by course or Students from Hyderabad..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask()}
                  disabled={loading}
                />
                {question && (
                  <button className="btn btn-link text-muted border-0 text-decoration-none" onClick={() => setQuestion('')}>
                    <i className="bi bi-x-lg" />
                  </button>
                )}
                <button 
                  className="btn btn-primary px-4 rounded-3 fw-semibold d-flex align-items-center gap-2" 
                  onClick={() => ask()} 
                  disabled={loading || !question.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <i className="bi bi-arrow-right" />
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-4">
                <div className="text-white-50 small mb-2 fw-semibold text-uppercase tracking-wider">Suggested Queries:</div>
                <div className="d-flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      className="btn btn-sm btn-light bg-white bg-opacity-10 text-white border-0 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 hover-glass transition"
                      onClick={() => ask(s.label)}
                      style={{ backdropFilter: 'blur(4px)', transition: 'all 0.2s ease' }}
                    >
                      <i className={`bi ${s.icon} text-info`} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results / Feedback Section */}
      <div className="row">
        <div className="col-12">
          {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
          {loading && (
            <div className="card border-0 shadow-sm py-5 my-3 text-center rounded-4">
              <Spinner label="Analyzing query, translating to SQL, and executing securely..." />
            </div>
          )}

          {response && !loading && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <div className="text-uppercase text-muted small fw-bold tracking-wider mb-1">Executed Question</div>
                  <h4 className="fw-bold text-dark mb-1">{response.question}</h4>
                  {response.summary && (
                    <p className="text-secondary mb-0 mt-2 fs-6 bg-light p-3 rounded-3 border-start border-primary border-4">
                      {response.summary}
                    </p>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className={`btn btn-sm ${showSql ? 'btn-dark' : 'btn-outline-dark'} rounded-pill px-3`} 
                    onClick={() => setShowSql((v) => !v)}
                  >
                    <i className="bi bi-code-slash me-1" />
                    {showSql ? 'Hide SQL' : 'View SQL'}
                  </button>
                </div>
              </div>

              {showSql && (
                <div className="card-body bg-dark text-white mx-4 mb-4 rounded-4 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary">
                    <span className="small text-muted font-monospace"><i className="bi bi-terminal me-1" /> Generated SQL Query</span>
                    <button className="btn btn-sm btn-outline-light py-0 px-2 small" onClick={handleCopySql}>
                      <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'} me-1`} />
                      {copied ? 'Copied!' : 'Copy SQL'}
                    </button>
                  </div>
                  <pre className="m-0 font-monospace text-info fs-6 overflow-x-auto p-2" style={{ background: 'transparent' }}>
                    {response.sql}
                  </pre>
                </div>
              )}

              {response.warning && (
                <div className="mx-4 mb-3 alert alert-warning d-flex align-items-center rounded-3">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5" />
                  <div>{response.warning}</div>
                </div>
              )}

              <div className="card-body px-4 pb-4">
                <AiResultView response={response} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
