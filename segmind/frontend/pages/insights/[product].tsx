import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, TrendingUp, Users, Target, Calendar, Mail, Plus, ExternalLink } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'
import CampaignCalendarModal from '../../components/CampaignCalendarModal'

interface SimilarProduct {
  id: string
  name: string
  similarity: number
  category: string
  price: number
  performance: {
    conversion_rate: number
    revenue: number
    sales: number
  }
}

interface ProductInsight {
  product: string
  segment: string
  affinity: number
  conversion_rate: number
  revenue: number
  sales: number
  insight: string
  recommendation: string
}

export default function ProductInsightsPage() {
  const router = useRouter()
  const { product } = router.query
  const [insight, setInsight] = useState<ProductInsight | null>(null)
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [campaignModal, setCampaignModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (product) {
      fetchProductInsights()
    }
  }, [product])

  const fetchProductInsights = async () => {
    setIsLoading(true)
    // Mock data - in real app would fetch from API
    setTimeout(() => {
      setInsight({
        product: product as string,
        segment: "High Converters",
        affinity: 92,
        conversion_rate: 28.4,
        revenue: 487650,
        sales: 342,
        insight: "High Converters show exceptional affinity for premium Apple products",
        recommendation: "Create premium positioning campaigns emphasizing exclusivity and advanced features"
      })

      setSimilarProducts([
        {
          id: "1",
          name: "iPhone 15 Pro Max",
          similarity: 0.94,
          category: "Smartphones",
          price: 1199,
          performance: { conversion_rate: 26.8, revenue: 523420, sales: 287 }
        },
        {
          id: "2",
          name: "MacBook Pro M3",
          similarity: 0.87,
          category: "Laptops",
          price: 1999,
          performance: { conversion_rate: 31.2, revenue: 654320, sales: 198 }
        },
        {
          id: "3",
          name: "iPad Pro 12.9\"",
          similarity: 0.83,
          category: "Tablets",
          price: 1099,
          performance: { conversion_rate: 24.1, revenue: 398750, sales: 156 }
        },
        {
          id: "4",
          name: "AirPods Max",
          similarity: 0.79,
          category: "Audio",
          price: 549,
          performance: { conversion_rate: 18.7, revenue: 187340, sales: 234 }
        },
        {
          id: "5",
          name: "Apple Watch Ultra",
          similarity: 0.76,
          category: "Wearables",
          price: 799,
          performance: { conversion_rate: 22.3, revenue: 298420, sales: 201 }
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600 bg-green-100 dark:bg-green-900'
    if (similarity >= 0.8) return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
    if (similarity >= 0.7) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900'
  }

  const handleCreateCampaign = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one similar product to include in the campaign')
      return
    }
    setCampaignModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{product} Insights - Segmind</title>
        <meta name="description" content={`Product insights and similar products for ${product}`} />
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
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product} Insights</h1>
                  <p className="text-gray-600 dark:text-gray-400">Similar products and campaign opportunities</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Insight Summary */}
          {insight && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {insight.product.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{insight.product}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">→ {insight.segment}</p>
                  </div>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900">
                  {insight.affinity}% Affinity
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{insight.conversion_rate}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">${insight.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{insight.sales}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sales</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-medium">💡 Insight:</span> {insight.insight}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  <span className="font-medium">📋 Recommendation:</span> {insight.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Similar Products Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-6 w-6 mr-2 text-purple-600" />
                  Similar Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  from vector similarity • Select products to include in campaign
                </p>
              </div>
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleCreateCampaign}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Create Email Campaign ({selectedProducts.length})</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {similarProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProducts.includes(product.id)
                      ? 'border-purple-200 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                      : 'border-gray-100 hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                  onClick={() => toggleProductSelection(product.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.category} • ${product.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColor(product.similarity)}`}>
                        {(product.similarity * 100).toFixed(0)}% similar
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{product.performance.conversion_rate}%</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Conversion</p>
                        </div>
                        <div>
                          <p className="font-semibold text-green-600">${product.performance.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-600">{product.performance.sales}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedProducts.includes(product.id)
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedProducts.includes(product.id) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select similar products to include in your email campaign</p>
              </div>
            )}
          </div>
        </main>

        {/* Campaign Calendar Modal */}
        <CampaignCalendarModal
          isOpen={campaignModal}
          onClose={() => setCampaignModal(false)}
          selectedProducts={selectedProducts.map(id => similarProducts.find(p => p.id === id)?.name || '').filter(Boolean)}
          segmentName={insight?.segment}
          initialCampaign={`${insight?.product} + Similar Products Campaign`}
        />
      </div>
    </>
  )
}