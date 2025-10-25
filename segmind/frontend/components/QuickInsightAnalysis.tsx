import { useState, useEffect } from 'react'
import { X, TrendingUp, Users, Zap, Calendar, Mail, ArrowRight, ChevronUp, ChevronDown, Eye } from 'lucide-react'

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

interface QuickInsightAnalysisProps {
  insight: ProductInsight
  isOpen: boolean
  onClose: () => void
  onCreateCampaign: (product: string, segment: string) => void
}

export default function QuickInsightAnalysis({ insight, isOpen, onClose, onCreateCampaign }: QuickInsightAnalysisProps) {
  const [emailPreviews, setEmailPreviews] = useState<any[]>([])
  const [isGeneratingEmails, setIsGeneratingEmails] = useState(false)
  const [hoveredEmail, setHoveredEmail] = useState<number | null>(null)

  if (!isOpen) return null

  // Similar products data based on vector similarity
  const getSimilarProducts = () => {
    const baseProducts = [
      { name: 'iPhone 15 Pro', conversion: 28.4, revenue: 487650, sales: 342, similarity: 0.95, category: 'high' },
      { name: 'iPhone 15 Pro Max', conversion: 26.8, revenue: 523420, sales: 287, similarity: 0.94, category: 'high' },
      { name: 'MacBook Pro M3', conversion: 31.2, revenue: 654320, sales: 198, similarity: 0.89, category: 'high' },
      { name: 'iPhone 14 Pro', conversion: 24.1, revenue: 398750, sales: 312, similarity: 0.91, category: 'high' },
      { name: 'AirPods Max', conversion: 18.7, revenue: 187340, sales: 234, similarity: 0.79, category: 'under' },
      { name: 'Apple Watch SE', conversion: 16.2, revenue: 145670, sales: 189, similarity: 0.76, category: 'under' },
      { name: 'iPad Air', conversion: 15.8, revenue: 123450, sales: 156, similarity: 0.73, category: 'under' },
      { name: 'HomePod mini', conversion: 12.4, revenue: 87650, sales: 123, similarity: 0.68, category: 'under' }
    ]

    const highPerformers = baseProducts.filter(p => p.category === 'high' && p.name !== insight.product)
    const underPerformers = baseProducts.filter(p => p.category === 'under')

    return { highPerformers: highPerformers.slice(0, 3), underPerformers: underPerformers.slice(0, 3) }
  }

  const { highPerformers, underPerformers } = getSimilarProducts()

  const suggestedSchedule = [
    { day: 'Monday', time: '9:00 AM', content: 'Product introduction with lifestyle focus', type: 'introduction' },
    { day: 'Wednesday', time: '2:00 PM', content: 'Feature highlight with user testimonials', type: 'features' },
    { day: 'Thursday', time: '10:00 AM', content: 'Limited time offer with urgency', type: 'offer' }
  ]

  const generateEmailContent = async () => {
    setIsGeneratingEmails(true)
    try {
      const emailPromises = suggestedSchedule.map(async (schedule, index) => {
        const response = await fetch('/api/generate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: insight.product,
            segment: insight.segment,
            emailType: schedule.type,
            day: schedule.day,
            insight: insight.insight,
            recommendation: insight.recommendation
          })
        })

        const data = await response.json()
        return {
          ...schedule,
          subject: data.subject || `${insight.product} - ${schedule.content}`,
          preview: data.preview || `Generated email content for ${schedule.day}`,
          content: data.content || `Email content for ${insight.product} targeting ${insight.segment}`
        }
      })

      const emails = await Promise.all(emailPromises)
      setEmailPreviews(emails)
    } catch (error) {
      console.error('Error generating emails:', error)
      // Fallback to mock data
      setEmailPreviews(suggestedSchedule.map(schedule => ({
        ...schedule,
        subject: `${insight.product} - ${schedule.content}`,
        preview: `Personalized email for ${insight.segment} segment`,
        content: `Subject: Discover the ${insight.product}\n\nHi there!\n\n${insight.insight}\n\n${insight.recommendation}\n\nBest regards,\nYour Team`
      })))
    } finally {
      setIsGeneratingEmails(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      generateEmailContent()
    }
  }, [isOpen])

  const handleQuickCampaign = () => {
    onCreateCampaign(insight.product, insight.segment)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {insight.product} → {insight.segment}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Why this combination works
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Performance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{insight.affinity_score}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Affinity Score</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{insight.conversion_rate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">${(insight.revenue / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
            </div>
          </div>

          {/* Why This Works */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Why This Works</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{insight.insight}</p>
            <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">{insight.recommendation}</p>
          </div>

          {/* Similar Products Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* High Performers */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <ChevronUp className="h-5 w-5 mr-2 text-green-600" />
                High Performers (Similar Products)
              </h3>
              <div className="space-y-2">
                {highPerformers.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{(product.similarity * 100).toFixed(0)}% similar</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium text-sm">{product.conversion}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">${(product.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Under Performers */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <ChevronDown className="h-5 w-5 mr-2 text-orange-600" />
                Under Performers (Could Benefit)
              </h3>
              <div className="space-y-2">
                {underPerformers.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{(product.similarity * 100).toFixed(0)}% similar</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 font-medium text-sm">{product.conversion}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">${(product.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI-Generated Email Schedule */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 relative">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              AI-Generated Email Schedule
              {isGeneratingEmails && (
                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full animate-pulse">
                  Generating...
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {(emailPreviews.length > 0 ? emailPreviews : suggestedSchedule).map((schedule, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredEmail(index)}
                  onMouseLeave={() => setHoveredEmail(null)}
                >
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">{schedule.day}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{schedule.time}</span>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {emailPreviews[index]?.subject || schedule.content}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {emailPreviews[index]?.preview || 'Hover to preview'}
                      </p>
                    </div>
                  </div>

                  {/* Email Preview Tooltip */}
                  {hoveredEmail === index && emailPreviews[index] && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-10 max-w-md">
                      <h4 className="font-medium mb-2 text-blue-300">Email Preview</h4>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-gray-300">Subject:</span>
                          <p className="text-white">{emailPreviews[index].subject}</p>
                        </div>
                        <div>
                          <span className="text-gray-300">Content:</span>
                          <p className="text-gray-100 text-xs leading-relaxed">
                            {emailPreviews[index].content?.substring(0, 200)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Expected Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on similar campaigns to {insight.segment}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">~{Math.round(insight.sales_count * 0.15)} conversions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">per campaign</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Ready to create this campaign?
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleQuickCampaign}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Set Up Emails</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}