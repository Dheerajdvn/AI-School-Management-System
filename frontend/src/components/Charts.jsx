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
)

const baseOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: !!title, text: title },
  },
})

export function BarChart({ title, labels, values }) {
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
    <div style={{ height: 320 }}>
      <Bar data={data} options={baseOptions(title)} />
    </div>
  )
}

export function PieChart({ title, labels, values }) {
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
  const options = { ...baseOptions(title), plugins: { ...baseOptions(title).plugins, legend: { display: true, position: 'right' } } }
  return (
    <div style={{ height: 320 }}>
      <Pie data={data} options={options} />
    </div>
  )
}

export function LineChart({ title, labels, values }) {
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
          pointRadius: 2,
        },
      ],
    }),
    [labels, values, title],
  )
  return (
    <div style={{ height: 320 }}>
      <Line data={data} options={baseOptions(title)} />
    </div>
  )
}

/**
 * Generic chart that renders bar/pie/line based on an explicit `type` prop.
 */
export default function Chart({ type = 'bar', title, labels, values }) {
  if (type === 'pie') return <PieChart title={title} labels={labels} values={values} />
  if (type === 'line') return <LineChart title={title} labels={labels} values={values} />
  return <BarChart title={title} labels={labels} values={values} />
}
