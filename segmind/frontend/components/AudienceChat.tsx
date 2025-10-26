import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Users, Target, MessageCircle, Sparkles } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  highlightedSegments?: string[]
  highlightedProducts?: string[]
  recommendations?: string[]
}

interface AudienceChatProps {
  pageData?: any
}

export default function AudienceChat({ pageData }: AudienceChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your audience insights assistant. Ask me about any of the customer segments or products you see on the right to get detailed insights and recommendations.

What would you like to know about your audience?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/audience-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputMessage,
          context: pageData || {}
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.answer,
          sender: 'bot',
          timestamp: new Date(),
          highlightedSegments: data.highlighted_segments || [],
          highlightedProducts: data.highlighted_products || [],
          recommendations: data.recommendations || []
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error(data.detail || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try asking your question again.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const renderHighlightedContent = (content: string, segments: string[] = [], products: string[] = []) => {
    let highlightedContent = content

    // Convert basic markdown formatting
    highlightedContent = highlightedContent
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')
      .replace(/^- (.*?)$/gm, '<div class="flex items-start mt-1"><span class="text-gray-600 dark:text-gray-400 mr-2">•</span><span class="text-gray-800 dark:text-gray-200">$1</span></div>')

    // Highlight customer segments
    segments.forEach(segment => {
      const regex = new RegExp(`\\b${segment}\\b`, 'gi')
      highlightedContent = highlightedContent.replace(regex,
        `<span class="font-medium text-blue-600 dark:text-blue-400">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
${segment}
        </span>`
      )
    })

    // Highlight products
    products.forEach(product => {
      const regex = new RegExp(`\\b${product}\\b`, 'gi')
      highlightedContent = highlightedContent.replace(regex,
        `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mx-1">
            <path fill-rule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" clip-rule="evenodd"></path>
          ${product}
        </span>`
      )
    })

    return highlightedContent
  }


  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

  return (
    <div className="flex gap-6 h-[800px]">
      {/* Chat Interface - Left Side */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Audience Insights Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ask questions about your customer segments and products</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>Live Data</span>
          </div>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'user'
                ? 'bg-purple-600'
                : 'bg-gradient-to-br from-purple-500 to-blue-600'
            }`}>
              {message.sender === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>

            <div className={`flex-1 ${
              message.sender === 'user' ? 'text-right' : ''
            }`}>
              <div className={`inline-block max-w-[85%] p-4 rounded-2xl shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-purple-200 dark:shadow-purple-900/50'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-gray-100 dark:shadow-gray-900/50'
              }`}>
                {message.sender === 'bot' ? (
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100"
                    dangerouslySetInnerHTML={{
                      __html: renderHighlightedContent(
                        message.content,
                        [],
                        []
                      )
                    }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                )}
              </div>


              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isMounted ? formatTime(message.timestamp) : ''}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Analyzing your audience data...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>


      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your audience: 'Who are my High Converters?' or 'iPhone audience insights'"
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      </div>

      {/* Right Sidebar - Segments & Products */}
      <div className="w-80 space-y-6">
        {/* Customer Segments Overview */}
        {pageData?.segmentData && pageData.segmentData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Customer Segments
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">Click to target</div>
            </div>

            <div className="space-y-3">
              {pageData.segmentData.map((segment: any, index: number) => (
                <div
                  key={segment.name}
                  className="group p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-purple-200 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {segment.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{segment.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{segment.count.toLocaleString()} customers</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${segment.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{segment.percentage}%</p>
                      <div
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mt-1"
                        style={{
                          backgroundColor: `${COLORS[index % COLORS.length]}20`,
                          borderColor: COLORS[index % COLORS.length],
                          color: COLORS[index % COLORS.length],
                          border: '1px solid'
                        }}
                      >
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Products Overview */}
        {pageData?.topProducts && pageData.topProducts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-600" />
                Top Products
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">Click to target</div>
            </div>

            <div className="space-y-3">
              {pageData.topProducts.slice(0, 6).map((product: any, index: number) => (
                <div
                  key={product.product_id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 font-bold text-xs mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{product.brand}</p>
                    <p className="text-xs font-medium text-green-600">${product.revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{product.top_segment}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">${product.avg_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}