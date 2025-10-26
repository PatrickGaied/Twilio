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
  const [strategyRecommendation, setStrategyRecommendation] = useState<any>(null)
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const [generatedCampaignCards, setGeneratedCampaignCards] = useState<any[]>([])
  const [hoveredCard, setHoveredCard] = useState<any>(null)
  const [editingSchedule, setEditingSchedule] = useState<any>(null)
  const [isGeneratingCards, setIsGeneratingCards] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedEmailType, setSelectedEmailType] = useState('informative')

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
        strategy: 'Generate targeted email campaigns for window shoppers with compelling hero images and personalized content. Focus on studio lighting backgrounds (avoid desert/outdoor settings) for optimal conversion rates.',
        emailStrategy: 'Each email will feature custom hero images and tailored messaging based on audience behavior patterns.',
        heroImageGuidelines: 'Use clean, studio-lit product shots with tech-focused backgrounds. Avoid outdoor/desert settings which reduce iPhone email performance by 40%.',
        timing: ['Monday 10AM', 'Wednesday 2PM'],
        followUp: 'Auto cart abandonment sequence',
        expectedCampaigns: 5,
        weeklySchedule: [
          {
            day: 'Monday',
            time: '10:00 AM',
            type: 'Primary Campaign',
            audience: 'Window Shoppers',
            heroImageDesc: 'Clean studio shot of iPhone 15 Pro on minimal white background with soft lighting',
            emailTheme: 'Discovery & Exploration'
          },
          {
            day: 'Wednesday',
            time: '2:00 PM',
            type: 'Primary Campaign',
            audience: 'Window Shoppers',
            heroImageDesc: 'iPhone 15 Pro with camera features highlighted, tech workspace background',
            emailTheme: 'Feature Showcase'
          },
          {
            day: 'Thursday',
            time: '11:00 AM',
            type: 'Follow-up',
            audience: 'Cart Abandoners',
            heroImageDesc: 'iPhone 15 Pro with shopping cart overlay, urgent but premium feel',
            emailTheme: 'Urgency & Completion'
          },
          {
            day: 'Friday',
            time: '9:00 AM',
            type: 'Premium Drop',
            audience: 'High Converters',
            heroImageDesc: 'Luxury product shot with dramatic lighting, black background, exclusive feel',
            emailTheme: 'Exclusive Access'
          },
          {
            day: 'Sunday',
            time: '6:00 PM',
            type: 'Weekly Recap',
            audience: 'All Segments',
            heroImageDesc: 'Collection layout featuring iPhone alongside other products, modern grid',
            emailTheme: 'Weekly Highlights'
          }
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

  // Generate campaign cards with OpenAI
  const generateCampaignCards = async (strategy: any) => {
    setIsGeneratingCards(true)
    try {
      const response = await fetch('/api/generate-campaign-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProductForPromotion,
          strategy: strategy,
          weeklySchedule: strategy.weeklySchedule
        })
      })

      if (response.ok) {
        const cards = await response.json()
        setGeneratedCampaignCards(cards)
        setShowStrategyModal(false)
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Error generating campaign cards:', error)
      // Fallback to mock data with detailed email content
      const mockCards = strategy.weeklySchedule.map((schedule: any, index: number) => ({
        id: `card_${Date.now()}_${index}`,
        day: schedule.day,
        time: schedule.time,
        type: schedule.type,
        audience: schedule.audience,
        theme: schedule.emailTheme || 'Engaging',
        heroImage: schedule.heroImageDesc,
        prompt: `Generate ${schedule.type} email for ${schedule.audience} promoting ${selectedProductForPromotion?.name}. Theme: ${schedule.emailTheme}. Hero image: ${schedule.heroImageDesc}`,
        preview: `${schedule.day} ${schedule.time}: ${schedule.type}`,
        status: 'pending',
        subject: getEmailSubjectForSchedule(schedule, selectedProductForPromotion?.name),
        emailContent: getEmailContentForSchedule(schedule, selectedProductForPromotion?.name),
        dateScheduled: getDateForSchedule(schedule)
      }))
      setGeneratedCampaignCards(mockCards)
      setShowStrategyModal(false)
    } finally {
      setIsGeneratingCards(false)
    }
  }

  // Modify individual schedule item
  const modifyScheduleItem = (index: number) => {
    setEditingSchedule(index)
  }

  // Save schedule modifications
  const saveScheduleModification = (index: number, newSchedule: any) => {
    if (strategyRecommendation) {
      const updatedSchedule = [...strategyRecommendation.weeklySchedule]
      updatedSchedule[index] = newSchedule
      setStrategyRecommendation({
        ...strategyRecommendation,
        weeklySchedule: updatedSchedule
      })
    }
    setEditingSchedule(null)
  }

  // Helper functions for email generation
  const getEmailSubjectForSchedule = (schedule: any, productName: string) => {
    const subjects: { [key: string]: string[] } = {
      'Primary Campaign': [
        `Discover the ${productName} - Perfect for You!`,
        `New ${productName} Features You'll Love`,
        `${productName} - See What's Possible`
      ],
      'Follow-up': [
        `Still thinking about ${productName}?`,
        `Don't miss out - ${productName} waiting for you`,
        `Complete your ${productName} journey`
      ],
      'Premium Drop': [
        `Exclusive: ${productName} VIP Access`,
        `Premium Members Only: ${productName}`,
        `Limited Edition ${productName} - For You`
      ],
      'Weekly Recap': [
        `This Week's Tech Highlights featuring ${productName}`,
        `Weekly Update: ${productName} & More`,
        `Your personalized tech roundup`
      ]
    }
    const typeSubjects = subjects[schedule.type] || subjects['Primary Campaign']
    return typeSubjects[0]
  }

  const getEmailContentForSchedule = (schedule: any, productName: string) => {
    const templates: { [key: string]: string } = {
      'Primary Campaign': `Hi {{first_name}},

We're excited to show you the ${productName}!

🌟 ${schedule.emailTheme}: Discover what makes this product special
📸 Hero Image: ${schedule.heroImageDesc}

✨ Perfect for ${schedule.audience.toLowerCase()} like you
• Premium design and latest features
• Tailored to your interests
• Available now with exclusive member benefits

Ready to explore?

Best regards,
The Segmind Team`,

      'Follow-up': `Hi {{first_name}},

We noticed you were interested in the ${productName}.

⏰ Theme: ${schedule.emailTheme}
🎯 Hero Image: ${schedule.heroImageDesc}

Don't let this opportunity slip away:
• Still available with member pricing
• Free shipping & 30-day guarantee
• Limited time offer

[Complete Your Purchase]

Best regards,
The Segmind Team`,

      'Premium Drop': `Hi {{first_name}},

Exclusive access to ${productName} - just for you.

👑 ${schedule.emailTheme}
💎 Hero Image: ${schedule.heroImageDesc}

VIP Benefits:
• 20% exclusive discount
• Priority shipping
• Extended warranty

[Claim Your Exclusive Access]

Best regards,
The Segmind Team`,

      'Weekly Recap': `Hi {{first_name}},

This week's highlights featuring ${productName}:

📊 ${schedule.emailTheme}
🖼️ Hero Image: ${schedule.heroImageDesc}

• Featured: ${productName}
• Trending tech deals
• Personalized recommendations

[Explore This Week's Picks]

Best regards,
The Segmind Team`
    }
    return templates[schedule.type] || templates['Primary Campaign']
  }

  const getDateForSchedule = (schedule: any) => {
    const today = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const targetDay = days.indexOf(schedule.day)
    const currentDay = today.getDay()

    let daysUntilTarget = targetDay - currentDay
    if (daysUntilTarget <= 0) daysUntilTarget += 7

    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntilTarget)

    return targetDate.toISOString().split('T')[0]
  }

  // Regenerate individual card
  const regenerateCard = async (cardId: string) => {
    const cardIndex = generatedCampaignCards.findIndex(card => card.id === cardId)
    if (cardIndex === -1) return

    const card = generatedCampaignCards[cardIndex]
    const schedule = strategyRecommendation?.weeklySchedule.find((s: any) =>
      s.day === card.day && s.time === card.time
    )

    if (!schedule) return

    // Create new card with different content
    const newCard = {
      ...card,
      id: `card_${Date.now()}_regenerated`,
      subject: getEmailSubjectForSchedule(schedule, selectedProductForPromotion?.name),
      emailContent: getEmailContentForSchedule(schedule, selectedProductForPromotion?.name),
      prompt: `Regenerated: Generate ${schedule.type} email for ${schedule.audience} promoting ${selectedProductForPromotion?.name}. Theme: ${schedule.emailTheme}. Hero image: ${schedule.heroImageDesc}`,
      status: 'pending'
    }

    const updatedCards = [...generatedCampaignCards]
    updatedCards[cardIndex] = newCard
    setGeneratedCampaignCards(updatedCards)
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

                    {/* Bigger Calendar */}
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

                      {/* Bigger Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-3 font-medium text-gray-500 border-b">{day}</div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(date => {
                          const dateStr = `2024-10-${String(date).padStart(2, '0')}`
                          const campaignsForDate = scheduledCampaigns.filter(c => c.date === dateStr)
                          return (
                            <div
                              key={date}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`p-3 min-h-[60px] hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer rounded border ${
                                selectedDate === dateStr
                                  ? 'bg-purple-500 text-white border-purple-600'
                                  : 'text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-600'
                              }`}
                            >
                              <div className="font-medium">{date}</div>
                              {campaignsForDate.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {campaignsForDate.slice(0, 3).map((campaign, index) => (
                                    <div key={index} className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate">
                                      {campaign.type}
                                    </div>
                                  ))}
                                  {campaignsForDate.length > 3 && (
                                    <div className="text-xs text-blue-600">+{campaignsForDate.length - 3} more</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Generated Email Campaign Cards */}
                    {generatedCampaignCards.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">📧 Generated Email Campaigns</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                // Approve all cards and add to calendar
                                generatedCampaignCards.forEach(card => {
                                  const calendarEntry = {
                                    id: card.id,
                                    product: selectedProductForPromotion?.name,
                                    date: card.dateScheduled,
                                    time: card.time,
                                    type: card.type,
                                    audience: card.audience,
                                    status: 'scheduled',
                                    email: card.emailContent,
                                    subject: card.subject,
                                    heroImage: card.heroImage
                                  }
                                  setScheduledCampaigns(prev => [...prev, calendarEntry])
                                })
                                setGeneratedCampaignCards([])
                              }}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              ✅ Approve All
                            </button>
                            <button
                              onClick={() => setGeneratedCampaignCards([])}
                              className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              ❌ Remove All
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {generatedCampaignCards.map(card => (
                            <div
                              key={card.id}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700 cursor-pointer hover:shadow-md transition-all"
                              onMouseEnter={() => setHoveredCard(card)}
                              onMouseLeave={() => setHoveredCard(null)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-blue-800 dark:text-blue-200 text-sm">{card.type}</div>
                                  <div className="text-xs text-blue-600 dark:text-blue-400">{card.day} {card.time}</div>
                                  <div className="text-xs text-gray-500">{card.audience}</div>
                                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">{card.theme}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium truncate">{card.subject}</div>
                                </div>
                                <div className="flex items-center space-x-2 ml-2">
                                  <button
                                    onClick={() => {
                                      // Add to calendar and remove from pending
                                      const calendarEntry = {
                                        id: card.id,
                                        product: selectedProductForPromotion?.name,
                                        date: card.dateScheduled,
                                        time: card.time,
                                        type: card.type,
                                        audience: card.audience,
                                        status: 'scheduled',
                                        email: card.emailContent,
                                        subject: card.subject,
                                        heroImage: card.heroImage
                                      }
                                      setScheduledCampaigns(prev => [...prev, calendarEntry])
                                      setGeneratedCampaignCards(prev => prev.filter(c => c.id !== card.id))
                                    }}
                                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center text-xs"
                                    title="Add to Calendar"
                                  >
                                    ✅
                                  </button>
                                  <button
                                    onClick={() => {
                                      setGeneratedCampaignCards(prev => prev.filter(c => c.id !== card.id))
                                    }}
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center text-xs"
                                    title="Remove"
                                  >
                                    ❌
                                  </button>
                                </div>
                              </div>

                              {/* Hover Preview - Full Email Content */}
                              {hoveredCard?.id === card.id && (
                                <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                  <div className="text-xs space-y-2">
                                    <div><strong>📧 Subject:</strong> {card.subject}</div>
                                    <div><strong>🎨 Theme:</strong> {card.theme}</div>
                                    <div><strong>📸 Hero Image:</strong> {card.heroImage}</div>
                                    <div><strong>🤖 AI Prompt:</strong> {card.prompt}</div>
                                    <div className="border-t pt-2">
                                      <strong>📝 Email Preview:</strong>
                                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1 text-xs font-mono">
                                        {card.emailContent.substring(0, 200)}...
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
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
                    {/* Audience Analytics & Strategies */}
                    {ocrInsights.filter(insight => insight.type === 'audience').length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Audience Strategies
                        </h4>
                        <div className="space-y-2">
                          {ocrInsights.filter(insight => insight.type === 'audience').map((insight, index) => (
                            <div key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-green-800 dark:text-green-200 text-sm">
                                  {insight.audience}
                                </div>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                                  {insight.conversionRate}
                                </span>
                              </div>

                              <div className="mb-2">
                                <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Strategy:</div>
                                <p className="text-xs text-green-700 dark:text-green-300">{insight.strategy}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="font-medium text-green-800 dark:text-green-200">Timing:</span>
                                  <div className="text-green-600 dark:text-green-400">{insight.timing}</div>
                                </div>
                                <div>
                                  <span className="font-medium text-green-800 dark:text-green-200">Follow-up:</span>
                                  <div className="text-green-600 dark:text-green-400">{insight.followUp}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* OCR Visual Insights */}
                    {ocrInsights.filter(insight => insight.type !== 'audience').length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Visual Insights
                        </h4>
                        <div className="space-y-2">
                          {ocrInsights.filter(insight => insight.type !== 'audience').map((insight, index) => (
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
                                    <span className="text-xs text-gray-500">{insight.source || insight.confidence}</span>
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

        {/* Strategy Recommendation Modal */}
        {showStrategyModal && strategyRecommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">📧 Email Campaign Strategy for {strategyRecommendation.product}</h3>
                <button
                  onClick={() => setShowStrategyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Strategy & Settings */}
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">

                  {/* Custom Prompt Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Custom Prompt (optional):
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., make emails promoting this and the hero image will be a guy..."
                      className="w-full p-2 text-sm border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-blue-800/50"
                      rows={2}
                    />
                  </div>

                  {/* Email Type Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Email Type:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['informative', 'sale', 'promotional', 'educational'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedEmailType(type)}
                          className={`p-2 text-sm rounded border capitalize ${
                            selectedEmailType === type
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white dark:bg-blue-800/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                    <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">📸 Hero Image Guidelines:</h5>
                      <p className="text-xs text-blue-700 dark:text-blue-300">{strategyRecommendation.heroImageGuidelines}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Weekly Schedule */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-3">📅 Weekly Schedule ({strategyRecommendation.expectedCampaigns} campaigns)</h4>
                  <div className="space-y-2">
                    {strategyRecommendation.weeklySchedule.map((schedule: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {editingSchedule === index ? (
                          /* Editing Mode */
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={schedule.day}
                                onChange={(e) => {
                                  const newSchedule = {...schedule, day: e.target.value}
                                  saveScheduleModification(index, newSchedule)
                                }}
                                className="text-sm p-1 border rounded dark:bg-gray-600 dark:border-gray-500"
                              >
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                              </select>
                              <input
                                type="time"
                                value={schedule.time.split(' ')[0]}
                                onChange={(e) => {
                                  const newSchedule = {...schedule, time: e.target.value + ' ' + schedule.time.split(' ')[1]}
                                  saveScheduleModification(index, newSchedule)
                                }}
                                className="text-sm p-1 border rounded dark:bg-gray-600 dark:border-gray-500"
                              />
                            </div>
                            <select
                              value={schedule.type}
                              onChange={(e) => {
                                const newSchedule = {...schedule, type: e.target.value}
                                saveScheduleModification(index, newSchedule)
                              }}
                              className="w-full text-sm p-1 border rounded dark:bg-gray-600 dark:border-gray-500"
                            >
                              <option value="Primary Campaign">Primary Campaign</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Premium Drop">Premium Drop</option>
                              <option value="Weekly Recap">Weekly Recap</option>
                            </select>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingSchedule(null)}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSchedule(null)}
                                className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Display Mode */
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">{schedule.day} {schedule.time}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{schedule.type} - {schedule.audience}</div>
                              <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">📧 {schedule.emailTheme}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium">Hero Image:</span>
                                <input
                                  type="text"
                                  value={schedule.heroImageDesc}
                                  onChange={(e) => {
                                    const newSchedule = {...schedule, heroImageDesc: e.target.value}
                                    saveScheduleModification(index, newSchedule)
                                  }}
                                  className="ml-1 text-xs bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500 flex-1"
                                  placeholder="Describe hero image..."
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => modifyScheduleItem(index)}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                              >
                                Modify
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons spanning both columns */}
              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600 mt-6">
                  <button
                    onClick={() => {
                      // Use custom prompt and email type if provided
                      const enhancedStrategy = {
                        ...strategyRecommendation,
                        customPrompt: customPrompt || '',
                        emailType: selectedEmailType,
                        weeklySchedule: strategyRecommendation.weeklySchedule.map((schedule: any) => ({
                          ...schedule,
                          emailType: selectedEmailType,
                          customPrompt: customPrompt
                        }))
                      }
                      generateCampaignCards(enhancedStrategy)
                    }}
                    disabled={isGeneratingCards}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingCards ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Email Cards
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      // Regenerate the entire strategy with current settings
                      const regeneratedStrategy = {
                        product: selectedProductForPromotion?.name,
                        primaryAudience: 'Window Shoppers',
                        strategy: customPrompt
                          ? `Generate ${selectedEmailType} email campaigns based on: ${customPrompt}`
                          : `Generate targeted ${selectedEmailType} email campaigns for window shoppers with compelling hero images and personalized content.`,
                        emailStrategy: 'Each email will feature custom hero images and tailored messaging based on audience behavior patterns.',
                        heroImageGuidelines: customPrompt.includes('guy') || customPrompt.includes('man') || customPrompt.includes('person')
                          ? 'Feature people in the hero images as specified. Use clean, studio-lit shots with tech-focused backgrounds.'
                          : 'Use clean, studio-lit product shots with tech-focused backgrounds. Avoid outdoor/desert settings which reduce iPhone email performance by 40%.',
                        timing: ['Monday 10AM', 'Wednesday 2PM'],
                        followUp: 'Auto cart abandonment sequence',
                        expectedCampaigns: 5,
                        emailType: selectedEmailType,
                        customPrompt: customPrompt,
                        weeklySchedule: [
                          {
                            day: 'Monday',
                            time: '10:00 AM',
                            type: selectedEmailType === 'sale' ? 'Sale Campaign' : 'Primary Campaign',
                            audience: 'Window Shoppers',
                            heroImageDesc: customPrompt || 'Clean studio shot of iPhone 15 Pro on minimal white background with soft lighting',
                            emailTheme: selectedEmailType === 'sale' ? 'Special Offers' : selectedEmailType === 'educational' ? 'Learning & Tips' : 'Discovery & Exploration',
                            emailType: selectedEmailType
                          },
                          {
                            day: 'Wednesday',
                            time: '2:00 PM',
                            type: selectedEmailType === 'promotional' ? 'Promotional Campaign' : 'Primary Campaign',
                            audience: 'Window Shoppers',
                            heroImageDesc: customPrompt || 'iPhone 15 Pro with camera features highlighted, tech workspace background',
                            emailTheme: selectedEmailType === 'promotional' ? 'Limited Time Offers' : 'Feature Showcase',
                            emailType: selectedEmailType
                          },
                          {
                            day: 'Thursday',
                            time: '11:00 AM',
                            type: 'Follow-up',
                            audience: 'Cart Abandoners',
                            heroImageDesc: customPrompt || 'iPhone 15 Pro with shopping cart overlay, urgent but premium feel',
                            emailTheme: 'Urgency & Completion',
                            emailType: selectedEmailType
                          },
                          {
                            day: 'Friday',
                            time: '9:00 AM',
                            type: selectedEmailType === 'sale' ? 'Flash Sale' : 'Premium Drop',
                            audience: 'High Converters',
                            heroImageDesc: customPrompt || 'Luxury product shot with dramatic lighting, black background, exclusive feel',
                            emailTheme: selectedEmailType === 'sale' ? 'Flash Sale' : 'Exclusive Access',
                            emailType: selectedEmailType
                          },
                          {
                            day: 'Sunday',
                            time: '6:00 PM',
                            type: selectedEmailType === 'educational' ? 'Educational Recap' : 'Weekly Recap',
                            audience: 'All Segments',
                            heroImageDesc: customPrompt || 'Collection layout featuring iPhone alongside other products, modern grid',
                            emailTheme: selectedEmailType === 'educational' ? 'Weekly Learning' : 'Weekly Highlights',
                            emailType: selectedEmailType
                          }
                        ]
                      }
                      setStrategyRecommendation(regeneratedStrategy)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate Strategy
                  </button>
                  <button
                    onClick={() => setShowStrategyModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
    </>
  )
}