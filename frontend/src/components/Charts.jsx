import React, { useMemo } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { PALETTE, hexToRgba } from '../utils/format'
import { useTheme } from '../context/ThemeContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const getBaseOptions = (title, onClick, isDark) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      ticks: {
        color: isDark ? '#94a3b8' : '#475569',
        font: { size: 11, weight: '500' }
      },
      grid: {
        color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: isDark ? '#94a3b8' : '#475569',
        font: { size: 11 },
        precision: 0,
      },
      grid: {
        color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
      }
    },
  },
  onClick: (event, elements, chart) => {
    if (onClick && elements && elements.length > 0) {
      const index = elements[0].index
      const label = chart.data.labels[index]
      const value = chart.data.datasets[elements[0].datasetIndex].data[index]
      onClick({ index, label, value, event })
    }
  },
  plugins: {
    legend: { display: false },
    title: {
      display: !!title,
      text: title,
      color: isDark ? '#f8fafc' : '#0f172a',
      font: { size: 14, weight: 'bold' }
    },
    tooltip: {
      enabled: true,
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      titleColor: isDark ? '#f8fafc' : '#0f172a',
      bodyColor: isDark ? '#cbd5e1' : '#334155',
      borderColor: isDark ? '#334155' : '#cbd5e1',
      borderWidth: 1,
      padding: 10,
      boxPadding: 4
    },
  },
})

export function BarChart({ title, labels, values, onClick }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || document.body.classList.contains('dark-mode')

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title || 'Count',
          data: values,
          backgroundColor: labels.map((_, i) => hexToRgba(PALETTE[i % PALETTE.length], isDark ? 0.65 : 0.75)),
          borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 1.5,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 42,
        },
      ],
    }),
    [labels, values, title, isDark],
  )

  const options = useMemo(() => {
    const base = getBaseOptions(title, onClick, isDark)
    return {
      ...base,
      scales: {
        ...base.scales,
        x: {
          ...base.scales.x,
          ticks: {
            ...base.scales.x.ticks,
            maxRotation: 28,
            minRotation: 0,
            autoSkip: false,
            callback: function(val) {
              const raw = this.getLabelForValue(val) || ''
              return raw.length > 18 ? raw.slice(0, 16) + '…' : raw
            }
          }
        },
        y: {
          ...base.scales.y,
          grid: {
            ...base.scales.y.grid,
            borderDash: [3, 3],
          },
          ticks: {
            ...base.scales.y.ticks,
            stepSize: 5,
          }
        }
      },
      plugins: {
        ...base.plugins,
        tooltip: {
          ...base.plugins.tooltip,
          callbacks: {
            title: function(context) {
              return labels[context[0].dataIndex] || context[0].label
            },
            label: function(context) {
              const datasetLabel = context.dataset.label || 'Count'
              return `  ${datasetLabel}: ${context.parsed.y}`
            }
          }
        }
      }
    }
  }, [title, onClick, isDark, labels])

  return (
    <div style={{ height: '100%', minHeight: 220, cursor: onClick ? 'pointer' : 'default' }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export function PieChart({ title, labels, values, onClick }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || document.body.classList.contains('dark-mode')

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title || 'Distribution',
          data: values,
          backgroundColor: labels.map((_, i) => hexToRgba(PALETTE[i % PALETTE.length], isDark ? 0.75 : 0.85)),
          borderWidth: 2,
          borderColor: isDark ? '#141418' : '#ffffff',
          hoverOffset: 4,
        },
      ],
    }),
    [labels, values, title, isDark],
  )

  const options = {
    ...getBaseOptions(title, onClick, isDark),
    scales: {}, // Pie charts don't require x/y axis scales
    cutout: '62%', // Modern Doughnut aesthetic
    plugins: {
      ...getBaseOptions(title, onClick, isDark).plugins,
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: isDark ? '#94a3b8' : '#475569',
          font: { size: 11, weight: '500' },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  }

  return (
    <div style={{ height: 300, cursor: onClick ? 'pointer' : 'default' }}>
      <Pie data={data} options={options} />
    </div>
  )
}

export function LineChart({ title, labels, values, onClick }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || document.body.classList.contains('dark-mode')

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title || 'Trend',
          data: values,
          borderColor: '#6366f1',
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.10)' : 'rgba(99, 102, 241, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: isDark ? '#09090b' : '#ffffff',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
        },
      ],
    }),
    [labels, values, title, isDark],
  )

  const options = useMemo(() => {
    const base = getBaseOptions(title, onClick, isDark)
    const maxVal = Math.max(...(values && values.length > 0 ? values : [0]), 0)
    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          beginAtZero: true,
          suggestedMax: maxVal === 0 ? 5 : undefined,
          ticks: {
            ...base.scales?.y?.ticks,
            precision: 0,
          }
        }
      }
    }
  }, [title, onClick, isDark, values])

  return (
    <div style={{ height: 300, cursor: onClick ? 'pointer' : 'default' }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default function Chart({ type = 'bar', title, labels, values, onClick }) {
  if (type === 'pie') return <PieChart title={title} labels={labels} values={values} onClick={onClick} />
  if (type === 'line') return <LineChart title={title} labels={labels} values={values} onClick={onClick} />
  return <BarChart title={title} labels={labels} values={values} onClick={onClick} />
}
