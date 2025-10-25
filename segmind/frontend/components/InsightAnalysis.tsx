import { useState } from 'react'
import { X, TrendingUp, Eye, Users, ShoppingCart, ChevronRight, Lightbulb, Camera, MessageSquare } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface ProductInsight {
  product: string
  segment: string
  affinity_score: number
  conversion_rate: number
  revenue: number
  sales_count: number
  insight: string
  recommendation: string
}

interface SimilarProduct {
  name: string
  brand: string
  similarity_score: number
  price: number
  category: string
  performance: {
    conversion_rate: number
    revenue: number
    sales: number
  }
}

interface OCRPattern {
  id: string
  description: string
  image_context: string
  effectiveness_score: number
  usage_count: number
  example: string
  demographics: string[]
}

interface InsightAnalysisProps {
  insight: ProductInsight
  isOpen: boolean
  onClose: () => void
  onCreateCampaign: (product: string, segment: string, similarProducts?: string[]) => void
}

export default function InsightAnalysis({ insight, isOpen, onClose, onCreateCampaign }: InsightAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'similar' | 'ocr'>('analysis')
  const [selectedSimilarProducts, setSelectedSimilarProducts] = useState<string[]>([])

  if (!isOpen) return null

  // Mock data for analysis
  const performanceData = [
    { month: 'Jan', conversion: 24.2, revenue: 345000, competitors: 18.5 },
    { month: 'Feb', conversion: 26.1, revenue: 412000, competitors: 19.2 },
    { month: 'Mar', conversion: 28.4, revenue: 487650, competitors: 20.1 },
    { month: 'Apr', conversion: 27.8, revenue: 465000, competitors: 19.8 },
    { month: 'May', conversion: 29.2, revenue: 523000, competitors: 21.3 },
    { month: 'Jun', conversion: 31.1, revenue: 578000, competitors: 22.1 }
  ]

  const segmentBreakdown = [
    { name: 'High Converters', value: 34, color: '#10B981' },
    { name: 'Creative Professionals', value: 28, color: '#8B5CF6' },
    { name: 'Tech Enthusiasts', value: 22, color: '#3B82F6' },
    { name: 'Business Users', value: 16, color: '#F59E0B' }
  ]

  const similarProducts: SimilarProduct[] = [
    {
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      similarity_score: 0.94,
      price: 1199,
      category: 'Smartphones',
      performance: { conversion_rate: 26.8, revenue: 523420, sales: 287 }
    },
    {
      name: 'iPhone 14 Pro',
      brand: 'Apple',
      similarity_score: 0.91,
      price: 999,
      category: 'Smartphones',
      performance: { conversion_rate: 24.1, revenue: 445320, sales: 312 }
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      similarity_score: 0.87,
      price: 1199,
      category: 'Smartphones',
      performance: { conversion_rate: 23.4, revenue: 398750, sales: 245 }
    },
    {
      name: 'Google Pixel 8 Pro',
      brand: 'Google',
      similarity_score: 0.82,
      price: 999,
      category: 'Smartphones',
      performance: { conversion_rate: 21.8, revenue: 334560, sales: 198 }
    },
    {
      name: 'OnePlus 12',
      brand: 'OnePlus',
      similarity_score: 0.78,
      price: 799,
      category: 'Smartphones',
      performance: { conversion_rate: 19.5, revenue: 267890, sales: 167 }
    }
  ]

  const ocrPatterns: OCRPattern[] = [
    {
      id: 'ocr_1',
      description: 'Person running with smartphone',
      image_context: 'Athletic lifestyle, fitness tracking, outdoor activities',
      effectiveness_score: 87,
      usage_count: 1243,
      example: 'Guy running with iPhone, showing fitness app and health tracking features',
      demographics: ['Health-conscious', 'Age 25-40', 'Active lifestyle']
    },
    {
      id: 'ocr_2',
      description: 'Professional using phone in office',
      image_context: 'Business environment, productivity, work efficiency',
      effectiveness_score: 82,
      usage_count: 967,
      example: 'Business professional taking video call on iPhone in modern office setting',
      demographics: ['Business professionals', 'Age 30-50', 'Corporate environment']
    },
    {
      id: 'ocr_3',
      description: 'Creative content creation',
      image_context: 'Photography, video editing, artistic work',
      effectiveness_score: 91,
      usage_count: 756,
      example: 'Photographer capturing and editing photos on iPhone with ProRAW features',
      demographics: ['Creative professionals', 'Age 22-45', 'Content creators']
    },
    {
      id: 'ocr_4',
      description: 'Family moments and memories',
      image_context: 'Family gatherings, special occasions, memory capture',
      effectiveness_score: 85,
      usage_count: 1567,
      example: 'Parent filming child\'s birthday with iPhone, emphasizing video quality and ease of use',
      demographics: ['Parents', 'Age 28-45', 'Family-oriented']
    }
  ]

  const toggleSimilarProduct = (productName: string) => {
    setSelectedSimilarProducts(prev =>
      prev.includes(productName)
        ? prev.filter(name => name !== productName)
        : [...prev, productName]
    )
  }

  const handleCreateCampaignWithProducts = () => {
    onCreateCampaign(insight.product, insight.segment, selectedSimilarProducts)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
              Insight Analysis: {insight.product} → {insight.segment}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Deep dive into why this combination works
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'analysis'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2 inline" />
            Data Analysis
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'similar'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2 inline" />
            Similar Products
            {selectedSimilarProducts.length > 0 && (
              <span className="ml-2 bg-purple-600 text-white rounded-full px-2 py-0.5 text-xs">
                {selectedSimilarProducts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'ocr'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Camera className="h-4 w-4 mr-2 inline" />
            OCR Patterns
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-green-900 dark:text-green-200">Affinity Score</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-200">{insight.affinity_score}%</p>
                  <p className="text-sm text-green-700 dark:text-green-300">+{(insight.affinity_score - 75).toFixed(1)}% vs avg</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-blue-900 dark:text-blue-200">Conversion Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{insight.conversion_rate}%</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">+{(insight.conversion_rate - 18.5).toFixed(1)}% vs market</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-purple-900 dark:text-purple-200">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">${(insight.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">{insight.sales_count} sales</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-orange-900 dark:text-orange-200">Market Share</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">23.4%</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">In segment</p>
                </div>
              </div>

              {/* Performance Trend */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Trend vs Competitors
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="conversion" stroke="#8B5CF6" strokeWidth={3} name="Your Product" />
                      <Line type="monotone" dataKey="competitors" stroke="#6B7280" strokeWidth={2} name="Market Average" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Segment Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Segment Distribution
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segmentBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {segmentBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Why This Works
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">High Purchase Intent</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">This segment shows 3.2x higher intent to purchase premium products</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Brand Affinity</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">92% brand loyalty score within this segment</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Timing Sensitivity</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Peak engagement during product launch periods</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                  AI-Generated Insight
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{insight.insight}</p>
                <p className="text-purple-700 dark:text-purple-300 font-medium">{insight.recommendation}</p>
              </div>
            </div>
          )}

          {activeTab === 'similar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Products Similar to {insight.product}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Select additional products that work well with {insight.segment} segment
                  </p>
                </div>
                {selectedSimilarProducts.length > 0 && (
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {selectedSimilarProducts.length} selected
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {similarProducts.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSimilarProduct(product.name)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedSimilarProducts.includes(product.name)
                        ? 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {product.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand} • {product.category} • ${product.price.toLocaleString()}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.similarity_score >= 0.9 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              product.similarity_score >= 0.8 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {(product.similarity_score * 100).toFixed(0)}% similar
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {product.performance.conversion_rate}% conversion
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400">
                              ${product.performance.revenue.toLocaleString()} revenue
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedSimilarProducts.includes(product.name)
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedSimilarProducts.includes(product.name) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ocr' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  OCR Content Patterns
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Visual content patterns that resonate with {insight.segment} segment
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ocrPatterns.map((pattern) => (
                  <div key={pattern.id} className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{pattern.description}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{pattern.image_context}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pattern.effectiveness_score >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        pattern.effectiveness_score >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {pattern.effectiveness_score}% effective
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{pattern.example}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Target Demographics</p>
                        <div className="flex flex-wrap gap-1">
                          {pattern.demographics.map((demo, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                              {demo}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Usage Count</span>
                        <span className="font-medium text-gray-900 dark:text-white">{pattern.usage_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Content Recommendations for {insight.segment}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    • Focus on lifestyle integration rather than technical specifications
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    • Show real people using the product in authentic scenarios
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    • Emphasize outcomes and benefits over features
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    • Use aspirational but achievable lifestyle imagery
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {activeTab === 'similar' && selectedSimilarProducts.length > 0 && (
              <span>Including {selectedSimilarProducts.length} similar product{selectedSimilarProducts.length !== 1 ? 's' : ''} in campaign</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCreateCampaignWithProducts}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>Create Campaign</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}