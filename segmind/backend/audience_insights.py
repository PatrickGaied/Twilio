from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import json

router = APIRouter()

# Mock audience insights data
AUDIENCE_INSIGHTS = {
    "customer_segments": {
        "High Converters": {
            "size": 2847,
            "percentage": 6.5,
            "demographics": {
                "age_range": "25-45",
                "income_level": "High ($75k+)",
                "location": "Urban areas, Tech hubs"
            },
            "behavior": {
                "purchase_frequency": "Monthly",
                "avg_order_value": "$1,200",
                "preferred_channels": ["Email", "Push notifications"],
                "peak_activity": "Evenings (6-9 PM)"
            },
            "preferences": {
                "product_categories": ["Premium smartphones", "High-end laptops", "Professional accessories"],
                "brand_loyalty": "Very High - stick to trusted brands",
                "price_sensitivity": "Low - willing to pay for quality",
                "communication_style": "Technical details, specifications, reviews"
            },
            "motivations": {
                "primary": "Latest technology and performance",
                "secondary": "Status and professional image",
                "pain_points": "Outdated technology, slow performance"
            }
        },
        "Window Shoppers": {
            "size": 15623,
            "percentage": 35.4,
            "demographics": {
                "age_range": "18-35",
                "income_level": "Medium ($40-75k)",
                "location": "Suburban and urban mix"
            },
            "behavior": {
                "purchase_frequency": "Quarterly",
                "avg_order_value": "$450",
                "preferred_channels": ["Social media", "Website browsing", "Email"],
                "peak_activity": "Weekends and lunch breaks"
            },
            "preferences": {
                "product_categories": ["Mid-range smartphones", "Accessories", "Consumer electronics"],
                "brand_loyalty": "Medium - compare multiple options",
                "price_sensitivity": "High - very price conscious",
                "communication_style": "Visual content, deals and promotions, social proof"
            },
            "motivations": {
                "primary": "Value for money and good deals",
                "secondary": "Social validation and trends",
                "pain_points": "High prices, decision paralysis"
            }
        },
        "Loyal Customers": {
            "size": 4256,
            "percentage": 9.7,
            "demographics": {
                "age_range": "30-55",
                "income_level": "Medium-High ($50-100k)",
                "location": "Mixed urban/suburban"
            },
            "behavior": {
                "purchase_frequency": "Bi-monthly",
                "avg_order_value": "$850",
                "preferred_channels": ["Email", "Direct website", "Customer service"],
                "peak_activity": "Tuesday-Thursday mornings"
            },
            "preferences": {
                "product_categories": ["Consistent brand products", "Upgrades", "Bundles"],
                "brand_loyalty": "Very High - repeat purchases from same brands",
                "price_sensitivity": "Medium - value quality over lowest price",
                "communication_style": "Personal recommendations, loyalty rewards, exclusive offers"
            },
            "motivations": {
                "primary": "Trust and reliability",
                "secondary": "Convenience and familiarity",
                "pain_points": "Brand discontinuations, poor customer service"
            }
        },
        "Cart Abandoners": {
            "size": 8941,
            "percentage": 20.3,
            "demographics": {
                "age_range": "22-40",
                "income_level": "Medium ($35-65k)",
                "location": "Diverse geographic spread"
            },
            "behavior": {
                "purchase_frequency": "Sporadic",
                "avg_order_value": "$320",
                "preferred_channels": ["Mobile apps", "Social media", "Email reminders"],
                "peak_activity": "Evening browsing, weekend purchases"
            },
            "preferences": {
                "product_categories": ["Trending items", "Seasonal products", "Impulse buys"],
                "brand_loyalty": "Low - easily distracted by alternatives",
                "price_sensitivity": "Very High - abandons cart for better deals",
                "communication_style": "Urgency tactics, limited-time offers, price comparisons"
            },
            "motivations": {
                "primary": "Finding the best deal possible",
                "secondary": "Avoiding buyer's remorse",
                "pain_points": "Unexpected costs, complicated checkout, price uncertainty"
            }
        },
        "At Risk": {
            "size": 12387,
            "percentage": 28.1,
            "demographics": {
                "age_range": "35-60",
                "income_level": "Mixed ($30-80k)",
                "location": "Broader geographic distribution"
            },
            "behavior": {
                "purchase_frequency": "Rare (6+ months)",
                "avg_order_value": "$180",
                "preferred_channels": ["Traditional email", "Phone calls", "Physical stores"],
                "peak_activity": "Weekday mornings"
            },
            "preferences": {
                "product_categories": ["Basic necessities", "Replacement items", "Budget options"],
                "brand_loyalty": "Medium - but dormant",
                "price_sensitivity": "Very High - only purchases on deep discounts",
                "communication_style": "Simple messaging, clear value propositions, nostalgia"
            },
            "motivations": {
                "primary": "Essential needs only",
                "secondary": "Extreme value and savings",
                "pain_points": "Budget constraints, loss of interest, competitor alternatives"
            }
        }
    },
    "top_products": {
        "iPhone 15 Pro": {
            "category": "Premium Smartphone",
            "audience_appeal": {
                "primary_segment": "High Converters",
                "appeal_factors": ["Latest A17 Pro chip", "Titanium build", "Pro camera system"],
                "audience_motivations": ["Professional photography", "Status symbol", "iOS ecosystem"],
                "demographic_skew": "Tech professionals, content creators, affluent millennials"
            },
            "marketing_insights": {
                "best_messaging": "Cutting-edge performance meets professional-grade capabilities",
                "emotional_triggers": ["Innovation", "Prestige", "Creativity"],
                "avoid": "Price comparisons, budget-focused messaging"
            }
        },
        "Samsung Galaxy S24": {
            "category": "Premium Android Smartphone",
            "audience_appeal": {
                "primary_segment": "Loyal Customers",
                "appeal_factors": ["AI features", "Camera improvements", "Android customization"],
                "audience_motivations": ["Android preference", "Value for features", "Brand familiarity"],
                "demographic_skew": "Tech-savvy users, Android loyalists, value-conscious professionals"
            },
            "marketing_insights": {
                "best_messaging": "Smart innovation that works the way you do",
                "emotional_triggers": ["Intelligence", "Reliability", "Personalization"],
                "avoid": "iOS comparisons, overly technical jargon"
            }
        },
        "MacBook Air M3": {
            "category": "Premium Laptop",
            "audience_appeal": {
                "primary_segment": "High Converters",
                "appeal_factors": ["M3 chip performance", "All-day battery", "Lightweight design"],
                "audience_motivations": ["Professional productivity", "Portability", "macOS ecosystem"],
                "demographic_skew": "Creative professionals, students, business executives"
            },
            "marketing_insights": {
                "best_messaging": "Powerful performance that travels with you",
                "emotional_triggers": ["Productivity", "Mobility", "Professional success"],
                "avoid": "Gaming-focused messaging, heavy technical specs"
            }
        }
    }
}

class AudienceInsightRequest(BaseModel):
    question: str
    context: Dict[str, Any] = {}

class AudienceInsightResponse(BaseModel):
    answer: str
    highlighted_segments: List[str]
    highlighted_products: List[str]
    insights: Dict[str, Any]
    recommendations: List[str]

@router.post("/audience-insights", response_model=AudienceInsightResponse)
async def get_audience_insights(request: AudienceInsightRequest):
    """
    Provide audience-focused insights based on questions
    """
    question = request.question.lower()

    # Initialize response
    highlighted_segments = []
    highlighted_products = []
    insights = {}
    recommendations = []

    try:
        # Audience-focused question handling
        if "high converters" in question or "premium customers" in question:
            segment = "High Converters"
            highlighted_segments.append(segment)
            segment_data = AUDIENCE_INSIGHTS["customer_segments"][segment]

            answer = f"""**{segment}** represents your most valuable customer segment ({segment_data['percentage']}% of customers, {segment_data['size']:,} people).

**Who They Are:**
- Demographics: {segment_data['demographics']['age_range']} years old, {segment_data['demographics']['income_level']} income
- Location: {segment_data['demographics']['location']}

**What They Want:**
- Primary motivation: {segment_data['motivations']['primary']}
- They value: {segment_data['preferences']['communication_style']}
- Average spending: {segment_data['behavior']['avg_order_value']} per order

**How to Reach Them:**
- Best channels: {', '.join(segment_data['behavior']['preferred_channels'])}
- Peak activity: {segment_data['behavior']['peak_activity']}
- Message focus: {segment_data['motivations']['primary']}"""

            insights = segment_data
            recommendations = [
                "Focus on premium product features and specifications",
                "Emphasize quality and performance over price",
                "Use technical details and professional imagery",
                "Target evening hours for maximum engagement"
            ]

        elif "window shoppers" in question or "browsers" in question:
            segment = "Window Shoppers"
            highlighted_segments.append(segment)
            segment_data = AUDIENCE_INSIGHTS["customer_segments"][segment]

            answer = f"""**{segment}** is your largest segment ({segment_data['percentage']}% of customers, {segment_data['size']:,} people) but needs careful nurturing.

**Who They Are:**
- Demographics: {segment_data['demographics']['age_range']} years old, {segment_data['demographics']['income_level']} income
- Behavior: Very price-conscious, compare multiple options

**What Motivates Them:**
- Primary goal: {segment_data['motivations']['primary']}
- Pain points: {segment_data['motivations']['pain_points']}
- Communication style: {segment_data['preferences']['communication_style']}

**Conversion Strategy:**
- Show clear value propositions and deals
- Use social proof and visual content
- Target {segment_data['behavior']['peak_activity']}
- Average potential: {segment_data['behavior']['avg_order_value']}"""

            insights = segment_data
            recommendations = [
                "Create compelling visual content and product comparisons",
                "Offer time-limited deals and discounts",
                "Use customer reviews and social proof heavily",
                "Implement retargeting campaigns for browsers"
            ]

        elif "iphone" in question and "audience" in question:
            product = "iPhone 15 Pro"
            highlighted_products.append(product)
            product_data = AUDIENCE_INSIGHTS["top_products"][product]

            answer = f"""**{product}** appeals primarily to **{product_data['audience_appeal']['primary_segment']}** customers.

**Target Audience Profile:**
- Primary segment: {product_data['audience_appeal']['primary_segment']}
- Demographics: {product_data['audience_appeal']['demographic_skew']}

**Why They Choose iPhone:**
- Key appeals: {', '.join(product_data['audience_appeal']['appeal_factors'])}
- Motivations: {', '.join(product_data['audience_appeal']['audience_motivations'])}

**Marketing Strategy:**
- Best messaging: "{product_data['marketing_insights']['best_messaging']}"
- Emotional triggers: {', '.join(product_data['marketing_insights']['emotional_triggers'])}
- Avoid: {product_data['marketing_insights']['avoid']}"""

            highlighted_segments.append(product_data['audience_appeal']['primary_segment'])
            insights = product_data
            recommendations = [
                "Target tech professionals and content creators",
                "Emphasize pro camera and performance features",
                "Use premium, sophisticated visual design",
                "Focus on creative and professional use cases"
            ]

        elif "samsung" in question and ("audience" in question or "customers" in question):
            product = "Samsung Galaxy S24"
            highlighted_products.append(product)
            product_data = AUDIENCE_INSIGHTS["top_products"][product]

            answer = f"""**{product}** resonates with **{product_data['audience_appeal']['primary_segment']}** and Android enthusiasts.

**Target Audience:**
- Primary segment: {product_data['audience_appeal']['primary_segment']}
- Profile: {product_data['audience_appeal']['demographic_skew']}

**Audience Preferences:**
- Appeal factors: {', '.join(product_data['audience_appeal']['appeal_factors'])}
- Key motivations: {', '.join(product_data['audience_appeal']['audience_motivations'])}

**Marketing Approach:**
- Messaging: "{product_data['marketing_insights']['best_messaging']}"
- Emotional connects: {', '.join(product_data['marketing_insights']['emotional_triggers'])}"""

            highlighted_segments.append(product_data['audience_appeal']['primary_segment'])
            insights = product_data
            recommendations = [
                "Highlight AI and customization features",
                "Target existing Android users for upgrades",
                "Emphasize value and feature richness",
                "Use practical, real-world use cases"
            ]

        elif "loyal customers" in question:
            segment = "Loyal Customers"
            highlighted_segments.append(segment)
            segment_data = AUDIENCE_INSIGHTS["customer_segments"][segment]

            answer = f"""**{segment}** are your most reliable customers ({segment_data['percentage']}% of customers, {segment_data['size']:,} people).

**Loyalty Profile:**
- Brand loyalty: {segment_data['preferences']['brand_loyalty']}
- Purchase pattern: {segment_data['behavior']['purchase_frequency']}
- Average value: {segment_data['behavior']['avg_order_value']}

**What Keeps Them Loyal:**
- Primary motivation: {segment_data['motivations']['primary']}
- Preferred communication: {segment_data['preferences']['communication_style']}
- Best channels: {', '.join(segment_data['behavior']['preferred_channels'])}

**Retention Strategy:**
- Focus on {segment_data['motivations']['primary']}
- Avoid: {segment_data['motivations']['pain_points']}"""

            insights = segment_data
            recommendations = [
                "Implement exclusive loyalty program benefits",
                "Provide early access to new products",
                "Maintain consistent customer service quality",
                "Send personalized recommendations based on history"
            ]

        elif "cart abandon" in question or "abandoners" in question:
            segment = "Cart Abandoners"
            highlighted_segments.append(segment)
            segment_data = AUDIENCE_INSIGHTS["customer_segments"][segment]

            answer = f"""**{segment}** represent a major opportunity ({segment_data['percentage']}% of customers, {segment_data['size']:,} people).

**Abandonment Patterns:**
- Main motivation: {segment_data['motivations']['primary']}
- Pain points: {segment_data['motivations']['pain_points']}
- Price sensitivity: {segment_data['preferences']['price_sensitivity']}

**Recovery Strategy:**
- Communication style: {segment_data['preferences']['communication_style']}
- Best timing: {segment_data['behavior']['peak_activity']}
- Potential value: {segment_data['behavior']['avg_order_value']}

**What Works:**
- Target their need for {segment_data['motivations']['primary']}
- Address {segment_data['motivations']['pain_points']}"""

            insights = segment_data
            recommendations = [
                "Implement urgency-based email sequences",
                "Offer limited-time discounts for cart items",
                "Simplify checkout process and show total costs upfront",
                "Use exit-intent popups with compelling offers"
            ]

        else:
            # General audience overview
            answer = """Here's an overview of your customer audience:

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

Ask me specific questions about any segment or product to get detailed audience insights!"""

            highlighted_segments = ["High Converters", "Window Shoppers", "Loyal Customers"]
            highlighted_products = ["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air M3"]
            recommendations = [
                "Segment your messaging for each audience type",
                "Personalize product recommendations based on segment behavior",
                "Test different communication styles for each group",
                "Focus retention efforts on High Converters and Loyal Customers"
            ]

        return AudienceInsightResponse(
            answer=answer,
            highlighted_segments=highlighted_segments,
            highlighted_products=highlighted_products,
            insights=insights,
            recommendations=recommendations
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.get("/audience-segments")
async def get_audience_segments():
    """Get all audience segments with basic info"""
    segments = []
    for name, data in AUDIENCE_INSIGHTS["customer_segments"].items():
        segments.append({
            "name": name,
            "size": data["size"],
            "percentage": data["percentage"],
            "primary_motivation": data["motivations"]["primary"]
        })
    return {"segments": segments}

@router.get("/product-audiences")
async def get_product_audiences():
    """Get product audience information"""
    products = []
    for name, data in AUDIENCE_INSIGHTS["top_products"].items():
        products.append({
            "name": name,
            "category": data["category"],
            "primary_segment": data["audience_appeal"]["primary_segment"],
            "demographic_skew": data["audience_appeal"]["demographic_skew"]
        })
    return {"products": products}