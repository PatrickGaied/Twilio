import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Calendar, CalendarDays, Clock, Target, Users, TrendingUp, Zap, Edit, Trash2, Play, Pause, MoreVertical, Wand2 } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import CampaignGenerationModal from '../components/CampaignGenerationModal'

interface Campaign {
  id: string
  name: string
  brand: string
  products: string[]
  tone: string
  segment: string
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
  scheduled_date: string
  created_at: string
  description: string
  performance?: {
    sent: number
    opened: number
    clicked: number
    converted: number
  }
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [showGenerationModal, setShowGenerationModal] = useState(false)

  useEffect(() => {
    // Load campaigns from localStorage or API
    loadCampaigns()
  }, [])

  useEffect(() => {
    // Auto-generate campaigns if none exist
    if (campaigns.length === 0) {
      generateSmartCampaigns()
    }
  }, [campaigns.length])

  const loadCampaigns = () => {
    try {
      const savedCampaigns = localStorage.getItem('segmind_campaigns')
      if (savedCampaigns) {
        const parsed = JSON.parse(savedCampaigns)
        setCampaigns(parsed)
        // If we have very few campaigns, generate more
        if (parsed.length < 5) {
          generateSmartCampaigns()
        }
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
      generateSmartCampaigns()
    }
  }

  // Insights data for AI generation
  const getInsightsData = () => [
    {
      product: 'iPhone 15 Pro',
      segment: 'High Converters',
      affinity_score: 92,
      conversion_rate: 28.4,
      revenue: 487650,
      sales_count: 342,
      insight: 'High Converters show exceptional affinity for premium Apple products',
      recommendation: 'Create premium positioning campaigns emphasizing exclusivity and advanced features'
    },
    {
      product: 'Samsung Galaxy S24',
      segment: 'Loyal Customers',
      affinity_score: 87,
      conversion_rate: 23.1,
      revenue: 298420,
      sales_count: 256,
      insight: 'Loyal Customers prefer Samsung for repeat purchases and upgrades',
      recommendation: 'Highlight upgrade benefits and loyalty rewards in campaigns'
    },
    {
      product: 'MacBook Air M3',
      segment: 'High Converters',
      affinity_score: 89,
      conversion_rate: 31.2,
      revenue: 623150,
      sales_count: 289,
      insight: 'Professional-grade products resonate strongly with high-value customers',
      recommendation: 'Focus on productivity and professional use cases in messaging'
    },
    {
      product: 'AirPods Pro',
      segment: 'Window Shoppers',
      affinity_score: 76,
      conversion_rate: 12.8,
      revenue: 156830,
      sales_count: 478,
      insight: 'Entry-level premium accessories attract browsing customers',
      recommendation: 'Use bundle offers and time-limited promotions to drive conversion'
    },
    {
      product: 'iPad Pro',
      segment: 'Creative Professionals',
      affinity_score: 94,
      conversion_rate: 34.7,
      revenue: 445720,
      sales_count: 187,
      insight: 'Creative segment shows highest affinity for professional tablets',
      recommendation: 'Showcase creative workflows and professional tools integration'
    }
  ]

  const generateSmartCampaigns = async () => {
    try {
      const insights = getInsightsData()

      const response = await fetch('/api/generate-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insights,
          timeframe: 'month'
        }),
      })

      const data = await response.json()

      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns)
        localStorage.setItem('segmind_campaigns', JSON.stringify(data.campaigns))
      } else {
        console.error('Failed to generate campaigns:', data.error)
        setSampleCampaigns()
      }
    } catch (error) {
      console.error('Error generating smart campaigns:', error)
      setSampleCampaigns()
    }
  }

  const setSampleCampaigns = () => {
    const sampleCampaigns: Campaign[] = [
      {
        id: "camp_1",
        name: "iPhone 15 Pro Launch Promo",
        brand: "Apple",
        products: ["iPhone 15 Pro"],
        tone: "Educational & Informative",
        segment: "High Converters",
        status: "active",
        scheduled_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        description: "Promote iPhone 15 Pro with 20% discount for high-converting customers",
        performance: {
          sent: 2847,
          opened: 1423,
          clicked: 341,
          converted: 97
        }
      },
      {
        id: "camp_2",
        name: "MacBook Pro M3 Upgrade Campaign",
        brand: "Apple",
        products: ["MacBook Pro M3"],
        tone: "Premium & Exclusive",
        segment: "Creative Professionals",
        status: "scheduled",
        scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        created_at: new Date().toISOString(),
        description: "Exclusive MacBook Pro M3 upgrade offer for creative professionals"
      },
      {
        id: "camp_3",
        name: "AirPods Bundle Deal",
        brand: "Apple",
        products: ["AirPods Max", "iPhone 15 Pro"],
        tone: "Urgent & Limited",
        segment: "Window Shoppers",
        status: "draft",
        scheduled_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        created_at: new Date().toISOString(),
        description: "Limited time bundle: AirPods Max + iPhone 15 Pro with special pricing"
      }
    ]
    setCampaigns(sampleCampaigns)
    localStorage.setItem('segmind_campaigns', JSON.stringify(sampleCampaigns))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />
      case 'scheduled': return <Clock className="h-3 w-3" />
      case 'draft': return <Edit className="h-3 w-3" />
      case 'completed': return <Target className="h-3 w-3" />
      case 'paused': return <Pause className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getCampaignsForDate = (date: string) => {
    return campaigns.filter(campaign =>
      campaign.scheduled_date.split('T')[0] === date
    )
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateString = date.toISOString().split('T')[0]
      days.push({
        day,
        date: dateString,
        campaigns: getCampaignsForDate(dateString)
      })
    }

    return days
  }

  return (
    <>
      <Head>
        <title>Campaigns - Segmind</title>
        <meta name="description" content="Manage and track your marketing campaigns" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold brand-text">Segmind</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Customer Messaging & Analytics Platform</p>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <nav className="flex items-center space-x-1">
                  <a href="/" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a href="/segments" className="nav-item dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Users className="h-4 w-4" />
                    <span>Segments</span>
                  </a>
                  <a href="/campaigns" className="nav-item active dark:text-purple-400 dark:bg-purple-900/20">
                    <Calendar className="h-4 w-4" />
                    <span>Campaigns</span>
                  </a>
                </nav>

                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden flex items-center space-x-3">
                <ThemeToggle />
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <line x1="4" x2="20" y1="12" y2="12"></line>
                    <line x1="4" x2="20" y1="6" y2="6"></line>
                    <line x1="4" x2="20" y1="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-purple-600" />
                Campaigns
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track and manage your marketing campaigns
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === 'calendar'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mr-2 inline" />
                  Calendar
                </button>
                <button
                  onClick={() => setSelectedView('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === 'list'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>

              <button
                onClick={() => setShowGenerationModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Wand2 className="h-4 w-4" />
                <span>AI Generate</span>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('segmind_campaigns')
                  generateSmartCampaigns()
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Quick Refresh</span>
              </button>

              <a
                href="/campaign/create"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Create Campaign</span>
              </a>
            </div>
          </div>

          {selectedView === 'calendar' ? (
            /* Calendar View */
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Scheduled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>Draft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-px mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-px">
                  {generateCalendarDays().map((dayData, index) => (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-100 dark:border-gray-700 rounded-lg ${
                        dayData ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''
                      }`}
                    >
                      {dayData && (
                        <>
                          <div className={`text-sm font-medium mb-2 ${
                            dayData.date === new Date().toISOString().split('T')[0]
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {dayData.day}
                          </div>

                          <div className="space-y-1">
                            {dayData.campaigns.slice(0, 2).map(campaign => (
                              <div
                                key={campaign.id}
                                className={`text-xs p-2 rounded-md ${getStatusColor(campaign.status)} truncate`}
                              >
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(campaign.status)}
                                  <span className="font-medium">{campaign.name}</span>
                                </div>
                                <div className="text-xs opacity-75 mt-1">
                                  {campaign.products.join(', ')}
                                </div>
                              </div>
                            ))}

                            {dayData.campaigns.length > 2 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 p-1">
                                +{dayData.campaigns.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {campaign.brand.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{campaign.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{campaign.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Products</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {campaign.products.join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Segment</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.segment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Scheduled</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(campaign.scheduled_date)} at {formatTime(campaign.scheduled_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tone</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.tone}</p>
                        </div>
                      </div>

                      {campaign.performance && (
                        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.performance.sent.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{campaign.performance.opened.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Opened</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{campaign.performance.clicked.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Clicked</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{campaign.performance.converted}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Converted</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">{campaign.status}</span>
                      </div>

                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Campaign Generation Modal */}
        <CampaignGenerationModal
          isOpen={showGenerationModal}
          onClose={() => setShowGenerationModal(false)}
          onGenerate={(newCampaigns) => {
            setCampaigns(newCampaigns)
            localStorage.setItem('segmind_campaigns', JSON.stringify(newCampaigns))
          }}
          insights={getInsightsData()}
        />
      </div>
    </>
  )
}