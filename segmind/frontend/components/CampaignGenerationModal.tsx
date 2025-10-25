import { useState } from 'react'
import { X, Wand2, Loader2, Send, Lightbulb, Calendar, Mail } from 'lucide-react'

interface CampaignGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (campaigns: any[]) => void
  insights: any[]
}

export default function CampaignGenerationModal({ isOpen, onClose, onGenerate, insights }: CampaignGenerationModalProps) {
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCampaigns, setGeneratedCampaigns] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [campaignCount, setCampaignCount] = useState(8)
  const [focusDay, setFocusDay] = useState('')
  const [variationRequest, setVariationRequest] = useState('')

  if (!isOpen) return null

  const defaultPrompts = [
    "Focus on high-converting products and create urgency with limited-time offers",
    "Create educational campaigns that showcase product features and benefits",
    "Design premium campaigns for high-value customers with exclusive positioning",
    "Generate campaigns that highlight product comparisons and help customers choose",
    "Create seasonal campaigns with holiday themes and gift suggestions",
    "Focus on cross-selling and bundle campaigns to increase average order value",
    "Create 10 campaigns focused on Monday launches with different tones",
    "Make campaign variations - each one should be distinctly different from the others",
    "Generate campaigns for different days: 3 on Monday, 3 on Wednesday, 2 on Friday",
    "Create campaigns where each targets a different customer segment entirely"
  ]

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Build enhanced prompt with specific controls
      let enhancedPrompt = customPrompt || "Generate smart marketing campaigns based on the insights provided"

      if (campaignCount !== 8) {
        enhancedPrompt += ` Generate exactly ${campaignCount} campaigns.`
      }

      if (focusDay) {
        enhancedPrompt += ` Focus scheduling on ${focusDay}.`
      }

      if (variationRequest) {
        enhancedPrompt += ` Variation request: ${variationRequest}`
      }

      const response = await fetch('/api/generate-campaigns-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insights,
          customPrompt: enhancedPrompt,
          includeEmailContent: true,
          campaignCount,
          focusDay,
          variationRequest
        }),
      })

      const data = await response.json()

      if (data.success && data.campaigns) {
        setGeneratedCampaigns(data.campaigns)
        setShowPreview(true)
      } else {
        console.error('Failed to generate campaigns:', data.error)
        alert('Failed to generate campaigns. Please try again.')
      }
    } catch (error) {
      console.error('Error generating campaigns:', error)
      alert('Error generating campaigns. Please check your connection.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyCampaigns = () => {
    onGenerate(generatedCampaigns)
    onClose()
    setShowPreview(false)
    setGeneratedCampaigns([])
  }

  const handleEditCampaign = async (campaignIndex: number, newPrompt: string) => {
    try {
      const campaign = generatedCampaigns[campaignIndex]
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: campaign.products[0],
          segment: campaign.segment,
          emailType: 'custom',
          customPrompt: newPrompt,
          insight: campaign.insight,
          recommendation: campaign.recommendation
        }),
      })

      const data = await response.json()

      if (data.success) {
        const updatedCampaigns = [...generatedCampaigns]
        updatedCampaigns[campaignIndex] = {
          ...campaign,
          emailContent: data.content,
          emailSubject: data.subject
        }
        setGeneratedCampaigns(updatedCampaigns)
      }
    } catch (error) {
      console.error('Error updating campaign:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Wand2 className="h-6 w-6 mr-2 text-purple-600" />
              AI Campaign Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize how AI creates your marketing campaigns
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Prompt Interface */}
          <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* Specific Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Campaigns
                  </label>
                  <select
                    value={campaignCount}
                    onChange={(e) => setCampaignCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[4, 6, 8, 10, 12, 15].map(num => (
                      <option key={num} value={num}>{num} campaigns</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Focus Day (Optional)
                  </label>
                  <select
                    value={focusDay}
                    onChange={(e) => setFocusDay(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Any day</option>
                    {dayOptions.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Variation Request */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Variations
                </label>
                <input
                  type="text"
                  value={variationRequest}
                  onChange={(e) => setVariationRequest(e.target.value)}
                  placeholder="e.g., 'Make campaign 7 more different than 6' or 'Create distinct variations for each segment'"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Instructions for AI
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Additional instructions: 'Focus on tech enthusiasts, create educational content about features, include pricing comparisons...'"
                  className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
              </div>

              {/* Quick Prompt Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Templates
                </label>
                <div className="space-y-2">
                  {defaultPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomPrompt(prompt)}
                      className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insights Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1 text-yellow-600" />
                  Using These Insights
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {insight.product} → {insight.segment}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        {insight.conversion_rate}% conversion, {insight.affinity_score}% affinity
                      </p>
                    </div>
                  ))}
                  {insights.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-2">
                      +{insights.length - 3} more insights
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Generate Campaigns</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {!showPreview ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Campaign Preview</p>
                  <p className="text-sm">Generated campaigns will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generated Campaigns ({generatedCampaigns.length})
                  </h3>
                  <button
                    onClick={handleApplyCampaigns}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Apply to Calendar</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {generatedCampaigns.map((campaign, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {campaign.products.join(', ')} → {campaign.segment}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {campaign.description}
                      </p>

                      {campaign.emailContent && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              Email Preview
                            </span>
                            <button
                              onClick={() => {
                                const newPrompt = prompt('Customize this email content:', campaign.emailContent)
                                if (newPrompt) {
                                  handleEditCampaign(index, newPrompt)
                                }
                              }}
                              className="text-xs text-purple-600 hover:text-purple-700"
                            >
                              Edit
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            Subject: {campaign.emailSubject}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                            {campaign.emailContent?.substring(0, 150)}...
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Scheduled: {new Date(campaign.scheduled_date).toLocaleDateString()}</span>
                        <span>Priority: {campaign.priority}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}