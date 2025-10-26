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
  const [selectedDate, setSelectedDate] = useState<string>('')
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
  const [promptEdit, setPromptEdit] = useState('')

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
    setShowStrategyModal(true) // Automatically show strategy modal
  }

  // Generate smart initial prompt based on analytics insights using OpenAI
  const generateSmartPrompt = async (product: any, insights: any[], similarProducts: any[]) => {
    try {
      const audienceInsight = insights.find(i => i.type === 'audience')
      const visualInsight = insights.find(i => i.type === 'info')
      const warningInsight = insights.find(i => i.type === 'warning')
      const crossSellOpportunity = similarProducts[0]

      // Prepare context for OpenAI
      const contextData = {
        product: {
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price
        },
        audience: audienceInsight?.audience || 'Window Shoppers',
        conversionRate: audienceInsight?.conversionRate,
        visualGuidance: visualInsight?.info,
        warnings: warningInsight?.warning,
        crossSellOpportunity: crossSellOpportunity?.name,
        expectedBoost: crossSellOpportunity?.expectedBoost
      }

      // Prepare the request payload
      const requestPayload = {
        product: {
          name: contextData.product.name || 'Unknown Product',
          category: contextData.product.category || 'Unknown Category',
          price: contextData.product.price || 0
        },
        strategy: {
          product: contextData.product.name || 'Unknown Product',
          primaryAudience: contextData.audience || 'General Audience',
          strategy: `Generate smart campaign prompt for ${product.name} targeting ${contextData.audience}`,
          emailType: 'prompt-generation',
          customPrompt: `Generate strategic campaign insights and analytics for ${product.name}:

ANALYTICS INSIGHTS:
- Analyze optimal timing for ${contextData.audience} segment
- Recommend hero image strategy for ${product.name}
- Suggest campaign frequency and duration
- Identify peak engagement windows

CAMPAIGN STRATEGY:
- Focus: Promote ${product.name} to ${contextData.audience}
- Hero Image: ${contextData.visualGuidance || 'Professional product photography with lifestyle context'}
- Cross-sell: ${contextData.crossSellOpportunity || 'None identified'}
- Performance optimization: ${contextData.warnings || 'Standard conversion optimization'}

OUTPUT REQUIRED: Strategic recommendations only (no email content). Focus on timing, targeting insights, and visual strategy.`
        },
        weeklySchedule: [{
          day: 'Today',
          time: new Date().toLocaleTimeString(),
          type: 'Prompt Generation',
          audience: contextData.audience || 'General Audience',
          emailTheme: 'Strategic Campaign Planning'
        }]
      }

      console.log('🔍 API Request payload:', JSON.stringify(requestPayload, null, 2))

      // Call Python backend API for prompt generation
      const response = await fetch('http://localhost:8000/api/campaign-generator/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      if (response.ok) {
        const apiResponse = await response.json()
        const generatedCards = apiResponse.cards || []

        if (generatedCards.length > 0) {
          // Extract the generated prompt from the AI response
          const aiPrompt = generatedCards[0].emailContent || generatedCards[0].subject ||
            `Focus on ${contextData.audience} with ${product.name}. Use professional imagery and highlight key benefits for maximum conversion.`
          return aiPrompt
        }
      }

      // Fallback if API fails - keep it simple
      return ''

    } catch (error) {
      console.error('Error generating smart prompt:', error)
      // Return empty string to let user write their own
      return ''
    }
  }

  // Apply user's prompt modification request
  const applyPromptEdit = () => {
    if (!promptEdit.trim()) return

    let updatedPrompt = customPrompt

    // Handle discount/pricing requests
    if (promptEdit.toLowerCase().includes('discount') || promptEdit.toLowerCase().includes('%')) {
      const discountMatch = promptEdit.match(/(\d+)%/)
      const discount = discountMatch ? discountMatch[1] : '50'
      updatedPrompt += ` Highlight ${discount}% discount offer throughout emails.`
    }
    if (promptEdit.toLowerCase().includes('free shipping')) {
      updatedPrompt += ' Emphasize free shipping benefits and delivery speed.'
    }
    if (promptEdit.toLowerCase().includes('bundle') || promptEdit.toLowerCase().includes('package')) {
      updatedPrompt += ' Focus on bundle deals and package savings.'
    }
    if (promptEdit.toLowerCase().includes('limited time') || promptEdit.toLowerCase().includes('expires')) {
      updatedPrompt += ' Create urgency with limited-time offers and expiration dates.'
    }

    // Handle image/visual requests
    if (promptEdit.toLowerCase().includes('lifestyle') || promptEdit.toLowerCase().includes('people using')) {
      updatedPrompt += ' Use lifestyle images showing people actively using the product.'
    }
    if (promptEdit.toLowerCase().includes('product only') || promptEdit.toLowerCase().includes('clean background')) {
      updatedPrompt += ' Use clean product shots on white/minimal backgrounds.'
    }
    if (promptEdit.toLowerCase().includes('action shots') || promptEdit.toLowerCase().includes('dynamic')) {
      updatedPrompt += ' Include dynamic action shots and movement in visuals.'
    }

    // Handle specific content requests
    if (promptEdit.toLowerCase().includes('comparison') || promptEdit.toLowerCase().includes('vs')) {
      updatedPrompt += ' Include product comparisons and competitive advantages.'
    }
    if (promptEdit.toLowerCase().includes('testimonial') || promptEdit.toLowerCase().includes('review')) {
      updatedPrompt += ' Feature customer testimonials and positive reviews.'
    }

    // If no specific keywords matched, just append the user's request
    if (updatedPrompt === customPrompt) {
      updatedPrompt += ` ${promptEdit}`
    }

    setCustomPrompt(updatedPrompt)
    setPromptEdit('')
  }

  // Generate strategy recommendation based on product
  const generateInsightsForProduct = async (product: any) => {
    // Generate visual insights based on conversion data
    const insights = [
      {
        type: 'info',
        message: `Use studio lighting for ${product.category} visuals - campaigns convert 40% better`,
        confidence: '92% confidence',
        source: 'Conversion data'
      },
      {
        type: 'warning',
        message: 'Skip outdoor/desert backgrounds - they reduce campaign performance significantly',
        source: 'Performance analysis'
      },
      {
        type: 'audience',
        audience: 'Window Shoppers',
        strategy: 'Target with discovery-focused content and clear value propositions',
        timing: 'Monday 10AM, Wednesday 2PM',
        followUp: 'Auto cart abandonment sequence',
        conversionRate: '24.5%'
      }
    ]
    setOcrInsights(insights)

    // Generate similar products
    const similarProds = [
      {
        id: 'similar_1',
        name: `${product.brand} Bundle Pack`,
        reason: 'Cross-sell opportunity with high conversion potential',
        urgency: 'High',
        expectedBoost: '+35%'
      }
    ]
    setSimilarProducts(similarProds)

    // Only auto-generate smart prompt if user hasn't already entered their own
    if (!customPrompt || customPrompt.trim() === '') {
      const smartPrompt = await generateSmartPrompt(product, insights, similarProds)
      setCustomPrompt(smartPrompt)
    }

    // Generate strategy recommendation
    setStrategyRecommendation({
      product: product.name,
      primaryAudience: 'Window Shoppers',
      strategy: 'Generate targeted email campaigns for window shoppers with compelling hero images and personalized content. Use studio lighting backgrounds for better conversions.',
      emailStrategy: 'Each email will feature custom hero images and tailored messaging based on audience behavior patterns.',
      heroImageGuidelines: 'Use clean, studio-lit product shots with tech-focused backgrounds for best results.',
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
      // Enhanced prompt with custom user input
      const enhancedPrompt = customPrompt ? `${customPrompt}. ` : ''

      // Infer product from prompt if no product is selected
      let productInfo = selectedProductForPromotion
      if (!productInfo && customPrompt) {
        // Try to extract product name from the prompt
        const productMatch = customPrompt.match(/iPhone \d+ Pro|iPhone|MacBook|iPad|Samsung Galaxy|Pixel|AirPods|Apple Watch/i)
        productInfo = {
          name: productMatch ? productMatch[0] : 'Product',
          category: 'Technology',
          price: 999
        }
      }

      // Prepare data for OpenAI API call
      const campaignData = {
        product: productInfo || { name: 'Product', category: 'General', price: 0 },
        strategy: {
          product: productInfo?.name || strategy.product || 'Product',
          strategy: strategy.strategy || 'Generate compelling email campaigns',
          primaryAudience: strategy.primaryAudience || 'Target Audience',
          emailType: selectedEmailType,
          customPrompt: enhancedPrompt
        },
        weeklySchedule: (strategy.weeklySchedule || []).map((schedule: any) => ({
          ...schedule,
          emailTheme: schedule.emailTheme || 'Strategic Campaign Planning'
        }))
      }

      // Call the optimized Python API
      console.log('🚀 Calling optimized Python API with data:', campaignData)

      const response = await fetch('http://localhost:8000/api/campaign-generator/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`Failed to generate campaigns: ${response.status}`)
      }

      const apiResponse = await response.json()
      console.log('✅ API Response:', apiResponse)
      const generatedCards = apiResponse.cards || []

      // Transform API response to match our card format
      const transformedCards = generatedCards.map((card: any, index: number) => {
        // Create a schedule object for date calculation
        const scheduleForDate = { day: card.day, time: card.time }

        return {
          id: card.id || `card_${Date.now()}_${index}`,
          day: card.day,
          time: card.time,
          type: card.type,
          audience: card.audience,
          theme: card.theme || 'Engaging',
          heroImage: card.imagePrompt,
          imagePrompt: card.imagePrompt,  // Keep both for compatibility
          prompt: card.prompt,
          preview: card.preview || `${card.day} ${card.time}: ${card.type}`,
          status: 'generated',
          subject: card.subject,
          emailContent: card.emailContent,
          dateScheduled: getDateForSchedule(scheduleForDate)
        }
      })

      // Set the cards in the strategy modal preview (not in main calendar yet)
      setGeneratedCampaignCards(transformedCards)
    } catch (error) {
      console.error('Error generating campaign cards:', error)

      // Fallback to mock data if API fails
      const fallbackEnhancedPrompt = customPrompt ? `${customPrompt}. ` : ''
      const mockCards = strategy.weeklySchedule.map((schedule: any, index: number) => ({
        id: `card_${Date.now()}_${index}`,
        day: schedule.day,
        time: schedule.time,
        type: schedule.type,
        audience: schedule.audience,
        theme: schedule.emailTheme || 'Engaging',
        heroImage: schedule.heroImageDesc,
        prompt: `${fallbackEnhancedPrompt}Generate ${selectedEmailType.includes('google-ads') ? `${selectedEmailType} ad` : `${selectedEmailType} email`} for ${schedule.type} targeting ${schedule.audience} promoting ${selectedProductForPromotion?.name}. Theme: ${schedule.emailTheme}. ${selectedEmailType.includes('google-ads') ? `Ad format: ${selectedEmailType}. Visual: ${schedule.heroImageDesc}` : `Hero image: ${schedule.heroImageDesc}`}`,
        preview: `${schedule.day} ${schedule.time}: ${schedule.type}`,
        status: 'generated',
        subject: getEmailSubjectForSchedule(schedule, selectedProductForPromotion?.name, selectedEmailType),
        emailContent: getEmailContentForSchedule(schedule, selectedProductForPromotion?.name, selectedEmailType, fallbackEnhancedPrompt),
        dateScheduled: getDateForSchedule(schedule)
      }))

      setGeneratedCampaignCards(mockCards)
      alert('Using fallback generation. Check console for API error details.')
    } finally {
      setIsGeneratingCards(false)
    }
  }

  // Approve selected campaigns and send to calendar
  const approveSelectedCampaigns = () => {
    // Add approved cards directly to calendar
    generatedCampaignCards.forEach(card => {
      const calendarEntry = {
        id: card.id,
        product: selectedProductForPromotion?.name,
        date: card.dateScheduled, // This matches what the calendar filters on
        time: card.time,
        type: card.type,
        audience: card.audience,
        status: 'scheduled',
        email: card.emailContent,
        subject: card.subject,
        heroImage: card.heroImage
      }
      console.log('Adding campaign to calendar:', calendarEntry) // Debug log
      setScheduledCampaigns(prev => [...prev, calendarEntry])
    })

    console.log('Total scheduled campaigns after approval:', scheduledCampaigns.length + generatedCampaignCards.length) // Debug log

    // Clear generated cards and close modal
    setGeneratedCampaignCards([])
    setShowStrategyModal(false)
  }

  // Remove individual campaign card
  const removeCampaignCard = (cardId: string) => {
    setGeneratedCampaignCards(prev => prev.filter(card => card.id !== cardId))
  }

  // Helper functions for campaign generation
  const getEmailSubjectForSchedule = (schedule: any, productName: string, emailType: string = 'informative') => {
    // Google Ads headlines (shorter, more direct)
    if (emailType.includes('google-ads')) {
      const adHeadlines: { [key: string]: string[] } = {
        'Primary Campaign': [
          `${productName} - Shop Now`,
          `New ${productName} Available`,
          `Get Your ${productName} Today`
        ],
        'Follow-up': [
          `${productName} Still Available`,
          `Complete Your Purchase`,
          `Don't Miss Out - ${productName}`
        ],
        'Premium Drop': [
          `Exclusive ${productName} Access`,
          `VIP ${productName} Offer`,
          `Limited Edition ${productName}`
        ],
        'Weekly Recap': [
          `This Week's Best Deals`,
          `Weekly Tech Update`,
          `Don't Miss These Deals`
        ]
      }
      const typeHeadlines = adHeadlines[schedule.type] || adHeadlines['Primary Campaign']
      return typeHeadlines[Math.floor(Math.random() * typeHeadlines.length)]
    }

    // Email subjects (longer, more descriptive)
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

  const getEmailContentForSchedule = (schedule: any, productName: string, emailType: string = 'informative', customPrompt: string = '') => {
    const toneMap: { [key: string]: string } = {
      'informative': 'professional and educational',
      'promotional': 'exciting and sales-focused',
      'urgent': 'urgent and action-oriented',
      'friendly': 'casual and conversational',
      'luxury': 'premium and exclusive'
    }

    const tone = toneMap[emailType] || 'professional'
    const smartPromptNote = customPrompt ? `\\n\\n🎯 Smart Targeting: ${customPrompt}` : ''

    // Enhanced content with smart insights
    const smartContent = customPrompt.includes('studio lighting')
      ? `\\n\\n📸 Featuring clean studio shots with premium lighting for optimal engagement.`
      : ''

    const crossSellNote = customPrompt.includes('Bundle Pack')
      ? `\\n\\n💡 Pro tip: Check out our ${productName.split(' ')[0]} Bundle Pack for even more value!`
      : ''

    return `Subject: ${getEmailSubjectForSchedule(schedule, productName, emailType)}\\n\\nHi there!\\n\\n[${tone.toUpperCase()} TONE] We're excited to share details about the ${productName} with you.\\n\\n${schedule.emailTheme}: This campaign focuses on ${schedule.audience.toLowerCase()} and aims to ${schedule.type.toLowerCase()}.\\n\\nHero Image: ${schedule.heroImageDesc}${smartContent}${crossSellNote}${smartPromptNote}\\n\\nEmail Type: ${emailType}\\n\\nBest regards,\\nYour Marketing Team`
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
      const updatedSchedule = [...(strategyRecommendation?.weeklySchedule || [])]
      updatedSchedule[index] = newSchedule
      setStrategyRecommendation({
        ...strategyRecommendation,
        weeklySchedule: updatedSchedule
      })
    }
    setEditingSchedule(null)
  }

  const autoPopulateMoreDays = () => {
    if (!strategyRecommendation || !selectedProductForPromotion) return

    const currentSchedule = strategyRecommendation.weeklySchedule || []

    // Extract existing date strings for comparison (e.g., "Monday 27", "Wednesday 29")
    const existingDays = currentSchedule.map((s: any) => s.day.toLowerCase())

    // Get current date info
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const currentDay = now.getDate()

    // Define campaign types and audiences to rotate through
    const campaignTypes = [
      'Primary Campaign',
      'Follow-up Campaign',
      'Cross-sell Campaign',
      'Engagement Campaign',
      'Retargeting Campaign',
      'Newsletter Campaign'
    ]

    const audiences = [
      'Window Shoppers',
      'Previous Customers',
      'Cart Abandoners',
      'Engaged Users',
      'New Subscribers'
    ]

    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']

    // Generate remaining days for the month
    const newScheduleEntries = []
    let campaignIndex = 0

    // Start from tomorrow and go through the next 20 days to ensure we get enough weekdays
    for (let i = 1; i <= 20; i++) {
      const futureDate = new Date(now)
      futureDate.setDate(now.getDate() + i)

      // Stop if we've exceeded this month and next month
      if (futureDate.getMonth() > now.getMonth() + 1) break

      const dayName = futureDate.toLocaleDateString('en-US', { weekday: 'long' })
      const dayNumber = futureDate.getDate()
      const monthName = futureDate.toLocaleDateString('en-US', { month: 'short' })

      // Create full day string like "Monday 27" or "Tuesday 3 Nov" for next month
      const fullDayString = futureDate.getMonth() === now.getMonth()
        ? `${dayName} ${dayNumber}`
        : `${dayName} ${dayNumber} ${monthName}`

      // Skip weekends for most campaigns
      if (futureDate.getDay() === 0 || futureDate.getDay() === 6) continue

      // Skip if this exact day already exists
      if (existingDays.includes(fullDayString.toLowerCase())) continue

      // Stop after adding 10 new campaign days
      if (newScheduleEntries.length >= 10) break

      const campaignType = campaignTypes[campaignIndex % campaignTypes.length]
      const audience = audiences[campaignIndex % audiences.length]
      const time = times[campaignIndex % times.length]

      newScheduleEntries.push({
        day: fullDayString,
        time: time,
        type: campaignType,
        audience: audience,
        heroImageDesc: `${selectedProductForPromotion.name} optimized for ${audience.toLowerCase()}, ${campaignType.toLowerCase()} style`,
        emailTheme: `${monthName} ${dayNumber} - ${campaignType}`
      })

      campaignIndex++
    }

    // Update strategy recommendation with new schedule
    const updatedStrategy = {
      ...strategyRecommendation,
      weeklySchedule: [...currentSchedule, ...newScheduleEntries],
      expectedCampaigns: currentSchedule.length + newScheduleEntries.length
    }

    setStrategyRecommendation(updatedStrategy)
  }

  return (
    <div className="max-w-full mx-auto">
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

      {/* Three Column Layout - Wide campaign builder style */}
      <div className="flex gap-3 h-[calc(100vh-180px)]">

        {/* Column 1: Product Catalog Searcher */}
        <div className="w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Product Catalog
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Search and select products</p>
          </div>

          {/* Product Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
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
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
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
          <div className="flex-1 overflow-y-auto p-3">
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
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
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

          <div className="flex-1 p-3">
            {!selectedProductForPromotion ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div className="text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a product to schedule campaigns</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Calendar Grid */}
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
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 font-medium text-gray-500 border-b">{day}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(date => {
                      const currentMonth = new Date().getMonth() + 1
                      const currentYear = new Date().getFullYear()
                      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                      const campaignsForDate = scheduledCampaigns.filter(c => {
                        const matches = c.date === dateStr
                        if (matches) console.log('Found campaign for date:', dateStr, c)
                        return matches
                      })
                      return (
                        <div
                          key={date}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-3 min-h-[55px] hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer rounded-lg border transition-all duration-200 ${
                            selectedDate === dateStr
                              ? 'bg-purple-500 text-white border-purple-600 shadow-lg'
                              : 'text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300'
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

                {/* Strategy Section - Inside Calendar Column */}
                {showStrategyModal && (
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">📧 Campaign Strategy</h4>
                      <button
                        onClick={() => setShowStrategyModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Email Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Campaign Type</label>
                        <select
                          value={selectedEmailType}
                          onChange={(e) => setSelectedEmailType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="informative">📧 Email - Informative</option>
                          <option value="promotional">📧 Email - Promotional</option>
                          <option value="urgent">📧 Email - Urgent</option>
                          <option value="friendly">📧 Email - Friendly</option>
                          <option value="luxury">📧 Email - Luxury</option>
                          <option value="google-ads-vertical">📱 Google Ads - Vertical (9:16)</option>
                          <option value="google-ads-horizontal">🖥️ Google Ads - Horizontal (16:9)</option>
                        </select>
                      </div>

                      {/* Prompt Editor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Edit AI Prompt
                        </label>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={promptEdit}
                              onChange={(e) => setPromptEdit(e.target.value)}
                              placeholder="e.g., '50% discount' or 'lifestyle images'"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                              onKeyPress={(e) => e.key === 'Enter' && applyPromptEdit()}
                            />
                            <button
                              onClick={applyPromptEdit}
                              disabled={!promptEdit.trim()}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              Apply
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {['50% discount', 'free shipping', 'limited time', 'lifestyle images', 'product only shots', 'customer reviews'].map(suggestion => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setPromptEdit(suggestion)
                                  setTimeout(applyPromptEdit, 100)
                                }}
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Current Prompt - More Space */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                          🤖 AI Prompt Editor
                          {selectedProductForPromotion ? (
                            <span className="text-xs text-green-600 ml-2">✨ Smart analytics applied</span>
                          ) : (
                            <span className="text-xs text-orange-600 ml-2">⚠️ Enter prompt to generate campaigns</span>
                          )}
                        </label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm leading-relaxed"
                          rows={4}
                          placeholder="Enter your campaign prompt here (e.g., 'Create a campaign for iPhone 15 Pro highlighting camera features with running imagery')"
                        />
                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                          <span className="mr-2">💡</span>
                          Based on: 24.5% conversion rate, studio lighting insights, cross-sell opportunities
                        </div>
                      </div>

                      {/* Generated Campaign Cards */}
                      {generatedCampaignCards.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 dark:text-white text-sm">Generated Campaigns ({generatedCampaignCards.length})</h5>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  if (!strategyRecommendation) {
                                    console.error('Strategy recommendation not available')
                                    return
                                  }
                                  const enhancedStrategy = {
                                    ...strategyRecommendation,
                                    customPrompt: customPrompt || '',
                                    emailType: selectedEmailType,
                                    weeklySchedule: (strategyRecommendation.weeklySchedule || []).map((schedule: any) => ({
                                      ...schedule,
                                      emailType: selectedEmailType,
                                      customPrompt: customPrompt
                                    }))
                                  }
                                  generateCampaignCards(enhancedStrategy)
                                }}
                                disabled={isGeneratingCards}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                🔄 Regenerate
                              </button>
                              <button
                                onClick={autoPopulateMoreDays}
                                disabled={!strategyRecommendation || !selectedProductForPromotion}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                title="Add more campaign days to the month"
                              >
                                📅 More Days
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {generatedCampaignCards.map((card) => (
                              <div key={card.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-2 rounded border border-blue-200 dark:border-blue-700">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-blue-800 dark:text-blue-200 text-xs">{card.type}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400">{card.day} {card.time}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{card.subject}</div>
                                    {card.preview && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        <span className="font-medium">Brief:</span> {card.preview}
                                      </div>
                                    )}
                                    {card.imagePrompt && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                        <span className="font-medium">Image:</span> {card.imagePrompt}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeCampaignCard(card.id)}
                                    className="ml-2 text-red-600 hover:text-red-800 text-xs"
                                    title="Remove campaign"
                                  >
                                    ❌
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                        {generatedCampaignCards.length === 0 ? (
                          <button
                            onClick={() => {
                              // Allow generation with just a prompt
                              if (!customPrompt || customPrompt.trim() === '') {
                                alert('Please enter a prompt to generate campaigns')
                                return
                              }

                              let strategy = strategyRecommendation

                              // Create a basic strategy if none exists (user only entered prompt)
                              if (!strategy) {
                                const inferredProduct = customPrompt.match(/iPhone|MacBook|iPad|Samsung|Pixel|product/i)?.[0] || 'Product'

                                strategy = {
                                  product: inferredProduct,
                                  primaryAudience: 'General Audience',
                                  strategy: 'Generate email campaigns based on custom prompt',
                                  emailStrategy: 'Custom campaign generation',
                                  timing: ['Monday 10AM', 'Wednesday 2PM'],
                                  weeklySchedule: [
                                    {
                                      day: 'Monday',
                                      time: '10:00 AM',
                                      type: 'Primary Campaign',
                                      audience: 'General Audience',
                                      emailTheme: 'Promotional'
                                    },
                                    {
                                      day: 'Wednesday',
                                      time: '2:00 PM',
                                      type: 'Follow-up',
                                      audience: 'Interested Users',
                                      emailTheme: 'Engagement'
                                    },
                                    {
                                      day: 'Friday',
                                      time: '9:00 AM',
                                      type: 'Weekly Recap',
                                      audience: 'All Users',
                                      emailTheme: 'Newsletter'
                                    }
                                  ]
                                }
                              }

                              const enhancedStrategy = {
                                ...strategy,
                                customPrompt: customPrompt || '',
                                emailType: selectedEmailType,
                                weeklySchedule: (strategy.weeklySchedule || []).map((schedule: any) => ({
                                  ...schedule,
                                  emailType: selectedEmailType,
                                  customPrompt: customPrompt
                                }))
                              }
                              generateCampaignCards(enhancedStrategy)
                            }}
                            disabled={isGeneratingCards || (!customPrompt || customPrompt.trim() === '')}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {isGeneratingCards ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="h-3 w-3 mr-2" />
                                Generate Campaigns
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={approveSelectedCampaigns}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm"
                          >
                            ✅ Approve & Schedule ({generatedCampaignCards.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Column 3: Analytics & Similar Products */}
        <div className="w-72 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
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
              <div className="space-y-4 p-2">
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
                      Cross-Sell Opportunities
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


      {/* Hidden Modal - keeping structure but not rendering */}
      {false && showStrategyModal && strategyRecommendation && (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Campaign Controls */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-3">🎯 Campaign for {strategyRecommendation.primaryAudience}</h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    📸 Using studio lighting for better campaign results
                  </div>
                </div>

                {/* Email Type and Prompt Editing */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Campaign Type</label>
                    <select
                      value={selectedEmailType}
                      onChange={(e) => setSelectedEmailType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="informative">📧 Email - Informative</option>
                      <option value="promotional">📧 Email - Promotional</option>
                      <option value="urgent">📧 Email - Urgent</option>
                      <option value="friendly">📧 Email - Friendly</option>
                      <option value="luxury">📧 Email - Luxury</option>
                      <option value="google-ads-vertical">📱 Google Ads - Vertical (9:16)</option>
                      <option value="google-ads-horizontal">🖥️ Google Ads - Horizontal (16:9)</option>
                    </select>
                  </div>

                  {/* Prompt Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Edit AI Prompt
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promptEdit}
                          onChange={(e) => setPromptEdit(e.target.value)}
                          placeholder="e.g., 'make it health focused' or 'add luxury tone'"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && applyPromptEdit()}
                        />
                        <button
                          onClick={applyPromptEdit}
                          disabled={!promptEdit.trim()}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Apply
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['50% discount', 'free shipping', 'limited time', 'lifestyle images', 'product only shots', 'customer reviews'].map(suggestion => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setPromptEdit(suggestion)
                              setTimeout(applyPromptEdit, 100)
                            }}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Current AI Prompt
                      <span className="text-xs text-green-600 ml-2">✨ Smart analytics</span>
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="AI prompt auto-populated with performance insights..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      💡 Based on: 24.5% conversion rate, studio lighting insights, cross-sell opportunities
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Generated Campaign Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white text-lg">📧 Generated Campaigns ({generatedCampaignCards.length})</h4>
                  {generatedCampaignCards.length > 0 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (!strategyRecommendation) {
                            console.error('Strategy recommendation not available')
                            return
                          }
                          const enhancedStrategy = {
                            ...strategyRecommendation,
                            customPrompt: customPrompt || '',
                            emailType: selectedEmailType,
                            weeklySchedule: (strategyRecommendation.weeklySchedule || []).map((schedule: any) => ({
                              ...schedule,
                              emailType: selectedEmailType,
                              customPrompt: customPrompt
                            }))
                          }
                          generateCampaignCards(enhancedStrategy)
                        }}
                        disabled={isGeneratingCards}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        🔄 Regenerate
                      </button>
                      <button
                        onClick={autoPopulateMoreDays}
                        disabled={!strategyRecommendation || !selectedProductForPromotion}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        title="Add more campaign days to the month"
                      >
                        📅 Populate More Days
                      </button>
                    </div>
                  )}
                </div>

                {generatedCampaignCards.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Click "Generate Email Campaigns" to create campaigns</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {generatedCampaignCards.map((card, index) => (
                      <div key={card.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-2 rounded-lg border border-blue-200 dark:border-blue-700 overflow-hidden">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-blue-800 dark:text-blue-200 text-sm truncate">{card.type}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">{card.day} {card.time}</div>
                            <div className="text-xs text-gray-500 truncate">{card.audience}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium break-words">{card.subject}</div>
                            {card.preview && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium">Brief:</span> {card.preview}
                              </div>
                            )}
                            {card.imagePrompt && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium">Image:</span> {card.imagePrompt}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeCampaignCard(card.id)}
                            className="ml-2 text-red-600 hover:text-red-800 text-xs flex-shrink-0"
                            title="Remove campaign"
                          >
                            ❌
                          </button>
                        </div>

                        {/* Content preview */}
                        <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border text-xs overflow-hidden">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {selectedEmailType.includes('google-ads') ? 'Ad Preview:' : 'Email Preview:'}
                            </span>
                            {customPrompt && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                ✨ Smart Insights Applied
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-gray-600 dark:text-gray-400 text-xs break-words">
                            {card.emailContent.substring(0, 140)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600 mt-6">
              {generatedCampaignCards.length === 0 ? (
                <button
                  onClick={() => {
                    if (!strategyRecommendation) {
                      console.error('Strategy recommendation not available')
                      return
                    }
                    // Use custom prompt and email type if provided
                    const enhancedStrategy = {
                      ...strategyRecommendation,
                      customPrompt: customPrompt || '',
                      emailType: selectedEmailType,
                      weeklySchedule: (strategyRecommendation.weeklySchedule || []).map((schedule: any) => ({
                        ...schedule,
                        emailType: selectedEmailType,
                        customPrompt: customPrompt
                      }))
                    }
                    generateCampaignCards(enhancedStrategy)
                  }}
                  disabled={isGeneratingCards}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingCards ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating with ChatGPT...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Email Campaigns
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={approveSelectedCampaigns}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  ✅ Approve & Schedule ({generatedCampaignCards.length} campaigns)
                </button>
              )}
              <button
                onClick={() => setShowStrategyModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}