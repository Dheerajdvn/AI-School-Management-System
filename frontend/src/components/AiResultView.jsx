import React, { useMemo } from 'react'
import Chart from './Charts'
import { formatNumber, formatCurrency, PALETTE } from '../utils/format'

/**
 * Renders an AI query response either as a metric, a chart, or a table,
 * depending on the shape of the result set and the backend's chartType hint.
 */
export default function AiResultView({ response }) {
  const { rows = [], chartType } = response || {}
  const columns = useMemo(() => (rows.length ? Object.keys(rows[0]) : []), [rows])

  if (!rows.length) {
    return <div className="text-muted">No rows returned.</div>
  }

  if (chartType === 'metric' && rows.length === 1 && columns.length === 1) {
    const label = columns[0]
    const raw = rows[0][label]
    const value = typeof raw === 'number' && /fee|revenue|amount/i.test(label)
      ? formatCurrency(raw)
      : formatNumber(raw)
    return (
      <div className="text-center py-4">
        <div className="text-muted text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
          {prettyLabel(label)}
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#4f46e5' }}>{value}</div>
      </div>
    )
  }

  if (columns.length === 2) {
    const labels = rows.map((r) => String(r[columns[0]]))
    const values = rows.map((r) => Number(r[columns[1]]) || 0)
    const type = chartType === 'pie' ? 'pie' : 'bar'
    return <Chart type={type} title={prettyLabel(columns[1])} labels={labels} values={values} />
  }

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{prettyLabel(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 100).map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c}>{formatCell(row[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 100 && <div className="text-muted small">Showing first 100 of {rows.length} rows.</div>}
    </div>
  )
}

function prettyLabel(name) {
  return String(name)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function formatCell(v) {
  if (v === null || v === undefined) return '-'
  if (typeof v === 'number') return Number.isInteger(v) ? formatNumber(v) : v
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    return new Date(v).toLocaleDateString('en-IN')
  }
  return String(v)
}
