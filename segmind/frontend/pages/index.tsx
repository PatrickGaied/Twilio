import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, MessageCircle, TrendingUp, DollarSign, Activity, Target } from 'lucide-react'

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

export default function Dashboard() {
  const [segmentData, setSegmentData] = useState<SegmentData[]>([])
  const [channelData, setChannelData] = useState<ChannelData[]>([])
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>({})
  const [overview, setOverview] = useState<any>({})

  useEffect(() => {
    // Fetch data from API
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch segment overview
      const segmentRes = await fetch('/api/segments/stats/overview')
      const segmentOverview = await segmentRes.json()
      setSegmentData(segmentOverview.segments || [])

      // Fetch channel performance
      const channelRes = await fetch('/api/analytics/channels')
      const channelPerf = await channelRes.json()
      setChannelData(channelPerf.channels || [])

      // Fetch overview metrics
      const overviewRes = await fetch('/api/analytics/overview')
      const overviewData = await overviewRes.json()
      setOverview(overviewData)

      // Fetch realtime metrics
      const realtimeRes = await fetch('/api/analytics/realtime')
      const realtimeData = await realtimeRes.json()
      setRealtimeMetrics(realtimeData)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to mock data
      setMockData()
    }
  }

  const setMockData = () => {
    setSegmentData([
      { name: 'High Converters', count: 2847, percentage: 6.5 },
      { name: 'Window Shoppers', count: 15623, percentage: 35.4 },
      { name: 'Cart Abandoners', count: 8941, percentage: 20.3 },
      { name: 'Loyal Customers', count: 4256, percentage: 9.7 },
      { name: 'At Risk', count: 12387, percentage: 28.1 }
    ])

    setChannelData([
      { name: 'SMS', messages_sent: 89456, delivery_rate: 98.9, open_rate: 89.2, click_rate: 12.4, roi: 12.1 },
      { name: 'Email', messages_sent: 45678, delivery_rate: 96.8, open_rate: 18.5, click_rate: 4.2, roi: 15.6 },
      { name: 'WhatsApp', messages_sent: 12345, delivery_rate: 99.1, open_rate: 95.6, click_rate: 18.9, roi: 22.3 },
      { name: 'Push', messages_sent: 9310, delivery_rate: 94.2, open_rate: 12.8, click_rate: 2.1, roi: 8.7 }
    ])

    setOverview({
      total_messages_sent: 156789,
      total_customers: 44054,
      active_campaigns: 3,
      revenue_attributed: 2847593.45,
      avg_engagement_rate: 24.7,
      monthly_growth: 18.5
    })

    setRealtimeMetrics({
      messages_sent_today: 4567,
      revenue_today: 12456.78,
      recent_conversions: 23,
      live_metrics: {
        messages_per_minute: 12,
        delivery_rate_today: 97.8,
        engagement_rate_today: 26.3
      }
    })
  }

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

  return (
    <>
      <Head>
        <title>Segmind - Customer Messaging Dashboard</title>
        <meta name="description" content="Advanced customer segmentation and messaging analytics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="header-glass sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Segmind</h1>
                <p className="text-gray-600 mt-1">Customer Messaging & Analytics Platform</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <a href="/segments" className="nav-item">
                    <Users className="h-4 w-4" />
                    <span>Segments</span>
                  </a>
                  <a href="/products" className="nav-item">
                    <Target className="h-4 w-4" />
                    <span>Products</span>
                  </a>
                  <a href="/analytics" className="nav-item">
                    <TrendingUp className="h-4 w-4" />
                    <span>Analytics</span>
                  </a>
                </div>
                <div className="floating-card px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Live Activity</div>
                      <div className="text-sm font-medium">{realtimeMetrics?.live_metrics?.messages_per_minute || 0} msg/min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.total_messages_sent?.toLocaleString() || '0'}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.total_customers?.toLocaleString() || '0'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Attributed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${overview.revenue_attributed?.toLocaleString() || '0'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.avg_engagement_rate || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Customer Segments */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
                <a href="/segments" className="btn-ghost text-sm">View All →</a>
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
                    <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Customers']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Channel Performance */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Channel Performance</h3>
                <a href="/analytics" className="btn-ghost text-sm">View Analytics →</a>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
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

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Segment Details */}
            <div className="klaviyo-card lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Segment Breakdown</h3>
              <div className="space-y-4">
                {segmentData.map((segment, index) => (
                  <div key={segment.name} className="group p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {segment.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{segment.name}</p>
                          <p className="text-sm text-gray-600">{segment.count.toLocaleString()} customers</p>
                          <div className="progress-bar w-32 mt-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${segment.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{segment.percentage}%</p>
                        <div className="segment-pill" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}>
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Activity */}
            <div className="klaviyo-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Activity</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Messages Sent</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">{realtimeMetrics.messages_sent_today?.toLocaleString() || '0'}</span>
                    <div className="stat-badge positive text-xs">+15%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600">${realtimeMetrics.revenue_today?.toLocaleString() || '0'}</span>
                    <div className="stat-badge positive text-xs">+8%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversions</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-purple-600">{realtimeMetrics.recent_conversions || 0}</span>
                    <div className="stat-badge neutral text-xs">±0%</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Delivery Rate</span>
                      <span className="font-semibold text-gray-900">{realtimeMetrics.live_metrics?.delivery_rate_today || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Engagement Rate</span>
                      <span className="font-semibold text-gray-900">{realtimeMetrics.live_metrics?.engagement_rate_today || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Top Product Today</p>
                    <p className="font-bold text-gray-900">{realtimeMetrics.top_selling_product_today || 'iPhone 15 Pro'}</p>
                    <p className="text-sm font-semibold text-green-600">${realtimeMetrics.electronics_sales_today?.toLocaleString() || '8,934'} sales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-center space-x-4">
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create New Campaign
            </button>
            <a href="/segments" className="btn-secondary">
              <Users className="h-4 w-4 mr-2" />
              View All Segments
            </a>
            <a href="/products" className="btn-secondary">
              <Target className="h-4 w-4 mr-2" />
              Products Analytics
            </a>
            <a href="/analytics" className="btn-secondary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Full Analytics Report
            </a>
          </div>
        </main>
      </div>
    </>
  )
}