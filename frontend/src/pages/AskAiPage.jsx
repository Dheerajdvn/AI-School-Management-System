import React, { useState } from 'react'
import { AiApi } from '../services/api'
import AiResultView from '../components/AiResultView'
import ErrorBanner from '../components/ErrorBanner'
import Spinner from '../components/Spinner'

const SUGGESTIONS = [
  'Show all Java students',
  'Students joined in January 2024',
  'Average fee',
  'Highest fee student',
  'Students from Hyderabad',
  'Top five courses',
  'Total students per city',
  'Count of students by subject',
  'Students who paid more than 30000',
  'Youngest joiners this year',
]

export default function AskAiPage() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [showSql, setShowSql] = useState(false)
  const [error, setError] = useState('')

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
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="ask-box">
          <h4 className="mb-1">
            <i className="bi bi-robot me-2" />
            Ask AI in plain English
          </h4>
          <p className="mb-3" style={{ opacity: 0.85 }}>
            Your question is converted to SQL, validated, and executed safely against the student database.
          </p>
          <div className="d-flex gap-2">
            <input
              className="form-control form-control-lg"
              placeholder="e.g. Show average fee by course"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              disabled={loading}
            />
            <button className="btn btn-light btn-lg px-4" onClick={() => ask()} disabled={loading || !question.trim()}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-send-fill" />}
            </button>
          </div>
          <div className="mt-3 d-flex flex-wrap">
            {SUGGESTIONS.map((s) => (
              <span key={s} className="suggestion-chip" onClick={() => ask(s)}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12">
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
        {loading && <Spinner label="Generating SQL and running query…" />}

        {response && (
          <div className="panel">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <div className="text-muted small">Question</div>
                <div className="fw-semibold">{response.question}</div>
                {response.summary && <div className="mt-1 text-secondary">{response.summary}</div>}
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowSql((v) => !v)}>
                <i className="bi bi-code-slash me-1" />
                {showSql ? 'Hide' : 'Show'} SQL
              </button>
            </div>

            {showSql && (
              <pre className="p-3 mb-3" style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: 8, overflowX: 'auto' }}>
                {response.sql}
              </pre>
            )}

            {response.warning && (
              <div className="alert alert-warning py-2 small">{response.warning}</div>
            )}

            <AiResultView response={response} />
          </div>
        )}
      </div>
    </div>
  )
}
