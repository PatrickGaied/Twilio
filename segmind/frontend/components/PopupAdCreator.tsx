import { useState, useEffect } from 'react'
import { X, ChevronRight, Zap, Target, Clock, Eye, Sparkles, Monitor, Smartphone } from 'lucide-react'
import ImageGenerator from './ImageGenerator'

interface PopupAdCreatorProps {
  isOpen: boolean
  onClose: () => void
  segmentName?: string
  productName?: string
}

interface Brand {
  name: string
  enabled: boolean
  products: string[]
}

export default function PopupAdCreator({ isOpen, onClose, segmentName, productName }: PopupAdCreatorProps) {
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [targetAudience, setTargetAudience] = useState<string>('')
  const [timing, setTiming] = useState<string>('immediate')
  const [device, setDevice] = useState<string>('all')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [marketingInsights, setMarketingInsights] = useState<any>(null)

  const brands: Brand[] = [
    {
      name: 'Apple',
      enabled: true,
      products: ['iPhone 15 Pro', 'iPhone 15', 'MacBook Pro', 'MacBook Air', 'iPad Pro', 'AirPods Pro', 'Apple Watch Ultra']
    },
    {
      name: 'Samsung',
      enabled: true,
      products: ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy Tab S9', 'Galaxy Watch 6', 'Galaxy Buds Pro', 'Galaxy Book Pro']
    },
    {
      name: 'Huawei',
      enabled: true,
      products: ['Mate 60 Pro', 'P60 Pro', 'MatePad Pro', 'Watch GT 4', 'FreeBuds Pro', 'MateBook X Pro']
    },
    {
      name: 'Yamaha',
      enabled: true,
      products: ['YAS-209 Soundbar', 'TSR-700 Receiver', 'MusicCast 50', 'True X Headphones', 'SR-B20A Sound Bar', 'WX-030 Speaker']
    }
  ]

  useEffect(() => {
    if (productName) {
      // Pre-select brand and product if passed from insights
      const brand = brands.find(b => b.products.some(p => p === productName))
      if (brand) {
        setSelectedBrand(brand.name)
        setSelectedProduct(productName)
        setStep(2)
      }
    }
    if (segmentName) {
      setTargetAudience(segmentName)
    }
  }, [productName, segmentName])

  const fetchMarketingInsights = async () => {
    // Simulate fetching marketing intelligence
    const insights = {
      product: selectedProduct,
      audience: targetAudience,
      bestPractices: [
        'Use urgency triggers for higher conversion',
        'Mobile-first design increases engagement by 45%',
        'Exit-intent popups recover 35% of abandoning visitors',
        'Personalized offers improve CTR by 2.5x'
      ],
      suggestedPrompts: [
        `Limited-time offer on ${selectedProduct} - Create urgency with countdown timer`,
        `Exclusive ${targetAudience} discount on ${selectedProduct} - Personalized messaging`,
        `Don't miss out on ${selectedProduct} - Exit-intent recovery strategy`,
        `Special bundle: ${selectedProduct} + accessories - Increase AOV`
      ],
      timing: {
        recommended: timing === 'exit_intent' ? 'exit_intent' : 'delayed_5',
        reason: 'Based on user behavior patterns for this segment'
      },
      deviceTargeting: {
        recommended: device,
        distribution: { mobile: 65, desktop: 30, tablet: 5 }
      }
    }
    setMarketingInsights(insights)
  }

  const handleNext = () => {
    if (step === 1 && selectedBrand) {
      setStep(2)
    } else if (step === 2 && selectedProduct) {
      setStep(3)
      fetchMarketingInsights()
    } else if (step === 3) {
      // Generate and preview popup
      handleGeneratePopup()
    }
  }

  const handleGeneratePopup = () => {
    // Store popup configuration
    const popupConfig = {
      brand: selectedBrand,
      product: selectedProduct,
      audience: targetAudience,
      timing,
      device,
      customPrompt: customPrompt || marketingInsights?.suggestedPrompts[0],
      insights: marketingInsights
    }

    localStorage.setItem('popupAdConfig', JSON.stringify(popupConfig))

    // Navigate to preview page
    window.location.href = '/popup-preview'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Zap className="h-7 w-7 mr-3" />
                Create Popup Ad
              </h2>
              <p className="text-orange-100 mt-1">
                Intelligent popup creation powered by marketing insights
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-300'
              }`}>1</div>
              <span className="ml-2 font-medium">Select Brand</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-300'
              }`}>2</div>
              <span className="ml-2 font-medium">Choose Product</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-300'
              }`}>3</div>
              <span className="ml-2 font-medium">Configure & Launch</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 280px)' }}>
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select a Brand to Promote
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {brands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => setSelectedBrand(brand.name)}
                    disabled={!brand.enabled}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedBrand === brand.name
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : brand.enabled
                        ? 'border-gray-200 dark:border-gray-600 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {brand.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {brand.products.length} products available
                    </div>
                    {!brand.enabled && (
                      <div className="text-xs text-gray-500 mt-2">Coming Soon</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select {selectedBrand} Product
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  ← Change Brand
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {brands.find(b => b.name === selectedBrand)?.products.map((product) => (
                  <button
                    key={product}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedProduct === product
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{product}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Best for: {getProductAudience(product)}
                        </p>
                      </div>
                      <div className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        {Math.floor(Math.random() * 20 + 15)}% CTR
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configure Popup for {selectedProduct}
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  ← Change Product
                </button>
              </div>

              {/* Marketing Intelligence Panel */}
              {marketingInsights && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Marketing Intelligence Insights
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    {marketingInsights.bestPractices.map((practice: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Visitors</option>
                  <option value="New Visitors">New Visitors</option>
                  <option value="Returning Customers">Returning Customers</option>
                  <option value="Cart Abandoners">Cart Abandoners</option>
                  <option value="High-Value Customers">High-Value Customers</option>
                  <option value="Mobile Users">Mobile Users</option>
                  {segmentName && <option value={segmentName}>{segmentName}</option>}
                </select>
              </div>

              {/* Timing Configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Display Timing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'delayed_5', label: '5 seconds' },
                    { value: 'exit_intent', label: 'Exit Intent' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTiming(option.value)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        timing === option.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
                {marketingInsights?.timing && timing !== marketingInsights.timing.recommended && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    💡 Recommended: {marketingInsights.timing.recommended.replace('_', ' ')} - {marketingInsights.timing.reason}
                  </p>
                )}
              </div>

              {/* Device Targeting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device Targeting
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'all', label: 'All', icon: Monitor },
                    { value: 'desktop', label: 'Desktop', icon: Monitor },
                    { value: 'mobile', label: 'Mobile', icon: Smartphone },
                    { value: 'tablet', label: 'Tablet', icon: Monitor }
                  ].map(option => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => setDevice(option.value)}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-1 ${
                          device === option.value
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
                {marketingInsights?.deviceTargeting && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Device distribution: Mobile {marketingInsights.deviceTargeting.distribution.mobile}%,
                    Desktop {marketingInsights.deviceTargeting.distribution.desktop}%,
                    Tablet {marketingInsights.deviceTargeting.distribution.tablet}%
                  </div>
                )}
              </div>

              {/* AI-Suggested Prompts */}
              {marketingInsights?.suggestedPrompts && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI-Suggested Messages
                  </label>
                  <div className="space-y-2">
                    {marketingInsights.suggestedPrompts.map((prompt: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCustomPrompt(prompt)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          customPrompt === prompt
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                        }`}
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add any specific instructions for the popup content..."
                  className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* AI Image Generator */}
              <ImageGenerator
                product={selectedProduct}
                brand={selectedBrand}
                audience={targetAudience}
                onImageGenerated={(imageUrl) => {
                  console.log('Generated image for popup:', imageUrl)
                  // Store the generated image for use in popup
                  localStorage.setItem('popupGeneratedImage', imageUrl)
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedBrand) ||
                (step === 2 && !selectedProduct)
              }
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {step === 3 ? (
                <>
                  <Eye className="h-5 w-5" />
                  <span>Preview Popup</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  function getProductAudience(product: string): string {
    const audiences: { [key: string]: string } = {
      'iPhone 15 Pro': 'Tech enthusiasts, professionals',
      'iPhone 15': 'General consumers, upgraders',
      'MacBook Pro': 'Creative professionals, developers',
      'MacBook Air': 'Students, casual users',
      'iPad Pro': 'Artists, designers',
      'AirPods Pro': 'Music lovers, commuters',
      'Apple Watch Ultra': 'Fitness enthusiasts, adventurers',
      'Galaxy S24 Ultra': 'Power users, photographers',
      'Galaxy S24': 'Android enthusiasts',
      'Galaxy Tab S9': 'Media consumers, productivity',
      'Galaxy Watch 6': 'Fitness tracking, Samsung ecosystem',
      'Galaxy Buds Pro': 'Audio enthusiasts',
      'Galaxy Book Pro': 'Windows professionals',
      'Mate 60 Pro': 'Photography enthusiasts',
      'P60 Pro': 'Value seekers',
      'MatePad Pro': 'Digital artists',
      'Watch GT 4': 'Sports enthusiasts',
      'FreeBuds Pro': 'Huawei ecosystem users',
      'MateBook X Pro': 'Business professionals',
      'YAS-209 Soundbar': 'Home theater enthusiasts',
      'TSR-700 Receiver': 'Audiophiles',
      'MusicCast 50': 'Multi-room audio fans',
      'True X Headphones': 'Premium audio seekers',
      'SR-B20A Sound Bar': 'TV audio upgrade',
      'WX-030 Speaker': 'Wireless audio enthusiasts'
    }
    return audiences[product] || 'General audience'
  }
}