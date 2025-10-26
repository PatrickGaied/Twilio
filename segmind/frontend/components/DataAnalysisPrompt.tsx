import { useState } from 'react'
import { Search, Sparkles, TrendingUp, Users, Target, Send } from 'lucide-react'

interface DataAnalysisPromptProps {
  onSubmit: (prompt: string) => void
}

export default function DataAnalysisPrompt({ onSubmit }: DataAnalysisPromptProps) {
  const [prompt, setPrompt] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsAnalyzing(true)
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    onSubmit(prompt)
    setIsAnalyzing(false)
  }

  const examplePrompts = [
    "Tell me about my High Converters audience",
    "What motivates Window Shoppers to buy?",
    "Who is the iPhone 15 Pro target audience?",
    "How can I reduce cart abandonment rates?",
    "What do Loyal Customers want from my brand?",
    "Samsung Galaxy S24 audience insights",
    "Best messaging for each customer segment",
    "How to re-engage At Risk customers?"
  ]

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audience Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Understand your customers better - ask about segments, products, and audience behavior</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Ask about your audience... e.g., 'Tell me about High Converters' or 'Who buys the iPhone 15 Pro?'"
            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isAnalyzing}
            className="absolute bottom-3 right-3 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Quick examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}