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
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Email Composer & Calendar (Larger) */}
            <div className="col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-purple-600" />
                  Email & Campaign
                </h3>
              </div>

              <div className="flex-1 p-4">
                {!emailGenerationFlow.selectedSegment ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="text-gray-400">
                      <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Select a segment to generate email</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setEmailGenerationFlow(prev => ({
                          ...prev,
                          isEmailGenerated: true,
                          generatedEmail: generateEmailWithChatGPT()
                        }))
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Email with AI
                    </button>

                    {emailGenerationFlow.isEmailGenerated && (
                      <textarea
                        className="w-full h-64 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                        value={emailGenerationFlow.generatedEmail}
                        onChange={(e) => setEmailGenerationFlow(prev => ({ ...prev, generatedEmail: e.target.value }))}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Analytics & Insights */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Analytics
                </h3>
              </div>

              <div className="flex-1 p-4">
                {!emailGenerationFlow.selectedSegment ? (
                  <div className="text-center text-gray-400 py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select segment to see analytics</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Predicted Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Open Rate</span>
                          <span className="text-sm font-medium text-green-600">{emailGenerationFlow.selectedSegment?.predictedRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Click Rate</span>
                          <span className="text-sm font-medium text-blue-600">{emailGenerationFlow.selectedSegment?.ctr}</span>
                        </div>
                      </div>
                    </div>

                    {emailGenerationFlow.isEmailGenerated && (
                      <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center">
                        <Send className="h-4 w-4 mr-2" />
                        Launch Campaign
                      </button>
                    )}
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