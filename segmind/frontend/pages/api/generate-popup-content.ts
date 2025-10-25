import type { NextApiRequest, NextApiResponse } from 'next'

type PopupContentResponse = {
  success: boolean
  popup?: {
    id: string
    headline: string
    content: string
    cta: string
    backgroundColor: string
    textColor: string
    ctaColor: string
    imageUrl?: string
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PopupContentResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { product, audience, customPrompt, timing, device, brand } = req.body

    if (!product || !brand) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
      })
    }

    // Build enhanced prompt based on configuration
    const deviceOptimization = device === 'mobile'
      ? 'Mobile-optimized with large touch targets and minimal text'
      : device === 'desktop'
      ? 'Desktop-optimized with rich content and detailed information'
      : 'Responsive design suitable for all devices'

    const timingStrategy = timing === 'exit_intent'
      ? 'Exit-intent popup to recover abandoning visitors with urgency'
      : timing === 'immediate'
      ? 'Welcome popup to engage visitors immediately upon arrival'
      : 'Delayed popup to engage visitors after they show initial interest'

    const systemPrompt = `You are an expert popup ad designer and conversion optimization specialist. Create a high-converting popup advertisement based on the following specifications:

Product: ${product}
Brand: ${brand}
Target Audience: ${audience || 'General visitors'}
Device Optimization: ${deviceOptimization}
Timing Strategy: ${timingStrategy}
Custom Instructions: ${customPrompt || 'Create an engaging and persuasive popup that drives conversions'}

Design Requirements:
1. Create a compelling headline (max 60 characters)
2. Write persuasive body content (max 120 characters for mobile, 180 for desktop)
3. Design an action-oriented CTA button text (max 20 characters)
4. Choose appropriate colors:
   - Background color (hex)
   - Text color (hex)
   - CTA button color (hex)

Content Strategy:
- Use urgency and scarcity when appropriate
- Highlight unique value propositions
- Match the tone to the target audience
- Optimize for the specified device and timing
- Include social proof or benefits when relevant

Brand Guidelines:
${brand === 'Apple' ? '- Premium, minimalist, innovative messaging' :
  brand === 'Samsung' ? '- Technology-forward, feature-rich, reliability-focused' :
  brand === 'Huawei' ? '- Innovation-driven, value-oriented, global appeal' :
  brand === 'Yamaha' ? '- Audio excellence, craftsmanship, professional quality' :
  '- Professional, trustworthy, customer-focused'}

Return your response as JSON with the following structure:
{
  "headline": "Compelling headline here",
  "content": "Persuasive body content here",
  "cta": "Action button text",
  "backgroundColor": "#ffffff",
  "textColor": "#1f2937",
  "ctaColor": "#f97316"
}`

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
            content: `Create a popup ad for ${product} targeting ${audience || 'general visitors'} with ${timing} timing for ${device} devices.`
          }
        ],
        max_tokens: 500,
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

      const popup = {
        id: `popup_${Date.now()}`,
        headline: popupData.headline || `Special ${product} Offer!`,
        content: popupData.content || `Exclusive deal for ${audience}. Don't miss out on this limited-time opportunity.`,
        cta: popupData.cta || 'Shop Now',
        backgroundColor: popupData.backgroundColor || '#ffffff',
        textColor: popupData.textColor || '#1f2937',
        ctaColor: popupData.ctaColor || '#f97316'
      }

      // Generate product image
      try {
        const imageResponse = await fetch(`${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product,
            brand,
            style: 'modern',
            type: 'popup_featured',
            audience,
            campaign_type: 'popup'
          }),
        })

        const imageData = await imageResponse.json()
        if (imageData.success && imageData.imageUrl) {
          popup.imageUrl = imageData.imageUrl
        }
      } catch (imageError) {
        console.log('Image generation failed, continuing without image:', imageError)
        // Continue without image - popup will work fine without it
      }

      res.status(200).json({
        success: true,
        popup
      })

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)

      // Fallback: create structured popup from raw text
      const lines = aiResponse.split('\n').filter(line => line.trim())

      const popup = {
        id: `popup_${Date.now()}`,
        headline: extractHeadline(aiResponse) || `Special ${product} Offer!`,
        content: extractContent(aiResponse) || `Exclusive deal for ${audience}. Get your ${product} today with special pricing!`,
        cta: extractCTA(aiResponse) || 'Shop Now',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        ctaColor: getBrandColor(brand)
      }

      // Generate product image for fallback case too
      try {
        const imageResponse = await fetch(`${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product,
            brand,
            style: 'modern',
            type: 'popup_featured',
            audience,
            campaign_type: 'popup'
          }),
        })

        const imageData = await imageResponse.json()
        if (imageData.success && imageData.imageUrl) {
          popup.imageUrl = imageData.imageUrl
        }
      } catch (imageError) {
        console.log('Image generation failed for fallback, continuing without image:', imageError)
      }

      res.status(200).json({
        success: true,
        popup
      })
    }

  } catch (error) {
    console.error('Popup content generation error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

function extractHeadline(text: string): string {
  const headlineMatch = text.match(/headline[":]\s*[""']([^""']+)[""']/i)
  if (headlineMatch) return headlineMatch[1]

  const firstLine = text.split('\n')[0]
  return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine
}

function extractContent(text: string): string {
  const contentMatch = text.match(/content[":]\s*[""']([^""']+)[""']/i)
  if (contentMatch) return contentMatch[1]

  const lines = text.split('\n').filter(line => line.trim())
  const contentLine = lines.find(line =>
    line.toLowerCase().includes('deal') ||
    line.toLowerCase().includes('offer') ||
    line.toLowerCase().includes('exclusive')
  )

  return contentLine || 'Special limited-time offer available now!'
}

function extractCTA(text: string): string {
  const ctaMatch = text.match(/cta[":]\s*[""']([^""']+)[""']/i)
  if (ctaMatch) return ctaMatch[1]

  const commonCTAs = ['shop now', 'buy now', 'get offer', 'claim deal', 'learn more']
  for (const cta of commonCTAs) {
    if (text.toLowerCase().includes(cta)) {
      return cta.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }
  }

  return 'Shop Now'
}

function getBrandColor(brand: string): string {
  const brandColors: { [key: string]: string } = {
    'Apple': '#007AFF',
    'Samsung': '#1428A0',
    'Huawei': '#FF0000',
    'Yamaha': '#660099'
  }
  return brandColors[brand] || '#f97316'
}