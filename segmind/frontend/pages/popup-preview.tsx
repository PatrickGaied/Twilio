import { useState, useEffect } from 'react'
import Head from 'next/head'
import { ArrowLeft, Eye, Settings, Code, Download, Share2, Smartphone, Monitor, Tablet, Zap, Clock, Target, Users } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

interface PopupConfig {
  brand: string
  product: string
  audience: string
  timing: string
  device: string
  customPrompt: string
  insights: any
}

interface GeneratedPopup {
  id: string
  headline: string
  content: string
  cta: string
  backgroundColor: string
  textColor: string
  ctaColor: string
  imageUrl?: string
}

export default function PopupPreview() {
  const [config, setConfig] = useState<PopupConfig | null>(null)
  const [generatedPopup, setGeneratedPopup] = useState<GeneratedPopup | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop')
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('popupAdConfig')
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      setConfig(parsedConfig)
      generatePopupContent(parsedConfig)
    }
  }, [])

  const generatePopupContent = async (configuration: PopupConfig) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-popup-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: configuration.product,
          audience: configuration.audience,
          customPrompt: configuration.customPrompt,
          timing: configuration.timing,
          device: configuration.device,
          brand: configuration.brand
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedPopup(data.popup)
      } else {
        // Fallback content
        setGeneratedPopup({
          id: 'popup_' + Date.now(),
          headline: `Special ${configuration.product} Offer!`,
          content: `Exclusive deal for ${configuration.audience}. Don't miss out on this limited-time opportunity to get the ${configuration.product} at an amazing price.`,
          cta: 'Shop Now',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          ctaColor: '#f97316'
        })
      }
    } catch (error) {
      console.error('Error generating popup:', error)
      // Fallback content
      setGeneratedPopup({
        id: 'popup_' + Date.now(),
        headline: `Special ${configuration?.product} Offer!`,
        content: `Exclusive deal for ${configuration?.audience}. Don't miss out on this limited-time opportunity to get the ${configuration?.product} at an amazing price.`,
        cta: 'Shop Now',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        ctaColor: '#f97316'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getDeviceFrameClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-[640px]'
      case 'tablet':
        return 'w-[480px] h-[640px]'
      case 'desktop':
      default:
        return 'w-[800px] h-[500px]'
    }
  }

  const getPopupSizeClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-72 max-w-sm p-4'
      case 'tablet':
        return 'w-80 max-w-md p-5'
      case 'desktop':
      default:
        return 'w-96 max-w-lg p-6'
    }
  }

  const generateCode = () => {
    if (!generatedPopup || !config) return ''

    const imageHtml = generatedPopup.imageUrl
      ? `      <div class="mb-4">
        <img src="${generatedPopup.imageUrl}" alt="${config.product} promotional image" class="w-32 h-32 mx-auto rounded-lg object-cover shadow-md" />
      </div>`
      : ''

    return `<!-- Popup Ad Code -->
<div id="popup-ad-${generatedPopup.id}" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;">
  <div class="bg-white rounded-lg shadow-xl ${getPopupSizeClass()}" style="background-color: ${generatedPopup.backgroundColor}; color: ${generatedPopup.textColor};">
    <div class="text-center">
${imageHtml}      <h2 class="text-xl font-bold mb-3">${generatedPopup.headline}</h2>
      <p class="text-gray-600 mb-4">${generatedPopup.content}</p>
      <button class="px-6 py-3 rounded-lg font-semibold text-white" style="background-color: ${generatedPopup.ctaColor};">
        ${generatedPopup.cta}
      </button>
    </div>
    <button onclick="document.getElementById('popup-ad-${generatedPopup.id}').style.display='none'" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
      ×
    </button>
  </div>
</div>

<script>
// Show popup based on timing: ${config.timing}
${config.timing === 'immediate' ? `
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('popup-ad-${generatedPopup.id}').style.display = 'flex';
  });
` : config.timing === 'delayed_5' ? `
  setTimeout(function() {
    document.getElementById('popup-ad-${generatedPopup.id}').style.display = 'flex';
  }, 5000);
` : `
  // Exit intent detection
  let exitIntentShown = false;
  document.addEventListener('mouseleave', function() {
    if (!exitIntentShown && event.clientY <= 0) {
      document.getElementById('popup-ad-${generatedPopup.id}').style.display = 'flex';
      exitIntentShown = true;
    }
  });
`}
</script>`
  }

  const downloadCode = () => {
    const code = generateCode()
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `popup-ad-${config?.product?.replace(/\s+/g, '-').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deployPopup = () => {
    if (generatedPopup && config) {
      // Store in localStorage for deployed popups
      const deployedPopups = JSON.parse(localStorage.getItem('deployedPopups') || '[]')
      deployedPopups.push({
        ...generatedPopup,
        config,
        deployedAt: new Date().toISOString(),
        status: 'active'
      })
      localStorage.setItem('deployedPopups', JSON.stringify(deployedPopups))

      alert('Popup ad deployed successfully!')
      window.location.href = '/'
    }
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No popup configuration found</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Popup Preview - {config.product}</title>
        <meta name="description" content="Preview your popup ad" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Popup Preview: {config.product}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuration
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Brand</label>
                    <p className="text-gray-900 dark:text-white">{config.brand}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Product</label>
                    <p className="text-gray-900 dark:text-white">{config.product}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Target Audience
                    </label>
                    <p className="text-gray-900 dark:text-white">{config.audience || 'All Visitors'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Timing
                    </label>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {config.timing.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Device Target
                    </label>
                    <p className="text-gray-900 dark:text-white capitalize">{config.device}</p>
                  </div>
                </div>
              </div>

              {/* Performance Prediction */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Prediction
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Expected CTR</span>
                    <span className="font-medium text-green-600">{Math.floor(Math.random() * 8 + 12)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                    <span className="font-medium text-blue-600">{Math.floor(Math.random() * 5 + 8)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Score</span>
                    <span className="font-medium text-purple-600">{Math.floor(Math.random() * 20 + 75)}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Live Preview
                  </h3>

                  {/* Device Selector */}
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {[
                      { key: 'desktop', icon: Monitor, label: 'Desktop' },
                      { key: 'tablet', icon: Tablet, label: 'Tablet' },
                      { key: 'mobile', icon: Smartphone, label: 'Mobile' }
                    ].map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => setPreviewDevice(key as any)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                          previewDevice === key
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Device Frame */}
                <div className="flex justify-center">
                  <div className={`${getDeviceFrameClass()} bg-gray-100 dark:bg-gray-700 rounded-lg relative overflow-hidden border-8 border-gray-300 dark:border-gray-600`}>
                    {/* Mock website background */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8">
                      <div className="w-full h-8 bg-white dark:bg-gray-700 rounded mb-4"></div>
                      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-white dark:bg-gray-700 rounded"></div>
                        <div className="h-32 bg-white dark:bg-gray-700 rounded"></div>
                      </div>

                      {/* Popup Overlay */}
                      {generatedPopup && !isGenerating && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div
                            className={`${getPopupSizeClass()} rounded-lg shadow-2xl relative`}
                            style={{
                              backgroundColor: generatedPopup.backgroundColor,
                              color: generatedPopup.textColor
                            }}
                          >
                            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">
                              ×
                            </button>

                            <div className="text-center">
                              {/* Product Image */}
                              {generatedPopup.imageUrl && (
                                <div className="mb-4">
                                  <img
                                    src={generatedPopup.imageUrl}
                                    alt={`${config.product} promotional image`}
                                    className="w-32 h-32 mx-auto rounded-lg object-cover shadow-md"
                                    onError={(e) => {
                                      // Hide image if it fails to load
                                      (e.target as HTMLElement).style.display = 'none'
                                    }}
                                  />
                                </div>
                              )}

                              <h2 className="text-xl font-bold mb-3">
                                {generatedPopup.headline}
                              </h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                {generatedPopup.content}
                              </p>
                              <button
                                className="px-6 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
                                style={{ backgroundColor: generatedPopup.ctaColor }}
                              >
                                {generatedPopup.cta}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loading State */}
                      {isGenerating && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Generating your popup...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Code className="h-4 w-4" />
                    <span>{showCode ? 'Hide' : 'Show'} Code</span>
                  </button>

                  <button
                    onClick={downloadCode}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={deployPopup}
                    className="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Deploy Popup</span>
                  </button>
                </div>

                {/* Code Display */}
                {showCode && generatedPopup && (
                  <div className="mt-6 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{generateCode()}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}