import { useState, useEffect } from 'react'
import Head from 'next/head'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts'
import { TrendingUp, DollarSign, MessageCircle, Users, Zap, Target, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [overview, setOverview] = useState<any>({})
  const [engagement, setEngagement] = useState<any>({})
  const [channels, setChannels] = useState<any[]>([])
  const [segments, setSegments] = useState<any[]>([])
  const [revenue, setRevenue] = useState<any>({})

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      // Fetch all analytics data
      const [overviewRes, engagementRes, channelsRes, segmentsRes, revenueRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/engagement'),
        fetch('/api/analytics/channels'),
        fetch('/api/analytics/segments/performance'),
        fetch('/api/analytics/revenue')
      ])

      const [overviewData, engagementData, channelsData, segmentsData, revenueData] = await Promise.all([
        overviewRes.json(),
        engagementRes.json(),
        channelsRes.json(),
        segmentsRes.json(),
        revenueRes.json()
      ])

      setOverview(overviewData)
      setEngagement(engagementData)
      setChannels(channelsData.channels || [])
      setSegments(segmentsData.segments || [])
      setRevenue(revenueData)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setMockData()
    }
  }

  const setMockData = () => {
    setOverview({
      total_messages_sent: 156789,
      total_customers: 44054,
      revenue_attributed: 2847593.45,
      avg_engagement_rate: 24.7,
      monthly_growth: 18.5
    })

    setEngagement({
      total_messages: 156789,
      delivery_rate: 97.2,
      open_rate: 24.7,
      click_rate: 5.8,
      conversion_rate: 2.1,
      roi: 8.2
    })

    setChannels([
      { name: 'SMS', messages_sent: 89456, delivery_rate: 98.9, open_rate: 89.2, click_rate: 12.4, roi: 12.1 },
      { name: 'Email', messages_sent: 45678, delivery_rate: 96.8, open_rate: 18.5, click_rate: 4.2, roi: 15.6 },
      { name: 'WhatsApp', messages_sent: 12345, delivery_rate: 99.1, open_rate: 95.6, click_rate: 18.9, roi: 22.3 },
      { name: 'Push', messages_sent: 9310, delivery_rate: 94.2, open_rate: 12.8, click_rate: 2.1, roi: 8.7 }
    ])

    setRevenue({
      total_revenue_attributed: 2847593.45,
      monthly_trend: [
        { month: 'Jan', revenue: 189456.78, messages: 12345 },
        { month: 'Feb', revenue: 234567.89, messages: 15678 },
        { month: 'Mar', revenue: 278901.23, messages: 18901 },
        { month: 'Apr', revenue: 312345.67, messages: 21234 },
        { month: 'May', revenue: 345678.90, messages: 23567 },
        { month: 'Jun', revenue: 389012.34, messages: 25890 }
      ]
    })
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

  const getChannelColor = (channel: string) => {
    const colors = {
      'SMS': '#8b5cf6',
      'Email': '#06b6d4',
      'WhatsApp': '#10b981',
      'Push': '#f59e0b'
    }
    return colors[channel as keyof typeof colors] || '#6b7280'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <>
      <Head>
        <title>Analytics Report - Segmind</title>
        <meta name="description" content="Comprehensive analytics and performance metrics" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="header-glass sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Analytics Report</h1>
                <p className="text-gray-600 mt-1">Comprehensive performance metrics and insights</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <a href="/" className="btn-ghost">← Back to Dashboard</a>
                <button className="btn-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
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
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatCurrency(overview.revenue_attributed || 0)}
                  </p>
                  <div className="stat-badge positive mt-2">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {overview.monthly_growth || 0}% vs last month
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-purple-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {overview.total_messages_sent?.toLocaleString() || '0'}
                  </p>
                  <div className="stat-badge positive mt-2">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    15% vs last month
                  </div>
                </div>
                <MessageCircle className="h-10 w-10 text-purple-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatPercentage(overview.avg_engagement_rate || 0)}
                  </p>
                  <div className="stat-badge positive mt-2">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    3.2% vs last month
                  </div>
                </div>
                <Zap className="h-10 w-10 text-purple-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {overview.total_customers?.toLocaleString() || '0'}
                  </p>
                  <div className="stat-badge positive mt-2">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8% vs last month
                  </div>
                </div>
                <Users className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="chart-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue.monthly_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Revenue']} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      fill="url(#revenueGradient)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Channel Performance</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channels}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="messages_sent"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {channels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getChannelColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Messages']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Channel Metrics */}
          <div className="chart-container mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Channel Metrics Comparison</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="roi">ROI %</option>
                  <option value="delivery_rate">Delivery Rate</option>
                  <option value="open_rate">Open Rate</option>
                  <option value="click_rate">Click Rate</option>
                </select>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channels}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={(value: any) => [`${value}${selectedMetric.includes('rate') ? '%' : ''}`, selectedMetric]} />
                  <Bar
                    dataKey={selectedMetric}
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Channel Performance Table */}
            <div className="klaviyo-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Channel Performance Details</h3>
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">Channel</th>
                      <th>Messages</th>
                      <th>Delivery</th>
                      <th>Open Rate</th>
                      <th className="rounded-tr-lg">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.map((channel) => (
                      <tr key={channel.name}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getChannelColor(channel.name) }}
                            ></div>
                            <span className="font-medium text-gray-900">{channel.name}</span>
                          </div>
                        </td>
                        <td>{channel.messages_sent.toLocaleString()}</td>
                        <td>{formatPercentage(channel.delivery_rate)}</td>
                        <td>{formatPercentage(channel.open_rate)}</td>
                        <td>
                          <span className="font-medium text-green-600">
                            {formatPercentage(channel.roi)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="klaviyo-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Overall Engagement</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Rate</span>
                  <div className="flex items-center space-x-3">
                    <div className="progress-bar w-32">
                      <div
                        className="progress-fill"
                        style={{ width: `${engagement.delivery_rate || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">
                      {formatPercentage(engagement.delivery_rate || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Open Rate</span>
                  <div className="flex items-center space-x-3">
                    <div className="progress-bar w-32">
                      <div
                        className="progress-fill"
                        style={{ width: `${engagement.open_rate || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">
                      {formatPercentage(engagement.open_rate || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Click Rate</span>
                  <div className="flex items-center space-x-3">
                    <div className="progress-bar w-32">
                      <div
                        className="progress-fill"
                        style={{ width: `${(engagement.click_rate || 0) * 4}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">
                      {formatPercentage(engagement.click_rate || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <div className="flex items-center space-x-3">
                    <div className="progress-bar w-32">
                      <div
                        className="progress-fill"
                        style={{ width: `${(engagement.conversion_rate || 0) * 10}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">
                      {formatPercentage(engagement.conversion_rate || 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">Overall ROI</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPercentage(engagement.roi || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="klaviyo-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Top Performing</h4>
                </div>
                <p className="text-sm text-green-800">
                  WhatsApp has the highest ROI at 22.3%. Consider expanding WhatsApp campaigns for better returns.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900">Optimization Opportunity</h4>
                </div>
                <p className="text-sm text-yellow-800">
                  Push notifications have low engagement. Review content strategy and timing for better performance.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">Growth Potential</h4>
                </div>
                <p className="text-sm text-purple-800">
                  Email shows strong conversion rates. Scale up email campaigns to increase overall revenue.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}