import { useState } from 'react'
import { X, Zap, Loader2, Send, Target, Clock, Users, Eye, Monitor, Smartphone, Tablet } from 'lucide-react'

interface PopupAdGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (popupAds: any[]) => void
  insights: any[]
}

export default function PopupAdGeneratorModal({ isOpen, onClose, onGenerate, insights }: PopupAdGeneratorModalProps) {
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPopups, setGeneratedPopups] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  // Popup-specific controls
  const [popupCount, setPopupCount] = useState(6)
  const [targetAudience, setTargetAudience] = useState('')
  const [deviceTargeting, setDeviceTargeting] = useState('all')
  const [popupTiming, setPopupTiming] = useState('immediate')
  const [triggerBehavior, setTriggerBehavior] = useState('page_load')
  const [displayDuration, setDisplayDuration] = useState(10)
  const [frequency, setFrequency] = useState('once_per_session')

  if (!isOpen) return null

  const audienceOptions = [
    'New Visitors',
    'Returning Customers',
    'Cart Abandoners',
    'High-Value Customers',
    'Mobile Users',
    'Desktop Users',
    'International Visitors',
    'VIP Members'
  ]

  const timingOptions = [
    { value: 'immediate', label: 'Immediate (0s)' },
    { value: 'delayed_3', label: '3 seconds' },
    { value: 'delayed_5', label: '5 seconds' },
    { value: 'delayed_10', label: '10 seconds' },
    { value: 'exit_intent', label: 'Exit Intent' },
    { value: 'scroll_50', label: '50% Page Scroll' },
    { value: 'time_on_page', label: 'Time on Page (30s)' }
  ]

  const triggerOptions = [
    { value: 'page_load', label: 'Page Load' },
    { value: 'scroll_trigger', label: 'Scroll Trigger' },
    { value: 'exit_intent', label: 'Exit Intent' },
    { value: 'time_based', label: 'Time Based' },
    { value: 'product_view', label: 'Product View' },
    { value: 'cart_action', label: 'Cart Action' }
  ]

  const deviceOptions = [
    { value: 'all', label: 'All Devices', icon: Monitor },
    { value: 'desktop', label: 'Desktop Only', icon: Monitor },
    { value: 'mobile', label: 'Mobile Only', icon: Smartphone },
    { value: 'tablet', label: 'Tablet Only', icon: Tablet }
  ]

  const frequencyOptions = [
    { value: 'once_per_session', label: 'Once per session' },
    { value: 'once_per_day', label: 'Once per day' },
    { value: 'once_per_week', label: 'Once per week' },
    { value: 'every_visit', label: 'Every visit' },
    { value: 'custom_interval', label: 'Custom interval' }
  ]

  const defaultPrompts = [
    "Create urgency-driven popups with limited-time offers and countdown timers",
    "Design educational popups that showcase product benefits and features",
    "Generate exit-intent popups to recover abandoning visitors",
    "Create welcome popups for new visitors with special introductory offers",
    "Design cart abandonment popups with personalized product recommendations",
    "Generate premium popups for high-value customers with exclusive deals",
    "Create mobile-optimized popups with simplified messaging and large CTAs",
    "Design seasonal popups with holiday themes and gift promotions"
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      let enhancedPrompt = customPrompt || "Generate effective popup ads based on the insights provided"

      if (popupCount !== 6) {
        enhancedPrompt += ` Generate exactly ${popupCount} popup variations.`
      }

      if (targetAudience) {
        enhancedPrompt += ` Target ${targetAudience} specifically.`
      }

      if (deviceTargeting !== 'all') {
        enhancedPrompt += ` Optimize for ${deviceTargeting} devices.`
      }

      enhancedPrompt += ` Display timing: ${popupTiming}, trigger: ${triggerBehavior}, frequency: ${frequency}.`

      const response = await fetch('/api/generate-popup-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insights,
          customPrompt: enhancedPrompt,
          popupCount,
          targetAudience,
          deviceTargeting,
          popupTiming,
          triggerBehavior,
          displayDuration,
          frequency
        }),
      })

      const data = await response.json()

      if (data.success && data.popupAds) {
        setGeneratedPopups(data.popupAds)
        setShowPreview(true)
      } else {
        console.error('Failed to generate popup ads:', data.error)
        alert('Failed to generate popup ads. Please try again.')
      }
    } catch (error) {
      console.error('Error generating popup ads:', error)
      alert('Error generating popup ads. Please check your connection.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyPopups = () => {
    onGenerate(generatedPopups)
    onClose()
    setShowPreview(false)
    setGeneratedPopups([])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Zap className="h-6 w-6 mr-2 text-orange-600" />
              AI Popup Ad Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create targeted popup ads with audience and timing controls
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
          {/* Left Panel - Configuration */}
          <div className="w-2/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Popup Variations
                  </label>
                  <select
                    value={popupCount}
                    onChange={(e) => setPopupCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[3, 4, 6, 8, 10, 12].map(num => (
                      <option key={num} value={num}>{num} popups</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Audiences</option>
                    {audienceOptions.map(audience => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Device Targeting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device Targeting
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {deviceOptions.map(device => {
                    const IconComponent = device.icon
                    return (
                      <button
                        key={device.value}
                        onClick={() => setDeviceTargeting(device.value)}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-1 ${
                          deviceTargeting === device.value
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`h-5 w-5 ${
                          deviceTargeting === device.value ? 'text-orange-600' : 'text-gray-500'
                        }`} />
                        <span className={`text-xs ${
                          deviceTargeting === device.value ? 'text-orange-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {device.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Timing and Trigger Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Display Timing
                  </label>
                  <select
                    value={popupTiming}
                    onChange={(e) => setPopupTiming(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {timingOptions.map(timing => (
                      <option key={timing.value} value={timing.value}>{timing.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Trigger Behavior
                  </label>
                  <select
                    value={triggerBehavior}
                    onChange={(e) => setTriggerBehavior(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {triggerOptions.map(trigger => (
                      <option key={trigger.value} value={trigger.value}>{trigger.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={displayDuration}
                    onChange={(e) => setDisplayDuration(Number(e.target.value))}
                    min={3}
                    max={60}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {frequencyOptions.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Instructions for AI
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Custom instructions: 'Create urgency with countdown timers, focus on mobile optimization, include social proof...'"
                  className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                />
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {defaultPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomPrompt(prompt)}
                      className="text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Popups...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Generate Popup Ads</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/3 p-6 overflow-y-auto">
            {!showPreview ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Eye className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Popup Preview</p>
                  <p className="text-sm">Generated popups will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generated Popups ({generatedPopups.length})
                  </h3>
                  <button
                    onClick={handleApplyPopups}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Deploy Popups
                  </button>
                </div>

                <div className="space-y-4">
                  {generatedPopups.map((popup, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{popup.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {popup.targetAudience} • {popup.device}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          {popup.priority}/10
                        </span>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                          {popup.headline}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {popup.content?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-orange-600 font-medium">{popup.cta}</span>
                          <span className="text-xs text-gray-500">{popup.displayDuration}s display</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Trigger: {popup.trigger}</span>
                        <span>Frequency: {popup.frequency}</span>
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