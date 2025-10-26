import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Users, TrendingUp, DollarSign, Target, Plus, Filter, Search, ArrowUpRight, ArrowDownRight, Zap, Mail, Calendar, ShoppingCart, Eye, MousePointer, Smartphone, Edit3, Send, Clock, BarChart3, TrendingDown, AlertCircle, Settings, ChevronRight, Star, Activity, Percent, Package, Sparkles, ImageIcon, AlertTriangle, CheckCircle, X } from 'lucide-react'
import ProductSegmentInsights from '../components/ProductSegmentInsights'
import CampaignModal from '../components/CampaignModal'
import PopupAdCreator from '../components/PopupAdCreator'
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
  const [popupAdModal, setPopupAdModal] = useState<{
    isOpen: boolean
    segmentName?: string
    productName?: string
  }>({ isOpen: false })

  // Email Generation Flow State
  const [emailGenerationFlow, setEmailGenerationFlow] = useState({
    selectedSegment: null as any,
    generatedEmail: '',
    emailMode: 'auto' as 'auto' | 'manual',
    scheduledTime: '',
    campaignName: '',
    isEmailGenerated: false,
    isScheduled: false,
    isGenerating: false
  })
  const [showInsightModal, setShowInsightModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Product Search State
  const [productSearch, setProductSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedProductForPromotion, setSelectedProductForPromotion] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [activeInsightTab, setActiveInsightTab] = useState('similar')
  const [ocrInsights, setOcrInsights] = useState<any[]>([])

  // Calendar State
  const [scheduledCampaigns, setScheduledCampaigns] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month')

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

  // Mock product data
  const mockProducts = [
    { id: 'p1', name: 'iPhone 15 Pro', category: 'Phones', price: 999, image: '📱', description: 'Latest Apple smartphone' },
    { id: 'p2', name: 'Samsung Galaxy S24', category: 'Phones', price: 899, image: '📱', description: 'Android flagship' },
    { id: 'p3', name: 'MacBook Pro', category: 'Laptops', price: 1999, image: '💻', description: 'Apple laptop' },
    { id: 'p4', name: 'AirPods Pro', category: 'Audio', price: 249, image: '🎧', description: 'Wireless earbuds' },
    { id: 'p5', name: 'iPad Air', category: 'Tablets', price: 599, image: '📱', description: 'Apple tablet' }
  ]

  // Search products function
  const handleProductSearch = (term: string) => {
    setProductSearch(term)
    if (term.length > 0) {
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.category.toLowerCase().includes(term.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }

  // Select product function
  const selectProductForPromotion = (product: any) => {
    setSelectedProductForPromotion(product)
    setProductSearch(product.name)
    setSearchResults([])

    // Generate similar products with strategies and OCR insights
    if (product.name.includes('iPhone')) {
      setSimilarProducts([
        {
          id: 'p2',
          name: 'Samsung Galaxy S24',
          strategy: 'Use iPhone\'s premium positioning strategy - highlight exclusive features and early access',
          reason: 'S25 launching soon - create urgency around current inventory',
          urgency: 'High',
          expectedBoost: '+25%',
          successExample: 'iPhone 15 Pro early access emails had 34% higher CTR'
        },
        {
          id: 'p6',
          name: 'Google Pixel 8',
          strategy: 'Apply iPhone\'s photography angle - focus on camera quality and AI features',
          reason: 'Leverage iPhone users\' interest in premium camera tech',
          urgency: 'Medium',
          expectedBoost: '+15%',
          successExample: 'Camera-focused iPhone emails convert 18% better'
        }
      ])
      setOcrInsights([
        {
          type: 'audience',
          audience: 'Window Shoppers',
          conversionRate: '12.4%',
          strategy: 'Create emails on Monday and Wednesday for window shoppers. If they view and click cart, trigger follow-up within 2 hours.',
          timing: 'Best: Mon 10AM, Wed 2PM',
          followUp: 'Auto cart abandonment sequence',
          confidence: '89%'
        },
        {
          type: 'audience',
          audience: 'High Converters',
          conversionRate: '28.7%',
          strategy: 'Friday premium drops work best. Use exclusive language and limited quantities.',
          timing: 'Best: Fri 9AM',
          followUp: 'VIP early access for next product',
          confidence: '94%'
        },
        {
          type: 'warning',
          message: 'iPhone emails perform 40% worse when product images contain desert/outdoor backgrounds',
          confidence: '87%',
          source: 'Past 30 campaigns analysis'
        },
        {
          type: 'tip',
          message: 'Studio lighting with tech-focused backgrounds increase iPhone CTR by 23%',
          confidence: '92%',
          source: 'A/B test data'
        }
      ])

      // Generate strategy recommendation
      setStrategyRecommendation({
        product: product.name,
        primaryAudience: 'Window Shoppers',
        strategy: 'Create emails on Monday and Wednesday for window shoppers. If they view and click cart, trigger follow-up within 2 hours.',
        timing: ['Monday 10AM', 'Wednesday 2PM'],
        followUp: 'Auto cart abandonment sequence',
        expectedCampaigns: 5,
        weeklySchedule: [
          { day: 'Monday', time: '10:00 AM', type: 'Primary Campaign', audience: 'Window Shoppers' },
          { day: 'Wednesday', time: '2:00 PM', type: 'Primary Campaign', audience: 'Window Shoppers' },
          { day: 'Thursday', time: '11:00 AM', type: 'Follow-up', audience: 'Cart Abandoners' },
          { day: 'Friday', time: '9:00 AM', type: 'Premium Drop', audience: 'High Converters' },
          { day: 'Sunday', time: '6:00 PM', type: 'Weekly Recap', audience: 'All Segments' }
        ]
      })
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

  const handleCreateCampaignFromInsight = (product: string, segment: string) => {
    setCampaignModal({ isOpen: true, productName: product, segmentName: segment })
  }

  const handleCreatePopupAdFromInsight = (product: string, segment: string) => {
    setPopupAdModal({ isOpen: true, productName: product, segmentName: segment })
  }

  const generateEmailWithChatGPT = () => {
    const segment = emailGenerationFlow.selectedSegment
    const product = selectedProductForPromotion

    if (!segment) return 'Please select a segment first.'

    let content = ''
    if (segment.name === 'High Converters') {
      content = `As one of our premium customers, you get first access to the ${product?.name || 'latest tech'}.`
    } else if (segment.name === 'Window Shoppers') {
      content = `We noticed you've been exploring our tech collection! Check out the ${product?.name || 'iPhone 15 Pro'}.`
    } else if (segment.name === 'Cart Abandoners') {
      content = `Your cart is waiting! Complete your purchase of ${product?.name || 'selected items'}.`
    } else if (segment.name === 'Loyal Customers') {
      content = `Thank you for being a valued customer! Here's an exclusive preview of ${product?.name || 'our latest product'}.`
    } else {
      content = `We miss you! Here's 25% off to welcome you back.`
    }

    const baseEmail = `Hi {{first_name}},

${content}

Best regards,
The Segmind Team`

    return baseEmail
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
            </div>
          </div>
        </header>

        {/* Main Content - Product Selection Flow */}
        <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Flow Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Builder</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Products → Calendar → Analytics</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">📱 Tech Products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">

            {/* Column 1: Product Catalog Searcher */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Package className="h-5 w-5 mr-2 text-purple-600" />
                  Product Catalog
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Search and select products to promote</p>
              </div>

              {/* Product Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products (e.g., iPhone, MacBook)..."
                    value={productSearch}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => selectProductForPromotion(product)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{product.image}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category} • ${product.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Product */}
              {selectedProductForPromotion && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Selected Product</h4>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{selectedProductForPromotion.image}</span>
                      <div>
                        <div className="font-medium text-purple-900 dark:text-purple-100">{selectedProductForPromotion.name}</div>
                        <div className="text-sm text-purple-600 dark:text-purple-300">${selectedProductForPromotion.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Catalog */}
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">All Products</h4>
                <div className="space-y-2">
                  {mockProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => selectProductForPromotion(product)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                        selectedProductForPromotion?.id === product.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{product.image}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category} • ${product.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Interactive Calendar */}
            <div className="col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                    Campaign Calendar
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCalendarView('week')}
                      className={`px-3 py-1 text-sm rounded ${
                        calendarView === 'week' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setCalendarView('month')}
                      className={`px-3 py-1 text-sm rounded ${
                        calendarView === 'month' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4">
                {!selectedProductForPromotion ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Select a product to schedule campaigns</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Auto Generate Campaign Button */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Generate Campaign Strategy</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">For {selectedProductForPromotion.name}</p>
                        </div>
                        <button
                          onClick={() => setShowStrategyModal(true)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Strategy
                        </button>
                      </div>
                    </div>

                    {/* Mini Calendar */}
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">October 2024</h4>
                        <div className="flex space-x-1">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                          <div key={day} className="p-2 font-medium text-gray-500">{day}</div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                          <div
                            key={date}
                            onClick={() => setSelectedDate(`2024-10-${String(date).padStart(2, '0')}`)}
                            className={`p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer rounded ${
                              selectedDate === `2024-10-${String(date).padStart(2, '0')}`
                                ? 'bg-purple-500 text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {date}
                            {scheduledCampaigns.some(c => c.date === `2024-10-${String(date).padStart(2, '0')}`) && (
                              <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scheduled Campaigns */}
                    {scheduledCampaigns.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">Scheduled Campaigns</h4>
                        {scheduledCampaigns.map(campaign => (
                          <div key={campaign.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-green-800 dark:text-green-200">{campaign.product}</div>
                                <div className="text-sm text-green-600 dark:text-green-400">{campaign.date} at {campaign.time}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                                  {campaign.status}
                                </span>
                                <button className="text-green-600 hover:text-green-800">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Analytics & Similar Products */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Analytics & Insights
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!selectedProductForPromotion ? (
                  <div className="text-center text-gray-400 py-8 px-4">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select a product to see insights</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {/* OCR Analytics */}
                    {ocrInsights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          OCR Insights
                        </h4>
                        <div className="space-y-2">
                          {ocrInsights.map((insight, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${
                              insight.type === 'warning'
                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                            }`}>
                              <div className="flex items-start">
                                {insight.type === 'warning' ? (
                                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className={`text-xs font-medium ${
                                    insight.type === 'warning'
                                      ? 'text-orange-800 dark:text-orange-200'
                                      : 'text-blue-800 dark:text-blue-200'
                                  }`}>
                                    {insight.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-500">{insight.source}</span>
                                    <span className={`text-xs font-medium ${
                                      insight.type === 'warning'
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                    }`}>
                                      {insight.confidence} confidence
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Vector Similarity Suggestions
                        </h4>
                        <div className="space-y-2">
                          {similarProducts.map((product, index) => (
                            <div key={index} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-purple-900 dark:text-purple-100 text-sm">
                                  {product.name}
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  product.urgency === 'High'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {product.urgency}
                                </span>
                              </div>
                              <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">{product.reason}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  {product.expectedBoost} boost
                                </span>
                                <button
                                  onClick={() => selectProductForPromotion({ name: product.name, id: product.id })}
                                  className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                                >
                                  Promote Instead
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Campaign Performance Prediction */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Predicted Performance
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Expected Open Rate</span>
                          <span className="text-sm font-medium text-green-600">24.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Expected CTR</span>
                          <span className="text-sm font-medium text-blue-600">8.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Revenue Potential</span>
                          <span className="text-sm font-medium text-purple-600">$12,450</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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