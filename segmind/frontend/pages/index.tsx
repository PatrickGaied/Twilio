import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Users, MessageCircle, TrendingUp, DollarSign, Activity, Target, Plus, Menu, X, Wand2 } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import CampaignModal from '../components/CampaignModal'

// Create a client-side only chart component
const DashboardCharts = dynamic(() => import('../components/DashboardCharts'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
})

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [campaignModal, setCampaignModal] = useState<{
    isOpen: boolean
    segmentName?: string
    productName?: string
  }>({ isOpen: false })

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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold brand-text">Segmind</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Customer Messaging & Analytics Platform</p>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <nav className="flex items-center space-x-1">
                  <a href="/" className="nav-item active dark:text-purple-400 dark:bg-purple-900/20">
                    <TrendingUp className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/segments" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Users className="h-4 w-4" />
                    <span>Segments</span>
                  </a>
                  <a href="/breakdown" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Target className="h-4 w-4" />
                    <span>Breakdown</span>
                  </a>
                </nav>

                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden flex items-center space-x-3">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="lg:hidden pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                <nav className="space-y-2">
                  <a href="/" className="block nav-item active dark:text-purple-400 dark:bg-purple-900/20">
                    <TrendingUp className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/segments" className="block nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Users className="h-4 w-4" />
                    <span>Segments</span>
                  </a>
                  <a href="/breakdown" className="block nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Target className="h-4 w-4" />
                    <span>Breakdown</span>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overview.total_messages_sent?.toLocaleString() || '0'}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overview.total_customers?.toLocaleString() || '0'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Attributed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${overview.revenue_attributed?.toLocaleString() || '0'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overview.avg_engagement_rate || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <DashboardCharts segmentData={segmentData} channelData={channelData} />

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Segment Details */}
            <div className="klaviyo-card lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Segment Breakdown</h3>
              <div className="space-y-4">
                {segmentData.map((segment, index) => (
                  <div
                    key={segment.name}
                    onClick={() => setCampaignModal({ isOpen: true, segmentName: segment.name })}
                    className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {segment.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{segment.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{segment.count.toLocaleString()} customers</p>
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
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{segment.percentage}%</p>
                        <div className="flex items-center space-x-2">
                          <div className="segment-pill" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}>
                            Active
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Wand2 className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Activity */}
            <div className="klaviyo-card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Today's Activity</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Messages Sent</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{realtimeMetrics.messages_sent_today?.toLocaleString() || '0'}</span>
                    <div className="stat-badge positive text-xs">+15%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600">${realtimeMetrics.revenue_today?.toLocaleString() || '0'}</span>
                    <div className="stat-badge positive text-xs">+8%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Conversions</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-purple-600">{realtimeMetrics.recent_conversions || 0}</span>
                    <div className="stat-badge neutral text-xs">±0%</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Delivery Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{realtimeMetrics.live_metrics?.delivery_rate_today || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Engagement Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{realtimeMetrics.live_metrics?.engagement_rate_today || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Product Today</p>
                    <p className="font-bold text-gray-900 dark:text-white">{realtimeMetrics.top_selling_product_today || 'iPhone 15 Pro'}</p>
                    <p className="text-sm font-semibold text-green-600">${realtimeMetrics.electronics_sales_today?.toLocaleString() || '8,934'} sales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* Campaign Modal */}
        <CampaignModal
          isOpen={campaignModal.isOpen}
          onClose={() => setCampaignModal({ isOpen: false })}
          segmentName={campaignModal.segmentName}
          productName={campaignModal.productName}
        />
      </div>
    </>
  )
}