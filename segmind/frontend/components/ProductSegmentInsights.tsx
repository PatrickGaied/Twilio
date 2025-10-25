import { useState } from 'react'
import { TrendingUp, Users, ShoppingCart, Target, Lightbulb, Zap, ArrowRight } from 'lucide-react'

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

interface ProductSegmentInsightsProps {
  onCreateCampaign?: (product: string, segment: string) => void
}

export default function ProductSegmentInsights({ onCreateCampaign }: ProductSegmentInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<ProductInsight | null>(null)

  // Mock insights data showing product-segment correlations
  const insights: ProductInsight[] = [
    {
      product: 'iPhone 15 Pro',
      segment: 'High Converters',
      affinity_score: 92,
      conversion_rate: 28.4,
      revenue: 487650,
      sales_count: 342,
      insight: 'High Converters show exceptional affinity for premium Apple products',
      recommendation: 'Create premium positioning campaigns emphasizing exclusivity and advanced features'
    },
    {
      product: 'Samsung Galaxy S24',
      segment: 'Loyal Customers',
      affinity_score: 87,
      conversion_rate: 23.1,
      revenue: 298420,
      sales_count: 256,
      insight: 'Loyal Customers prefer Samsung for repeat purchases and upgrades',
      recommendation: 'Highlight upgrade benefits and loyalty rewards in campaigns'
    },
    {
      product: 'MacBook Air M3',
      segment: 'High Converters',
      affinity_score: 89,
      conversion_rate: 31.2,
      revenue: 623150,
      sales_count: 289,
      insight: 'Professional-grade products resonate strongly with high-value customers',
      recommendation: 'Focus on productivity and professional use cases in messaging'
    },
    {
      product: 'AirPods Pro',
      segment: 'Window Shoppers',
      affinity_score: 76,
      conversion_rate: 12.8,
      revenue: 156830,
      sales_count: 478,
      insight: 'Entry-level premium accessories attract browsing customers',
      recommendation: 'Use bundle offers and time-limited promotions to drive conversion'
    },
    {
      product: 'iPad Pro',
      segment: 'Creative Professionals',
      affinity_score: 94,
      conversion_rate: 34.7,
      revenue: 445720,
      sales_count: 187,
      insight: 'Creative segment shows highest affinity for professional tablets',
      recommendation: 'Showcase creative workflows and professional tools integration'
    }
  ]

  const getAffinityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900'
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
  }

  const getAffinityLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Strong'
    if (score >= 70) return 'Good'
    return 'Moderate'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            Product-Segment Insights
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Discover which products work best with specific customer segments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
            AI Powered
          </span>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            onClick={() => setSelectedInsight(insight)}
            className="group p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-300 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {insight.product.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{insight.product}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">→ {insight.segment}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAffinityColor(insight.affinity_score)}`}>
                      {insight.affinity_score}% {getAffinityLabel(insight.affinity_score)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Affinity</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{insight.conversion_rate}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Conversion</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">${insight.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-blue-600">{insight.sales_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-medium">💡 Insight:</span> {insight.insight}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    <span className="font-medium">📋 Recommendation:</span> {insight.recommendation}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onCreateCampaign) {
                      onCreateCampaign(insight.product, insight.segment)
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 opacity-0 group-hover:opacity-100"
                >
                  <Zap className="h-3 w-3" />
                  <span>Create Campaign</span>
                </button>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.filter(i => i.affinity_score >= 85).length}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">High Affinity Pairs</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {(insights.reduce((sum, i) => sum + i.conversion_rate, 0) / insights.length).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Avg Conversion</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(insights.reduce((sum, i) => sum + i.revenue, 0)).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedInsight.product} × {selectedInsight.segment}
              </h4>
              <button
                onClick={() => setSelectedInsight(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="metric-card">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Affinity Score</h5>
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl font-bold ${getAffinityColor(selectedInsight.affinity_score).split(' ')[0]}`}>
                      {selectedInsight.affinity_score}%
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getAffinityLabel(selectedInsight.affinity_score)}
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Performance</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate:</span>
                      <span className="font-semibold">{selectedInsight.conversion_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sales Count:</span>
                      <span className="font-semibold">{selectedInsight.sales_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue:</span>
                      <span className="font-semibold text-green-600">${selectedInsight.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">AI Insight</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    {selectedInsight.insight}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Campaign Recommendation</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    {selectedInsight.recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (onCreateCampaign) {
                    onCreateCampaign(selectedInsight.product, selectedInsight.segment)
                  }
                  setSelectedInsight(null)
                }}
                className="flex-1 btn-primary"
              >
                <Zap className="h-4 w-4 mr-2" />
                Create Targeted Campaign
              </button>
              <button
                onClick={() => setSelectedInsight(null)}
                className="btn-secondary"
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