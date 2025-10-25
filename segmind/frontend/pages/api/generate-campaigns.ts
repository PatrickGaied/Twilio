import type { NextApiRequest, NextApiResponse } from 'next'

interface CampaignSuggestion {
  id: string
  name: string
  brand: string
  products: string[]
  tone: string
  segment: string
  status: 'draft' | 'scheduled' | 'active'
  scheduled_date: string
  created_at: string
  description: string
  priority: number
}

type CampaignResponse = {
  success: boolean
  campaigns?: CampaignSuggestion[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CampaignResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { insights, timeframe = 'month' } = req.body

    if (!insights || !Array.isArray(insights)) {
      return res.status(400).json({ success: false, error: 'Insights data is required' })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      // Return fallback campaigns if no API key
      const fallbackCampaigns = generateFallbackCampaigns()
      return res.status(200).json({ success: true, campaigns: fallbackCampaigns })
    }

    const systemPrompt = `You are an AI marketing strategist that creates optimal campaign schedules based on customer insights.

Given these product-segment insights, create a strategic campaign calendar for the next month.

Insights data:
${JSON.stringify(insights, null, 2)}

Create 8-12 campaigns with the following considerations:
1. High affinity scores should get priority scheduling
2. Spread campaigns across the month for optimal timing
3. Group complementary products for cross-selling
4. Vary campaign tones based on segment characteristics
5. Consider seasonal timing and customer behavior patterns

For each campaign, provide:
- name: Descriptive campaign name
- products: Array of 1-4 related products
- segment: Target segment
- tone: Campaign tone (premium, friendly, urgent, educational, celebration)
- priority: 1-10 (higher = more urgent)
- description: Brief campaign description
- optimal_timing: When to schedule (early_month, mid_month, late_month, specific_date)

Return as JSON array of campaign objects.`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Generate optimal campaign schedule based on the insights provided.' }
          ],
          max_tokens: 1500,
          temperature: 0.8,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error('No response from OpenAI')
      }

      // Parse AI response and convert to campaign format
      let aiCampaigns: any[] = []
      try {
        aiCampaigns = JSON.parse(aiResponse)
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback')
        aiCampaigns = generateFallbackCampaigns()
      }

      // Convert AI suggestions to our campaign format
      const campaigns = aiCampaigns.map((campaign, index) => {
        const scheduledDate = getScheduledDate(campaign.optimal_timing || 'mid_month', index)

        return {
          id: `ai_camp_${Date.now()}_${index}`,
          name: campaign.name || `${campaign.products?.[0] || 'Product'} Campaign`,
          brand: getBrandFromProducts(campaign.products || []),
          products: campaign.products || ['iPhone 15 Pro'],
          tone: campaign.tone || 'premium',
          segment: campaign.segment || 'High Converters',
          status: getStatusByDate(scheduledDate),
          scheduled_date: scheduledDate,
          created_at: new Date().toISOString(),
          description: campaign.description || `Campaign targeting ${campaign.segment}`,
          priority: campaign.priority || 5
        }
      })

      res.status(200).json({ success: true, campaigns })

    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError)
      const fallbackCampaigns = generateFallbackCampaigns()
      res.status(200).json({ success: true, campaigns: fallbackCampaigns })
    }

  } catch (error) {
    console.error('Campaign generation error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

function generateFallbackCampaigns(): CampaignSuggestion[] {
  const campaigns = [
    {
      name: "iPhone 15 Pro Launch Promo",
      products: ["iPhone 15 Pro"],
      segment: "High Converters",
      tone: "premium",
      description: "Promote iPhone 15 Pro with 15% discount for high-converting customers",
      timing: "early_month",
      priority: 9
    },
    {
      name: "Apple Ecosystem Bundle",
      products: ["iPhone 15 Pro", "Apple Watch Ultra", "AirPods Max"],
      segment: "High Converters",
      tone: "premium",
      description: "Complete Apple ecosystem for premium customers",
      timing: "mid_month",
      priority: 8
    },
    {
      name: "Samsung Galaxy Experience",
      products: ["Galaxy S24 Ultra", "Galaxy Buds Pro"],
      segment: "Loyal Customers",
      tone: "educational",
      description: "Showcase Samsung's latest innovations",
      timing: "early_month",
      priority: 7
    },
    {
      name: "Creative Professional Tools",
      products: ["MacBook Pro M3", "iPad Pro 12.9\""],
      segment: "Creative Professionals",
      tone: "educational",
      description: "Professional tools for creative workflows",
      timing: "mid_month",
      priority: 8
    },
    {
      name: "Window Shoppers Special",
      products: ["AirPods Pro", "Apple Watch SE"],
      segment: "Window Shoppers",
      tone: "urgent",
      description: "Limited time bundle offer to convert browsers",
      timing: "late_month",
      priority: 6
    },
    {
      name: "Audio Enthusiast Collection",
      products: ["YH-E700A Headphones", "AG03MK2 Audio Interface"],
      segment: "High Converters",
      tone: "educational",
      description: "Professional audio equipment for enthusiasts",
      timing: "mid_month",
      priority: 7
    },
    {
      name: "Huawei Innovation Showcase",
      products: ["P60 Pro", "Watch GT 4"],
      segment: "Loyal Customers",
      tone: "friendly",
      description: "Discover Huawei's latest technology innovations",
      timing: "late_month",
      priority: 6
    },
    {
      name: "Multi-Brand Comparison",
      products: ["iPhone 15 Pro", "Galaxy S24 Ultra", "P60 Pro"],
      segment: "High Converters",
      tone: "educational",
      description: "Help customers choose the right flagship phone",
      timing: "early_month",
      priority: 8
    },
    {
      name: "Budget-Friendly Tech",
      products: ["Galaxy Buds Pro", "YH-E700A Headphones"],
      segment: "Window Shoppers",
      tone: "friendly",
      description: "Quality audio options at accessible prices",
      timing: "late_month",
      priority: 5
    }
  ]

  return campaigns.map((campaign, index) => {
    const scheduledDate = getScheduledDate(campaign.timing, index)

    return {
      id: `fallback_${Date.now()}_${index}`,
      name: campaign.name,
      brand: getBrandFromProducts(campaign.products),
      products: campaign.products,
      tone: campaign.tone,
      segment: campaign.segment,
      status: getStatusByDate(scheduledDate),
      scheduled_date: scheduledDate,
      created_at: new Date().toISOString(),
      description: campaign.description,
      priority: campaign.priority
    }
  })
}

function getScheduledDate(timing: string, index: number): string {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let day: number

  switch (timing) {
    case 'early_month':
      day = 3 + (index % 8) // Days 3-10
      break
    case 'late_month':
      day = 22 + (index % 7) // Days 22-28
      break
    case 'specific_date':
      day = 15 + (index % 5) // Days 15-19
      break
    default: // mid_month
      day = 12 + (index % 8) // Days 12-19
  }

  const campaignDate = new Date(currentYear, currentMonth, day)
  return campaignDate.toISOString()
}

function getBrandFromProducts(products: string[]): string {
  const brandMap: { [key: string]: string } = {
    'iPhone': 'Apple',
    'MacBook': 'Apple',
    'iPad': 'Apple',
    'AirPods': 'Apple',
    'Apple Watch': 'Apple',
    'Galaxy': 'Samsung',
    'P60': 'Huawei',
    'Watch GT': 'Huawei',
    'YH-': 'Yamaha',
    'AG03': 'Yamaha'
  }

  for (const product of products) {
    for (const [key, brand] of Object.entries(brandMap)) {
      if (product.includes(key)) {
        return brand
      }
    }
  }

  return 'Multi-Brand'
}

function getStatusByDate(scheduledDate: string): 'draft' | 'scheduled' | 'active' {
  const now = new Date()
  const scheduled = new Date(scheduledDate)
  const timeDiff = scheduled.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysDiff < 0) return 'active'
  if (daysDiff <= 2) return 'scheduled'
  return 'draft'
}