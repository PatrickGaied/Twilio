import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, TrendingUp, DollarSign, Target, Plus, Filter, Search, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import ProductSegmentInsights from '../components/ProductSegmentInsights'
import CampaignModal from '../components/CampaignModal'
import PopupAdCreator from '../components/PopupAdCreator'
import ThemeToggle from '../components/ThemeToggle'
import AIChat from '../components/AIChat'

interface CustomerSegment {
  id: string
  name: string
  type: string
  description: string
  customer_count: number
  criteria: any
  created_at: string
  updated_at: string
}

interface Customer {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  segment_ids: string[]
  total_orders: number
  total_spent: number
  last_activity: string
  conversion_rate: number
  lifetime_value: number
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<CustomerSegment[]>([])
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [segmentOverview, setSegmentOverview] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    fetchSegmentsData()
  }, [])

  const fetchSegmentsData = async () => {
    setIsLoading(true)
    try {
      // Fetch segments
      const segmentsRes = await fetch('/api/segments/')
      const segmentsData = await segmentsRes.json()
      setSegments(segmentsData || [])

      // Fetch segment overview
      const overviewRes = await fetch('/api/segments/stats/overview')
      const overviewData = await overviewRes.json()
      setSegmentOverview(overviewData || {})

      // Select first segment by default
      if (segmentsData && segmentsData.length > 0) {
        setSelectedSegment(segmentsData[0])
        fetchSegmentCustomers(segmentsData[0].id)
      }

    } catch (error) {
      console.error('Error fetching segments data:', error)
      setMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSegmentCustomers = async (segmentId: string) => {
    try {
      const customersRes = await fetch(`/api/segments/${segmentId}/customers`)
      const customersData = await customersRes.json()
      setCustomers(customersData || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    }
  }

  const setMockData = () => {
    const mockSegments = [
      {
        id: "seg_1",
        name: "High Converters",
        type: "high_converters",
        description: "Customers with >10% conversion rate and high LTV",
        customer_count: 2847,
        criteria: {"conversion_rate": {"gt": 0.1}},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "seg_2",
        name: "Window Shoppers",
        type: "window_shoppers",
        description: "High browser activity, no purchases",
        customer_count: 15623,
        criteria: {"views": {"gt": 10}, "purchases": {"eq": 0}},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    setSegments(mockSegments)
    setSelectedSegment(mockSegments[0])
    setSegmentOverview({
      total_segments: 5,
      total_customers: 44054,
      segments: [
        {name: 'High Converters', count: 2847, percentage: 6.5},
        {name: 'Window Shoppers', count: 15623, percentage: 35.4}
      ]
    })
    setIsLoading(false)
  }

  const getSegmentColor = (type: string) => {
    const colors = {
      'high_converters': 'from-green-500 to-emerald-600',
      'window_shoppers': 'from-yellow-500 to-orange-600',
      'cart_abandoners': 'from-purple-500 to-violet-600',
      'loyal_customers': 'from-blue-500 to-indigo-600',
      'at_risk': 'from-red-500 to-rose-600'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'high_converters': return '🎯'
      case 'window_shoppers': return '👀'
      case 'cart_abandoners': return '🛒'
      case 'loyal_customers': return '⭐'
      case 'at_risk': return '⚠️'
      default: return '👥'
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCampaignFromInsight = (product: string, segment: string) => {
    setCampaignModal({ isOpen: true, productName: product, segmentName: segment })
  }

  const handleCreatePopupAdFromInsight = (product: string, segment: string) => {
    setPopupAdModal({ isOpen: true, productName: product, segmentName: segment })
  }

  // Prepare data for AI chat
  const getChatData = () => {
    const topProducts = [
      {
        name: "iPhone 15 Pro",
        brand: "Apple",
        sales: 2847,
        revenue: 2567340,
        segment: "High Converters",
        price: 1199.99
      },
      {
        name: "Samsung Galaxy S24",
        brand: "Samsung",
        sales: 1923,
        revenue: 1634550,
        segment: "Loyal Customers",
        price: 999.99
      },
      {
        name: "MacBook Air M3",
        brand: "Apple",
        sales: 1456,
        revenue: 1891244,
        segment: "High Converters",
        price: 1299.99
      },
      {
        name: "AirPods Pro",
        brand: "Apple",
        sales: 3421,
        revenue: 855250,
        segment: "Window Shoppers",
        price: 249.99
      },
      {
        name: "Sony WH-1000XM5",
        brand: "Sony",
        sales: 987,
        revenue: 394800,
        segment: "High Converters",
        price: 399.99
      }
    ]

    return {
      segments: [
        { name: "High Converters", customers: 2847, percentage: 6.5, status: "Active" },
        { name: "Window Shoppers", customers: 15623, percentage: 35.4, status: "Active" },
        { name: "Cart Abandoners", customers: 8941, percentage: 20.3, status: "Active" },
        { name: "Loyal Customers", customers: 4256, percentage: 9.7, status: "Active" },
        { name: "At Risk", customers: 12387, percentage: 28.1, status: "Active" }
      ],
      topProducts,
      overview: {
        total_segments: segmentOverview.total_segments || 5,
        total_customers: segmentOverview.total_customers || 44054,
        total_revenue: topProducts.reduce((sum, p) => sum + p.revenue, 0)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Customer Segments - Segmind</title>
        <meta name="description" content="Manage and analyze customer segments" />
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
                  <a href="/" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/segments" className="nav-item active dark:text-purple-400 dark:bg-purple-900/20">
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
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <line x1="4" x2="20" y1="12" y2="12"></line>
                    <line x1="4" x2="20" y1="6" y2="6"></line>
                    <line x1="4" x2="20" y1="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              // Loading skeletons for stats
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="metric-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3 w-24"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                    </div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Segments</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {segmentOverview.total_segments || 0}
                      </p>
                      <div className="stat-badge positive mt-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        12% this month
                      </div>
                    </div>
                    <Target className="h-10 w-10 text-purple-600" />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {segmentOverview.total_customers?.toLocaleString() || '0'}
                      </p>
                      <div className="stat-badge positive mt-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        8% this month
                      </div>
                    </div>
                    <Users className="h-10 w-10 text-purple-600" />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Revenue per Segment</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        $142K
                      </p>
                      <div className="stat-badge neutral mt-2">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        2% this month
                      </div>
                    </div>
                    <DollarSign className="h-10 w-10 text-purple-600" />
                  </div>
                </div>
              </>
            )}
          </div>


          {/* Product-Segment Insights */}
          <div className="mt-8">
            <ProductSegmentInsights
              onCreateCampaign={handleCreateCampaignFromInsight}
              onCreatePopupAd={handleCreatePopupAdFromInsight}
            />
          </div>
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

        {/* AI Chat */}
        <AIChat
          pageData={getChatData()}
          context="customer segments and product performance data"
        />
      </div>
    </>
  )
}