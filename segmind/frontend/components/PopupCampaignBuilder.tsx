import { useState } from 'react'
import { ArrowLeft, Search, Zap, Users, ImageIcon, Target, Wand2, Eye, X, CheckCircle } from 'lucide-react'

interface PopupCampaignBuilderProps {
  onBack: () => void
  onSchedulePopup?: (popupData: any) => void
}

export default function PopupCampaignBuilder({ onBack, onSchedulePopup }: PopupCampaignBuilderProps) {
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [popupHeadline, setPopupHeadline] = useState('')
  const [popupDescription, setPopupDescription] = useState('')
  const [popupCTA, setPopupCTA] = useState('')
  const [popupShape, setPopupShape] = useState('square')
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [selectedOCRPatterns, setSelectedOCRPatterns] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customPrompts, setCustomPrompts] = useState<{[key: string]: string}>({})
  const [showPromptEditor, setShowPromptEditor] = useState<string | null>(null)
  const [tempPrompt, setTempPrompt] = useState('')
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)

  // Mock product data
  const availableProducts = [
    { id: 'prod_1001', name: 'iPhone 15 Pro', brand: 'Apple', category: 'Smartphones', price: 1199 },
    { id: 'prod_1002', name: 'Samsung Galaxy S24', brand: 'Samsung', category: 'Smartphones', price: 999 },
    { id: 'prod_1003', name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Smartphones', price: 1199 },
    { id: 'prod_1004', name: 'MacBook Pro M3', brand: 'Apple', category: 'Laptops', price: 1999 },
    { id: 'prod_1005', name: 'AirPods Pro', brand: 'Apple', category: 'Audio', price: 249 }
  ]

  // OCR patterns from successful campaigns
  const ocrPatterns = [
    {
      id: 'ocr_1',
      description: 'Person running with smartphone',
      context: 'Athletic lifestyle, fitness tracking, outdoor activities',
      effectiveness: 87,
      example: 'Guy running with iPhone, showing fitness app and health tracking features'
    },
    {
      id: 'ocr_2',
      description: 'Professional using phone in office',
      context: 'Business environment, productivity, work efficiency',
      effectiveness: 82,
      example: 'Business professional taking video call on iPhone in modern office setting'
    },
    {
      id: 'ocr_3',
      description: 'Creative content creation',
      context: 'Photography, video editing, artistic work',
      effectiveness: 91,
      example: 'Photographer capturing and editing photos on iPhone with ProRAW features'
    }
  ]

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleOCRPattern = (patternId: string) => {
    setSelectedOCRPatterns(prev =>
      prev.includes(patternId)
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    )
  }

  const handleCreatePrompt = (patternId: string) => {
    setShowPromptEditor(patternId)
    setTempPrompt(customPrompts[patternId] || '')
  }

  const saveCustomPrompt = () => {
    if (showPromptEditor && tempPrompt.trim()) {
      setCustomPrompts(prev => ({
        ...prev,
        [showPromptEditor]: tempPrompt.trim()
      }))
      setShowPromptEditor(null)
      setTempPrompt('')
    }
  }

  const cancelPromptEditor = () => {
    setShowPromptEditor(null)
    setTempPrompt('')
  }

  const handleAIGenerate = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product first')
      return
    }

    setIsGeneratingContent(true)

    try {
      const selectedProductData = selectedProducts.map(id => availableProducts.find(p => p.id === id)).filter(Boolean)
      const selectedPatternData = selectedOCRPatterns.map(id => ocrPatterns.find(p => p.id === id)).filter(Boolean)

      // Create a simplified request for headline and CTA generation
      const patternInfo = selectedPatternData.length > 0
        ? `\nVisual Pattern: ${selectedPatternData[0]?.description}\nContext: ${selectedPatternData[0]?.context}`
        : '\nVisual Style: Modern, clean popup design'

      const generationRequest = {
        product: selectedProductData[0],
        strategy: {
          strategy: `Generate compelling popup advertisement headline and call-to-action for ${selectedProductData[0]?.name}`,
          primaryAudience: 'General audience',
          emailType: 'popup-content',
          customPrompt: `Product: ${selectedProductData[0]?.name} (${selectedProductData[0]?.brand}, $${selectedProductData[0]?.price})${patternInfo}\nGenerate a catchy headline and compelling call-to-action button text for this popup ad.`
        },
        weeklySchedule: [{
          day: 'Today',
          time: new Date().toLocaleTimeString(),
          type: 'Content Generation',
          audience: 'All Segments',
          emailTheme: 'Popup Content'
        }]
      }

      const response = await fetch('/api/campaign-generator/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationRequest),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const apiResponse = await response.json()
      const generatedCards = apiResponse.cards || []

      if (generatedCards.length > 0) {
        const card = generatedCards[0]
        // Extract headline and CTA from the generated content
        setPopupHeadline(card.subject || `${selectedProductData[0]?.name} - Limited Time!`)
        setPopupCTA(card.emailContent?.match(/\[(.*?)\]/)?.[1] || 'Shop Now')
        setPopupDescription(card.preview || `Discover the amazing features of ${selectedProductData[0]?.name}`)
      } else {
        // Fallback generation
        const fallbackContext = selectedPatternData.length > 0
          ? selectedPatternData[0]?.context.split(',')[0]
          : 'Limited Time'
        setPopupHeadline(`${selectedProductData[0]?.name} - ${fallbackContext}`)
        setPopupCTA('Shop Now')
        setPopupDescription(`Experience ${selectedProductData[0]?.name} like never before`)
      }

    } catch (error) {
      console.error('Error generating content:', error)
      // Fallback to simple generation based on product and pattern
      const selectedProductData = selectedProducts.map(id => availableProducts.find(p => p.id === id)).filter(Boolean)
      const selectedPatternData = selectedOCRPatterns.map(id => ocrPatterns.find(p => p.id === id)).filter(Boolean)

      const fallbackContext = selectedPatternData.length > 0
        ? selectedPatternData[0]?.context.split(',')[0]
        : 'Limited Time'
      const fallbackDescription = selectedPatternData.length > 0
        ? `Perfect for ${selectedPatternData[0]?.context.toLowerCase()}`
        : `Discover the amazing ${selectedProductData[0]?.name}`

      setPopupHeadline(`${selectedProductData[0]?.name} - ${fallbackContext}`)
      setPopupCTA('Shop Now')
      setPopupDescription(fallbackDescription)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const handleApproveAndSchedule = async () => {
    if (!popupHeadline || selectedProducts.length === 0) {
      return
    }

    setIsGenerating(true)

    const selectedProductData = selectedProducts.map(id => availableProducts.find(p => p.id === id)).filter(Boolean)
    const selectedPatternData = selectedOCRPatterns.map(id => ocrPatterns.find(p => p.id === id)).filter(Boolean)

    // Prepare data for campaign generation API
    const campaignData = {
      product: selectedProductData[0], // Use first selected product
      strategy: {
        strategy: `Generate popup advertisement campaign for ${selectedProductData.map(p => p.name).join(', ')} with ${aspectRatio} aspect ratio`,
        primaryAudience: 'General audience',
        emailType: 'popup',
        customPrompt: `Headline: ${popupHeadline}\nDescription: ${popupDescription}\nCTA: ${popupCTA}\nShape: ${popupShape}\nAspect Ratio: ${aspectRatio}\nVisual Patterns: ${selectedPatternData.map(p => p.description).join(', ')}\nCustom Prompts: ${Object.entries(customPrompts).map(([id, prompt]) => `${selectedPatternData.find(p => p.id === id)?.description || id}: ${prompt}`).join('; ')}`
      },
      weeklySchedule: [{
        day: 'Today',
        time: new Date().toLocaleTimeString(),
        type: 'Popup Campaign',
        audience: 'All Segments',
        emailTheme: 'Interactive Popup'
      }]
    }

    try {
      // Generate campaign using the optimized Python API
      const response = await fetch('/api/campaign-generator/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate campaign')
      }

      const apiResponse = await response.json()
      const generatedCampaigns = apiResponse.cards || []

      // Transform to popup format
      const popupData = {
        id: `popup_${Date.now()}`,
        type: 'popup',
        products: selectedProductData,
        headline: popupHeadline,
        description: popupDescription,
        cta: popupCTA,
        shape: popupShape,
        aspectRatio: aspectRatio,
        visualPatterns: selectedPatternData,
        generatedCampaigns: generatedCampaigns,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      }

      if (onSchedulePopup) {
        onSchedulePopup(popupData)
      }

      alert('Popup campaign generated and scheduled successfully!')
    } catch (error) {
      console.error('Error generating campaign:', error)
      alert('Error generating campaign. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Popup Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Popup Campaign Builder</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Products → Design → Preview</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">🎨 Design Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex gap-3 h-[calc(100vh-200px)]">

        {/* Column 1: Product Selection */}
        <div className="w-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
              <Target className="h-4 w-4 mr-2 text-orange-600" />
              Products
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Choose for popup</p>
          </div>

          {/* Product Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all ${
                    selectedProducts.includes(product.id)
                      ? 'border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.brand} • ${product.price}</div>
                    </div>
                    {selectedProducts.includes(product.id) && (
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Popup Design */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-orange-600" />
              Popup Design
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customize your popup advertisement</p>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* AI Generate Button */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <Wand2 className="h-4 w-4 mr-2 text-purple-600" />
                    AI Content Generator
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Select a product (+ optional pattern), then click to auto-generate headline & CTA
                  </p>
                </div>
                <button
                  onClick={handleAIGenerate}
                  disabled={selectedProducts.length === 0 || isGeneratingContent}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center"
                >
                  <Wand2 className={`h-4 w-4 mr-2 ${isGeneratingContent ? 'animate-spin' : ''}`} />
                  {isGeneratingContent ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              {selectedProducts.length === 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  Select at least one product to enable AI generation
                </p>
              )}
              {selectedProducts.length > 0 && selectedOCRPatterns.length === 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  ✨ Product selected! Optionally select a pattern for enhanced generation
                </p>
              )}
            </div>

            {/* Popup Content Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Headline</label>
                <input
                  type="text"
                  placeholder="Enter compelling headline..."
                  value={popupHeadline}
                  onChange={(e) => setPopupHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Description</label>
                <textarea
                  placeholder="Enter description..."
                  value={popupDescription}
                  onChange={(e) => setPopupDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Call to Action</label>
                <input
                  type="text"
                  placeholder="e.g., Shop Now, Learn More..."
                  value={popupCTA}
                  onChange={(e) => setPopupCTA(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Popup Shape</label>
                <select
                  value={popupShape}
                  onChange={(e) => setPopupShape(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                  <option value="circle">Circle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Google Ads Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { ratio: '9:16', label: 'Vertical', desc: 'Stories/Feed' },
                    { ratio: '16:9', label: 'Horizontal', desc: 'Banner/Display' }
                  ].map(({ ratio, label, desc }) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        aspectRatio === ratio
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium">{label}</div>
                      <div className="text-xs opacity-75">{ratio}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {aspectRatio === '9:16' && 'Vertical format - perfect for mobile stories and feed ads'}
                  {aspectRatio === '16:9' && 'Horizontal format - ideal for display and banner ads'}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Live Preview</h4>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                <div
                  className={`bg-white dark:bg-gray-800 shadow-lg mx-auto transition-all duration-500 ease-in-out ${
                    popupShape === 'rounded' ? 'rounded-2xl' :
                    popupShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                  } ${
                    aspectRatio === '9:16' ? 'w-48' :
                    'w-96'
                  }`}
                  style={{
                    aspectRatio: aspectRatio === '9:16' ? '9/16' : '16/9'
                  }}
                >
                  <div className={`h-full flex flex-col justify-center ${
                    popupShape === 'circle' ? 'p-4' : 'p-6'
                  }`}>
                    <div className="text-center">
                      <div className={`font-bold text-gray-900 dark:text-white mb-2 ${
                        aspectRatio === '16:9' ? 'text-base' :
                        aspectRatio === '4:3' ? 'text-lg' : 'text-lg'
                      }`}>
                        {popupHeadline || 'Your Headline Here'}
                      </div>
                      <div className={`text-gray-600 dark:text-gray-400 mb-4 ${
                        aspectRatio === '16:9' ? 'text-xs' :
                        aspectRatio === '4:3' ? 'text-sm' : 'text-sm'
                      }`}>
                        {popupDescription || 'Your description will appear here...'}
                      </div>
                      <button className={`bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors ${
                        aspectRatio === '16:9' ? 'px-3 py-1 text-xs' :
                        aspectRatio === '4:3' ? 'px-4 py-2 text-sm' : 'px-4 py-2 text-sm'
                      }`}>
                        {popupCTA || 'Call to Action'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Indicator */}
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
                    {aspectRatio} • {
                      aspectRatio === '1:1' ? '320x320px' :
                      aspectRatio === '4:3' ? '320x240px' :
                      '384x216px'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: OCR Patterns */}
        <div className="w-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
              <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
              Patterns
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Visual insights</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {ocrPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`p-2 rounded-lg border transition-all ${
                    selectedOCRPatterns.includes(pattern.id)
                      ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex-1"
                      onClick={() => toggleOCRPattern(pattern.id)}
                    >
                      {pattern.description}
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {pattern.effectiveness}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{pattern.context}</div>
                  <div className="text-xs text-gray-500 italic mb-2">{pattern.example}</div>

                  {/* Custom Prompt Section */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    {customPrompts[pattern.id] ? (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border">
                          <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">Your Custom Prompt:</div>
                          {customPrompts[pattern.id]}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCreatePrompt(pattern.id)
                          }}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                        >
                          ✏️ Edit Prompt
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCreatePrompt(pattern.id)
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium flex items-center"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Create Custom Prompt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approve & Schedule Button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {popupHeadline && selectedProducts.length > 0 && (
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready to schedule!
                </div>
              )}
              <button
                onClick={handleApproveAndSchedule}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center font-medium shadow-lg"
                disabled={!popupHeadline || selectedProducts.length === 0 || isGenerating}
              >
                <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating Campaign...' : 'Approve & Schedule Popup'}
              </button>
              {(!popupHeadline || selectedProducts.length === 0) && !isGenerating && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {selectedProducts.length === 0 ? 'Select a product' : 'Add headline'} to continue
                </p>
              )}
              {isGenerating && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-center">
                  Creating your popup campaign with AI...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Prompt Editor Modal */}
      {showPromptEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Custom Prompt
              </h3>
              <button
                onClick={cancelPromptEditor}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Pattern: <span className="font-medium text-gray-900 dark:text-white">
                  {ocrPatterns.find(p => p.id === showPromptEditor)?.description}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {ocrPatterns.find(p => p.id === showPromptEditor)?.context}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Custom Prompt for this Pattern
              </label>
              <textarea
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                placeholder="Describe how you want this visual pattern to be used in your popup ad... (e.g., 'Show the iPhone being used while jogging in a city park at sunset, emphasizing health and lifestyle features')"
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-sm"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Be specific about the setting, mood, and product usage you want to convey
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelPromptEditor}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomPrompt}
                disabled={!tempPrompt.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}