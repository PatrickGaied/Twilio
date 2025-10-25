import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Users, MessageCircle, TrendingUp, DollarSign, Activity, Target, Plus, Menu, X, Wand2, BarChart2, Clock, Dot, Zap, Search, Network, GitBranch } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import CampaignModal from '../components/CampaignModal'
import PopupAdCreator from '../components/PopupAdCreator'

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
  const [activeTab, setActiveTab] = useState<'analytics' | 'trends' | 'clusters'>('analytics')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)

  // State for pan and zoom
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 })

  // Pan and zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setLastPan({ x: transform.x, y: transform.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setTransform(prev => ({
        ...prev,
        x: lastPan.x + deltaX,
        y: lastPan.y + deltaY
      }))
      e.preventDefault()
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const container = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - container.left
    const mouseY = e.clientY - container.top

    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(transform.scale * scaleFactor, 0.5), 3)

    // Calculate new position to zoom towards mouse
    const scaleRatio = newScale / transform.scale
    const newX = mouseX - (mouseX - transform.x) * scaleRatio
    const newY = mouseY - (mouseY - transform.y) * scaleRatio

    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    })
  }

  const resetZoom = () => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }

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
  const [popupAdModal, setPopupAdModal] = useState<{
    isOpen: boolean
    segmentName?: string
    productName?: string
  }>({ isOpen: false })

  // Mock data for OCR campaign analysis
  const [pastCampaigns] = useState([
    {
      product: "iPhone 15 Pro",
      image_description: "Picture of a woman holding iPhone with city background",
      performance: "High conversion rate",
      campaign_type: "Email",
      date: "2024-01-10",
      metrics: { conversion_rate: 28.4, clicks: 1250, opens: 4500 }
    },
    {
      product: "MacBook Pro",
      image_description: "Professional setup with MacBook on minimalist desk",
      performance: "Medium conversion rate",
      campaign_type: "Popup",
      date: "2024-01-08",
      metrics: { conversion_rate: 15.2, clicks: 890, opens: 3200 }
    },
    {
      product: "AirPods Max",
      image_description: "Person wearing headphones in studio environment",
      performance: "Low conversion rate",
      campaign_type: "Email",
      date: "2024-01-05",
      metrics: { conversion_rate: 8.7, clicks: 420, opens: 2100 }
    }
  ])

  // Mock data for product clustering
  const [productClusters] = useState([
    {
      cluster_name: "Premium Smartphones",
      products: ["iPhone 15 Pro", "iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra"],
      center: { x: 25, y: 80 },
      color: "bg-blue-500"
    },
    {
      cluster_name: "Budget Smartphones",
      products: ["iPhone SE", "Samsung Galaxy A54", "Google Pixel 7a"],
      center: { x: 15, y: 30 },
      color: "bg-green-500"
    },
    {
      cluster_name: "Professional Laptops",
      products: ["MacBook Pro M3", "MacBook Air M2", "Dell XPS 13"],
      center: { x: 70, y: 85 },
      color: "bg-purple-500"
    },
    {
      cluster_name: "Audio Accessories",
      products: ["AirPods Pro", "AirPods Max", "Sony WH-1000XM5"],
      center: { x: 45, y: 60 },
      color: "bg-orange-500"
    },
    {
      cluster_name: "Wearables",
      products: ["Apple Watch Ultra", "Apple Watch Series 9", "Samsung Galaxy Watch"],
      center: { x: 60, y: 40 },
      color: "bg-pink-500"
    }
  ])

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

        {/* Sub-Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <BarChart2 className="h-4 w-4 mr-2 inline" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'trends'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Clock className="h-4 w-4 mr-2 inline" />
                Past Trends
              </button>
              <button
                onClick={() => setActiveTab('clusters')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'clusters'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Network className="h-4 w-4 mr-2 inline" />
                Product Clusters
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'analytics' && (
            <>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{realtimeMetrics.messages_sent_today?.toLocaleString() || '0'}</span>
                      <div className="stat-badge positive text-xs">+15%</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-green-600">${realtimeMetrics.revenue_today?.toLocaleString() || '0'}</span>
                      <div className="stat-badge positive text-xs">+8%</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Conversions</span>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-purple-600">{realtimeMetrics.recent_conversions || 0}</span>
                      <div className="stat-badge neutral text-xs">±0%</div>
                    </div>
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
            </>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Campaign Trends</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">OCR analysis of past campaigns and their performance</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full flex items-center space-x-1">
                  <Search className="h-4 w-4 text-blue-800 dark:text-blue-200" />
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">OCR Powered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {pastCampaigns.map((campaign, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{campaign.product}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.campaign_type === 'Email'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {campaign.campaign_type}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{campaign.image_description}"</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                        <span className={`text-sm font-medium ${
                          campaign.performance.includes('High') ? 'text-green-600' :
                          campaign.performance.includes('Medium') ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {campaign.performance}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{campaign.metrics.conversion_rate}%</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">CVR</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{campaign.metrics.clicks}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{campaign.metrics.opens}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Opens</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeTab === 'clusters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Clusters</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Visualization of product similarity and clustering patterns</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full flex items-center space-x-1">
                  <GitBranch className="h-4 w-4 text-purple-800 dark:text-purple-200" />
                  <span className="text-sm text-purple-800 dark:text-purple-200 font-medium">ML Clustering</span>
                </div>
              </div>

              {/* Cluster Visualization - Interactive Graph */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Graph Visualization */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Similarity Graph</h3>

                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-2 mb-3">
                    <button
                      onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }))}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded"
                    >
                      Zoom In
                    </button>
                    <button
                      onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.5) }))}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded"
                    >
                      Zoom Out
                    </button>
                    <button
                      onClick={resetZoom}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded"
                    >
                      Reset View
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(transform.scale * 100)}%
                    </span>
                  </div>

                  <div
                    className="relative h-96 bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden border cursor-grab"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                  >
                    {/* Zoomable/Pannable Content Container */}
                    <div
                      className="absolute inset-0 transition-transform origin-top-left"
                      style={{
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        transformOrigin: '0 0'
                      }}
                    >
                      {/* Graph Axes */}
                      <div className="absolute inset-0">
                      {/* Y-axis */}
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-400 dark:bg-gray-500"></div>
                      {/* X-axis */}
                      <div className="absolute left-4 bottom-4 right-4 h-px bg-gray-400 dark:bg-gray-500"></div>

                      {/* Axis Labels */}
                      <div className="absolute left-1 top-2 text-xs text-gray-300 dark:text-gray-300 transform -rotate-90 origin-left">
                        Market Appeal
                      </div>
                      <div className="absolute bottom-1 right-2 text-xs text-gray-300 dark:text-gray-300">
                        Price Range
                      </div>
                    </div>

                    {/* Individual Product Dots - Randomly positioned within clusters */}
                    {productClusters.map((cluster, clusterIndex) =>
                      cluster.products.map((product, productIndex) => {
                        // Generate consistent random positions within cluster radius using product name as seed
                        const seed = product.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
                        const angle = (seed * 137.5) % 360 // Golden angle for even distribution
                        const radius = 15 + (seed % 20) // Random radius between 15-35px from center
                        const radians = (angle * Math.PI) / 180
                        const x = cluster.center.x + (Math.cos(radians) * radius) / 4
                        const y = cluster.center.y + (Math.sin(radians) * radius) / 4
                        const isSelected = selectedProduct === product
                        const isClusterSelected = selectedCluster === cluster.cluster_name

                        return (
                          <div
                            key={`${clusterIndex}-${productIndex}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isDragging) {
                                setSelectedProduct(selectedProduct === product ? null : product)
                                setSelectedCluster(cluster.cluster_name)
                              }
                            }}
                            className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 shadow-lg border-2 ${
                              isSelected
                                ? `${cluster.color} border-gray-900 dark:border-white scale-150 z-10`
                                : isClusterSelected
                                ? `${cluster.color} border-white scale-125`
                                : `${cluster.color} border-white hover:scale-125`
                            }`}
                            style={{
                              left: `${Math.max(6, Math.min(94, x))}%`,
                              top: `${Math.max(6, Math.min(94, y))}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                            title={`${product} - Click to explore`}
                          />
                        )
                      })
                    )}

                    {/* Cluster Boundary Shapes - Scanner Style */}
                    {productClusters.map((cluster, index) => {
                      const isSelected = selectedCluster === cluster.cluster_name;
                      return (
                        <svg
                          key={`boundary-${index}`}
                          className={`absolute pointer-events-none transition-opacity duration-300 ${
                            isSelected ? 'opacity-80' : 'opacity-25'
                          }`}
                          style={{
                            left: `${cluster.center.x}%`,
                            top: `${cluster.center.y}%`,
                            width: '120px',
                            height: '120px',
                            transform: 'translate(-50%, -50%)'
                          }}
                          viewBox="0 0 120 120"
                        >
                          {/* Cluster outline circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                   cluster.color.includes('red') ? '#ef4444' :
                                   cluster.color.includes('yellow') ? '#f59e0b' :
                                   cluster.color.includes('green') ? '#10b981' :
                                   cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'}
                            strokeWidth="2"
                            strokeDasharray="8,4"
                            opacity="0.6"
                          />

                          {/* Outer boundary circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r="55"
                            fill="none"
                            stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                   cluster.color.includes('red') ? '#ef4444' :
                                   cluster.color.includes('yellow') ? '#f59e0b' :
                                   cluster.color.includes('green') ? '#10b981' :
                                   cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'}
                            strokeWidth="1"
                            strokeDasharray="4,8"
                            opacity="0.4"
                          />

                          {/* Corner brackets for scanner effect */}
                          <g opacity={isSelected ? "0.8" : "0.4"}>
                            {/* Top-left bracket */}
                            <path
                              d="M25 25 L25 35 M25 25 L35 25"
                              stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                     cluster.color.includes('red') ? '#ef4444' :
                                     cluster.color.includes('yellow') ? '#f59e0b' :
                                     cluster.color.includes('green') ? '#10b981' :
                                     cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'}
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            {/* Top-right bracket */}
                            <path
                              d="M95 25 L95 35 M95 25 L85 25"
                              stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                     cluster.color.includes('red') ? '#ef4444' :
                                     cluster.color.includes('yellow') ? '#f59e0b' :
                                     cluster.color.includes('green') ? '#10b981' :
                                     cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'}
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            {/* Bottom-left bracket */}
                            <path
                              d="M25 95 L25 85 M25 95 L35 95"
                              stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                     cluster.color.includes('red') ? '#ef4444' :
                                     cluster.color.includes('yellow') ? '#f59e0b' :
                                     cluster.color.includes('green') ? '#10b981' :
                                     cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'}
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            {/* Bottom-right bracket */}
                            <path
                              d="M95 95 L95 85 M95 95 L85 95"
                              stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                     cluster.color.includes('red') ? '#ef4444' :
                                     cluster.color.includes('yellow') ? '#f59e0b' :
                                     cluster.color.includes('green') ? '#10b981' :
                                     cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'}
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </g>

                          {/* Center crosshair when selected */}
                          {isSelected && (
                            <g opacity="0.6">
                              <line x1="50" y1="60" x2="70" y2="60" stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                     cluster.color.includes('red') ? '#ef4444' :
                                     cluster.color.includes('yellow') ? '#f59e0b' :
                                     cluster.color.includes('green') ? '#10b981' :
                                     cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'} strokeWidth="2"/>
                              <line x1="60" y1="50" x2="60" y2="70" stroke={cluster.color.includes('blue') ? '#3b82f6' :
                                     cluster.color.includes('red') ? '#ef4444' :
                                     cluster.color.includes('yellow') ? '#f59e0b' :
                                     cluster.color.includes('green') ? '#10b981' :
                                     cluster.color.includes('purple') ? '#8b5cf6' : '#6b7280'} strokeWidth="2"/>
                            </g>
                          )}
                        </svg>
                      );
                    })}

                    {/* Cluster Labels */}
                    {productClusters.map((cluster, index) => (
                      <div
                        key={index}
                        className={`absolute cursor-pointer transition-all duration-200 ${
                          selectedCluster === cluster.cluster_name ? 'scale-110' : ''
                        }`}
                        style={{
                          left: `${cluster.center.x}%`,
                          top: `${cluster.center.y + 18}%`,
                          transform: 'translate(-50%, 0)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isDragging) {
                            setSelectedCluster(selectedCluster === cluster.cluster_name ? null : cluster.cluster_name)
                          }
                        }}
                      >
                        <div className={`px-2 py-1 rounded shadow-sm border transition-colors duration-200 ${
                          selectedCluster === cluster.cluster_name
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'bg-white dark:bg-gray-700'
                        }`}>
                          <span className={`text-xs font-medium ${
                            selectedCluster === cluster.cluster_name
                              ? 'text-white dark:text-gray-900'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {cluster.cluster_name}
                          </span>
                          <div className={`text-xs ${
                            selectedCluster === cluster.cluster_name
                              ? 'text-gray-300 dark:text-gray-600'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {cluster.products.length} products
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Click and drag to pan, scroll to zoom. Click on products or cluster names to explore relationships.
                  </p>
                </div>

                {/* Product Details Sidebar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Details</h3>

                  {selectedProduct ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{selectedProduct}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cluster: {selectedCluster}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Market Appeal</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.floor(Math.random() * 30 + 70)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Similarity Score</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.floor(Math.random() * 20 + 80)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Price Range</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${Math.floor(Math.random() * 500 + 200)} - ${Math.floor(Math.random() * 800 + 800)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Related Products</h5>
                        <div className="space-y-1">
                          {productClusters
                            .find(c => c.cluster_name === selectedCluster)?.products
                            .filter(p => p !== selectedProduct)
                            .map((product, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedProduct(product)}
                                className="block w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {product}
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => {
                            setSelectedProduct(null)
                            setSelectedCluster(null)
                          }}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          Clear selection
                        </button>
                      </div>
                    </div>
                  ) : selectedCluster ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{selectedCluster}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {productClusters.find(c => c.cluster_name === selectedCluster)?.products.length} products in this cluster
                        </p>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Products in this cluster:</h5>
                        <div className="space-y-1">
                          {productClusters
                            .find(c => c.cluster_name === selectedCluster)?.products
                            .map((product, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedProduct(product)}
                                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:underline p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                {product}
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => setSelectedCluster(null)}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          Clear selection
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 dark:text-gray-500 mb-2">
                        <Network className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click on a product or cluster to explore details and relationships
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cluster Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productClusters.map((cluster, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-6 h-6 rounded-full ${cluster.color}`}></div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cluster.cluster_name}</h3>
                    </div>

                    <div className="space-y-2">
                      {cluster.products.map((product, productIndex) => (
                        <div key={productIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm text-gray-900 dark:text-white">{product}</span>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${cluster.color}`}></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.floor(Math.random() * 20 + 80)}% similarity
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Cluster Insights:</strong> Products in this cluster share similar features, pricing, and customer appeal patterns.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>

        {/* Campaign Modal */}
        <CampaignModal
          isOpen={campaignModal.isOpen}
          onClose={() => setCampaignModal({ isOpen: false })}
          segmentName={campaignModal.segmentName}
          productName={campaignModal.productName}
        />

        {/* Popup Ad Creator */}
        <PopupAdCreator
          isOpen={popupAdModal.isOpen}
          onClose={() => setPopupAdModal({ isOpen: false })}
          segmentName={popupAdModal.segmentName}
          productName={popupAdModal.productName}
        />
      </div>
    </>
  )
}