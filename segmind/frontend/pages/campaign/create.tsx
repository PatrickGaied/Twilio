import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Target, Mail, Plus, Check, Zap, Wand2, Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  similarity?: number
  performance: {
    conversion_rate: number
    revenue: number
    sales: number
    trend: 'up' | 'down' | 'stable'
  }
  image?: string
  description: string
}

interface CampaignTone {
  id: string
  name: string
  description: string
  example: string
  color: string
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const { segment, product: initialProduct } = router.query

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedTone, setSelectedTone] = useState<string>('')
  const [campaignGoal, setCampaignGoal] = useState<string>('')
  const [step, setStep] = useState<'brand' | 'products' | 'tone' | 'review'>('brand')

  // Product-audience affinity data based on query params
  const getAffinityData = () => {
    if (!segment || !initialProduct) return null

    // Mock affinity data - in real app this would come from API
    const affinityMap: { [key: string]: { [key: string]: { affinity: number, conversion: number, revenue: number } } } = {
      'iPhone 15 Pro': {
        'High Converters': { affinity: 92, conversion: 28.4, revenue: 488000 },
        'Loyal Customers': { affinity: 78, conversion: 22.1, revenue: 340000 },
        'Window Shoppers': { affinity: 45, conversion: 12.3, revenue: 156000 }
      },
      'Samsung Galaxy S24': {
        'Loyal Customers': { affinity: 87, conversion: 23.1, revenue: 298000 },
        'High Converters': { affinity: 72, conversion: 19.8, revenue: 267000 },
        'Window Shoppers': { affinity: 58, conversion: 15.6, revenue: 198000 }
      },
      'MacBook Air M3': {
        'High Converters': { affinity: 89, conversion: 31.2, revenue: 654000 },
        'Loyal Customers': { affinity: 76, conversion: 24.7, revenue: 432000 }
      }
    }

    return affinityMap[initialProduct as string]?.[segment as string] || null
  }

  const affinityData = getAffinityData()

  // Get similar high-performing products
  const getSimilarProducts = () => {
    const similarProducts = [
      { name: 'iPhone 15 Pro Max', similarity: 94, conversion: 26.8, revenue: 523000 },
      { name: 'MacBook Pro M3', similarity: 89, conversion: 31.2, revenue: 654000 },
      { name: 'iPhone 14 Pro', similarity: 91, conversion: 24.1, revenue: 399000 }
    ]
    return similarProducts
  }

  // Get underperforming products that could benefit
  const getUnderperformingProducts = () => {
    const underperforming = [
      { name: 'AirPods Max', similarity: 79, conversion: 18.7, revenue: 187000 },
      { name: 'Apple Watch SE', similarity: 76, conversion: 16.2, revenue: 146000 },
      { name: 'iPad Air', similarity: 73, conversion: 15.8, revenue: 123000 }
    ]
    return underperforming
  }

  // Generate AI campaign calendar based on successful trends
  const generateAICampaignCalendar = () => {
    if (!initialProduct) return []

    // Base schedule on what works across segments for this product
    const schedules = [
      {
        type: 'Email',
        title: `${initialProduct} - Product Spotlight`,
        description: 'Launch announcement to all segments',
        segments: ['High Converters', 'Loyal Customers'],
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        priority: 'high',
        color: 'purple'
      },
      {
        type: 'Push',
        title: `Flash Sale: ${initialProduct}`,
        description: 'Limited time offer to drive urgency',
        segments: ['Window Shoppers', 'Cart Abandoners'],
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '6:00 PM',
        priority: 'high',
        color: 'red'
      },
      {
        type: 'Email',
        title: `Bundle Deal: ${initialProduct} + Accessories`,
        description: 'Cross-sell complementary products',
        segments: ['High Converters', 'Loyal Customers'],
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '2:00 PM',
        priority: 'medium',
        color: 'blue'
      },
      {
        type: 'SMS',
        title: `Last Chance: ${initialProduct}`,
        description: 'Final push to remaining segments',
        segments: ['All Segments'],
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '8:00 PM',
        priority: 'high',
        color: 'orange'
      }
    ]

    return schedules
  }

  const handleCreateUnderperformingCampaign = (productName: string) => {
    // Route to create campaign for underperforming product
    router.push(`/campaign/create?segment=${segment}&product=${encodeURIComponent(productName)}&type=clearance`)
  }

  const [brands] = useState([
    {
      id: "apple",
      name: "Apple",
      description: "Premium consumer electronics",
      logo: "🍎",
      enabled: true,
      color: "from-gray-500 to-gray-700"
    },
    {
      id: "samsung",
      name: "Samsung",
      description: "Mobile and electronics leader",
      logo: "📱",
      enabled: true,
      color: "from-blue-500 to-blue-700"
    },
    {
      id: "huawei",
      name: "Huawei",
      description: "Telecommunications and consumer electronics",
      logo: "📡",
      enabled: true,
      color: "from-red-500 to-red-700"
    },
    {
      id: "yamaha",
      name: "Yamaha",
      description: "Audio and musical instruments",
      logo: "🎵",
      enabled: true,
      color: "from-purple-500 to-purple-700"
    }
  ])

  const [allProducts] = useState<Product[]>([
    // Apple Products
    {
      id: "1",
      name: "iPhone 15 Pro",
      category: "Smartphones",
      brand: "apple",
      price: 999,
      similarity: 0.95,
      performance: { conversion_rate: 28.4, revenue: 487650, sales: 342, trend: 'up' },
      description: "Latest flagship iPhone with titanium design and Action Button"
    },
    {
      id: "2",
      name: "iPhone 15 Pro Max",
      category: "Smartphones",
      brand: "apple",
      price: 1199,
      similarity: 0.94,
      performance: { conversion_rate: 26.8, revenue: 523420, sales: 287, trend: 'up' },
      description: "Largest iPhone with advanced camera system and all-day battery"
    },
    {
      id: "3",
      name: "MacBook Pro M3",
      category: "Laptops",
      brand: "apple",
      price: 1999,
      similarity: 0.87,
      performance: { conversion_rate: 31.2, revenue: 654320, sales: 198, trend: 'up' },
      description: "Professional laptop with M3 chip for ultimate performance"
    },
    {
      id: "4",
      name: "iPad Pro 12.9\"",
      category: "Tablets",
      brand: "apple",
      price: 1099,
      similarity: 0.83,
      performance: { conversion_rate: 24.1, revenue: 398750, sales: 156, trend: 'stable' },
      description: "Professional tablet with M2 chip and Liquid Retina XDR display"
    },
    {
      id: "5",
      name: "AirPods Max",
      category: "Audio",
      brand: "apple",
      price: 549,
      similarity: 0.79,
      performance: { conversion_rate: 18.7, revenue: 187340, sales: 234, trend: 'down' },
      description: "Premium over-ear headphones with spatial audio"
    },
    {
      id: "6",
      name: "Apple Watch Ultra",
      category: "Wearables",
      brand: "apple",
      price: 799,
      similarity: 0.76,
      performance: { conversion_rate: 22.3, revenue: 298420, sales: 201, trend: 'up' },
      description: "Rugged smartwatch designed for extreme conditions"
    },
    // Samsung Products
    {
      id: "7",
      name: "Galaxy S24 Ultra",
      category: "Smartphones",
      brand: "samsung",
      price: 1199,
      similarity: 0.88,
      performance: { conversion_rate: 23.1, revenue: 298420, sales: 256, trend: 'up' },
      description: "Premium Android flagship with S Pen"
    },
    {
      id: "8",
      name: "Galaxy Book Pro",
      category: "Laptops",
      brand: "samsung",
      price: 1399,
      similarity: 0.75,
      performance: { conversion_rate: 19.4, revenue: 245680, sales: 134, trend: 'stable' },
      description: "Lightweight business laptop"
    },
    {
      id: "13",
      name: "Galaxy Buds Pro",
      category: "Audio",
      brand: "samsung",
      price: 199,
      similarity: 0.79,
      performance: { conversion_rate: 17.8, revenue: 178920, sales: 567, trend: 'up' },
      description: "Premium wireless earbuds with ANC"
    },
    // Huawei Products
    {
      id: "9",
      name: "P60 Pro",
      category: "Smartphones",
      brand: "huawei",
      price: 899,
      similarity: 0.82,
      performance: { conversion_rate: 21.3, revenue: 234560, sales: 189, trend: 'stable' },
      description: "Advanced camera smartphone"
    },
    {
      id: "10",
      name: "MateBook X Pro",
      category: "Laptops",
      brand: "huawei",
      price: 1599,
      similarity: 0.78,
      performance: { conversion_rate: 18.7, revenue: 198740, sales: 98, trend: 'down' },
      description: "Premium ultrabook with touch display"
    },
    {
      id: "14",
      name: "Watch GT 4",
      category: "Wearables",
      brand: "huawei",
      price: 299,
      similarity: 0.74,
      performance: { conversion_rate: 16.2, revenue: 145670, sales: 287, trend: 'stable' },
      description: "Advanced fitness and health smartwatch"
    },
    // Yamaha Products
    {
      id: "11",
      name: "YH-E700A Headphones",
      category: "Audio",
      brand: "yamaha",
      price: 399,
      similarity: 0.71,
      performance: { conversion_rate: 15.6, revenue: 123450, sales: 156, trend: 'up' },
      description: "High-quality wireless headphones"
    },
    {
      id: "12",
      name: "P-45 Digital Piano",
      category: "Musical Instruments",
      brand: "yamaha",
      price: 499,
      similarity: 0.65,
      performance: { conversion_rate: 12.8, revenue: 98760, sales: 78, trend: 'stable' },
      description: "88-key weighted action digital piano"
    },
    {
      id: "15",
      name: "AG03MK2 Audio Interface",
      category: "Audio Equipment",
      brand: "yamaha",
      price: 149,
      similarity: 0.58,
      performance: { conversion_rate: 14.2, revenue: 67890, sales: 234, trend: 'up' },
      description: "Compact mixer and USB audio interface"
    }
  ])

  const products = allProducts.filter(product => selectedBrands.includes(product.brand))

  const [campaignTones] = useState<CampaignTone[]>([
    {
      id: "premium",
      name: "Premium & Exclusive",
      description: "Sophisticated tone emphasizing luxury and exclusivity",
      example: "Experience the pinnacle of innovation with our carefully curated selection...",
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: "friendly",
      name: "Friendly & Personal",
      description: "Warm, conversational tone that feels like a recommendation from a friend",
      example: "Hey! We thought you'd love these amazing products we've picked just for you...",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "urgent",
      name: "Urgent & Limited",
      description: "Creates urgency with limited-time offers and scarcity",
      example: "⏰ Only 24 hours left! Don't miss out on these exclusive deals...",
      color: "from-red-500 to-orange-600"
    },
    {
      id: "educational",
      name: "Educational & Informative",
      description: "Focus on product features, benefits, and comparisons",
      example: "Let us show you why these products are perfect for your needs...",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "celebration",
      name: "Celebration & Reward",
      description: "Celebrates the customer and positions products as rewards",
      example: "You deserve the best! Treat yourself to these incredible products...",
      color: "from-yellow-500 to-amber-600"
    }
  ])

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    if (similarity >= 0.8) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
    if (similarity >= 0.7) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
      case 'stable': return <div className="h-3 w-3 bg-gray-400 rounded-full" />
    }
  }

  const getSelectedProductsInfo = () => {
    return selectedProducts.map(id => products.find(p => p.id === id)).filter(Boolean)
  }

  const handleCreateCampaign = () => {
    const selectedProductsInfo = getSelectedProductsInfo()

    // Create campaign object
    const newCampaign = {
      id: `camp_${Date.now()}`,
      name: `${selectedProductsInfo.map(p => p?.name).join(' + ')} Campaign`,
      brand: selectedBrands.map(brandId => brands.find(b => b.id === brandId)?.name).join(' + '),
      products: selectedProductsInfo.map(p => p?.name || ''),
      tone: campaignTones.find(t => t.id === selectedTone)?.name || selectedTone,
      segment: segment || 'All Customers',
      status: 'draft' as const,
      scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      created_at: new Date().toISOString(),
      description: `${campaignGoal || `Promote ${selectedProductsInfo.map(p => p?.name).join(' and ')} with special offers`}`,
    }

    // Save campaign to localStorage
    try {
      const existingCampaigns = JSON.parse(localStorage.getItem('segmind_campaigns') || '[]')
      existingCampaigns.push(newCampaign)
      localStorage.setItem('segmind_campaigns', JSON.stringify(existingCampaigns))
    } catch (error) {
      console.error('Error saving campaign:', error)
    }

    console.log('Creating campaign:', newCampaign)

    // Redirect to campaigns page to show the new campaign
    router.push('/campaigns')
  }

  // Auto-select initial product and brand if provided
  useEffect(() => {
    if (initialProduct && typeof initialProduct === 'string') {
      // Auto-select brand based on product
      const productName = initialProduct.toLowerCase()
      if (productName.includes('iphone') || productName.includes('macbook') || productName.includes('ipad') || productName.includes('airpods')) {
        setSelectedBrands(['apple'])
      } else if (productName.includes('samsung') || productName.includes('galaxy')) {
        setSelectedBrands(['samsung'])
      }

      const matchingProduct = allProducts.find(p =>
        p.name.toLowerCase().includes(initialProduct.toLowerCase())
      )
      if (matchingProduct && !selectedProducts.includes(matchingProduct.id)) {
        setSelectedProducts([matchingProduct.id])
      }

      // Skip to tone selection when coming from insights
      if (segment && initialProduct) {
        setStep('tone')
      }
    }
  }, [initialProduct, segment])

  return (
    <>
      <Head>
        <title>Create Campaign - Segmind</title>
        <meta name="description" content="Create targeted email campaigns with similar products" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Campaign</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {segment && `Targeting: ${segment}`} • Select products and set campaign tone
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Product-Audience Affinity Section */}
        {affinityData && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      {initialProduct} → {segment}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Why this combination works</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{affinityData.affinity}%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Affinity Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{affinityData.conversion}%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Conversion</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">${(affinityData.revenue / 1000).toFixed(0)}K</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  </div>
                </div>

                {/* Interactive Campaign Builder */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 flex items-center mb-3">
                    🚀 Quick Campaign Builder
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Email Campaign */}
                    <div
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group"
                      onClick={() => setStep('tone')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Email Campaign</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Create email series for {initialProduct}</p>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        • Subject line suggestions
                        • Multi-segment targeting
                        • Scheduled delivery
                      </div>
                    </div>

                    {/* Push Campaign */}
                    <div
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border cursor-pointer hover:border-orange-300 hover:shadow-md transition-all group"
                      onClick={() => setStep('tone')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Push Campaign</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Urgent notifications for {initialProduct}</p>
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        • Flash sale alerts
                        • Limited time offers
                        • High conversion focus
                      </div>
                    </div>

                    {/* Multi-Channel */}
                    <div
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
                      onClick={() => setStep('tone')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Multi-Channel</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Email + Push + SMS sequence</p>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        • 7-day campaign calendar
                        • All segments covered
                        • Maximum reach
                      </div>
                    </div>
                  </div>
                </div>

                {/* Similar Products & Underperformers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* High Performers */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">High Performers (Similar Products)</h3>
                    <div className="space-y-2">
                      {getSimilarProducts().map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">{product.similarity}% similar</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.conversion}%</p>
                            <p className="text-xs text-green-600">${(product.revenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Under Performers */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Under Performers (Could Benefit)</h3>
                    <div className="space-y-2">
                      {getUnderperformingProducts().map((product, index) => (
                        <div
                          key={index}
                          onClick={() => handleCreateUnderperformingCampaign(product.name)}
                          className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">{product.similarity}% similar • Click to create clearance campaign</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.conversion}%</p>
                            <p className="text-xs text-orange-600">${(product.revenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Campaign Calendar */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        🤖 Multi-Segment Campaign Calendar
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sell {initialProduct} across all segments using proven trends</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generateAICampaignCalendar().map((schedule, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                              schedule.color === 'purple' ? 'bg-purple-600' :
                              schedule.color === 'red' ? 'bg-red-600' :
                              schedule.color === 'blue' ? 'bg-blue-600' :
                              schedule.color === 'orange' ? 'bg-orange-600' : 'bg-gray-600'
                            }`}>
                              {schedule.type.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">{schedule.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{schedule.type}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            schedule.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            schedule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {schedule.priority}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{schedule.description}</p>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Target Segments:</p>
                          <div className="flex flex-wrap gap-1">
                            {schedule.segments.map((seg, segIndex) => (
                              <span key={segIndex} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
                                {seg}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{schedule.date.toLocaleDateString()}</span>
                          <span>{schedule.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      💡 <strong>Strategy:</strong> Start with high-value segments (Day 1), create urgency for deal-seekers (Day 3), then cross-sell accessories (Day 5), finish with broad push to everyone (Day 7). This maximizes revenue across all customer types.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps - Hide when coming from insights */}
        {!affinityData && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center space-x-6">
              <div className={`flex items-center space-x-2 ${step === 'brand' ? 'text-purple-600' : selectedBrands.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'brand' ? 'bg-purple-600 text-white' :
                  selectedBrands.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {selectedBrands.length > 0 && step !== 'brand' ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span className="font-medium">Select Brands</span>
              </div>

              <div className={`h-0.5 w-12 ${selectedBrands.length > 0 ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />

              <div className={`flex items-center space-x-2 ${step === 'products' ? 'text-purple-600' : selectedProducts.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'products' ? 'bg-purple-600 text-white' :
                  selectedProducts.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {selectedProducts.length > 0 && step !== 'products' ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span className="font-medium">Select Products</span>
              </div>

              <div className={`h-0.5 w-12 ${selectedProducts.length > 0 ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />

              <div className={`flex items-center space-x-2 ${step === 'tone' ? 'text-purple-600' : selectedTone ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'tone' ? 'bg-purple-600 text-white' :
                  selectedTone ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {selectedTone && step !== 'tone' ? <Check className="h-4 w-4" /> : '3'}
                </div>
                <span className="font-medium">Choose Tone</span>
              </div>

              <div className={`h-0.5 w-12 ${selectedTone ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />

              <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'review' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  4
                </div>
                <span className="font-medium">Review & Create</span>
              </div>
            </div>
          </div>
        )}

        {/* Simplified Steps for Insight-based campaigns */}
        {affinityData && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center space-x-6">
              <div className={`flex items-center space-x-2 ${step === 'tone' ? 'text-purple-600' : selectedTone ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'tone' ? 'bg-purple-600 text-white' :
                  selectedTone ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {selectedTone && step !== 'tone' ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span className="font-medium">Choose Tone</span>
              </div>

              <div className={`h-0.5 w-12 ${selectedTone ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />

              <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'review' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  2
                </div>
                <span className="font-medium">Review & Create</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {step === 'brand' && !affinityData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Target className="h-6 w-6 mr-2 text-purple-600" />
                    Select Brands
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Choose which brands to include in your campaign • Multiple selections allowed
                  </p>
                </div>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setStep('products')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Continue with {selectedBrands.length} brand{selectedBrands.length !== 1 ? 's' : ''}</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => {
                      if (brand.enabled) {
                        setSelectedBrands(prev =>
                          prev.includes(brand.id)
                            ? prev.filter(id => id !== brand.id)
                            : [...prev, brand.id]
                        )
                      }
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      !brand.enabled
                        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                        : selectedBrands.includes(brand.id)
                          ? 'border-purple-200 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20 cursor-pointer hover:shadow-lg'
                          : 'border-gray-100 hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-600 cursor-pointer hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${brand.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                          {brand.logo}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{brand.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{brand.description}</p>
                          {!brand.enabled && (
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>

                      {brand.enabled && (
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedBrands.includes(brand.id)
                            ? 'border-purple-600 bg-purple-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedBrands.includes(brand.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {brand.enabled && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {brand.id === 'apple' && 'Premium consumer electronics with focus on innovation and design'}
                          {brand.id === 'samsung' && 'Mobile technology leader with diverse product portfolio'}
                          {brand.id === 'huawei' && 'Telecommunications and consumer electronics innovator'}
                          {brand.id === 'yamaha' && 'Audio equipment and musical instruments specialist'}
                        </p>
                      </div>
                    )}

                    {!brand.enabled && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Campaign creation for {brand.name} will be available soon. Currently only Apple campaigns are supported.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedBrands.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Select brands to get started</p>
                  <p className="text-sm">Choose one or more brands for your multi-brand campaign</p>
                </div>
              )}
            </div>
          )}

          {step === 'products' && !affinityData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Target className="h-6 w-6 mr-2 text-purple-600" />
                    Select Products to Promote
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    from vector similarity • Choose products that align with your campaign goals
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setStep('brand')}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Back to Brands
                  </button>
                )}
                {selectedProducts.length > 0 && (
                  <button
                    onClick={() => setStep('tone')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Continue with {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                )}
              </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedProducts.includes(product.id)
                        ? 'border-purple-200 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                        : 'border-gray-100 hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{product.category} • ${product.price.toLocaleString()}</p>
                          {product.similarity && (
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSimilarityColor(product.similarity)}`}>
                              {(product.similarity * 100).toFixed(0)}% similar
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedProducts.includes(product.id)
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedProducts.includes(product.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <p className="font-bold text-gray-900 dark:text-white">{product.performance.conversion_rate}%</p>
                          {getTrendIcon(product.performance.trend)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Conversion</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-bold text-green-600">${product.performance.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-bold text-blue-600">{product.performance.sales}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Select products to promote in your campaign</p>
                  <p className="text-sm">Choose products that align with your {segment} segment</p>
                </div>
              )}
            </div>
          )}

          {step === 'tone' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Wand2 className="h-6 w-6 mr-2 text-purple-600" />
                    Choose Campaign Tone
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Select the tone that best fits your {segment} audience
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setStep('products')}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Back to Products
                  </button>
                  {selectedTone && (
                    <button
                      onClick={() => setStep('review')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>Review Campaign</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaignTones.map((tone) => (
                  <div
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTone === tone.id
                        ? 'border-purple-200 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                        : 'border-gray-100 hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tone.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                          {tone.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tone.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tone.description}</p>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedTone === tone.id
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedTone === tone.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{tone.example}"</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Campaign Goal (Optional)</h4>
                <textarea
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  placeholder="Describe what you want to achieve with this campaign (e.g., increase sales, clear inventory, promote new features)..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Mail className="h-6 w-6 mr-2 text-purple-600" />
                    Review & Create Campaign
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Review your campaign details before creating
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setStep('tone')}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Back to Tone
                  </button>
                  <button
                    onClick={handleCreateCampaign}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Create Campaign</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Selected Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selected Products</h3>
                  <div className="space-y-3">
                    {getSelectedProductsInfo().map((product) => (
                      <div key={product?.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {product?.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{product?.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">${product?.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Brands</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedBrands.map(brandId => brands.find(b => b.id === brandId)?.name).join(', ')}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Target Segment</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{segment}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campaign Tone</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaignTones.find(t => t.id === selectedTone)?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {campaignTones.find(t => t.id === selectedTone)?.description}
                      </p>
                    </div>

                    {campaignGoal && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campaign Goal</p>
                        <p className="text-gray-900 dark:text-white mt-1">{campaignGoal}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{campaignTones.find(t => t.id === selectedTone)?.example}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}