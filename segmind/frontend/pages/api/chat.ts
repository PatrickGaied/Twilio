import type { NextApiRequest, NextApiResponse } from 'next'

type ChatResponse = {
  success: boolean
  response?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { message, pageData, context } = req.body

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
      })
    }

    // Format the page data for the AI
    const dataContext = pageData ? `
Current page data:
${JSON.stringify(pageData, null, 2)}
` : ''

    const systemPrompt = `You are an AI assistant helping analyze ${context}.

${dataContext}

You should:
1. Be helpful and concise in your responses
2. Focus on insights about customer segments, products, and business metrics
3. Suggest actionable recommendations
4. Use the data provided to give specific insights
5. Keep responses under 200 words

When users ask about the data, reference the specific numbers and segments shown.`

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
            content: message
          }
        ],
        max_tokens: 300,
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

    res.status(200).json({ success: true, response: aiResponse })

  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}