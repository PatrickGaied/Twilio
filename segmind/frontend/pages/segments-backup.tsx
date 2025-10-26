import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Users, TrendingUp, DollarSign, Target, Plus, Filter, Search, ArrowUpRight, ArrowDownRight, Zap, Mail, Calendar, ShoppingCart, Eye, MousePointer, Smartphone, Edit3, Send, Clock, BarChart3, TrendingDown, AlertCircle, Settings, ChevronRight, Star, Activity, Percent, Package, Sparkles, ImageIcon, AlertTriangle, CheckCircle, X, ArrowLeft, Gift, Check, Wand2 } from 'lucide-react'
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

  // Campaign Type Selection State
  const [showCampaignSelection, setShowCampaignSelection] = useState(true)
  const [selectedCampaignType, setSelectedCampaignType] = useState<'calendar' | 'popup' | null>(null)

  // Product search state for popup campaigns
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [selectedOCRPatterns, setSelectedOCRPatterns] = useState<string[]>([])
  const [popupHeadline, setPopupHeadline] = useState('')
  const [popupDescription, setPopupDescription] = useState('')
  const [popupCTA, setPopupCTA] = useState('')
  const [popupShape, setPopupShape] = useState('square')

  // Products data for search
  const availableProducts = [
    { id: 'prod_1001', name: 'iPhone 15 Pro', brand: 'Apple', category: 'Smartphones', price: 1199 },
    { id: 'prod_1002', name: 'Samsung Galaxy S24', brand: 'Samsung', category: 'Smartphones', price: 999 },
    { id: 'prod_1003', name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Smartphones', price: 1199 },
    { id: 'prod_1004', name: 'iPhone 14 Pro', brand: 'Apple', category: 'Smartphones', price: 999 },
    { id: 'prod_1005', name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Smartphones', price: 999 },
    { id: 'prod_1006', name: 'OnePlus 12', brand: 'OnePlus', category: 'Smartphones', price: 799 },
    { id: 'prod_1007', name: 'MacBook Pro M3', brand: 'Apple', category: 'Laptops', price: 1999 },
    { id: 'prod_1008', name: 'iPad Pro', brand: 'Apple', category: 'Tablets', price: 1099 },
    { id: 'prod_1009', name: 'AirPods Pro', brand: 'Apple', category: 'Audio', price: 249 },
    { id: 'prod_1010', name: 'Apple Watch Series 9', brand: 'Apple', category: 'Wearables', price: 399 }
  ]

  // OCR patterns from successful campaigns
  const ocrPatterns = [
    {
      id: 'ocr_1',
      description: 'Person running with smartphone',
      context: 'Athletic lifestyle, fitness tracking, outdoor activities',
      effectiveness: 87,
      example: 'Guy running with iPhone, showing fitness app and health tracking features',
      demographics: ['Health-conscious', 'Age 25-40', 'Active lifestyle']
    },
    {
      id: 'ocr_2',
      description: 'Professional using phone in office',
      context: 'Business environment, productivity, work efficiency',
      effectiveness: 82,
      example: 'Business professional taking video call on iPhone in modern office setting',
      demographics: ['Business professionals', 'Age 30-50', 'Corporate environment']
    },
    {
      id: 'ocr_3',
      description: 'Creative content creation',
      context: 'Photography, video editing, artistic work',
      effectiveness: 91,
      example: 'Photographer capturing and editing photos on iPhone with ProRAW features',
      demographics: ['Creative professionals', 'Age 22-45', 'Content creators']
    },
    {
      id: 'ocr_4',
      description: 'Family moments and memories',
      context: 'Family gatherings, special occasions, memory capture',
      effectiveness: 85,
      example: 'Parent filming child\'s birthday with iPhone, emphasizing video quality and ease of use',
      demographics: ['Parents', 'Age 28-45', 'Family-oriented']
    },
    {
      id: 'ocr_5',
      description: 'Gaming and entertainment',
      context: 'Gaming performance, entertainment consumption, immersive experiences',
      effectiveness: 78,
      example: 'Gamer playing mobile games on iPhone with high-performance graphics',
      demographics: ['Gamers', 'Age 18-35', 'Entertainment focused']
    }
  ]

  // Low-performing campaign patterns to avoid
  const lowPerformingPatterns = [
    {
      id: 'low_1',
      description: 'Product in studio setting',
      context: 'Generic studio photography, white background, no context',
      effectiveness: 23,
      example: 'iPhone placed on white background in studio lighting without any lifestyle context',
      issue: 'Lacks emotional connection and real-world application'
    },
    {
      id: 'low_2',
      description: 'Feature-focused technical shots',
      context: 'Close-up of specs, technical details, isolated features',
      effectiveness: 31,
      example: 'Close-up of iPhone camera lens with technical specifications overlay',
      issue: 'Too technical, doesn\'t show benefits or use cases'
    },
    {
      id: 'low_3',
      description: 'Generic hand holding device',
      context: 'Hand holding phone without clear purpose or activity',
      effectiveness: 28,
      example: 'Hand holding iPhone with blank screen in neutral setting',
      issue: 'No clear value proposition or engaging scenario'
    },
    {
      id: 'low_4',
      description: 'Product comparison charts',
      context: 'Side-by-side comparisons, specification tables, feature lists',
      effectiveness: 19,
      example: 'iPhone vs competitor comparison table with technical specs',
      issue: 'Too data-heavy for visual advertising, lacks emotional appeal'
    },
    {
      id: 'low_5',
      description: 'Stock photo scenarios',
      context: 'Generic business settings, posed interactions, obvious staging',
      effectiveness: 25,
      example: 'Obviously posed business meeting with iPhone prominently displayed',
      issue: 'Appears inauthentic and staged, low engagement'
    }
  ]

  // Filter products based on search term
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

  // Helper functions for popup campaigns
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleOCRPattern = (patternId: string) => {
    setSelectedOCRPatterns(prev =>
      prev.includes(patternId)
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    )
  }

  const generateImagePrompt = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product first')
      return
    }

    setIsGeneratingPrompt(true)

    // Simulate AI prompt generation
    const selectedProductNames = selectedProducts.map(id =>
      availableProducts.find(p => p.id === id)?.name || ''
    ).filter(Boolean)

    const selectedOCRData = selectedOCRPatterns.map(id =>
      ocrPatterns.find(p => p.id === id)
    ).filter(Boolean)

    // Generate prompt based on products and OCR patterns
    let prompt = `Create a professional marketing image featuring ${selectedProductNames.join(', ')}`

    if (selectedOCRData.length > 0) {
      const contexts = selectedOCRData.map(p => p.context).join(', ')
      const examples = selectedOCRData.map(p => p.example).join('; ')
      prompt += `. Incorporate elements from successful campaigns: ${contexts}. Style similar to: ${examples}`
    }

    prompt += '. High-quality, professional product photography with modern lighting and composition.'

    // Simulate API delay
    setTimeout(() => {
      setGeneratedPrompt(prompt)
      setIsGeneratingPrompt(false)
    }, 2000)
  }

  // Helper function to get theme for campaign type
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

  // Generate campaign cards with Python backend
  const generateCampaignCards = async (strategy: any) => {
    setIsGeneratingCards(true)
    try {
      // First create basic card structure from the strategy
      const basicCards = strategy.weeklySchedule.map((schedule: any, index: number) => ({
        id: `card_${Date.now()}_${index}`,
        day: schedule.day,
        time: schedule.time,
        type: schedule.type,
        audience: schedule.audience,
        theme: getThemeForCampaign(schedule.type),
        subject: '',
        preview: '',
        prompt: '',
        emailContent: '',
        imagePrompt: '',
        status: 'pending'
      }))

      // Send cards to Python backend for AI enhancement
      const response = await fetch('http://localhost:8000/api/campaign-generator/process-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: basicCards,
          product: selectedProductForPromotion,
          strategy: {
            product: selectedProductForPromotion?.name,
            primaryAudience: strategy.primaryAudience,
            strategy: strategy.strategy,
            emailType: strategy.emailType || 'informative',
            customPrompt: strategy.customPrompt || ''
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setGeneratedCampaignCards(result.cards)
          setShowStrategyModal(false)
        } else {
          throw new Error('Python API request failed')
        }
      } else {
        throw new Error('Python API request failed')
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

  // Campaign Type Selection Handlers
  const handleCampaignTypeSelection = (type: 'calendar' | 'popup') => {
    setSelectedCampaignType(type)
    setShowCampaignSelection(false)
  }

  const handleBackToSelection = () => {
    setShowCampaignSelection(true)
    setSelectedCampaignType(null)
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

        {/* Main Content */}
        <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
          {showCampaignSelection ? (
            // Campaign Type Selection Screen
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Campaign Type</h1>
                <p className="text-gray-600 dark:text-gray-400">Select the type of campaign you want to create</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar Campaign Option */}
                <div
                  onClick={() => handleCampaignTypeSelection('calendar')}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all group"
                >
                  <div className="text-center">
                    <Calendar className="h-16 w-16 text-gray-400 group-hover:text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Calendar Campaign</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create and schedule multiple email campaigns with AI-powered content generation,
                      product targeting, and strategic timing across a full calendar view.
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      ✨ AI Strategy Generation • 📧 Email Campaigns • 📅 Calendar Scheduling
                    </div>
                  </div>
                </div>

                {/* Popup Campaign Option */}
                <div
                  onClick={() => handleCampaignTypeSelection('popup')}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 cursor-pointer transition-all group"
                >
                  <div className="text-center">
                    <Zap className="h-16 w-16 text-gray-400 group-hover:text-orange-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Popup Campaign</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Design targeted popup advertisements with personalized messaging,
                      custom visuals, and conversion-optimized layouts for specific customer segments.
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      🎨 Visual Design • 🎯 Targeted Messaging • 📊 Conversion Optimization
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedCampaignType === 'calendar' ? (
            // Calendar Campaign Interface
            <>
              {/* Flow Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleBackToSelection}
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
            </>
          ) : selectedCampaignType === 'popup' ? (
            // Popup Campaign Interface
            <>
              {/* Popup Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleBackToSelection}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Popup Campaign Builder</h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Design → Target → Deploy</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-200">🎨 Popup Mode</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popup Campaign Flow */}
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column - Design & Settings */}
                  <div className="col-span-12 lg:col-span-3 space-y-6">
                    {/* Popup Design Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-orange-600" />
                        Popup Design & Targeting
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Popup Shape & Size
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="popupShape"
                                value="square"
                                checked={popupShape === 'square'}
                                onChange={(e) => setPopupShape(e.target.value)}
                                className="text-orange-600"
                              />
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-6 bg-orange-200 dark:bg-orange-800 rounded border"></div>
                                <span className="text-sm text-gray-900 dark:text-white">Square (400x400)</span>
                              </div>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="popupShape"
                                value="horizontal"
                                checked={popupShape === 'horizontal'}
                                onChange={(e) => setPopupShape(e.target.value)}
                                className="text-orange-600"
                              />
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-4 bg-blue-200 dark:bg-blue-800 rounded border"></div>
                                <span className="text-sm text-gray-900 dark:text-white">Horizontal (600x300)</span>
                              </div>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="popupShape"
                                value="tall"
                                checked={popupShape === 'tall'}
                                onChange={(e) => setPopupShape(e.target.value)}
                                className="text-orange-600"
                              />
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-10 bg-green-200 dark:bg-green-800 rounded border"></div>
                                <span className="text-sm text-gray-900 dark:text-white">Tall Banner (250x500)</span>
                              </div>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="popupShape"
                                value="wide"
                                checked={popupShape === 'wide'}
                                onChange={(e) => setPopupShape(e.target.value)}
                                className="text-orange-600"
                              />
                              <div className="flex items-center space-x-2">
                                <div className="w-12 h-2 bg-purple-200 dark:bg-purple-800 rounded border"></div>
                                <span className="text-sm text-gray-900 dark:text-white">Wide Banner (800x150)</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Popup Trigger
                          </label>
                          <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option>Exit Intent</option>
                            <option>Timed Popup (5 seconds)</option>
                            <option>Scroll Trigger (50%)</option>
                            <option>Click Trigger</option>
                            <option>Page Load</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Campaign Goal
                          </label>
                          <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option>Lead Generation</option>
                            <option>Product Promotion</option>
                            <option>Discount Offer</option>
                            <option>Newsletter Signup</option>
                            <option>Cart Recovery</option>
                            <option>Event Promotion</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Target Segment
                          </label>
                          <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option>High Converters</option>
                            <option>Window Shoppers</option>
                            <option>Cart Abandoners</option>
                            <option>Loyal Customers</option>
                            <option>New Visitors</option>
                            <option>Mobile Users</option>
                            <option>Returning Customers</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Product Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Search className="h-5 w-5 mr-2 text-blue-600" />
                        Product Selection
                      </h3>
                      <div className="space-y-6">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearchTerm}
                            onChange={(e) => {
                              setProductSearchTerm(e.target.value)
                              setShowProductDropdown(e.target.value.length > 0)
                            }}
                            onFocus={() => setShowProductDropdown(productSearchTerm.length > 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10"
                          />
                          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />

                          {showProductDropdown && filteredProducts.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {filteredProducts.map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => {
                                    toggleProductSelection(product.id)
                                    setProductSearchTerm('')
                                    setShowProductDropdown(false)
                                  }}
                                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand} • {product.category} • ${product.price}</p>
                                  </div>
                                  {selectedProducts.includes(product.id) && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selected Products */}
                        {selectedProducts.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Selected Products ({selectedProducts.length})</p>
                            <div className="flex flex-wrap gap-3">
                              {selectedProducts.map((productId) => {
                                const product = availableProducts.find(p => p.id === productId)
                                return product ? (
                                  <div key={productId} className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                    <span>{product.name}</span>
                                    <button
                                      onClick={() => toggleProductSelection(productId)}
                                      className="ml-2 hover:text-blue-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ) : null
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>

                  {/* Center Column - Live Preview */}
                  <div className="col-span-12 lg:col-span-6 space-y-6">
                    {/* Live Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Live Preview</h3>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                        <div
                          className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl transition-all duration-300 ${
                            popupShape === 'square' ? 'w-80 h-80 p-8' :
                            popupShape === 'horizontal' ? 'w-96 h-48 p-6' :
                            popupShape === 'tall' ? 'w-48 h-96 p-6' :
                            popupShape === 'wide' ? 'w-full max-w-2xl h-32 p-4' : 'w-80 h-80 p-8'
                          }`}
                        >
                          <div className={`text-center h-full ${
                            popupShape === 'wide' ? 'flex items-center justify-between' : 'flex flex-col justify-center'
                          }`}>
                            {popupShape === 'wide' ? (
                              <>
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Gift className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {popupHeadline || "Special Offer!"}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {popupDescription || "Get 20% off your next purchase"}
                                    </p>
                                  </div>
                                </div>
                                <button className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors">
                                  {popupCTA || "Claim Offer"}
                                </button>
                              </>
                            ) : (
                              <>
                                <div className={`${
                                  popupShape === 'tall' ? 'w-8 h-8 mb-2' : 'w-16 h-16 mb-4'
                                } bg-orange-500 rounded-full flex items-center justify-center mx-auto`}>
                                  <Gift className={`${
                                    popupShape === 'tall' ? 'h-4 w-4' : 'h-8 w-8'
                                  } text-white`} />
                                </div>
                                <h4 className={`font-semibold text-gray-900 dark:text-white mb-2 ${
                                  popupShape === 'tall' ? 'text-sm' :
                                  popupShape === 'horizontal' ? 'text-lg' : 'text-xl'
                                }`}>
                                  {popupHeadline || "Special Offer!"}
                                </h4>
                                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${
                                  popupShape === 'tall' ? 'text-xs' : 'text-sm'
                                }`}>
                                  {popupDescription || "Get 20% off your next purchase"}
                                </p>
                                <button className={`bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors ${
                                  popupShape === 'tall' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                                }`}>
                                  {popupCTA || "Claim Offer"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Shape Info */}
                      <div className="mt-4 text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          {popupShape === 'square' ? '400×400px Square' :
                           popupShape === 'horizontal' ? '600×300px Horizontal' :
                           popupShape === 'tall' ? '250×500px Tall Banner' :
                           popupShape === 'wide' ? '800×150px Wide Banner' : 'Custom Size'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - AI Tools & Actions */}
                  <div className="col-span-12 lg:col-span-3 space-y-6">
                    {/* AI Image Prompt Generation */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Wand2 className="h-5 w-5 mr-2 text-indigo-600" />
                        AI Image Prompt
                      </h3>
                      <button
                        onClick={generateImagePrompt}
                        disabled={selectedProducts.length === 0 || isGeneratingPrompt}
                        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 mb-6"
                      >
                        {isGeneratingPrompt ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generate Image Prompt</span>
                          </>
                        )}
                      </button>

                      {generatedPrompt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Generated Prompt (Edit as needed)
                          </label>
                          <textarea
                            value={generatedPrompt}
                            onChange={(e) => setGeneratedPrompt(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={4}
                            placeholder="AI-generated image prompt will appear here..."
                          />
                        </div>
                      )}
                    </div>

                    {/* OCR Campaign Insights */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                        High-Performing Campaign Styles
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Select successful campaign patterns to incorporate
                      </p>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {ocrPatterns.map((pattern) => (
                          <div
                            key={pattern.id}
                            onClick={() => toggleOCRPattern(pattern.id)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedOCRPatterns.includes(pattern.id)
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{pattern.description}</h4>
                                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded-full">
                                    {pattern.effectiveness}%
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{pattern.example}</p>
                              </div>
                              {selectedOCRPatterns.includes(pattern.id) && (
                                <Check className="h-4 w-4 text-purple-600 ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Low-Performing Campaign Styles Info */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Campaign Style Notes</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Common low-performing patterns for this product type
                      </p>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {lowPerformingPatterns.map((pattern) => (
                          <div
                            key={pattern.id}
                            className="p-3 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{pattern.description}</h4>
                                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-0.5 rounded-full">
                                    {pattern.effectiveness}% CTR
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{pattern.example}</p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">{pattern.issue}</p>
                              </div>
                              <div className="ml-2 text-yellow-500">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate Campaign */}
                    <button className="w-full bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold">
                      <Sparkles className="h-6 w-6" />
                      <span>Generate Popup Campaign</span>
                    </button>

                    {/* Performance Metrics */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Expected Performance</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Expected Views</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedProducts.length > 0 ? (2450 * selectedProducts.length / 2).toLocaleString() : '2,450'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Predicted CTR</span>
                          <span className="text-sm font-medium text-green-600">
                            {selectedOCRPatterns.length > 0
                              ? `${Math.round(8.5 + (selectedOCRPatterns.reduce((acc, id) => {
                                  const pattern = ocrPatterns.find(p => p.id === id);
                                  return acc + (pattern ? pattern.effectiveness / 10 : 0);
                                }, 0) / selectedOCRPatterns.length))}%`
                              : '8.5%'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Expected Conversions</span>
                          <span className="text-sm font-medium text-blue-600">
                            {selectedProducts.length > 0 ? Math.round(208 * selectedProducts.length / 2) : 208}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Potential</span>
                          <span className="text-sm font-medium text-purple-600">
                            ${selectedProducts.length > 0 ? (5200 * selectedProducts.length / 2).toLocaleString() : '5,200'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
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