import { useState } from 'react'
import { X, Wand2, Users, Target, Mail, MessageCircle, Send, Calendar, FileText } from 'lucide-react'
import CampaignCalendar from './CampaignCalendar'
import EmailTemplates from './EmailTemplates'

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
  segmentName?: string
  productName?: string
}

export default function CampaignModal({ isOpen, onClose, segmentName, productName }: CampaignModalProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'schedule'>('generate')
  const [campaignType, setCampaignType] = useState<'email' | 'sms' | 'whatsapp'>('email')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const generateCampaign = async () => {
    setGenerating(true)

    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    let content = ''
    if (segmentName && productName) {
      content = `🎯 Personalized Campaign for ${segmentName}\n\nSubject: Exclusive ${productName} Offer Just for You!\n\nHi [Customer Name],\n\nAs one of our valued ${segmentName.toLowerCase()}, we've noticed your interest in premium electronics. We have an exclusive offer on the ${productName} that we think you'll love!\n\n✨ Limited Time: 15% off + Free Express Shipping\n📱 ${productName} - Perfect for your lifestyle\n💎 Premium quality you trust\n\nThis offer expires in 48 hours. Don't miss out!\n\n[SHOP NOW] [Learn More]\n\nBest regards,\nThe Segmind Team`
    } else if (segmentName) {
      content = `🎯 Campaign for ${segmentName}\n\nSubject: We Miss You! Come Back for Exclusive Rewards\n\nHi [Customer Name],\n\nWe've prepared something special for our ${segmentName.toLowerCase()}. Based on your previous purchases and browsing behavior, here's a personalized offer:\n\n🎁 25% OFF your next purchase\n📦 Free shipping on orders over $50\n⭐ Early access to new arrivals\n\nYour rewards are waiting!\n\n[CLAIM OFFER] [Browse Products]\n\nBest,\nThe Segmind Team`
    } else {
      content = `🎯 AI-Generated Campaign\n\nSubject: Don't Miss Out - Limited Time Offer!\n\nHi [Customer Name],\n\nBased on our analytics, we've crafted a special offer just for you:\n\n✨ Exclusive 20% discount\n📱 On your favorite product categories\n🚀 Free express shipping\n\nThis personalized offer expires soon!\n\n[SHOP NOW] [View More]\n\nThe Segmind Team`
    }

    setGeneratedContent(content)
    setGenerating(false)
  }

  const handleScheduleCampaign = (date: string, time: string) => {
    console.log(`Campaign scheduled for ${date} at ${time}`)
    // In a real app, this would save to backend
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Creator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {segmentName && `Targeting: ${segmentName}`}
                  {productName && ` • Product: ${productName}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'generate'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Wand2 className="h-4 w-4 mr-2 inline" />
              AI Generate
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 mr-2 inline" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'schedule'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2 inline" />
              Schedule
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'generate' && (
            <div>
              {/* Campaign Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Campaign Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setCampaignType('email')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      campaignType === 'email'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </button>
                  <button
                    onClick={() => setCampaignType('sms')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      campaignType === 'sms'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">SMS</span>
                  </button>
                  <button
                    onClick={() => setCampaignType('whatsapp')}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      campaignType === 'whatsapp'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Generation Button */}
              <div className="mb-6">
                <button
                  onClick={generateCampaign}
                  disabled={generating}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating AI Campaign...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span>Generate Campaign</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Content */}
              {generatedContent && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">Generated Campaign</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        AI Generated
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {generatedContent}
                    </pre>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 btn-primary">
                      <Send className="h-4 w-4 mr-2" />
                      Send Campaign
                    </button>
                    <button className="btn-secondary">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <EmailTemplates
              segmentName={segmentName}
              productName={productName}
            />
          )}

          {activeTab === 'schedule' && (
            <CampaignCalendar
              onScheduleCampaign={handleScheduleCampaign}
            />
          )}
        </div>
      </div>
    </div>
  )
}