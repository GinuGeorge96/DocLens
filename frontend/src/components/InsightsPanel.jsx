import { useState, useEffect } from 'react'
import { getInsights } from '../services/api'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function InsightsPanel({ file, filename }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!file) return
    setLoading(true)
    setError(null)
    getInsights(file)
      .then(res => setInsights(res.data))
      .catch(() => setError('Failed to generate insights.'))
      .finally(() => setLoading(false))
  }, [file])

  const renderChart = () => {
    if (!insights?.chart || !insights?.sample) return null
    const { type, x_column, y_column, title } = insights.chart
    const data = insights.sample

    if (type === 'bar') return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_column} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={y_column} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    )

    if (type === 'line') return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_column} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={y_column} stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    )

    if (type === 'pie') return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey={y_column} nameKey={x_column} cx="50%" cy="50%" outerRadius={80}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Insights — <span className="text-blue-500">{filename}</span>
      </h3>

      {loading && <p className="text-gray-400 animate-pulse">Analyzing your data...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {insights && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Key Findings</h4>
            <ul className="space-y-2">
              {insights.insights.map((insight, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 font-bold">{i + 1}.</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              {insights.chart?.title || 'Chart'}
            </h4>
            {renderChart()}
          </div>
        </div>
      )}
    </div>
  )
}
