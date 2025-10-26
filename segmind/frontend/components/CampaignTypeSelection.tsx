import { Calendar, Zap } from 'lucide-react'

interface CampaignTypeSelectionProps {
  onSelectType: (type: 'calendar' | 'popup') => void
}

export default function CampaignTypeSelection({ onSelectType }: CampaignTypeSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Campaign Type</h1>
        <p className="text-gray-600 dark:text-gray-400">Select the type of campaign you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar Campaign Option */}
        <div
          onClick={() => onSelectType('calendar')}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all group"
        >
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 group-hover:text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Calendar Campaign</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create and schedule multiple email campaigns with AI-powered content generation,
              product targeting, and strategic timing across a full calendar view.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              ✨ AI Strategy Generation • 📧 Email Campaigns • 📅 Calendar Scheduling
            </div>
          </div>
        </div>

        {/* Popup Campaign Option */}
        <div
          onClick={() => onSelectType('popup')}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 cursor-pointer transition-all group"
        >
          <div className="text-center">
            <Zap className="h-16 w-16 text-gray-400 group-hover:text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Popup Campaign</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Design targeted popup advertisements with personalized messaging,
              custom visuals, and conversion-optimized layouts for specific customer segments.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              🎨 Visual Design • 🎯 Targeting • 💬 Personalization
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}