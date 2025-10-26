import { useState, useEffect } from 'react'
import { ArrowLeft, Package, Search, Calendar, Users, Target, Mail, Activity, Wand2, Plus, X, BarChart3, ImageIcon, TrendingUp, CheckCircle, AlertTriangle, ChevronRight, Sparkles, Gift } from 'lucide-react'

interface CalendarCampaignBuilderProps {
  onBack: () => void
}

export default function CalendarCampaignBuilder({ onBack }: CalendarCampaignBuilderProps) {
  // Product search and selection
  const [productSearch, setProductSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedProductForPromotion, setSelectedProductForPromotion] = useState<any>(null)

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [scheduledCampaigns, setScheduledCampaigns] = useState<any[]>([])
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month')

  // Strategy and campaign generation
  const [strategyRecommendation, setStrategyRecommendation] = useState<any>(null)
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const [generatedCampaignCards, setGeneratedCampaignCards] = useState<any[]>([])
  const [hoveredCard, setHoveredCard] = useState<any>(null)
  const [editingSchedule, setEditingSchedule] = useState<any>(null)
  const [isGeneratingCards, setIsGeneratingCards] = useState(false)

  // Custom prompt and email type
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedEmailType, setSelectedEmailType] = useState('informative')

  // Analytics and insights
  const [ocrInsights, setOcrInsights] = useState<any[]>([])
  const [similarProducts, setSimilarProducts] = useState<any[]>([])

  // Mock product data
  const mockProducts = [
    { id: 'prod_1001', name: 'iPhone 15 Pro', brand: 'Apple', category: 'Smartphones', price: 1199, image: '📱' },
    { id: 'prod_1002', name: 'Samsung Galaxy S24', brand: 'Samsung', category: 'Smartphones', price: 999, image: '📱' },
    { id: 'prod_1003', name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Smartphones', price: 1199, image: '📱' },
    { id: 'prod_1004', name: 'iPhone 14 Pro', brand: 'Apple', category: 'Smartphones', price: 999, image: '📱' },
    { id: 'prod_1005', name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Smartphones', price: 999, image: '📱' },
    { id: 'prod_1006', name: 'OnePlus 12', brand: 'OnePlus', category: 'Smartphones', price: 799, image: '📱' },
    { id: 'prod_1007', name: 'MacBook Pro M3', brand: 'Apple', category: 'Laptops', price: 1999, image: '💻' },
    { id: 'prod_1008', name: 'iPad Pro', brand: 'Apple', category: 'Tablets', price: 1099, image: '📱' },
    { id: 'prod_1009', name: 'AirPods Pro', brand: 'Apple', category: 'Audio', price: 249, image: '🎧' },
    { id: 'prod_1010', name: 'Apple Watch Series 9', brand: 'Apple', category: 'Wearables', price: 399, image: '⌚' }
  ]

  const handleProductSearch = (term: string) => {
    setProductSearch(term)
    if (term.length > 0) {
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.brand.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      )
      setSearchResults(results.slice(0, 5))
    } else {
      setSearchResults([])
    }
  }

  const selectProductForPromotion = (product: any) => {
    setSelectedProductForPromotion(product)
    setProductSearch('')
    setSearchResults([])
    generateInsightsForProduct(product)
  }

  // Generate strategy recommendation based on product
  const generateInsightsForProduct = (product: any) => {
    // Generate OCR insights
    setOcrInsights([
      {
        type: 'info',
        message: `Studio lighting backgrounds perform 40% better for ${product.category} campaigns`,
        confidence: '92% confidence',
        source: 'OCR analysis'
      },
      {
        type: 'warning',
        message: 'Avoid desert/outdoor settings - reduces iPhone email performance significantly',
        source: 'A/B test data'
      },
      {
        type: 'audience',
        audience: 'Window Shoppers',
        strategy: 'Target with discovery-focused content and clear value propositions',
        timing: 'Monday 10AM, Wednesday 2PM',
        followUp: 'Auto cart abandonment sequence',
        conversionRate: '24.5%'
      }
    ])

    // Generate similar products
    setSimilarProducts([
      {
        id: 'similar_1',
        name: `${product.brand} Bundle Pack`,
        reason: 'Cross-sell opportunity with high conversion potential',
        urgency: 'High',
        expectedBoost: '+35%'
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
          heroImageDesc: `Clean studio shot of ${product.name} on minimal white background with soft lighting`,
          emailTheme: 'Discovery & Exploration'
        },
        {
          day: 'Wednesday',
          time: '2:00 PM',
          type: 'Primary Campaign',
          audience: 'Window Shoppers',
          heroImageDesc: `${product.name} with features highlighted, tech workspace background`,
          emailTheme: 'Feature Showcase'
        },
        {
          day: 'Thursday',
          time: '11:00 AM',
          type: 'Follow-up',
          audience: 'Cart Abandoners',
          heroImageDesc: `${product.name} with shopping cart overlay, urgent but premium feel`,
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
          heroImageDesc: `Collection layout featuring ${product.name} alongside other products, modern grid`,
          emailTheme: 'Weekly Highlights'
        }
      ]
    })
  }

  // Campaign generation functions
  const generateCampaignCards = async (strategy: any) => {
    setIsGeneratingCards(true)
    try {
      // Mock cards with detailed email content
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

  // Helper functions for email generation
  const getEmailSubjectForSchedule = (schedule: any, productName: string) => {
    const subjects: { [key: string]: string[] } = {
      'Primary Campaign': [
        `Discover the ${productName} - Perfect for You!`,
        `${productName}: Everything You Need to Know`,
        `Why ${productName} is Trending Right Now`
      ],
      'Follow-up': [
        `Still thinking about ${productName}?`,
        `Your ${productName} is waiting...`,
        `Complete your ${productName} purchase today`
      ],
      'Premium Drop': [
        `Exclusive: ${productName} VIP Access`,
        `Limited Time: Premium ${productName} Offer`,
        `Members Only: ${productName} Early Access`
      ],
      'Weekly Recap': [
        `This Week's Highlights: ${productName} & More`,
        `Weekly Update: ${productName} News`,
        `Your Weekly Tech Roundup`
      ]
    }
    const typeSubjects = subjects[schedule.type] || subjects['Primary Campaign']
    return typeSubjects[Math.floor(Math.random() * typeSubjects.length)]
  }

  const getEmailContentForSchedule = (schedule: any, productName: string) => {
    return `Subject: ${getEmailSubjectForSchedule(schedule, productName)}\n\nHi there!\n\nWe're excited to share details about the ${productName} with you.\n\n${schedule.emailTheme}: This campaign focuses on ${schedule.audience.toLowerCase()} and aims to ${schedule.type.toLowerCase()}.\n\nHero Image: ${schedule.heroImageDesc}\n\nBest regards,\nYour Marketing Team`
  }

  const getDateForSchedule = (schedule: any) => {
    const today = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const targetDay = dayNames.indexOf(schedule.day.toLowerCase())
    const currentDay = today.getDay()
    const daysUntilTarget = (targetDay - currentDay + 7) % 7
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntilTarget)
    return targetDate.toISOString().split('T')[0]
  }

  const getThemeForCampaign = (type: string): string => {
    const themes: { [key: string]: string } = {
      'Primary Campaign': 'Modern & Clean',
      'Follow-up': 'Urgent & Direct',
      'Premium Drop': 'Luxury & Exclusive',
      'Weekly Recap': 'Friendly & Informative',
      'Sale Campaign': 'Bold & Exciting',
      'Promotional Campaign': 'Vibrant & Engaging',
      'Educational Recap': 'Professional & Informative'
    }
    return themes[type] || 'Engaging & Professional'
  }

  // Schedule modification functions
  const modifyScheduleItem = (index: number) => {
    setEditingSchedule(index)
  }

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

  return (
    <>
      {/* Flow Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar Campaign Builder</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Products → Calendar → Analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">📅 Calendar Mode</span>
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
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <span className="text-sm mr-2">{product.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</div>
                    <div className="text-xs text-gray-500">${product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Calendar View */}
        <div className="col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Campaign Calendar
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Schedule and manage your email campaigns</p>
          </div>

          <div className="flex-1 p-4">
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Calendar View</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedProductForPromotion
                  ? `Ready to schedule campaigns for ${selectedProductForPromotion.name}`
                  : 'Select a product to start scheduling campaigns'
                }
              </p>
              {selectedProductForPromotion && (
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Generate Campaign Strategy
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Campaign Analytics */}
        <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Campaign Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Performance insights and metrics</p>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-4">
              {/* Metrics */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Total Campaigns</div>
                <div className="text-2xl font-bold text-purple-600">12</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Open Rate</div>
                <div className="text-2xl font-bold text-green-600">24.5%</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Click Rate</div>
                <div className="text-2xl font-bold text-blue-600">8.2%</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Revenue</div>
                <div className="text-2xl font-bold text-yellow-600">$45K</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}