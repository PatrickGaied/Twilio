import type { NextApiRequest, NextApiResponse } from 'next'

type ImageGenerationResponse = {
  success: boolean
  imageUrl?: string
  error?: string
  fallbackUrl?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageGenerationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const {
      product,
      brand,
      style = 'modern',
      type = 'product_showcase',
      audience,
      campaign_type = 'popup'
    } = req.body

    if (!product || !brand) {
      return res.status(400).json({ success: false, error: 'Missing required fields: product and brand' })
    }

    // Check for OpenAI API key (we'll use DALL-E for image generation)
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured for image generation.'
      })
    }

    // Build image generation prompt
    const imagePrompt = buildImagePrompt(product, brand, style, type, audience, campaign_type)

    try {
      // Use OpenAI DALL-E for image generation
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
        console.error('OpenAI DALL-E error:', errorData)
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
        throw new Error('No image URL returned from DALL-E')
      }

    } catch (dalleError) {
      console.error('DALL-E generation failed, trying alternative services:', dalleError)

      // Fallback to alternative image generation services or stock images
      const fallbackImageUrl = getFallbackImage(product, brand, style, type)

      res.status(200).json({
        success: true,
        imageUrl: fallbackImageUrl,
        fallbackUrl: fallbackImageUrl
      })
    }

  } catch (error) {
    console.error('Image generation error:', error)

    // Always provide a fallback image
    const fallbackImageUrl = getFallbackImage(
      req.body.product || 'product',
      req.body.brand || 'brand',
      req.body.style || 'modern',
      req.body.type || 'product_showcase'
    )

    res.status(200).json({
      success: true,
      imageUrl: fallbackImageUrl,
      fallbackUrl: fallbackImageUrl
    })
  }
}

function buildImagePrompt(
  product: string,
  brand: string,
  style: string,
  type: string,
  audience?: string,
  campaignType?: string
): string {
  const brandStyles = {
    'Apple': 'clean minimalist white background, premium lighting, sleek modern aesthetic',
    'Samsung': 'technology-focused, dynamic lighting, modern tech environment',
    'Huawei': 'innovative design, professional photography, contemporary setting',
    'Yamaha': 'audio-focused, professional studio environment, rich deep colors'
  }

  const typePrompts = {
    'product_showcase': 'professional product photography showcasing the item prominently',
    'lifestyle': 'person using the product in a real-life scenario',
    'hero_banner': 'wide banner-style composition perfect for web headers',
    'popup_featured': 'eye-catching centered product image optimized for popup ads',
    'social_media': 'square format optimized for social media posts'
  }

  const styleModifiers = {
    'modern': 'contemporary, clean, professional',
    'premium': 'luxury, high-end, sophisticated',
    'playful': 'colorful, energetic, fun',
    'minimal': 'simple, clean, lots of white space',
    'dramatic': 'bold lighting, strong contrast, cinematic'
  }

  const audienceModifiers = audience ? {
    'High Converters': 'appealing to discerning customers who value quality',
    'New Visitors': 'welcoming and accessible to newcomers',
    'Loyal Customers': 'familiar and trustworthy feeling',
    'Creative Professionals': 'professional, sophisticated, tool-focused',
    'Tech Enthusiasts': 'cutting-edge, innovative, high-tech aesthetic'
  }[audience] || '' : ''

  const campaignModifiers = campaignType === 'popup'
    ? 'optimized for popup ads, attention-grabbing, clear focus on product'
    : 'suitable for email campaigns, engaging and informative'

  const basePrompt = `${typePrompts[type as keyof typeof typePrompts] || typePrompts.product_showcase} of a ${product}`
  const brandStyle = brandStyles[brand as keyof typeof brandStyles] || 'professional commercial photography'
  const styleGuide = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers.modern

  return `${basePrompt}, ${brandStyle}, ${styleGuide} style, ${campaignModifiers}${audienceModifiers ? `, ${audienceModifiers}` : ''}, high quality, commercial photography, 4K resolution, no text or watermarks`
}

function getFallbackImage(product: string, brand: string, style: string, type: string): string {
  // Generate a fallback using Unsplash or placeholder services
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

  // Find the most relevant category
  const category = Object.keys(productCategories).find(key =>
    product.toLowerCase().includes(key)
  ) || 'technology'

  const mappedCategory = productCategories[category as keyof typeof productCategories] || 'technology'

  // Use Unsplash Source for high-quality stock images
  const dimensions = type === 'popup_featured' ? '400x300' :
                   type === 'social_media' ? '400x400' :
                   type === 'hero_banner' ? '800x400' : '600x400'

  // Unsplash Source API with relevant search terms
  return `https://source.unsplash.com/${dimensions}/?${mappedCategory},product,${style},${brand.toLowerCase()}`
}

// Alternative function for when we want to use a different service
export async function generateImageWithStabilityAI(
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    })

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.status}`)
    }

    const data = await response.json()

    // Stability AI returns base64 encoded images
    const base64Image = data.artifacts[0].base64
    return `data:image/png;base64,${base64Image}`

  } catch (error) {
    console.error('Stability AI generation failed:', error)
    throw error
  }
}

// Function to generate images using Hugging Face's models
export async function generateImageWithHuggingFace(
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face error: ${response.status}`)
    }

    const imageBlob = await response.blob()
    const imageUrl = URL.createObjectURL(imageBlob)

    return imageUrl

  } catch (error) {
    console.error('Hugging Face generation failed:', error)
    throw error
  }
}