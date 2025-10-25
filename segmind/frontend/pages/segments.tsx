import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, TrendingUp, DollarSign, Target, Plus, Filter, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import ProductSegmentInsights from '../components/ProductSegmentInsights'
import CampaignModal from '../components/CampaignModal'
import ThemeToggle from '../components/ThemeToggle'

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Segments List */}
            <div className="lg:col-span-1">
              <div className="klaviyo-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Segments</h3>
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  {isLoading ? (
                    // Loading skeletons for segments
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-24"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-32"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    segments.map((segment) => (
                      <div
                        key={segment.id}
                        onClick={() => {
                          setSelectedSegment(segment)
                          fetchSegmentCustomers(segment.id)
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedSegment?.id === segment.id
                            ? 'border-purple-200 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                            : 'border-gray-100 hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getSegmentColor(segment.type)} flex items-center justify-center text-white text-lg`}>
                              {getSegmentIcon(segment.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{segment.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{segment.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {segment.customer_count.toLocaleString()} customers
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Segment Details */}
            <div className="lg:col-span-2">
              {isLoading ? (
                // Loading skeleton for segment details
                <div className="space-y-6">
                  <div className="klaviyo-card">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-48"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="text-center">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 mx-auto w-16"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto w-20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="klaviyo-card">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 w-48"></div>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedSegment ? (
                <div className="space-y-6">
                  {/* Segment Header */}
                  <div className="klaviyo-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getSegmentColor(selectedSegment.type)} flex items-center justify-center text-white text-2xl`}>
                          {getSegmentIcon(selectedSegment.type)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSegment.name}</h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedSegment.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-ghost">Edit</button>
                        <button
                          onClick={() => setCampaignModal({ isOpen: true, segmentName: selectedSegment.name })}
                          className="btn-primary"
                        >
                          Create Campaign
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSegment.customer_count.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">$1,247</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg LTV</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">12.4%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Customers Table */}
                  <div className="klaviyo-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customers in Segment</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="table-modern">
                        <thead>
                          <tr>
                            <th className="rounded-tl-lg">Customer</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                            <th>Conversion Rate</th>
                            <th>Last Activity</th>
                            <th className="rounded-tr-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.slice(0, 10).map((customer) => (
                            <tr key={customer.id}>
                              <td>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {customer.first_name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{customer.first_name} {customer.last_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="font-medium text-gray-900 dark:text-white">{customer.total_orders}</span>
                              </td>
                              <td>
                                <span className="font-medium text-green-600">${customer.total_spent.toLocaleString()}</span>
                              </td>
                              <td>
                                <div className="flex items-center space-x-2">
                                  <div className="progress-bar w-16">
                                    <div
                                      className="progress-fill"
                                      style={{ width: `${Math.min(customer.conversion_rate * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {(customer.conversion_rate * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(customer.last_activity).toLocaleDateString()}
                                </span>
                              </td>
                              <td>
                                <button className="btn-ghost text-sm py-1 px-3">
                                  View Profile
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredCustomers.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No customers found matching your search.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="klaviyo-card">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Customer Segments</h3>
                    <p className="text-gray-600 dark:text-gray-400">Analyze customer behavior and create targeted campaigns.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product-Segment Insights */}
          <div className="mt-8">
            <ProductSegmentInsights onCreateCampaign={handleCreateCampaignFromInsight} />
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