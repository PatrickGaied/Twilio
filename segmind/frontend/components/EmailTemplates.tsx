import { useState } from 'react'
import { Mail, Eye, Edit, Copy, Zap, Image, Type, Square, Circle } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  type: 'promotional' | 'welcome' | 'cart_abandonment' | 'loyalty' | 'product_launch'
  preview: string
  blocks: TemplateBlock[]
  thumbnail: string
}

interface TemplateBlock {
  id: string
  type: 'header' | 'text' | 'image' | 'button' | 'spacer' | 'product' | 'social'
  content: any
  styles?: any
}

interface EmailTemplatesProps {
  segmentName?: string
  productName?: string
  onSelectTemplate?: (template: EmailTemplate) => void
}

export default function EmailTemplates({ segmentName, productName, onSelectTemplate }: EmailTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Mock templates with placeholder blocks
  const templates: EmailTemplate[] = [
    {
      id: 'template_1',
      name: 'Product Spotlight',
      type: 'promotional',
      preview: 'Perfect for highlighting specific products to targeted segments',
      thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Product+Spotlight',
      blocks: [
        {
          id: 'header_1',
          type: 'header',
          content: {
            title: `Exclusive for ${segmentName || 'Our Valued Customers'}`,
            subtitle: `${productName || 'Amazing Product'} - Limited Time Offer`,
            backgroundColor: '#8B5CF6',
            textColor: '#FFFFFF'
          }
        },
        {
          id: 'image_1',
          type: 'image',
          content: {
            src: 'https://via.placeholder.com/600x300/3B82F6/FFFFFF?text=Product+Image',
            alt: productName || 'Product Image',
            link: '#shop-now'
          }
        },
        {
          id: 'text_1',
          type: 'text',
          content: {
            html: `<h2>🎯 Hand-picked just for you!</h2><p>Based on your preferences as a <strong>${segmentName || 'valued customer'}</strong>, we think you'll love this exclusive offer on ${productName || 'our premium product'}.</p>`
          }
        },
        {
          id: 'button_1',
          type: 'button',
          content: {
            text: 'Shop Now - 25% OFF',
            link: '#shop-now',
            backgroundColor: '#EF4444',
            textColor: '#FFFFFF'
          }
        }
      ]
    },
    {
      id: 'template_2',
      name: 'Welcome Series',
      type: 'welcome',
      preview: 'Perfect for onboarding new customers',
      thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Welcome+Series',
      blocks: [
        {
          id: 'header_2',
          type: 'header',
          content: {
            title: 'Welcome to Segmind!',
            subtitle: 'We\'re excited to have you join our community',
            backgroundColor: '#10B981',
            textColor: '#FFFFFF'
          }
        },
        {
          id: 'text_2',
          type: 'text',
          content: {
            html: '<h2>🎉 Your journey starts here</h2><p>Get ready to discover personalized recommendations, exclusive deals, and premium products tailored just for you.</p>'
          }
        },
        {
          id: 'product_1',
          type: 'product',
          content: {
            title: 'Trending Now',
            products: [
              { name: 'iPhone 15 Pro', price: '$1199', image: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=iPhone' },
              { name: 'MacBook Air', price: '$1299', image: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=MacBook' },
              { name: 'AirPods Pro', price: '$249', image: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=AirPods' }
            ]
          }
        }
      ]
    },
    {
      id: 'template_3',
      name: 'Cart Recovery',
      type: 'cart_abandonment',
      preview: 'Win back customers who left items in their cart',
      thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Cart+Recovery',
      blocks: [
        {
          id: 'header_3',
          type: 'header',
          content: {
            title: 'Don\'t forget your items!',
            subtitle: 'Your cart is waiting for you',
            backgroundColor: '#F59E0B',
            textColor: '#FFFFFF'
          }
        },
        {
          id: 'text_3',
          type: 'text',
          content: {
            html: '<h2>🛒 Still thinking about it?</h2><p>We saved your items! Complete your purchase now and get <strong>free shipping</strong> + an exclusive 10% discount.</p>'
          }
        },
        {
          id: 'spacer_1',
          type: 'spacer',
          content: { height: 20 }
        },
        {
          id: 'button_2',
          type: 'button',
          content: {
            text: 'Complete Purchase',
            link: '#checkout',
            backgroundColor: '#10B981',
            textColor: '#FFFFFF'
          }
        }
      ]
    }
  ]

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'promotional': return <Zap className="h-4 w-4" />
      case 'welcome': return <Mail className="h-4 w-4" />
      case 'cart_abandonment': return <Copy className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'promotional': return 'text-purple-600'
      case 'welcome': return 'text-green-600'
      case 'cart_abandonment': return 'text-orange-600'
      default: return 'text-blue-600'
    }
  }

  const renderBlockPreview = (block: TemplateBlock) => {
    switch (block.type) {
      case 'header':
        return (
          <div
            className="p-6 text-center rounded-lg mb-4"
            style={{
              backgroundColor: block.content.backgroundColor,
              color: block.content.textColor
            }}
          >
            <h1 className="text-2xl font-bold mb-2">{block.content.title}</h1>
            <p className="text-lg opacity-90">{block.content.subtitle}</p>
          </div>
        )

      case 'text':
        return (
          <div
            className="p-4 mb-4"
            dangerouslySetInnerHTML={{ __html: block.content.html }}
          />
        )

      case 'image':
        return (
          <div className="mb-4">
            <img
              src={block.content.src}
              alt={block.content.alt}
              className="w-full rounded-lg"
            />
          </div>
        )

      case 'button':
        return (
          <div className="text-center mb-4">
            <button
              className="px-8 py-3 rounded-lg font-semibold text-lg"
              style={{
                backgroundColor: block.content.backgroundColor,
                color: block.content.textColor
              }}
            >
              {block.content.text}
            </button>
          </div>
        )

      case 'product':
        return (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">{block.content.title}</h3>
            <div className="grid grid-cols-3 gap-4">
              {block.content.products.map((product: any, index: number) => (
                <div key={index} className="text-center">
                  <img src={product.image} alt={product.name} className="w-full rounded-lg mb-2" />
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-green-600 font-bold">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'spacer':
        return <div style={{ height: block.content.height }} className="mb-4" />

      default:
        return null
    }
  }

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Templates</h3>
        <p className="text-gray-600 dark:text-gray-400">Choose a template and customize it for your campaign</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={getTemplateColor(template.type)}>
                  {getTemplateIcon(template.type)}
                </span>
                <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.preview}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  {template.blocks.length} blocks
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTemplate(template)
                    setShowPreview(true)
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Block Editor */}
      {selectedTemplate && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customize: {selectedTemplate.name}
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-ghost text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button className="btn-secondary text-sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit Blocks
              </button>
            </div>
          </div>

          {/* Block List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Template Blocks</h5>
              <div className="space-y-2">
                {selectedTemplate.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {block.type === 'header' && <Type className="h-4 w-4 text-blue-600" />}
                      {block.type === 'text' && <Type className="h-4 w-4 text-gray-600" />}
                      {block.type === 'image' && <Image className="h-4 w-4 text-green-600" />}
                      {block.type === 'button' && <Square className="h-4 w-4 text-purple-600" />}
                      {block.type === 'spacer' && <Circle className="h-4 w-4 text-gray-400" />}
                      {block.type === 'product' && <Copy className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {block.type.replace('_', ' ')} Block
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {block.type === 'header' && 'Header with title and subtitle'}
                        {block.type === 'text' && 'Rich text content'}
                        {block.type === 'image' && 'Product or hero image'}
                        {block.type === 'button' && 'Call-to-action button'}
                        {block.type === 'spacer' && 'Spacing element'}
                        {block.type === 'product' && 'Product showcase grid'}
                      </p>
                    </div>
                    <span className="text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">Live Preview</h5>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-96 overflow-y-auto">
                  {selectedTemplate.blocks.map((block) => (
                    <div key={block.id}>
                      {renderBlockPreview(block)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              💡 Tip: Blocks will be generated dynamically with AI when nano banana is integrated
            </div>
            <button className="btn-primary">
              Use This Template
            </button>
          </div>
        </div>
      )}
    </div>
  )
}