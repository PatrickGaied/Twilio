import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, TrendingUp, Target, Wand2, Menu, X, Smartphone, Laptop, Headphones, Gamepad2, Tv, ShoppingCart } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import CampaignModal from '../components/CampaignModal'
import DataAnalysisPrompt from '../components/DataAnalysisPrompt'

interface SegmentData {
  name: string
  count: number
  percentage: number
}

interface TopProduct {
  product_id: string
  name: string
  category: string
  brand: string
  total_sales: number
  revenue: number
  avg_price: number
  top_segment: string
  segment_distribution: Record<string, number>
}

export default function BreakdownPage() {
  const [segmentData, setSegmentData] = useState<SegmentData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [campaignModal, setCampaignModal] = useState<{
    isOpen: boolean
    segmentName?: string
    productName?: string
  }>({ isOpen: false })

  const handleDataAnalysis = (prompt: string) => {
    // For now, just open campaign modal with the prompt context
    // In a real app, this would send to an AI analysis service
    console.log('Analyzing:', prompt)

    // Extract intent and open appropriate modal
    if (prompt.toLowerCase().includes('campaign') || prompt.toLowerCase().includes('ad')) {
      setCampaignModal({ isOpen: true })
    }
  }

  useEffect(() => {
    fetchBreakdownData()
  }, [])

  const fetchBreakdownData = async () => {
    try {
      // Fetch segment data
      const segmentRes = await fetch('/api/segments/stats/overview')
      const segmentOverview = await segmentRes.json()
      setSegmentData(segmentOverview.segments || [])

      // Fetch products data
      const productsRes = await fetch('/api/analytics/products/top')
      const productsData = await productsRes.json()
      setTopProducts(productsData.top_products || [])

    } catch (error) {
      console.error('Error fetching breakdown data:', error)
      setMockData()
    }
  }

  const setMockData = () => {
    setSegmentData([
      { name: 'High Converters', count: 2847, percentage: 6.5 },
      { name: 'Window Shoppers', count: 15623, percentage: 35.4 },
      { name: 'Cart Abandoners', count: 8941, percentage: 20.3 },
      { name: 'Loyal Customers', count: 4256, percentage: 9.7 },
      { name: 'At Risk', count: 12387, percentage: 28.1 }
    ])

    setTopProducts([
      {
        product_id: "prod_1001",
        name: "iPhone 15 Pro",
        category: "electronics.smartphone",
        brand: "apple",
        total_sales: 2847,
        revenue: 2567340.00,
        avg_price: 1199.99,
        top_segment: "High Converters",
        segment_distribution: {
          "high_converters": 45.2,
          "loyal_customers": 32.1,
          "window_shoppers": 15.7,
          "cart_abandoners": 5.8,
          "at_risk": 1.2
        }
      },
      {
        product_id: "prod_1002",
        name: "Samsung Galaxy S24",
        category: "electronics.smartphone",
        brand: "samsung",
        total_sales: 1923,
        revenue: 1634550.00,
        avg_price: 999.99,
        top_segment: "Loyal Customers",
        segment_distribution: {
          "loyal_customers": 38.4,
          "high_converters": 28.9,
          "window_shoppers": 18.2,
          "cart_abandoners": 12.1,
          "at_risk": 2.4
        }
      },
      {
        product_id: "prod_1003",
        name: "MacBook Air M3",
        category: "electronics.laptop",
        brand: "apple",
        total_sales: 1456,
        revenue: 1891244.00,
        avg_price: 1299.99,
        top_segment: "High Converters",
        segment_distribution: {
          "high_converters": 52.1,
          "loyal_customers": 28.3,
          "window_shoppers": 12.4,
          "cart_abandoners": 5.2,
          "at_risk": 2.0
        }
      }
    ])
  }

  const getCategoryIcon = (category: string) => {
    if (category.includes('smartphone')) return <Smartphone className="h-5 w-5" />
    if (category.includes('laptop')) return <Laptop className="h-5 w-5" />
    if (category.includes('headphone')) return <Headphones className="h-5 w-5" />
    if (category.includes('gaming')) return <Gamepad2 className="h-5 w-5" />
    if (category.includes('tv')) return <Tv className="h-5 w-5" />
    return <ShoppingCart className="h-5 w-5" />
  }

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

  return (
    <>
      <Head>
        <title>Breakdown - Segmind</title>
        <meta name="description" content="Customer segments and product breakdown for campaign targeting" />
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
                  <a href="/breakdown" className="nav-item active dark:text-purple-400 dark:bg-purple-900/20">
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
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="lg:hidden pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                <nav className="space-y-2">
                  <a href="/" className="block nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/breakdown" className="block nav-item active dark:text-purple-400 dark:bg-purple-900/20">
                    <Target className="h-4 w-4" />
                    <span>Breakdown</span>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Campaign Targeting</h2>
            <p className="text-gray-600 dark:text-gray-400">Ask questions about your data or click on segments/products to create campaigns</p>
          </div>

          {/* Data Analysis Prompt */}
          <div className="mb-8">
            <DataAnalysisPrompt onSubmit={handleDataAnalysis} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Segments */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Segments
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">Click to target</div>
              </div>

              <div className="space-y-4">
                {segmentData.map((segment, index) => (
                  <div
                    key={segment.name}
                    onClick={() => setCampaignModal({ isOpen: true, segmentName: segment.name })}
                    className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {segment.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{segment.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{segment.count.toLocaleString()} customers</p>
                          <div className="progress-bar w-32 mt-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${segment.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{segment.percentage}%</p>
                        <div className="flex items-center space-x-2">
                          <div className="segment-pill" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}>
                            Active
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Wand2 className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Top Products
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">Click to target</div>
              </div>

              <div className="space-y-4">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.product_id}
                    onClick={() => setCampaignModal({ isOpen: true, productName: product.name, segmentName: product.top_segment })}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {index + 1}
                      </div>
                      {getCategoryIcon(product.category)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand} • {product.total_sales.toLocaleString()} sales</p>
                        <p className="text-sm font-medium text-green-600">${product.revenue.toLocaleString()} revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{product.top_segment}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">${product.avg_price}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Wand2 className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{segmentData.reduce((sum, s) => sum + s.count, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Customers</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{topProducts.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Top Products</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">${topProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
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
      </div>
    </>
  )
}