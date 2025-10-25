import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

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

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

export default function DashboardCharts({ segmentData, channelData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Customer Segments */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Segments</h3>
          <a href="/breakdown" className="btn-ghost text-sm dark:text-gray-300 dark:hover:text-white">View Breakdown →</a>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [value.toLocaleString(), 'Customers']}
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
            </PieChart>
          </ResponsiveContainer>
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