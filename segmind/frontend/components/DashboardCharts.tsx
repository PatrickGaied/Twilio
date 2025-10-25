import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useState } from 'react'

interface SegmentData {
  name: string
  count: number
  percentage: number
}

interface ChannelData {
  name: string
  messages_sent: number
  delivery_rate: number
  open_rate: number
  click_rate: number
  roi: number
}

interface DashboardChartsProps {
  segmentData: SegmentData[]
  channelData: ChannelData[]
}

const COLORS = [
  { start: '#8b5cf6', end: '#6366f1' }, // Purple gradient
  { start: '#06b6d4', end: '#0891b2' }, // Cyan gradient
  { start: '#10b981', end: '#059669' }, // Emerald gradient
  { start: '#f59e0b', end: '#d97706' }, // Amber gradient
  { start: '#ef4444', end: '#dc2626' }, // Red gradient
  { start: '#ec4899', end: '#db2777' }, // Pink gradient
]

export default function DashboardCharts({ segmentData, channelData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Customer Segments */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Segments</h3>
          <a href="/breakdown" className="btn-ghost text-sm dark:text-gray-300 dark:hover:text-white">View Breakdown →</a>
        </div>
        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <radialGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    cx="50%"
                    cy="50%"
                    r="80%"
                  >
                    <stop offset="0%" stopColor={color.start} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color.end} stopOpacity={0.7} />
                  </radialGradient>
                ))}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                </filter>
              </defs>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                dataKey="count"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
                filter="url(#shadow)"
              >
                {segmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index % COLORS.length})`}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '13px'
                }}
                formatter={(value, entry) => (
                  <span style={{
                    color: '#6b7280',
                    fontWeight: '400'
                  }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {segmentData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Customers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Channel Performance</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  color: 'var(--tooltip-text)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{
                  color: 'var(--tooltip-text)'
                }}
              />
              <Bar dataKey="roi" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}