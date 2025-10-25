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
  emailContent?: string
  emailSubject?: string
  insight?: string
  recommendation?: string
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
    const { insights, customPrompt, includeEmailContent = false } = req.body

    if (!insights || !Array.isArray(insights)) {
      return res.status(400).json({ success: false, error: 'Insights data is required' })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      // Return fallback campaigns if no API key
      const fallbackCampaigns = generateFallbackCampaigns(insights, customPrompt || '')
      return res.status(200).json({ success: true, campaigns: fallbackCampaigns })
    }

    const systemPrompt = `You are an expert marketing strategist and email campaign creator. Based on customer insights and user requirements, create comprehensive marketing campaigns.

User's Custom Instructions: "${customPrompt || 'Create effective marketing campaigns'}"

Customer Insights Data:
${JSON.stringify(insights, null, 2)}

Create 6-10 strategic marketing campaigns that follow the user's instructions. For each campaign:

1. Analyze the insights to identify the best product-segment combinations
2. Apply the user's custom instructions to shape the campaign strategy
3. Create compelling campaign names and descriptions
4. ${includeEmailContent ? 'Generate complete email content with subject lines' : 'Focus on campaign strategy and timing'}

Requirements:
- Follow the user's custom instructions closely
- Use the insights data to make data-driven decisions
- Create campaigns that are diverse but cohesive
- Spread campaigns across different time periods
- Vary campaign tones and approaches
- Include cross-selling opportunities where appropriate

For each campaign, provide:
{
  "name": "Campaign name",
  "products": ["Product 1", "Product 2"],
  "segment": "Target segment from insights",
  "tone": "Campaign tone (premium/friendly/urgent/educational/celebration)",
  "description": "Brief campaign description",
  "priority": "1-10 priority score",
  "optimal_timing": "early_month/mid_month/late_month",
  ${includeEmailContent ? '"emailSubject": "Email subject line", "emailContent": "Complete email content (200-300 words)",' : ''}
  "insight": "Key insight driving this campaign",
  "recommendation": "Strategic recommendation"
}

Return ONLY a valid JSON array of campaign objects.`

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
            {
              role: 'user',
              content: `Generate marketing campaigns based on the insights and custom instructions provided. ${includeEmailContent ? 'Include complete email content for each campaign.' : ''}`
            }
          ],
          max_tokens: includeEmailContent ? 2000 : 1200,
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

      // Parse AI response
      let aiCampaigns: any[] = []
      try {
        // Clean the response in case there's extra text
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse
        aiCampaigns = JSON.parse(jsonString)
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback')
        aiCampaigns = generateFallbackCampaigns(insights, customPrompt || '')
      }

      // Convert AI suggestions to our campaign format
      const campaigns = aiCampaigns.map((campaign, index) => {
        const scheduledDate = getScheduledDate(campaign.optimal_timing || 'mid_month', index)

        return {
          id: `custom_${Date.now()}_${index}`,
          name: campaign.name || `${campaign.products?.[0] || 'Product'} Campaign`,
          brand: getBrandFromProducts(campaign.products || []),
          products: campaign.products || ['iPhone 15 Pro'],
          tone: campaign.tone || 'premium',
          segment: campaign.segment || 'High Converters',
          status: getStatusByDate(scheduledDate),
          scheduled_date: scheduledDate,
          created_at: new Date().toISOString(),
          description: campaign.description || `Campaign targeting ${campaign.segment}`,
          priority: campaign.priority || 5,
          emailContent: campaign.emailContent,
          emailSubject: campaign.emailSubject,
          insight: campaign.insight,
          recommendation: campaign.recommendation
        }
      })

      res.status(200).json({ success: true, campaigns })

    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError)
      const fallbackCampaigns = generateFallbackCampaigns(insights, customPrompt || '')
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

function generateFallbackCampaigns(insights: any[], customPrompt: string): CampaignSuggestion[] {
  // Create campaigns based on insights with consideration of custom prompt
  const hasUrgencyFocus = customPrompt.toLowerCase().includes('urgent') || customPrompt.toLowerCase().includes('limited')
  const hasEducationalFocus = customPrompt.toLowerCase().includes('educational') || customPrompt.toLowerCase().includes('features')
  const hasPremiumFocus = customPrompt.toLowerCase().includes('premium') || customPrompt.toLowerCase().includes('exclusive')

  const campaigns = insights.slice(0, 6).map((insight, index) => {
    let tone = 'friendly'
    if (hasPremiumFocus && insight.affinity_score > 85) tone = 'premium'
    else if (hasUrgencyFocus && insight.segment === 'Window Shoppers') tone = 'urgent'
    else if (hasEducationalFocus) tone = 'educational'

    return {
      name: `${insight.product} ${tone === 'urgent' ? 'Flash Sale' : tone === 'premium' ? 'Exclusive Launch' : 'Feature Spotlight'}`,
      products: [insight.product],
      segment: insight.segment,
      tone,
      description: `${insight.recommendation} - ${customPrompt}`,
      timing: index % 3 === 0 ? 'early_month' : index % 3 === 1 ? 'mid_month' : 'late_month',
      priority: Math.floor(insight.affinity_score / 10),
      emailSubject: `Discover ${insight.product} - Perfect for You`,
      emailContent: `Hi there!\n\n${insight.insight}\n\n${insight.recommendation}\n\nCustomized based on: ${customPrompt}\n\nBest regards,\nYour Team`,
      insight: insight.insight,
      recommendation: insight.recommendation
    }
  })

  return campaigns.map((campaign, index) => {
    const scheduledDate = getScheduledDate(campaign.timing, index)

    return {
      id: `fallback_custom_${Date.now()}_${index}`,
      name: campaign.name,
      brand: getBrandFromProducts(campaign.products),
      products: campaign.products,
      tone: campaign.tone,
      segment: campaign.segment,
      status: getStatusByDate(scheduledDate),
      scheduled_date: scheduledDate,
      created_at: new Date().toISOString(),
      description: campaign.description,
      priority: campaign.priority,
      emailContent: campaign.emailContent,
      emailSubject: campaign.emailSubject,
      insight: campaign.insight,
      recommendation: campaign.recommendation
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
      day = 3 + (index % 8)
      break
    case 'late_month':
      day = 22 + (index % 7)
      break
    default: // mid_month
      day = 12 + (index % 8)
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