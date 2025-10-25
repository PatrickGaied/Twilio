import type { NextApiRequest, NextApiResponse } from 'next'

type EmailImageResponse = {
  success: boolean
  imageUrl?: string
  error?: string
  fallbackUrl?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailImageResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const {
      product,
      brand,
      emailType = 'introduction',
      segment,
      style = 'professional'
    } = req.body

    if (!product || !brand) {
      return res.status(400).json({ success: false, error: 'Missing required fields: product and brand' })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured for image generation.'
      })
    }

    // Build email-specific image prompt
    const imagePrompt = buildEmailImagePrompt(product, brand, emailType, segment, style)

    try {
      // Use OpenAI DALL-E for email header image generation
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('OpenAI DALL-E error for email:', errorData)
        throw new Error(`DALL-E API error: ${response.status}`)
      }

      const data = await response.json()
      const imageUrl = data.data[0]?.url

      if (imageUrl) {
        res.status(200).json({
          success: true,
          imageUrl
        })
      } else {
        throw new Error('No image URL returned from DALL-E for email')
      }

    } catch (dalleError) {
      console.error('DALL-E email generation failed, using fallback:', dalleError)

      // Fallback to email-optimized stock images
      const fallbackImageUrl = getEmailFallbackImage(product, brand, emailType, style)

      res.status(200).json({
        success: true,
        imageUrl: fallbackImageUrl,
        fallbackUrl: fallbackImageUrl
      })
    }

  } catch (error) {
    console.error('Email image generation error:', error)

    // Always provide a fallback image for emails
    const fallbackImageUrl = getEmailFallbackImage(
      req.body.product || 'product',
      req.body.brand || 'brand',
      req.body.emailType || 'introduction',
      req.body.style || 'professional'
    )

    res.status(200).json({
      success: true,
      imageUrl: fallbackImageUrl,
      fallbackUrl: fallbackImageUrl
    })
  }
}

function buildEmailImagePrompt(
  product: string,
  brand: string,
  emailType: string,
  segment?: string,
  style: string = 'professional'
): string {
  const brandStyles = {
    'Apple': 'minimalist white background, premium photography, sleek modern aesthetic',
    'Samsung': 'technology-focused, professional lighting, modern tech environment',
    'Huawei': 'innovative design, contemporary setting, professional photography',
    'Yamaha': 'audio-focused, professional studio environment, rich colors'
  }

  const emailTypePrompts = {
    'introduction': 'welcoming hero image introducing the product to new customers',
    'features': 'detailed product showcase highlighting key features and benefits',
    'offer': 'promotional banner with sale or discount visual elements',
    'newsletter': 'professional header image suitable for email newsletters',
    'follow_up': 'friendly reminder style image for follow-up communications'
  }

  const styleModifiers = {
    'professional': 'professional, business-appropriate, clean design',
    'modern': 'contemporary, trendy, cutting-edge aesthetic',
    'friendly': 'warm, approachable, customer-friendly tone',
    'premium': 'luxury, high-end, sophisticated appearance',
    'minimal': 'simple, clean, lots of white space, focused'
  }

  const segmentModifiers = segment ? {
    'High Converters': 'appealing to premium customers who value quality',
    'Loyal Customers': 'familiar and trustworthy, emphasizing brand loyalty',
    'New Visitors': 'welcoming and accessible to newcomers',
    'Tech Enthusiasts': 'cutting-edge, innovative, high-tech focus'
  }[segment] || '' : ''

  const basePrompt = `${emailTypePrompts[emailType as keyof typeof emailTypePrompts] || emailTypePrompts.introduction} featuring ${product}`
  const brandStyle = brandStyles[brand as keyof typeof brandStyles] || 'professional commercial photography'
  const styleGuide = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers.professional

  return `${basePrompt}, ${brandStyle}, ${styleGuide}, optimized for email headers and newsletters, wide banner format, ${segmentModifiers ? segmentModifiers + ', ' : ''}high quality, no text overlays, suitable for email campaigns, professional marketing image`
}

function getEmailFallbackImage(
  product: string,
  brand: string,
  emailType: string,
  style: string
): string {
  const productCategories = {
    'iphone': 'smartphone',
    'macbook': 'laptop',
    'ipad': 'tablet',
    'airpods': 'headphones',
    'watch': 'smartwatch',
    'galaxy': 'smartphone',
    'tab': 'tablet',
    'buds': 'earbuds',
    'book': 'laptop',
    'mate': 'smartphone',
    'freebuds': 'earbuds',
    'soundbar': 'speaker',
    'receiver': 'audio-equipment',
    'speaker': 'speaker',
    'headphones': 'headphones'
  }

  const category = Object.keys(productCategories).find(key =>
    product.toLowerCase().includes(key)
  ) || 'technology'

  const mappedCategory = productCategories[category as keyof typeof productCategories] || 'technology'

  // Email-optimized dimensions (banner format)
  const dimensions = '800x400'

  // Add email-specific terms
  const emailTerms = emailType === 'offer' ? 'sale,promotion' :
                    emailType === 'features' ? 'features,benefits' :
                    emailType === 'newsletter' ? 'newsletter,professional' :
                    'professional,business'

  return `https://source.unsplash.com/${dimensions}/?${mappedCategory},${emailTerms},${style},${brand.toLowerCase()},business`
}