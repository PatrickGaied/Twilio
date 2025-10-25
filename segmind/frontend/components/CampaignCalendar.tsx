import { useState } from 'react'
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, Mail, MessageCircle, Send } from 'lucide-react'

interface CampaignEvent {
  id: string
  title: string
  type: 'email' | 'sms' | 'whatsapp'
  segment: string
  date: string
  time: string
  status: 'scheduled' | 'sent' | 'draft'
}

interface CampaignCalendarProps {
  onScheduleCampaign?: (date: string, time: string) => void
}

export default function CampaignCalendar({ onScheduleCampaign }: CampaignCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Mock data for campaigns
  const [campaigns] = useState<CampaignEvent[]>([
    {
      id: '1',
      title: 'High Converters Email Blast',
      type: 'email',
      segment: 'High Converters',
      date: '2025-10-26',
      time: '10:00',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Window Shoppers SMS',
      type: 'sms',
      segment: 'Window Shoppers',
      date: '2025-10-27',
      time: '14:30',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Loyal Customers WhatsApp',
      type: 'whatsapp',
      segment: 'Loyal Customers',
      date: '2025-10-28',
      time: '09:00',
      status: 'scheduled'
    }
  ])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getCampaignsForDate = (date: string) => {
    return campaigns.filter(campaign => campaign.date === date)
  }

  const getCampaignIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-3 w-3" />
      case 'sms': return <MessageCircle className="h-3 w-3" />
      case 'whatsapp': return <Send className="h-3 w-3" />
      default: return <Mail className="h-3 w-3" />
    }
  }

  const getCampaignColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
      case 'sms': return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
      case 'whatsapp': return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
    }
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setShowScheduleModal(true)
  }

  const handleSchedule = (time: string) => {
    if (selectedDate && onScheduleCampaign) {
      onScheduleCampaign(selectedDate, time)
    }
    setShowScheduleModal(false)
    setSelectedDate(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
          Campaign Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dateStr = formatDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = formatDate(day) === formatDate(new Date())
          const campaignsForDay = getCampaignsForDate(dateStr)

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && handleDateClick(dateStr)}
              className={`h-20 p-1 border rounded-lg cursor-pointer transition-all duration-200 ${
                isCurrentMonth
                  ? 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  : 'border-transparent text-gray-300 dark:text-gray-600'
              } ${isToday ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300' : ''}`}
            >
              <div className={`text-xs font-medium mb-1 ${isCurrentMonth ? 'text-gray-900 dark:text-white' : ''}`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {campaignsForDay.slice(0, 2).map((campaign) => (
                  <div
                    key={campaign.id}
                    className={`text-xs px-1 py-0.5 rounded flex items-center space-x-1 ${getCampaignColor(campaign.type)}`}
                  >
                    {getCampaignIcon(campaign.type)}
                    <span className="truncate">{campaign.segment}</span>
                  </div>
                ))}
                {campaignsForDay.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{campaignsForDay.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Campaign</h4>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Plus className="h-4 w-4 rotate-45 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Selected Date: {new Date(selectedDate).toLocaleDateString()}
              </p>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time
              </label>
              <select
                onChange={(e) => handleSchedule(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select time...</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: Best engagement times are typically 10 AM - 2 PM
            </div>
          </div>
        </div>
      )}
    </div>
  )
}