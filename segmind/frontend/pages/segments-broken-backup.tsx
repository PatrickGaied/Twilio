import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
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

  const generateEmailWithChatGPT = () => {
    const segment = emailGenerationFlow.selectedSegment
    const product = selectedProductForPromotion

    if (!segment) return ''

    const baseEmail = `Hi {{first_name}},

${segment.name === 'High Converters'
  ? `As one of our premium customers, you get first access to the ${product?.name || 'latest tech'}.

🎯 Exclusive early access
📱 ${product?.name || 'Premium device'} - ${product?.price || 'Special pricing'}
🚚 Free premium setup & delivery

Your high engagement shows you appreciate quality.

Claim your ${product?.name || 'device'} now →`
  : segment.name === 'Window Shoppers'
  ? `We noticed you've been exploring our tech collection!

👀 Based on your browsing:
• ${product?.name || 'iPhone 15 Pro'} - ${product?.price || '$1199'}

Not sure which is right for you? Our experts are here to help.

Get personalized recommendations →`
  : segment.name === 'Cart Abandoners'
  ? `Your cart is waiting! We saved your items:

🛒 ${product?.name || 'Selected item'} - ${product?.price || '$999'}

⏰ Limited stock alert: Only 3 left
💰 Complete now & save $50

Complete your purchase →`
  : segment.name === 'Loyal Customers'
  ? `Thank you for being a valued customer!

⭐ VIP exclusive preview:
• ${product?.name || 'MacBook Air M3'} with cutting-edge features
• 20% loyalty discount applied

Shop VIP collection →`
  : `We miss you! Here's 25% off to welcome you back:

⚠️ It's been a while since your last visit
💰 25% off everything sitewide

Code: COMEBACK25 (expires in 48h)

Rediscover what you love →`
}

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

        {/* Main Content - Email Generation Flow */}
        <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Flow Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Campaign Builder</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Segments → Email → Calendar → Analytics</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">📱 Tech Products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Column Layout - Larger Email/Calendar Section */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">

            {/* Column 1: Segment Selection Panel */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Customer Segments
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Select segment to generate email</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[
                  {
                    name: 'High Converters',
                    count: 2847,
                    percentage: 6.5,
                    ctr: '12.4%',
                    avgSpend: '$1,250',
                    engagement: 'High',
                    color: 'from-green-500 to-emerald-600',
                    icon: '🎯',
                    suggestedTone: 'Premium & Exclusive',
                    topProducts: ['iPhone 15 Pro', 'MacBook Pro'],
                    predictedRate: '18.2%'
                  },
                  {
                    name: 'Window Shoppers',
                    count: 15623,
                    percentage: 35.4,
                    ctr: '3.2%',
                    avgSpend: '$180',
                    engagement: 'Medium',
                    color: 'from-yellow-500 to-orange-600',
                    icon: '👀',
                    suggestedTone: 'Educational & Helpful',
                    topProducts: ['AirPods Pro', 'iPad'],
                    predictedRate: '8.7%'
                  },
                  {
                    name: 'Cart Abandoners',
                    count: 8941,
                    percentage: 20.3,
                    ctr: '8.7%',
                    avgSpend: '$420',
                    engagement: 'Medium',
                    color: 'from-purple-500 to-violet-600',
                    icon: '🛒',
                    suggestedTone: 'Urgent & Persuasive',
                    topProducts: ['Samsung Galaxy S24', 'Nintendo Switch'],
                    predictedRate: '15.3%'
                  },
                  {
                    name: 'Loyal Customers',
                    count: 4256,
                    percentage: 9.7,
                    ctr: '15.8%',
                    avgSpend: '$2,100',
                    engagement: 'Very High',
                    color: 'from-blue-500 to-indigo-600',
                    icon: '⭐',
                    suggestedTone: 'Appreciative & Exclusive',
                    topProducts: ['MacBook Air M3', 'Sony WH-1000XM5'],
                    predictedRate: '22.1%'
                  },
                  {
                    name: 'At Risk',
                    count: 12387,
                    percentage: 28.1,
                    ctr: '2.1%',
                    avgSpend: '$95',
                    engagement: 'Low',
                    color: 'from-red-500 to-rose-600',
                    icon: '⚠️',
                    suggestedTone: 'Win-back & Incentive',
                    topProducts: ['Budget Accessories', 'Refurbished Items'],
                    predictedRate: '5.4%'
                  }
                ].map((segment) => (
                  <div
                    key={segment.name}
                    onClick={() => {
                      setEmailGenerationFlow(prev => ({
                        ...prev,
                        selectedSegment: segment,
                        isEmailGenerated: false
                      }))
                    }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                      emailGenerationFlow.selectedSegment?.name === segment.name
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{segment.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{segment.name}</span>
                      </div>
                      {emailGenerationFlow.selectedSegment?.name === segment.name && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Size:</span>
                        <span className="font-medium">{segment.count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">CTR:</span>
                        <span className="font-medium text-green-600">{segment.ctr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Spend:</span>
                        <span className="font-medium">{segment.avgSpend}</span>
                      </div>
                    </div>

                    {emailGenerationFlow.selectedSegment?.name === segment.name && (
                      <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                        <div className="text-xs space-y-1">
                          <p className="text-purple-700 dark:text-purple-300 font-medium">💡 AI Insights:</p>
                          <p className="text-purple-600 dark:text-purple-400">Tone: {segment.suggestedTone}</p>
                          <p className="text-purple-600 dark:text-purple-400">Predicted Rate: {segment.predictedRate}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {segment.topProducts.map(product => (
                              <span key={product} className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs">
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Email Composer & Calendar (Larger) */}
            <div className="col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Tabbed Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center px-3 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-lg text-sm font-medium">
                      <Mail className="h-4 w-4 mr-2" />
                      Email & Calendar
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEmailGenerationFlow(prev => ({ ...prev, emailMode: 'auto' }))}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        emailGenerationFlow.emailMode === 'auto'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      onClick={() => setEmailGenerationFlow(prev => ({ ...prev, emailMode: 'manual' }))}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        emailGenerationFlow.emailMode === 'manual'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>

                {/* Product Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products to promote (e.g., 'iPhone', 'MacBook')..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      if (e.target.value.length > 2) {
                        // Mock search results
                        const mockResults = [
                          { id: 1, name: 'iPhone 15 Pro', category: 'Smartphones', price: '$1199', image: '📱' },
                          { id: 2, name: 'iPhone 15', category: 'Smartphones', price: '$899', image: '📱' },
                          { id: 3, name: 'iPhone 14 Pro', category: 'Smartphones', price: '$999', image: '📱' },
                          { id: 4, name: 'iPhone SE', category: 'Smartphones', price: '$429', image: '📱' }
                        ].filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()))
                        setSearchResults(mockResults)
                      } else {
                        setSearchResults([])
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                  />

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {searchResults.map(product => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedProductForPromotion(product)
                            setProductSearch('')
                            setSearchResults([])
                            // Set similar products
                            setSimilarProducts([
                              { name: 'Samsung Galaxy S24', similarity: 95, reason: 'Premium smartphone category' },
                              { name: 'Google Pixel 8 Pro', similarity: 88, reason: 'High-end mobile features' },
                              { name: 'OnePlus 12', similarity: 82, reason: 'Performance-focused phone' },
                              { name: 'iPhone 14 Pro', similarity: 96, reason: 'Same product line' }
                            ])
                            // Set OCR insights
                            setOcrInsights([
                              {
                                insight: 'Phone ads with water elements show 23% lower conversion',
                                confidence: 89,
                                samples: 847,
                                recommendation: 'Avoid water backgrounds or splash effects'
                              },
                              {
                                insight: 'Close-up product shots perform 34% better than lifestyle shots',
                                confidence: 76,
                                samples: 1203,
                                recommendation: 'Use detailed product photography'
                              },
                              {
                                insight: 'Tech specs in headlines increase CTR by 18%',
                                confidence: 82,
                                samples: 654,
                                recommendation: 'Highlight camera MP, storage, or chip details'
                              }
                            ])
                          }}
                          className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <span className="text-xl mr-3">{product.image}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{product.category} • {product.price}</p>
                          </div>
                          <Package className="h-4 w-4 text-purple-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Product for Promotion */}
                {selectedProductForPromotion && (
                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{selectedProductForPromotion.image}</span>
                        <div>
                          <p className="font-medium text-purple-800 dark:text-purple-200">{selectedProductForPromotion.name}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">Selected for promotion</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedProductForPromotion(null)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Composer & Calendar Split */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Email Composer */}
                <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
                  {!emailGenerationFlow.selectedSegment ? (
                    <div className="flex-1 flex items-center justify-center text-center p-6">
                      <div className="text-gray-400">
                        <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Select a segment to generate email</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      {/* Email Subject */}
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Subject Line</label>
                        <input
                          type="text"
                          placeholder="AI will generate based on segment..."
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                          defaultValue={emailGenerationFlow.selectedSegment?.name === 'High Converters' ?
                            (selectedProductForPromotion ? `🎯 Exclusive Early Access - ${selectedProductForPromotion.name}` : '🎯 Exclusive Early Access - New iPhone 15 Pro') :
                            emailGenerationFlow.selectedSegment?.name === 'Window Shoppers' ? '👀 Still browsing? Here\'s what you might love' :
                            emailGenerationFlow.selectedSegment?.name === 'Cart Abandoners' ? '🛒 Your cart misses you! Complete your purchase' :
                            emailGenerationFlow.selectedSegment?.name === 'Loyal Customers' ? '⭐ VIP Preview: Latest Tech Just For You' :
                            '⚠️ We miss you! Special comeback offer inside'
                          }
                        />
                      </div>

                      {/* Email Body */}
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Email Content</label>
                          {!emailGenerationFlow.isEmailGenerated && (
                            <button
                              onClick={async () => {
                                setEmailGenerationFlow(prev => ({ ...prev, isGenerating: true }))

                                // Simulate ChatGPT API call
                                setTimeout(() => {
                                  setEmailGenerationFlow(prev => ({
                                    ...prev,
                                    isEmailGenerated: true,
                                    isGenerating: false,
                                    generatedEmail: generateEmailWithChatGPT()
                                  }))
                                }, 2000)
                              }}
                              disabled={emailGenerationFlow.isGenerating}
                              className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 flex items-center disabled:opacity-50"
                            >
                              {emailGenerationFlow.isGenerating ? (
                                <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full"></div>
                              ) : (
                                <Sparkles className="h-3 w-3 mr-1" />
                              )}
                              {emailGenerationFlow.isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                          )}
                        </div>

                        <div className="flex-1">
                          {emailGenerationFlow.isGenerating ? (
                            <div className="flex items-center justify-center h-64 border-2 border-dashed border-purple-200 dark:border-purple-600 rounded-lg">
                              <div className="text-center text-purple-600">
                                <div className="animate-spin h-8 w-8 mx-auto mb-2 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                                <p className="text-sm font-medium">AI is crafting your campaign...</p>
                                <p className="text-xs text-gray-500 mt-1">Analyzing segment data & product insights</p>
                              </div>
                            </div>
                          ) : emailGenerationFlow.isEmailGenerated ? (
                            <div className="space-y-4">
                              <textarea
                                className="w-full h-64 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 resize-none"
                                value={emailGenerationFlow.generatedEmail || `Hi {{first_name}},

${emailGenerationFlow.selectedSegment?.name === 'High Converters' ?
  `As one of our premium customers, you get first access to the ${selectedProductForPromotion?.name || 'iPhone 15 Pro'}.

🎯 Exclusive 48-hour early access
📱 Free premium setup service
🚚 Express delivery included

Your purchase history shows you love cutting-edge tech. This is exactly what you've been waiting for.

Claim your ${selectedProductForPromotion?.name || 'iPhone 15 Pro'} now →` :
  emailGenerationFlow.selectedSegment?.name === 'Window Shoppers' ?
  `We noticed you've been exploring our latest tech collection!

👀 Based on your browsing:
• ${selectedProductForPromotion?.name || 'iPhone 15 Pro'} - 48MP camera system
• MacBook Air M3 - All-day battery life
• AirPods Pro - Adaptive transparency

Not sure which is right for you? Our tech experts are here to help.

Get personalized recommendations →` :
  emailGenerationFlow.selectedSegment?.name === 'Cart Abandoners' ?
  `Your cart is waiting! We saved your items:

🛒 ${selectedProductForPromotion?.name || 'Samsung Galaxy S24'} - ${selectedProductForPromotion?.price || '$999'}
📱 Premium case bundle - $49

⏰ Limited stock alert: Only 3 left
💰 Complete now & save $50

Don't miss out on this deal.

Complete your purchase →` :
  emailGenerationFlow.selectedSegment?.name === 'Loyal Customers' ?
  `Thank you for being a valued customer!

⭐ VIP exclusive preview:
• ${selectedProductForPromotion?.name || 'MacBook Air M3'} with cutting-edge features
• 20% loyalty discount applied
• Free premium support included

You've spent $${emailGenerationFlow.selectedSegment?.avgSpend} with us. Here's something special.

Shop VIP collection →` :
  `We miss you! Here's 25% off to welcome you back:

⚠️ It's been a while since your last visit
💰 25% off everything sitewide
🎁 Free shipping on any order

Code: COMEBACK25 (expires in 48h)

Rediscover what you love →`
}

Best regards,
The Segmind Team`}
                                onChange={(e) => setEmailGenerationFlow(prev => ({ ...prev, generatedEmail: e.target.value }))}
                              />

                            {emailGenerationFlow.emailMode === 'manual' && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">✨ AI Suggestions:</p>
                                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                                  <p>• Add product scarcity indicator</p>
                                  <p>• Include customer's favorite category</p>
                                  <p>• Personalize based on purchase history</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="text-center text-gray-400">
                              <Edit3 className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">Click Generate to create email</p>
                              <p className="text-xs">AI will use segment insights & product data</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview Toggle */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Preview</span>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Mobile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

                {/* Right: Campaign Calendar */}
                <div className="w-80 flex flex-col">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                      Schedule
                    </h3>
                  </div>

                  <div className="flex-1 p-4">
                    {!emailGenerationFlow.isEmailGenerated ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div className="text-gray-400">
                          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Generate email first</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Campaign Name */}
                        <div>
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Campaign Name</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-xs focus:ring-1 focus:ring-purple-500 dark:bg-gray-700"
                            defaultValue={`${emailGenerationFlow.selectedSegment?.name} - ${selectedProductForPromotion?.name || 'Tech'}`}
                          />
                        </div>

                        {/* Performance Heatmap */}
                        <div>
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Best Times</label>
                          <div className="grid grid-cols-7 gap-1 text-xs">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                              <div key={day} className="text-center text-gray-500 text-xs">{day}</div>
                            ))}
                            {[
                              ['9AM', '10AM', '11AM', '2PM', '3PM', '10AM', '11AM'],
                              ['bg-green-100', 'bg-green-200', 'bg-yellow-100', 'bg-green-200', 'bg-green-300', 'bg-yellow-100', 'bg-gray-100']
                            ][1].map((color, i) => (
                              <div key={i} className={`${color} p-1 rounded text-center cursor-pointer hover:ring-1 hover:ring-purple-300 text-xs`}>
                                {['9A', '10A', '11A', '2P', '3P', '10A', '11A'][i]}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Schedule */}
                        <div>
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Schedule</label>
                          <input
                            type="datetime-local"
                            className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-xs focus:ring-1 focus:ring-purple-500 dark:bg-gray-700"
                            defaultValue={`${new Date().toISOString().slice(0, 16)}`}
                          />
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded mt-2">
                            <p className="text-xs font-medium text-green-800 dark:text-green-200">📈 Optimal Time</p>
                            <p className="text-xs text-green-700 dark:text-green-300">Thu 10AM: +23% open rate</p>
                          </div>
                        </div>

                        {/* A/B Test Options */}
                        <div>
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">A/B Test</label>
                          <div className="space-y-1">
                            <label className="flex items-center text-xs">
                              <input type="checkbox" className="mr-1" />
                              Subject variants
                            </label>
                            <label className="flex items-center text-xs">
                              <input type="checkbox" className="mr-1" />
                              Send time
                            </label>
                          </div>
                        </div>

                        {!emailGenerationFlow.isScheduled && (
                          <button
                            onClick={() => setEmailGenerationFlow(prev => ({ ...prev, isScheduled: true }))}
                            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex items-center justify-center text-xs"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Schedule
                          </button>
                        )}

                        {emailGenerationFlow.isScheduled && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                            <p className="text-xs font-medium text-purple-800 dark:text-purple-200">✅ Scheduled</p>
                            <p className="text-xs text-purple-700 dark:text-purple-300">Thu 10:00 AM</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Analytics & Insights */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Campaign Analytics
                </h3>

                {/* Insight Tabs */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setActiveInsightTab('similar')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      activeInsightTab === 'similar'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Similar Products
                  </button>
                  <button
                    onClick={() => setActiveInsightTab('ocr')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      activeInsightTab === 'ocr'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    OCR Insights
                  </button>
                  <button
                    onClick={() => setActiveInsightTab('predictions')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      activeInsightTab === 'predictions'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Predictions
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {/* Similar Products Tab */}
                {activeInsightTab === 'similar' && (
                  <div>
                    {!selectedProductForPromotion ? (
                      <div className="text-center text-gray-400 py-8">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Search for a product to see similar recommendations</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Also promote these similar products:</h4>
                          <div className="space-y-3">
                            {similarProducts.map((product, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{product.reason}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-purple-600">{product.similarity}%</div>
                                  <div className="text-xs text-gray-500">similarity</div>
                                </div>
                                <button className="ml-3 p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OCR Insights Tab */}
                {activeInsightTab === 'ocr' && (
                  <div>
                    {!selectedProductForPromotion ? (
                      <div className="text-center text-gray-400 py-8">
                        <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Select a product to see OCR insights</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">OCR Training Insights for {selectedProductForPromotion.category}</h4>
                        {ocrInsights.map((insight, i) => (
                          <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                {insight.confidence > 80 ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                ) : insight.confidence > 60 ? (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                                )}
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {insight.insight}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {insight.confidence}% confidence
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              📊 Based on {insight.samples} campaign samples
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <p className="text-xs font-medium text-blue-800 dark:text-blue-200">💡 Recommendation:</p>
                              <p className="text-xs text-blue-700 dark:text-blue-300">{insight.recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Predictions Tab */}
                {activeInsightTab === 'predictions' && (
                  <div>
                    {!emailGenerationFlow.selectedSegment ? (
                      <div className="text-center text-gray-400 py-8">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Select segment to see predictions</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Predicted Performance */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Predicted Performance</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Open Rate</span>
                              <span className="text-sm font-medium text-green-600">{emailGenerationFlow.selectedSegment?.predictedRate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Click Rate</span>
                              <span className="text-sm font-medium text-blue-600">{emailGenerationFlow.selectedSegment?.ctr}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Est. Revenue</span>
                              <span className="text-sm font-medium text-purple-600">
                                ${Math.round(emailGenerationFlow.selectedSegment?.count * 0.12 * parseFloat(emailGenerationFlow.selectedSegment?.avgSpend?.replace('$', '').replace(',', '')))?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cost Index */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Cost Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Email Cost</span>
                              <span className="text-sm">${(emailGenerationFlow.selectedSegment?.count * 0.0008).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Design & Copy</span>
                              <span className="text-sm">$0.00</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-600">
                              <span className="text-xs">Total Cost</span>
                              <span className="text-sm">${(emailGenerationFlow.selectedSegment?.count * 0.0008).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* ROI Projection */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">ROI Projection</h4>
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {emailGenerationFlow.selectedSegment ? Math.round((emailGenerationFlow.selectedSegment?.count * 0.12 * parseFloat(emailGenerationFlow.selectedSegment?.avgSpend?.replace('$', '').replace(',', '')) / (emailGenerationFlow.selectedSegment?.count * 0.0008)) * 100) / 100 : 0}x
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Expected return on investment</p>
                        </div>

                        {/* Launch Campaign */}
                        {emailGenerationFlow.isScheduled && (
                          <div className="pt-4">
                            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center font-medium">
                              <Send className="h-4 w-4 mr-2" />
                              Launch Campaign
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Insight Modal */}
          {showInsightModal && selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedProduct.name} Promotion
                  </h3>
                  <button
                    onClick={() => setShowInsightModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Promotion Strategy</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">{selectedProduct.strategy}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedProduct.potential}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Conversion Potential</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{emailGenerationFlow.selectedSegment?.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Target Segment</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Promotion Ideas</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Highlight key features in email header</li>
                      <li>• Add "limited time" urgency element</li>
                      <li>• Include customer reviews/ratings</li>
                      <li>• Offer bundle discount with accessories</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setShowInsightModal(false)
                      // Could trigger email update here
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Apply to Email
                  </button>
                </div>
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