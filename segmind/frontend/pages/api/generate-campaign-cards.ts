import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { product, strategy, weeklySchedule } = req.body

    // OpenAI integration
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a marketing campaign generator. Create email campaign cards based on the provided strategy.
            Return a JSON array of campaign objects with the following structure:
            {
              "id": "unique_id",
              "day": "day_name",
              "time": "time",
              "type": "campaign_type",
              "audience": "target_audience",
              "theme": "email_theme",
              "subject": "email_subject",
              "preview": "email_preview_text",
              "prompt": "generation_prompt",
              "emailContent": "full_email_content",
              "imagePrompt": "image_generation_prompt",
              "status": "pending"
            }`
          },
          {
            role: 'user',
            content: `Generate campaign cards for:
            Product: ${product?.name || 'Unknown Product'}
            Strategy: ${strategy.strategy}
            Primary Audience: ${strategy.primaryAudience}

            Weekly Schedule:
            ${weeklySchedule.map((s: any) => `${s.day} ${s.time}: ${s.type} for ${s.audience}`).join('\n')}

            Each campaign should have compelling subject lines, engaging email content, and specific image prompts for visual generation.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed')
    }

    const aiData = await openaiResponse.json()
    const generatedContent = aiData.choices[0]?.message?.content

    // Try to parse JSON from AI response
    let campaignCards
    try {
      campaignCards = JSON.parse(generatedContent)
    } catch (error) {
      // Fallback to structured mock data if JSON parsing fails
      campaignCards = weeklySchedule.map((schedule: any, index: number) => ({
        id: `card_${Date.now()}_${index}`,
        day: schedule.day,
        time: schedule.time,
        type: schedule.type,
        audience: schedule.audience,
        theme: getThemeForCampaign(schedule.type),
        subject: generateSubject(product?.name, schedule.type, schedule.audience),
        preview: `${schedule.day} ${schedule.time}: ${schedule.type}`,
        prompt: `${schedule.type} email for ${schedule.audience} promoting ${product?.name}`,
        emailContent: generateEmailContent(product?.name, schedule.type, schedule.audience),
        imagePrompt: generateImagePrompt(product?.name, schedule.type),
        status: 'pending'
      }))
    }

    res.status(200).json(campaignCards)

  } catch (error) {
    console.error('Error generating campaign cards:', error)

    // Fallback mock data
    const { weeklySchedule, product } = req.body
    const fallbackCards = weeklySchedule.map((schedule: any, index: number) => ({
      id: `card_${Date.now()}_${index}`,
      day: schedule.day,
      time: schedule.time,
      type: schedule.type,
      audience: schedule.audience,
      theme: getThemeForCampaign(schedule.type),
      subject: generateSubject(product?.name, schedule.type, schedule.audience),
      preview: `${schedule.day} ${schedule.time}: ${schedule.type}`,
      prompt: `${schedule.type} email for ${schedule.audience} promoting ${product?.name}`,
      emailContent: generateEmailContent(product?.name, schedule.type, schedule.audience),
      imagePrompt: generateImagePrompt(product?.name, schedule.type),
      status: 'pending'
    }))

    res.status(200).json(fallbackCards)
  }
}

function getThemeForCampaign(type: string): string {
  const themes: { [key: string]: string } = {
    'Primary Campaign': 'Modern & Clean',
    'Follow-up': 'Urgent & Direct',
    'Premium Drop': 'Luxury & Exclusive',
    'Weekly Recap': 'Friendly & Informative'
  }
  return themes[type] || 'Engaging & Professional'
}

function generateSubject(productName: string, type: string, audience: string): string {
  const subjects: { [key: string]: string[] } = {
    'Primary Campaign': [
      `New ${productName} - Perfect for You!`,
      `Discover the Latest ${productName}`,
      `${productName} - Now Available`
    ],
    'Follow-up': [
      `Don't Miss Out - ${productName} Still Available`,
      `Your Cart is Waiting - Complete Your ${productName} Purchase`,
      `Last Chance for ${productName}`
    ],
    'Premium Drop': [
      `Exclusive: ${productName} VIP Access`,
      `Premium Members Only: ${productName}`,
      `Limited Edition ${productName} - For You`
    ],
    'Weekly Recap': [
      `This Week's Tech Highlights`,
      `Weekly Update: ${productName} & More`,
      `Don't Miss These Updates`
    ]
  }

  const typeSubjects = subjects[type] || subjects['Primary Campaign']
  return typeSubjects[Math.floor(Math.random() * typeSubjects.length)]
}

function generateEmailContent(productName: string, type: string, audience: string): string {
  const templates: { [key: string]: string } = {
    'Primary Campaign': `Hi {{first_name}},

We're excited to introduce you to the ${productName}!

As someone who appreciates quality technology, we thought you'd love to know about this latest addition to our collection.

✨ Key Features:
• Premium design and build quality
• Latest technology innovations
• Perfect for your lifestyle

Ready to learn more?

Best regards,
The Segmind Team`,

    'Follow-up': `Hi {{first_name}},

We noticed you were interested in the ${productName}. Your cart is still waiting for you!

Don't let this opportunity slip away. Complete your purchase now and enjoy:
• Fast, free shipping
• 30-day money-back guarantee
• Exclusive member pricing

[Complete Your Purchase]

Best regards,
The Segmind Team`,

    'Premium Drop': `Hi {{first_name}},

As one of our premium members, you get exclusive early access to the ${productName}.

This is a limited-time offer available only to our most valued customers like you.

🔥 Exclusive Benefits:
• 20% member discount
• Priority shipping
• Extended warranty

[Claim Your Exclusive Access]

Best regards,
The Segmind Team`,

    'Weekly Recap': `Hi {{first_name}},

Here's what's trending this week in tech:

📱 Featured: ${productName}
🔥 Hot deals and new arrivals
📊 Personalized recommendations for you

Stay ahead of the curve with the latest technology trends.

[Explore This Week's Picks]

Best regards,
The Segmind Team`
  }

  return templates[type] || templates['Primary Campaign']
}

function generateImagePrompt(productName: string, type: string): string {
  const basePrompts: { [key: string]: string } = {
    'Primary Campaign': `Clean, modern product photography of ${productName} on a minimal white background with soft studio lighting, professional commercial style`,
    'Follow-up': `${productName} with a subtle urgency overlay, warm lighting, call-to-action focused design`,
    'Premium Drop': `Luxury product shot of ${productName} with dramatic lighting, black or dark background, premium feel, exclusive atmosphere`,
    'Weekly Recap': `Collection layout featuring ${productName} alongside other tech products, organized grid layout, modern tech aesthetic`
  }

  return basePrompts[type] || basePrompts['Primary Campaign']
}