import type { NextApiRequest, NextApiResponse } from 'next'

type PopupAdResponse = {
  success: boolean
  popupAds?: any[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PopupAdResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const {
      insights,
      customPrompt,
      popupCount = 6,
      targetAudience,
      deviceTargeting,
      popupTiming,
      triggerBehavior,
      displayDuration,
      frequency
    } = req.body

    if (!insights || insights.length === 0) {
      return res.status(400).json({ success: false, error: 'Insights are required' })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
      })
    }

    // Build comprehensive prompt for popup ad generation
    const systemPrompt = `You are an expert popup ad designer and conversion optimization specialist. Create effective popup advertisements based on customer insights and targeting parameters.

INSIGHTS PROVIDED:
${insights.map((insight: any, index: number) => `
${index + 1}. Product: ${insight.product}
   Segment: ${insight.segment}
   Conversion Rate: ${insight.conversion_rate}%
   Affinity Score: ${insight.affinity_score}%
   Recommendation: ${insight.recommendation}
`).join('')}

TARGETING PARAMETERS:
- Target Audience: ${targetAudience || 'All audiences'}
- Device Targeting: ${deviceTargeting}
- Display Timing: ${popupTiming}
- Trigger Behavior: ${triggerBehavior}
- Display Duration: ${displayDuration} seconds
- Frequency: ${frequency}
- Number of Popups: ${popupCount}

CUSTOM INSTRUCTIONS: ${customPrompt}

Generate ${popupCount} distinct popup ad variations that:
1. Target the specified audience effectively
2. Use appropriate timing and triggers
3. Are optimized for the specified devices
4. Include compelling headlines, content, and CTAs
5. Leverage the insights to create personalized messaging
6. Follow popup ad best practices for conversion

For each popup ad, provide:
- title: Short descriptive name for the popup
- headline: Main attention-grabbing headline (max 60 characters)
- content: Supporting text/description (max 150 characters)
- cta: Call-to-action button text (max 25 characters)
- targetAudience: Who this targets
- device: Device optimization
- trigger: How it's triggered
- timing: When it appears
- frequency: How often shown
- displayDuration: How long displayed
- priority: Effectiveness score (1-10)
- product: Primary product being promoted
- segment: Target customer segment
- backgroundColor: Hex color for popup background
- textColor: Hex color for text
- ctaColor: Hex color for CTA button

Return your response as a JSON object with a "popupAds" array containing all generated popup ads.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate ${popupCount} popup ads targeting ${targetAudience || 'general audience'} for ${deviceTargeting} devices with ${triggerBehavior} triggers.`
          }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    // Try to parse JSON response
    try {
      const popupData = JSON.parse(aiResponse)

      // Validate and enhance the popup ads
      const enhancedPopups = (popupData.popupAds || []).map((popup: any, index: number) => ({
        id: `popup_${Date.now()}_${index}`,
        title: popup.title || `Popup Ad ${index + 1}`,
        headline: popup.headline || `Special Offer`,
        content: popup.content || `Don't miss out on this limited-time opportunity!`,
        cta: popup.cta || `Shop Now`,
        targetAudience: popup.targetAudience || targetAudience || 'All Users',
        device: popup.device || deviceTargeting,
        trigger: popup.trigger || triggerBehavior,
        timing: popup.timing || popupTiming,
        frequency: popup.frequency || frequency,
        displayDuration: popup.displayDuration || displayDuration,
        priority: popup.priority || Math.floor(Math.random() * 10) + 1,
        product: popup.product || insights[index % insights.length]?.product,
        segment: popup.segment || insights[index % insights.length]?.segment,
        backgroundColor: popup.backgroundColor || '#ffffff',
        textColor: popup.textColor || '#1f2937',
        ctaColor: popup.ctaColor || '#f97316',
        createdAt: new Date().toISOString(),
        status: 'draft'
      }))

      res.status(200).json({
        success: true,
        popupAds: enhancedPopups
      })

    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)

      // Fallback: create structured popup ads from insights
      const fallbackPopups = insights.slice(0, popupCount).map((insight: any, index: number) => ({
        id: `popup_${Date.now()}_${index}`,
        title: `${insight.product} Popup ${index + 1}`,
        headline: `Special ${insight.product} Offer!`,
        content: `Perfect for ${insight.segment} customers. ${insight.recommendation}`,
        cta: 'Shop Now',
        targetAudience: targetAudience || insight.segment,
        device: deviceTargeting,
        trigger: triggerBehavior,
        timing: popupTiming,
        frequency: frequency,
        displayDuration: displayDuration,
        priority: Math.floor(Math.random() * 10) + 1,
        product: insight.product,
        segment: insight.segment,
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        ctaColor: '#f97316',
        createdAt: new Date().toISOString(),
        status: 'draft'
      }))

      res.status(200).json({
        success: true,
        popupAds: fallbackPopups
      })
    }

  } catch (error) {
    console.error('Popup ad generation error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}