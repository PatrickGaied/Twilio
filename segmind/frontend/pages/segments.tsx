import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, TrendingUp, DollarSign, Target, Plus, Filter, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'

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

  useEffect(() => {
    fetchSegmentsData()
  }, [])

  const fetchSegmentsData = async () => {
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

  return (
    <>
      <Head>
        <title>Customer Segments - Segmind</title>
        <meta name="description" content="Manage and analyze customer segments" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="header-glass sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Customer Segments</h1>
                <p className="text-gray-600 mt-1">Manage and analyze your customer segments for targeted messaging</p>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="btn-ghost">← Back to Dashboard</a>
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Segment
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Segments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
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
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
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
                  <p className="text-sm font-medium text-gray-600">Avg Revenue per Segment</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Segments List */}
            <div className="lg:col-span-1">
              <div className="klaviyo-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Segments</h3>
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      onClick={() => {
                        setSelectedSegment(segment)
                        fetchSegmentCustomers(segment.id)
                      }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedSegment?.id === segment.id
                          ? 'border-purple-200 bg-purple-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getSegmentColor(segment.type)} flex items-center justify-center text-white text-lg`}>
                            {getSegmentIcon(segment.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm font-medium text-gray-900">
                                {segment.customer_count.toLocaleString()} customers
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Segment Details */}
            <div className="lg:col-span-2">
              {selectedSegment ? (
                <div className="space-y-6">
                  {/* Segment Header */}
                  <div className="klaviyo-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getSegmentColor(selectedSegment.type)} flex items-center justify-center text-white text-2xl`}>
                          {getSegmentIcon(selectedSegment.type)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedSegment.name}</h2>
                          <p className="text-gray-600 mt-1">{selectedSegment.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-ghost">Edit</button>
                        <button className="btn-primary">Create Campaign</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{selectedSegment.customer_count.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">$1,247</p>
                        <p className="text-sm text-gray-600">Avg LTV</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">12.4%</p>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Customers Table */}
                  <div className="klaviyo-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Customers in Segment</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                    <p className="font-medium text-gray-900">{customer.first_name} {customer.last_name}</p>
                                    <p className="text-sm text-gray-600">{customer.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="font-medium text-gray-900">{customer.total_orders}</span>
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
                                  <span className="text-sm font-medium text-gray-900">
                                    {(customer.conversion_rate * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="text-sm text-gray-600">
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
                    <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Segment</h3>
                    <p className="text-gray-600">Choose a segment from the left to view its details and customers.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}