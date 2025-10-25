import { useState } from 'react'
import { X, Plus, Calendar, Mail, Clock, Users, Link, FileText, Download, Eye } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  date: string
  time: string
  email: string
  link: string
  status: 'scheduled' | 'sent' | 'draft'
  segment: string
  products: string[]
}

interface CampaignCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts?: string[]
  segmentName?: string
  initialCampaign?: string
}

export default function CampaignCalendarModal({
  isOpen,
  onClose,
  selectedProducts = [],
  segmentName = '',
  initialCampaign = ''
}: CampaignCalendarModalProps) {
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('list')
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro Launch Campaign',
      date: '2024-01-15',
      time: '09:00',
      email: 'premium-launch@segmind.com',
      link: 'https://segmind.com/campaigns/iphone15-launch',
      status: 'scheduled',
      segment: 'High Converters',
      products: ['iPhone 15 Pro', 'iPhone 15 Pro Max']
    },
    {
      id: '2',
      name: 'Similar Products Cross-sell',
      date: '2024-01-16',
      time: '14:30',
      email: 'crosssell@segmind.com',
      link: 'https://segmind.com/campaigns/similar-products',
      status: 'draft',
      segment: 'High Converters',
      products: ['MacBook Pro M3', 'iPad Pro 12.9"']
    },
    {
      id: '3',
      name: 'Weekend Bundle Offer',
      date: '2024-01-19',
      time: '10:00',
      email: 'weekend-deals@segmind.com',
      link: 'https://segmind.com/campaigns/weekend-bundle',
      status: 'scheduled',
      segment: 'Loyal Customers',
      products: ['AirPods Max', 'Apple Watch Ultra']
    }
  ])

  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: initialCampaign || `${selectedProducts.join(', ')} Campaign`,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    email: 'campaign@segmind.com',
    link: '',
    status: 'draft',
    segment: segmentName,
    products: selectedProducts
  })

  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const addCampaign = () => {
    if (newCampaign.name && newCampaign.date && newCampaign.time) {
      const campaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaign.name!,
        date: newCampaign.date!,
        time: newCampaign.time!,
        email: newCampaign.email || 'campaign@segmind.com',
        link: newCampaign.link || `https://segmind.com/campaigns/${newCampaign.name?.toLowerCase().replace(/\s+/g, '-')}`,
        status: 'draft',
        segment: newCampaign.segment || segmentName,
        products: newCampaign.products || selectedProducts
      }
      setCampaigns([...campaigns, campaign])
      setShowNewCampaignForm(false)
      setNewCampaign({
        name: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        email: 'campaign@segmind.com',
        link: '',
        status: 'draft',
        segment: segmentName,
        products: selectedProducts
      })
    }
  }

  const getNextWeekDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getWeekdayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getCampaignsForDate = (dateString: string) => {
    return campaigns.filter(campaign => campaign.date === dateString)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Calendar</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedProducts.length > 0 && `Including ${selectedProducts.length} similar products`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'list'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2 inline" />
                  List View
                </button>
                <button
                  onClick={() => setActiveView('calendar')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'calendar'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  Calendar View
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {activeView === 'list' ? (
            /* Excel-like List View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Schedule</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowNewCampaignForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Campaign</span>
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* New Campaign Form */}
              {showNewCampaignForm && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Create New Campaign</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Name</label>
                      <input
                        type="text"
                        value={newCampaign.name || ''}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter campaign name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                      <input
                        type="date"
                        value={newCampaign.date || ''}
                        onChange={(e) => setNewCampaign({...newCampaign, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                      <input
                        type="time"
                        value={newCampaign.time || ''}
                        onChange={(e) => setNewCampaign({...newCampaign, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={newCampaign.email || ''}
                        onChange={(e) => setNewCampaign({...newCampaign, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="campaign@segmind.com"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setShowNewCampaignForm(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addCampaign}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Campaign
                    </button>
                  </div>
                </div>
              )}

              {/* Excel-like Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Link</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.segment}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(campaign.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {campaign.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {campaign.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a href={campaign.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1">
                              <span className="truncate max-w-32">{campaign.link}</span>
                              <Link className="h-3 w-3" />
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {campaign.products.slice(0, 2).join(', ')}
                              {campaign.products.length > 2 && (
                                <span className="text-gray-500 dark:text-gray-400"> +{campaign.products.length - 2} more</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                <Mail className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Calendar View */
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next 7 Days</h3>
              <div className="grid grid-cols-7 gap-4">
                {getNextWeekDates().map((date, index) => {
                  const dateString = getDateString(date)
                  const daysCampaigns = getCampaignsForDate(dateString)

                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 min-h-48">
                      <div className="text-center mb-3">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{getWeekdayName(date)}</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{date.getDate()}</div>
                      </div>

                      <div className="space-y-2">
                        {daysCampaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2 border-l-4 border-purple-500"
                          >
                            <div className="text-xs font-medium text-purple-800 dark:text-purple-200 truncate">
                              {campaign.name}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {campaign.time}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              {campaign.segment}
                            </div>
                          </div>
                        ))}

                        {daysCampaigns.length === 0 && (
                          <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-4">
                            No campaigns
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}