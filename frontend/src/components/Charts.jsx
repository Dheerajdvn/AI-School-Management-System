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

const baseOptions = (title, onClick) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
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
    title: { display: !!title, text: title },
    tooltip: {
      enabled: true,
    },
  },
})

export function BarChart({ title, labels, values, onClick }) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title || '',
          data: values,
          backgroundColor: labels.map((_, i) => hexToRgba(PALETTE[i % PALETTE.length], 0.75)),
          borderColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [labels, values, title],
  )
  return (
    <div style={{ height: 320, cursor: onClick ? 'pointer' : 'default' }}>
      <Bar data={data} options={baseOptions(title, onClick)} />
    </div>
  )
}

export function PieChart({ title, labels, values, onClick }) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title || '',
          data: values,
          backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 1,
        },
      ],
    }),
    [labels, values, title],
  )
  const options = { ...baseOptions(title, onClick), plugins: { ...baseOptions(title, onClick).plugins, legend: { display: true, position: 'right' } } }
  return (
    <div style={{ height: 320, cursor: onClick ? 'pointer' : 'default' }}>
      <Pie data={data} options={options} />
    </div>
  )
}

export function LineChart({ title, labels, values, onClick }) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: title || '',
          data: values,
          borderColor: PALETTE[0],
          backgroundColor: hexToRgba(PALETTE[0], 0.15),
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }),
    [labels, values, title],
  )
  return (
    <div style={{ height: 320, cursor: onClick ? 'pointer' : 'default' }}>
      <Line data={data} options={baseOptions(title, onClick)} />
    </div>
  )
}

/**
 * Generic chart that renders bar/pie/line based on an explicit `type` prop.
 */
export default function Chart({ type = 'bar', title, labels, values, onClick }) {
  if (type === 'pie') return <PieChart title={title} labels={labels} values={values} onClick={onClick} />
  if (type === 'line') return <LineChart title={title} labels={labels} values={values} onClick={onClick} />
  return <BarChart title={title} labels={labels} values={values} onClick={onClick} />
}
