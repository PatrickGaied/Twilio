import { useState } from 'react'
import { Sparkles, RefreshCw, Download, Eye, Image } from 'lucide-react'

interface ImageGeneratorProps {
  product: string
  brand: string
  audience?: string
  onImageGenerated?: (imageUrl: string) => void
  className?: string
}

export default function ImageGenerator({
  product,
  brand,
  audience,
  onImageGenerated,
  className = ''
}: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [selectedType, setSelectedType] = useState('popup_featured')
  const [error, setError] = useState<string | null>(null)

  const styleOptions = [
    { value: 'modern', label: 'Modern', description: 'Clean, contemporary design' },
    { value: 'premium', label: 'Premium', description: 'Luxury, high-end aesthetic' },
    { value: 'playful', label: 'Playful', description: 'Colorful and energetic' },
    { value: 'minimal', label: 'Minimal', description: 'Simple with lots of white space' },
    { value: 'dramatic', label: 'Dramatic', description: 'Bold lighting and contrast' }
  ]

  const typeOptions = [
    { value: 'popup_featured', label: 'Popup Featured', description: 'Optimized for popup ads' },
    { value: 'product_showcase', label: 'Product Showcase', description: 'Professional product photography' },
    { value: 'lifestyle', label: 'Lifestyle', description: 'Person using the product' },
    { value: 'hero_banner', label: 'Hero Banner', description: 'Wide banner composition' },
    { value: 'social_media', label: 'Social Media', description: 'Square format for social' }
  ]

  const generateImage = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          brand,
          style: selectedStyle,
          type: selectedType,
          audience,
          campaign_type: 'popup'
        }),
      })

      const data = await response.json()

      if (data.success && data.imageUrl) {
        const newImages = [data.imageUrl, ...generatedImages.slice(0, 2)] // Keep last 3 images
        setGeneratedImages(newImages)

        if (onImageGenerated) {
          onImageGenerated(data.imageUrl)
        }
      } else {
        setError(data.error || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Image generation error:', error)
      setError('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${product.replace(/\s+/g, '-').toLowerCase()}-${selectedStyle}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Image className="h-5 w-5 mr-2 text-purple-600" />
          AI Image Generator
        </h3>
        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
          DALL-E Powered
        </span>
      </div>

      <div className="space-y-4">
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Visual Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styleOptions.map((style) => (
              <button
                key={style.value}
                onClick={() => setSelectedStyle(style.value)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  selectedStyle === style.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {style.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {style.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {typeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>

        {/* Product Preview */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Generating for:</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {brand} {product}
            {audience && <span className="text-purple-600"> → {audience}</span>}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating Image...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate AI Image</span>
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Images
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {generatedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={`Generated ${product} image ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      // Remove failed images from the list
                      setGeneratedImages(prev => prev.filter((_, i) => i !== index))
                    }}
                  />

                  {/* Image Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onImageGenerated && onImageGenerated(imageUrl)}
                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Use this image"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadImage(imageUrl)}
                        className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Download image"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Latest Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Latest
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            💡 Pro Tips
          </h5>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Modern style works best for tech products</li>
            <li>• Premium style enhances luxury brand perception</li>
            <li>• Lifestyle images increase emotional connection</li>
            <li>• Images may take 30-60 seconds to generate</li>
          </ul>
        </div>
      </div>
    </div>
  )
}