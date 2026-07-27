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
        font: { size: 11 }
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
          label: title || 'Enrollment',
          data: values,
          backgroundColor: labels.map((_, i) => hexToRgba(PALETTE[i % PALETTE.length], 0.85)),
          borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 1.5,
          borderRadius: 8,
        },
      ],
    }),
    [labels, values, title],
  )

  return (
    <div style={{ height: 300, cursor: onClick ? 'pointer' : 'default' }}>
      <Bar data={data} options={getBaseOptions(title, onClick, isDark)} />
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
          backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 2,
          borderColor: isDark ? '#18181b' : '#ffffff',
        },
      ],
    }),
    [labels, values, title, isDark],
  )

  const options = {
    ...getBaseOptions(title, onClick, isDark),
    scales: {}, // Pie charts don't require x/y axis scales
    plugins: {
      ...getBaseOptions(title, onClick, isDark).plugins,
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: isDark ? '#e2e8f0' : '#1e293b',
          font: { size: 12, weight: '600' },
          padding: 14,
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
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#4f46e5',
          pointHoverRadius: 6,
        },
      ],
    }),
    [labels, values, title],
  )

  return (
    <div style={{ height: 300, cursor: onClick ? 'pointer' : 'default' }}>
      <Line data={data} options={getBaseOptions(title, onClick, isDark)} />
    </div>
  )
}

export default function Chart({ type = 'bar', title, labels, values, onClick }) {
  if (type === 'pie') return <PieChart title={title} labels={labels} values={values} onClick={onClick} />
  if (type === 'line') return <LineChart title={title} labels={labels} values={values} onClick={onClick} />
  return <BarChart title={title} labels={labels} values={values} onClick={onClick} />
}
