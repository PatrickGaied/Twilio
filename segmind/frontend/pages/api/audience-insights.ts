import type { NextApiRequest, NextApiResponse } from 'next'

type AudienceInsightResponse = {
  success: boolean
  answer?: string
  highlighted_segments?: string[]
  highlighted_products?: string[]
  insights?: any
  recommendations?: string[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AudienceInsightResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { question, context } = req.body

    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' })
    }

    // For now, we'll use mock responses based on the question
    // In production, this would call the Python FastAPI backend
    const mockResponse = getMockAudienceInsight(question)

    res.status(200).json({
      success: true,
      ...mockResponse
    })

  } catch (error) {
    console.error('Audience insights error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get audience insights'
    })
  }
}

function getMockAudienceInsight(question: string): Omit<AudienceInsightResponse, 'success'> {
  const q = question.toLowerCase()

  if (q.includes('high converters') || q.includes('premium customers')) {
    return {
      answer: `**High Converters** represent your most valuable customer segment (6.5% of customers, 2,847 people).

**Who They Are:**
- Demographics: 25-45 years old, High income ($75k+)
- Location: Urban areas, Tech hubs

**What They Want:**
- Primary motivation: Latest technology and performance
- They value: Technical details, specifications, reviews
- Average spending: $1,200 per order

**How to Reach Them:**
- Best channels: Email, Push notifications
- Peak activity: Evenings (6-9 PM)
- Message focus: Latest technology and performance`,
      highlighted_segments: ['High Converters'],
      highlighted_products: [],
      recommendations: []
    }
  }

  if (q.includes('window shoppers') || q.includes('browsers')) {
    return {
      answer: `**Window Shoppers** are price-conscious browsers (35.4%, 15,623 people) who need deals and social proof to convert.

**Key traits:** Ages 18-35, compare options, motivated by value
**How to convert:** Show deals, use reviews, target weekends`,
      highlighted_segments: ['Window Shoppers'],
      highlighted_products: [],
      recommendations: []
    }
  }

  if (q.includes('iphone') && (q.includes('audience') || q.includes('who'))) {
    return {
      answer: `**iPhone 15 Pro** appeals primarily to **High Converters** customers.

**Target Audience Profile:**
- Primary segment: High Converters
- Demographics: Tech professionals, content creators, affluent millennials

**Why They Choose iPhone:**
- Key appeals: Latest A17 Pro chip, Titanium build, Pro camera system
- Motivations: Professional photography, Status symbol, iOS ecosystem

**Marketing Strategy:**
- Best messaging: "Cutting-edge performance meets professional-grade capabilities"
- Emotional triggers: Innovation, Prestige, Creativity
- Avoid: Price comparisons, budget-focused messaging`,
      highlighted_segments: ['High Converters'],
      highlighted_products: ['iPhone 15 Pro'],
      recommendations: []
    }
  }

  if (q.includes('samsung') && (q.includes('audience') || q.includes('customers'))) {
    return {
      answer: `**Samsung Galaxy S24** resonates with **Loyal Customers** and Android enthusiasts.

**Target Audience:**
- Primary segment: Loyal Customers
- Profile: Tech-savvy users, Android loyalists, value-conscious professionals

**Audience Preferences:**
- Appeal factors: AI features, Camera improvements, Android customization
- Key motivations: Android preference, Value for features, Brand familiarity

**Marketing Approach:**
- Messaging: "Smart innovation that works the way you do"
- Emotional connects: Intelligence, Reliability, Personalization`,
      highlighted_segments: ['Loyal Customers'],
      highlighted_products: ['Samsung Galaxy S24'],
      recommendations: []
    }
  }

  if (q.includes('loyal customers')) {
    return {
      answer: `**Loyal Customers** are your most reliable customers (9.7% of customers, 4,256 people).

**Loyalty Profile:**
- Brand loyalty: Very High - repeat purchases from same brands
- Purchase pattern: Bi-monthly
- Average value: $850

**What Keeps Them Loyal:**
- Primary motivation: Trust and reliability
- Preferred communication: Personal recommendations, loyalty rewards, exclusive offers
- Best channels: Email, Direct website, Customer service

**Retention Strategy:**
- Focus on Trust and reliability
- Avoid: Brand discontinuations, poor customer service`,
      highlighted_segments: ['Loyal Customers'],
      highlighted_products: [],
      recommendations: []
    }
  }

  if (q.includes('cart abandon') || q.includes('abandoners')) {
    return {
      answer: `**Cart Abandoners** represent a major opportunity (20.3% of customers, 8,941 people).

**Abandonment Patterns:**
- Main motivation: Finding the best deal possible
- Pain points: Unexpected costs, complicated checkout, price uncertainty
- Price sensitivity: Very High - abandons cart for better deals

**Recovery Strategy:**
- Communication style: Urgency tactics, limited-time offers, price comparisons
- Best timing: Evening browsing, weekend purchases
- Potential value: $320

**What Works:**
- Target their need for Finding the best deal possible
- Address Unexpected costs, complicated checkout, price uncertainty`,
      highlighted_segments: ['Cart Abandoners'],
      highlighted_products: [],
      recommendations: []
    }
  }

  // General overview
  return {
    answer: `Here's an overview of your customer audience:

**Primary Segments:**
- **High Converters** (6.5%): Premium customers who value quality and latest technology
- **Window Shoppers** (35.4%): Price-conscious browsers who need compelling offers
- **Loyal Customers** (9.7%): Reliable repeat purchasers who trust your brand
- **Cart Abandoners** (20.3%): Deal-seekers who need incentives to complete purchases
- **At Risk** (28.1%): Dormant customers who need re-engagement

**Top Product Appeals:**
- **iPhone 15 Pro**: Appeals to tech professionals and status-conscious users
- **Samsung Galaxy S24**: Attracts Android loyalists and feature-focused buyers
- **MacBook Air M3**: Targets creative professionals and productivity-focused users

Ask me specific questions about any segment or product to get detailed audience insights!`,
    highlighted_segments: ['High Converters', 'Window Shoppers', 'Loyal Customers'],
    highlighted_products: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M3'],
    recommendations: []
  }
}