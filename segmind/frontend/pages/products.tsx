import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Smartphone, Laptop, Headphones, Gamepad2, Tv, TrendingUp, ShoppingCart, Target, Wand2, Users, Menu, X } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import CampaignModal from '../components/CampaignModal'

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

interface CategoryPerformance {
  category: string
  total_sales: number
  revenue: number
  avg_conversion_rate: number
  top_segment: string
  messaging_opportunity: string
}

export default function ProductsPage() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [electronicsInsights, setElectronicsInsights] = useState<any>({})
  const [segmentPreferences, setSegmentPreferences] = useState<any>({})
  const [campaignModal, setCampaignModal] = useState<{
    isOpen: boolean
    segmentName?: string
    productName?: string
  }>({ isOpen: false })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchProductsData()
  }, [])

  const fetchProductsData = async () => {
    try {
      // Fetch top products
      const productsRes = await fetch('/api/analytics/products/top')
      const productsData = await productsRes.json()
      setTopProducts(productsData.top_products || [])
      setCategoryPerformance(productsData.category_performance || [])
      setElectronicsInsights(productsData.electronics_insights || {})

      // Fetch segment preferences
      const segmentsRes = await fetch('/api/analytics/products/segments')
      const segmentsData = await segmentsRes.json()
      setSegmentPreferences(segmentsData.segment_preferences || {})

    } catch (error) {
      console.error('Error fetching products data:', error)
      // Set mock data on error
      setMockData()
    }
  }

  const setMockData = () => {
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
      }
    ])

    setCategoryPerformance([
      {
        category: "electronics.smartphone",
        total_sales: 4770,
        revenue: 4201890.00,
        avg_conversion_rate: 8.4,
        top_segment: "High Converters",
        messaging_opportunity: "Premium smartphone campaigns for high-value customers"
      }
    ])

    setElectronicsInsights({
      total_electronics_revenue: 8610790.00,
      electronics_percentage_of_total: 68.4,
      avg_electronics_order_value: 789.50,
      top_electronics_segment: "High Converters",
      cart_abandonment_rate_electronics: 23.7
    })
  }

  const getCategoryIcon = (category: string) => {
    if (category.includes('smartphone')) return <Smartphone className="h-5 w-5" />
    if (category.includes('laptop')) return <Laptop className="h-5 w-5" />
    if (category.includes('headphone')) return <Headphones className="h-5 w-5" />
    if (category.includes('gaming')) return <Gamepad2 className="h-5 w-5" />
    if (category.includes('tv')) return <Tv className="h-5 w-5" />
    return <ShoppingCart className="h-5 w-5" />
  }

  const SEGMENT_COLORS = {
    'high_converters': '#ef4444',
    'loyal_customers': '#10b981',
    'window_shoppers': '#f59e0b',
    'cart_abandoners': '#8b5cf6',
    'at_risk': '#6b7280'
  }

  const getSegmentColor = (segment: string) => {
    return SEGMENT_COLORS[segment as keyof typeof SEGMENT_COLORS] || '#3b82f6'
  }

  return (
    <>
      <Head>
        <title>Products Analytics - Segmind</title>
        <meta name="description" content="Product performance and segment analysis" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Segmind</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Customer Messaging & Analytics Platform</p>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <nav className="flex items-center space-x-1">
                  <a href="/" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/segments" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Users className="h-4 w-4" />
                    <span>Segments</span>
                  </a>
                  <a href="/products" className="nav-item active dark:text-purple-400 dark:bg-purple-900/20">
                    <Target className="h-4 w-4" />
                    <span>Products</span>
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
                  <a href="/segments" className="block nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Users className="h-4 w-4" />
                    <span>Segments</span>
                  </a>
                  <a href="/products" className="block nav-item active dark:text-purple-400 dark:bg-purple-900/20">
                    <Target className="h-4 w-4" />
                    <span>Products</span>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Electronics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Electronics Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${electronicsInsights.total_electronics_revenue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {electronicsInsights.electronics_percentage_of_total || 0}% of total
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${electronicsInsights.avg_electronics_order_value?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-gray-500">Electronics only</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Segment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {electronicsInsights.top_electronics_segment || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">For electronics</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cart Abandonment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {electronicsInsights.cart_abandonment_rate_electronics || 0}%
                  </p>
                  <p className="text-sm text-gray-500">Electronics category</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Products */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
              <div className="space-y-4">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.product_id}
                    onClick={() => setCampaignModal({ isOpen: true, productName: product.name, segmentName: product.top_segment })}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      {getCategoryIcon(product.category)}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.brand} • {product.total_sales.toLocaleString()} sales</p>
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

            {/* Category Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tickFormatter={(value) => value.split('.').pop()}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name === 'avg_conversion_rate' ? `${value}%` : value.toLocaleString(),
                        name === 'avg_conversion_rate' ? 'Conversion Rate' : 'Revenue'
                      ]}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Bar dataKey="revenue" fill="#2563eb" name="Revenue ($)" />
                    <Bar dataKey="avg_conversion_rate" fill="#10b981" name="Conversion Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Product Segment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {topProducts.slice(0, 3).map((product) => (
              <div key={product.product_id} className="card">
                <h4 className="text-md font-semibold text-gray-900 mb-3">{product.name}</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Sales by Segment</p>
                  <div className="space-y-2">
                    {Object.entries(product.segment_distribution).map(([segment, percentage]) => (
                      <div key={segment} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getSegmentColor(segment) }}
                          ></div>
                          <span className="text-sm text-gray-700 capitalize">
                            {segment.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Top Segment: <span className="font-medium text-gray-900">{product.top_segment}</span></p>
                  <p className="text-sm text-gray-600">Avg Price: <span className="font-medium text-green-600">${product.avg_price}</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Category Messaging Opportunities */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Messaging Opportunities by Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPerformance.map((category) => (
                <div key={category.category} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(category.category)}
                    <h4 className="font-medium text-gray-900 capitalize">
                      {category.category.split('.').pop()?.replace('_', ' ')}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{category.total_sales.toLocaleString()}</span> sales
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Top segment: <span className="font-medium text-blue-700">{category.top_segment}</span>
                  </p>
                  <p className="text-xs text-gray-700 italic">
                    {category.messaging_opportunity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Campaigns */}
          {electronicsInsights.recommended_campaigns && (
            <div className="card mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Campaigns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {electronicsInsights.recommended_campaigns.map((campaign: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700">{index + 1}</span>
                    </div>
                    <p className="text-sm text-green-800">{campaign}</p>
                  </div>
                ))}
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
      </div>
    </>
  )
}