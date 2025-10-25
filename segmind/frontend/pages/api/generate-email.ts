import type { NextApiRequest, NextApiResponse } from 'next'

type EmailResponse = {
  success: boolean
  subject?: string
  preview?: string
  content?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { product, segment, emailType, day, insight, recommendation, customPrompt } = req.body

    if (!product || !segment) {
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

    // Create email-specific prompt based on type
    const getEmailPrompt = (type: string) => {
      switch (type) {
        case 'introduction':
          return `Create an engaging product introduction email for ${product} targeting ${segment} customers. Focus on lifestyle benefits and first impressions. Make it warm and welcoming.`
        case 'features':
          return `Create a feature-focused email for ${product} targeting ${segment} customers. Highlight key features with user testimonials and benefits. Be informative but engaging.`
        case 'offer':
          return `Create a limited-time offer email for ${product} targeting ${segment} customers. Create urgency while remaining helpful. Include a clear call-to-action.`
        default:
          return `Create a marketing email for ${product} targeting ${segment} customers.`
      }
    }

    const emailPrompt = customPrompt || getEmailPrompt(emailType || 'introduction')

    const systemPrompt = `You are an expert email marketing copywriter. Create personalized email content based on customer insights.

Product: ${product}
Target Segment: ${segment}
Email Type: ${emailType || 'custom'} ${day ? `(for ${day})` : ''}
Insight: ${insight || 'No specific insight provided'}
Recommendation: ${recommendation || 'No specific recommendation provided'}
${customPrompt ? `Custom Instructions: ${customPrompt}` : ''}

Generate:
1. A compelling subject line (max 50 characters)
2. A preview text (max 90 characters)
3. Email content (150-250 words, professional but engaging tone)

Requirements:
${customPrompt ? `- Follow the custom instructions closely` : '- Use the insight and recommendation to personalize the content'}
- Match the tone to the target segment
- Include a clear call-to-action
- Make it feel personal, not spammy
- Focus on value for the customer

Format your response as JSON with fields: subject, preview, content`

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
            content: emailPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
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
      const emailData = JSON.parse(aiResponse)
      res.status(200).json({
        success: true,
        subject: emailData.subject,
        preview: emailData.preview,
        content: emailData.content
      })
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      const lines = aiResponse.split('\n').filter(line => line.trim())
      res.status(200).json({
        success: true,
        subject: `${product} - Perfect for ${segment}`,
        preview: `Discover why ${product} works great for you`,
        content: aiResponse
      })
    }

  } catch (error) {
    console.error('Email generation error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}