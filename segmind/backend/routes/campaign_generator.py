from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import random
import requests
import os
import re

router = APIRouter(prefix="/api/campaign-generator", tags=["campaign-generator"])

class Product(BaseModel):
    name: str
    category: Optional[str] = None
    price: Optional[float] = None

class Strategy(BaseModel):
    product: str
    primaryAudience: str
    strategy: str
    emailType: Optional[str] = "informative"
    customPrompt: Optional[str] = ""

class WeeklySchedule(BaseModel):
    day: str
    time: str
    type: str
    audience: str
    emailTheme: str

class CampaignCardsRequest(BaseModel):
    product: Product
    strategy: Strategy
    weeklySchedule: List[WeeklySchedule]

class CampaignCard(BaseModel):
    id: str
    day: str
    time: str
    type: str
    audience: str
    theme: str
    subject: Optional[str] = ""
    preview: Optional[str] = ""
    prompt: Optional[str] = ""
    emailContent: Optional[str] = ""
    imagePrompt: Optional[str] = ""
    status: str = "pending"

class ProcessCardsRequest(BaseModel):
    cards: List[CampaignCard]
    product: Product
    strategy: Strategy

class CampaignCardGenerator:
    def __init__(self, openai_api_key: Optional[str] = None):
        """
        Initialize the campaign card generator.

        Args:
            openai_api_key: OpenAI API key. If None, will try to get from environment.
        """
        # TEMP VARIABLE: Store API key temporarily for class usage
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')

    def generate_campaign_cards(self, product: Dict[str, Any], strategy: Dict[str, Any],
                               weekly_schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate campaign cards for a given product and strategy.

        Args:
            product: Product information (name, etc.)
            strategy: Marketing strategy details
            weekly_schedule: List of scheduled campaigns

        Returns:
            List of campaign card dictionaries
        """
        if self.openai_api_key:
            try:
                return self._generate_with_openai(product, strategy, weekly_schedule)
            except Exception as e:
                print(f"OpenAI generation failed: {e}")

        return self._generate_with_templates(product, strategy, weekly_schedule)

    def _generate_with_openai(self, product: Dict[str, Any], strategy: Dict[str, Any],
                             weekly_schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate campaign cards using OpenAI API."""

        # TEMP VARIABLE: Build schedule text for API prompt
        schedule_text = "\n".join([
            f"{s['day']} {s['time']}: {s['type']} for {s['audience']}"
            for s in weekly_schedule
        ])

        # TEMP VARIABLE: Prepare API request headers
        headers = {
            'Authorization': f'Bearer {self.openai_api_key}',
            'Content-Type': 'application/json',
        }

        # TEMP VARIABLE: Build API request payload
        payload = {
            'model': 'gpt-4',
            'messages': [
                {
                    'role': 'system',
                    'content': '''You are a marketing campaign generator. Create email campaign cards based on the provided strategy.
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
  "imagePrompt": "detailed_image_generation_prompt_based_on_campaign_content",
  "status": "pending"
}

IMPORTANT: The imagePrompt should be a detailed description that reflects the campaign's specific message and theme. For example:
- If the subject mentions "Amazing Features", the image prompt should describe showing the product with highlighted features
- If it's about "running" or sports, include a person engaged in that activity with the product
- If it's a discount campaign, show the product with price tags or sale badges
- Make the image prompt contextual and specific to each campaign's unique message'''
                },
                {
                    'role': 'user',
                    'content': f'''Generate campaign cards for:
Product: {product.get('name', 'Unknown Product')}
Primary Audience: {strategy.get('primaryAudience', 'General audience')}

IMPORTANT USER REQUEST: {strategy.get('customPrompt', '')}

Weekly Schedule:
{schedule_text}

CRITICAL INSTRUCTIONS:
1. Follow the user's custom prompt EXACTLY - if they ask for "15% discount", make it about 15% discount
2. DO NOT change discount percentages or add generic product introductions
3. Target the specified audience (e.g., window shoppers need deals and urgency, not generic features)
4. Generate contextual image prompts that match the actual campaign content
5. If user mentions a specific discount or offer, EVERY campaign should include that offer

Remember: Window shoppers respond to deals, discounts, and urgency - not generic product descriptions!'''
                }
            ],
            'temperature': 0.7,
            'max_tokens': 2000,
        }

        # TEMP VARIABLE: Store API response
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )

        if not response.ok:
            raise Exception(f"OpenAI API request failed: {response.status_code}")

        # TEMP VARIABLE: Parse response data
        ai_data = response.json()
        # TEMP VARIABLE: Extract generated content from AI response
        generated_content = ai_data['choices'][0]['message']['content']

        try:
            # TEMP VARIABLE: Parse JSON from AI response
            campaign_cards = json.loads(generated_content)
            return campaign_cards
        except json.JSONDecodeError:
            raise Exception("Failed to parse JSON from AI response")

    def _generate_with_templates(self, product: Dict[str, Any], strategy: Dict[str, Any],
                                weekly_schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate campaign cards using predefined templates."""

        # TEMP VARIABLE: Initialize list to collect campaign cards
        campaign_cards = []

        # Check if user specified a discount in their custom prompt
        custom_prompt = strategy.get('customPrompt', '')
        discount_match = re.search(r'(\d+)%', custom_prompt)
        has_discount = discount_match is not None
        discount_percent = discount_match.group(1) if discount_match else None

        # TEMP VARIABLE: Loop through schedule items with index
        for index, schedule in enumerate(weekly_schedule):
            # Generate subject based on whether there's a discount
            if has_discount:
                subject = self._generate_discount_subject(product.get('name', 'Product'),
                                                        schedule['type'], discount_percent)
            else:
                subject = self._generate_subject(product.get('name', 'Product'),
                                               schedule['type'], schedule['audience'])

            # Generate email content based on discount
            if has_discount:
                email_content = self._generate_discount_email(product.get('name', 'Product'),
                                                            schedule['type'], discount_percent)
            else:
                email_content = self._generate_email_content(product.get('name', 'Product'),
                                                           schedule['type'], schedule['audience'])

            # TEMP VARIABLE: Build individual campaign card
            card = {
                'id': f"card_{int(datetime.now().timestamp())}_{index}",
                'day': schedule['day'],
                'time': schedule['time'],
                'type': schedule['type'],
                'audience': schedule['audience'],
                'theme': self._get_theme_for_campaign(schedule['type']),
                'subject': subject,
                'preview': f"{schedule['day']} {schedule['time']}: {schedule['type']}",
                'prompt': custom_prompt if custom_prompt else f"{schedule['type']} email for {schedule['audience']} promoting {product.get('name', 'Product')}",
                'emailContent': email_content,
                'imagePrompt': self._generate_image_prompt(product.get('name', 'Product'),
                                                         schedule['type'], subject, schedule['audience']),
                'status': 'pending'
            }
            campaign_cards.append(card)

        return campaign_cards

    def _get_theme_for_campaign(self, campaign_type: str) -> str:
        """Get theme for campaign type."""
        # TEMP VARIABLE: Theme mapping dictionary
        themes = {
            'Primary Campaign': 'Modern & Clean',
            'Follow-up': 'Urgent & Direct',
            'Premium Drop': 'Luxury & Exclusive',
            'Weekly Recap': 'Friendly & Informative',
            'Sale Campaign': 'Bold & Exciting',
            'Promotional Campaign': 'Vibrant & Engaging',
            'Educational Recap': 'Professional & Informative'
        }
        return themes.get(campaign_type, 'Engaging & Professional')

    def _generate_discount_subject(self, product_name: str, campaign_type: str, discount: str) -> str:
        """Generate discount-specific subject lines."""
        subjects = {
            'Primary Campaign': [
                f"🔥 {discount}% OFF {product_name} - Limited Time!",
                f"Exclusive: {product_name} at {discount}% Off - Act Now!",
                f"Save {discount}% on {product_name} Today Only!"
            ],
            'Follow-up': [
                f"⏰ Your {discount}% discount on {product_name} expires soon!",
                f"Last Chance: {discount}% off {product_name} ending!",
                f"Don't Miss Out - {discount}% off {product_name} almost gone!"
            ],
            'Premium Drop': [
                f"VIP Only: {discount}% off {product_name}",
                f"Exclusive {discount}% discount on {product_name} for members",
                f"Premium Deal: Save {discount}% on {product_name}"
            ],
            'Weekly Recap': [
                f"Still Available: {discount}% off {product_name}",
                f"Weekend Special: {discount}% discount on {product_name}",
                f"Don't forget: {discount}% off {product_name} this week"
            ]
        }
        type_subjects = subjects.get(campaign_type, subjects['Primary Campaign'])
        return random.choice(type_subjects)

    def _generate_discount_email(self, product_name: str, campaign_type: str, discount: str) -> str:
        """Generate discount-focused email content."""
        if campaign_type == 'Primary Campaign':
            return f"""Hi {{{{first_name}}}},

🎉 SPECIAL OFFER: Save {discount}% on the {product_name}!

This is your chance to get the {product_name} at an incredible {discount}% discount.
Perfect for smart shoppers looking for the best deals!

✨ Why this deal is amazing:
• Save {discount}% off regular price
• Limited time offer
• Free shipping included
• 30-day money-back guarantee

[GRAB YOUR {discount}% DISCOUNT NOW]

Hurry - this offer won't last long!

Best regards,
The Segmind Team"""
        elif campaign_type == 'Follow-up':
            return f"""Hi {{{{first_name}}}},

⏰ TIME IS RUNNING OUT!

Your exclusive {discount}% discount on the {product_name} is about to expire!

Don't let this amazing deal slip away. You've shown interest in the {product_name},
and we don't want you to miss out on saving {discount}%.

[CLAIM YOUR {discount}% DISCOUNT]

This offer expires soon - act now!

Best regards,
The Segmind Team"""
        else:
            return self._generate_email_content(product_name, campaign_type, "Window Shoppers")

    def _generate_subject(self, product_name: str, campaign_type: str, audience: str) -> str:
        """Generate email subject line."""
        # TEMP VARIABLE: Subject line templates dictionary
        subjects = {
            'Primary Campaign': [
                f"New {product_name} - Perfect for You!",
                f"Discover the Latest {product_name}",
                f"{product_name} - Now Available"
            ],
            'Follow-up': [
                f"Don't Miss Out - {product_name} Still Available",
                f"Your Cart is Waiting - Complete Your {product_name} Purchase",
                f"Last Chance for {product_name}"
            ],
            'Premium Drop': [
                f"Exclusive: {product_name} VIP Access",
                f"Premium Members Only: {product_name}",
                f"Limited Edition {product_name} - For You"
            ],
            'Weekly Recap': [
                f"This Week's Tech Highlights",
                f"Weekly Update: {product_name} & More",
                f"Don't Miss These Updates"
            ],
            'Sale Campaign': [
                f"Flash Sale: {product_name} - Limited Time!",
                f"Save Big on {product_name} Today Only",
                f"🔥 Hot Deal: {product_name} Sale"
            ],
            'Promotional Campaign': [
                f"Special Promotion: {product_name}",
                f"Limited Time Offer: {product_name}",
                f"Exclusive Deal on {product_name}"
            ]
        }

        # TEMP VARIABLE: Get subject options for campaign type
        type_subjects = subjects.get(campaign_type, subjects['Primary Campaign'])
        return random.choice(type_subjects)

    def _generate_email_content(self, product_name: str, campaign_type: str, audience: str) -> str:
        """Generate email content."""
        # TEMP VARIABLE: Email content templates dictionary
        templates = {
            'Primary Campaign': f"""Hi {{{{first_name}}}},

We're excited to introduce you to the {product_name}!

As someone who appreciates quality technology, we thought you'd love to know about this latest addition to our collection.

✨ Key Features:
• Premium design and build quality
• Latest technology innovations
• Perfect for your lifestyle

Ready to learn more?

Best regards,
The Segmind Team""",

            'Follow-up': f"""Hi {{{{first_name}}}},

We noticed you were interested in the {product_name}. Your cart is still waiting for you!

Don't let this opportunity slip away. Complete your purchase now and enjoy:
• Fast, free shipping
• 30-day money-back guarantee
• Exclusive member pricing

[Complete Your Purchase]

Best regards,
The Segmind Team""",

            'Premium Drop': f"""Hi {{{{first_name}}}},

As one of our premium members, you get exclusive early access to the {product_name}.

This is a limited-time offer available only to our most valued customers like you.

🔥 Exclusive Benefits:
• 20% member discount
• Priority shipping
• Extended warranty

[Claim Your Exclusive Access]

Best regards,
The Segmind Team""",

            'Weekly Recap': f"""Hi {{{{first_name}}}},

Here's what's trending this week in tech:

📱 Featured: {product_name}
🔥 Hot deals and new arrivals
📊 Personalized recommendations for you

Stay ahead of the curve with the latest technology trends.

[Explore This Week's Picks]

Best regards,
The Segmind Team""",

            'Sale Campaign': f"""Hi {{{{first_name}}}},

🚨 FLASH SALE ALERT! 🚨

The {product_name} is on sale for a limited time only!

💥 Special Offer:
• Up to 40% OFF regular price
• Free express shipping
• Extended return period

Don't wait - this deal ends soon!

[Shop Sale Now]

Best regards,
The Segmind Team"""
        }

        return templates.get(campaign_type, templates['Primary Campaign'])

    def _generate_image_prompt(self, product_name: str, campaign_type: str, subject: str = None, audience: str = None) -> str:
        """Generate contextual image prompt based on campaign content."""

        # Analyze subject line for contextual clues
        context_additions = []

        if subject:
            subject_lower = subject.lower()

            # Activity-based contexts
            if any(word in subject_lower for word in ['run', 'running', 'sport', 'fitness', 'workout', 'exercise']):
                context_additions.append("with an athletic person running or exercising")
            elif any(word in subject_lower for word in ['work', 'office', 'professional', 'business']):
                context_additions.append("in a modern office setting with a professional using the device")
            elif any(word in subject_lower for word in ['travel', 'adventure', 'explore']):
                context_additions.append("in a travel context with scenic backgrounds")
            elif any(word in subject_lower for word in ['student', 'study', 'learn', 'education']):
                context_additions.append("with a student in a study environment")

            # Feature-based contexts
            if any(word in subject_lower for word in ['water', 'waterproof', 'resistant', 'underwater']):
                context_additions.append("underwater or with water splashing, showcasing water resistance")
            elif any(word in subject_lower for word in ['camera', 'photo', 'picture']):
                context_additions.append("showcasing the camera capabilities with sample photos")
            elif any(word in subject_lower for word in ['speed', 'fast', 'performance', 'powerful']):
                context_additions.append("with dynamic motion effects suggesting speed and performance")
            elif any(word in subject_lower for word in ['battery', 'charge', 'power']):
                context_additions.append("highlighting battery life with charging indicators")
            elif any(word in subject_lower for word in ['durable', 'tough', 'strong', 'rugged']):
                context_additions.append("in extreme conditions showing durability and toughness")
            elif 'feature' in subject_lower or 'amazing' in subject_lower:
                context_additions.append("with key features highlighted and annotated around the product")

            # Promotional contexts
            if '50%' in subject_lower or 'half' in subject_lower:
                context_additions.append("with large bold '50% OFF' badge in vibrant colors, price slash graphics")
            elif any(word in subject_lower for word in ['discount', 'sale', 'save', '%', 'offer']):
                # Extract percentage if present
                percent_match = re.search(r'(\d+)%', subject_lower)
                if percent_match:
                    context_additions.append(f"with bold '{percent_match.group(0)} OFF' badge and sale tags")
                else:
                    context_additions.append("with prominent discount badges and price tags")
            elif any(word in subject_lower for word in ['exclusive', 'vip', 'premium', 'limited']):
                context_additions.append("with luxury golden accents and exclusive badges")
            elif any(word in subject_lower for word in ['new', 'latest', 'just arrived']):
                context_additions.append("with 'NEW' badges and fresh, modern styling")

            # Urgency contexts
            if any(word in subject_lower for word in ['expire', 'ending', 'last chance', 'hurry', 'today only']):
                context_additions.append("with countdown timer or urgency indicators")
            elif any(word in subject_lower for word in ['grab', 'don\'t miss', 'act now']):
                context_additions.append("with action-oriented visual cues and arrows pointing to CTA")

        # Base prompts for each campaign type
        base_prompts = {
            'Primary Campaign': f"High-quality product shot of {product_name}",
            'Follow-up': f"{product_name} with urgency elements",
            'Premium Drop': f"Luxury presentation of {product_name}",
            'Weekly Recap': f"Collection featuring {product_name}",
            'Sale Campaign': f"Sale promotion for {product_name}",
            'Promotional Campaign': f"Promotional display of {product_name}"
        }

        base_prompt = base_prompts.get(campaign_type, base_prompts['Primary Campaign'])

        # Combine base prompt with contextual additions
        if context_additions:
            return f"{base_prompt} {', '.join(context_additions)}, professional photography, high resolution, marketing ready"
        else:
            # Fallback to detailed type-specific prompts
            detailed_prompts = {
                'Primary Campaign': f"Clean, modern product photography of {product_name} on a minimal white background with soft studio lighting, professional commercial style",
                'Follow-up': f"{product_name} with a subtle urgency overlay, warm lighting, call-to-action focused design",
                'Premium Drop': f"Luxury product shot of {product_name} with dramatic lighting, black or dark background, premium feel, exclusive atmosphere",
                'Weekly Recap': f"Collection layout featuring {product_name} alongside other tech products, organized grid layout, modern tech aesthetic",
                'Sale Campaign': f"Dynamic sale image of {product_name} with bold red and yellow accents, sale badges, energetic composition",
                'Promotional Campaign': f"Promotional banner style image of {product_name} with vibrant colors, special offer styling, eye-catching design"
            }
            return detailed_prompts.get(campaign_type, detailed_prompts['Primary Campaign'])


@router.post("/generate-cards")
def generate_campaign_cards(request: CampaignCardsRequest):
    """Generate email campaign cards using our Python generator"""
    try:
        # TEMP VARIABLE: Initialize the generator
        generator = CampaignCardGenerator()

        # TEMP VARIABLE: Convert request to the format expected by the generator
        product_dict = request.product.dict()
        strategy_dict = request.strategy.dict()
        schedule_list = [schedule.dict() for schedule in request.weeklySchedule]

        # TEMP VARIABLE: Generate campaign cards
        cards = generator.generate_campaign_cards(
            product=product_dict,
            strategy=strategy_dict,
            weekly_schedule=schedule_list
        )

        return {
            "success": True,
            "cards": cards,
            "generated_at": datetime.now().isoformat(),
            "total_cards": len(cards)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate campaign cards: {str(e)}"
        )

@router.post("/process-cards")
def process_campaign_cards(request: ProcessCardsRequest):
    """Process campaign cards sent from UI and enhance them with AI"""
    try:
        # TEMP VARIABLE: Initialize the generator with OpenAI support
        generator = CampaignCardGenerator()

        # TEMP VARIABLE: Convert request to the format expected by the main generator
        product_dict = request.product.dict()
        strategy_dict = request.strategy.dict()

        # TEMP VARIABLE: Convert cards to weekly schedule format for AI generation
        weekly_schedule = []
        for card in request.cards:
            schedule_item = {
                'day': card.day,
                'time': card.time,
                'type': card.type,
                'audience': card.audience,
                'emailTheme': card.theme
            }
            weekly_schedule.append(schedule_item)

        # TEMP VARIABLE: Use the main generator method that includes OpenAI integration
        enhanced_cards = generator.generate_campaign_cards(
            product=product_dict,
            strategy=strategy_dict,
            weekly_schedule=weekly_schedule
        )

        # TEMP VARIABLE: Map the generated cards back to the original card IDs
        processed_cards = []
        for i, card in enumerate(request.cards):
            if i < len(enhanced_cards):
                # Use AI-generated content
                enhanced_card = enhanced_cards[i]
                enhanced_card['id'] = card.id  # Preserve original ID
                enhanced_card['status'] = card.status
            else:
                # Fallback for any missing cards
                subject = generator._generate_subject(product_dict.get('name'), card.type, card.audience)
                enhanced_card = {
                    "id": card.id,
                    "day": card.day,
                    "time": card.time,
                    "type": card.type,
                    "audience": card.audience,
                    "theme": card.theme,
                    "subject": subject,
                    "preview": f"{card.day} {card.time}: {card.type} for {card.audience}",
                    "prompt": f"{card.type} email for {card.audience} promoting {product_dict.get('name')}",
                    "emailContent": generator._generate_email_content(product_dict.get('name'), card.type, card.audience),
                    "imagePrompt": generator._generate_image_prompt(product_dict.get('name'), card.type, subject, card.audience),
                    "status": card.status
                }

            processed_cards.append(enhanced_card)

        return {
            "success": True,
            "cards": processed_cards,
            "processed_at": datetime.now().isoformat(),
            "total_cards": len(processed_cards),
            "ai_generated": True
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process campaign cards: {str(e)}"
        )

@router.get("/test")
def test_generator():
    """Test endpoint to verify the campaign generator works"""
    # TEMP VARIABLE: Test product data
    test_product = {
        'name': 'iPhone 15 Pro',
        'category': 'Phones',
        'price': 999
    }

    # TEMP VARIABLE: Test strategy data
    test_strategy = {
        'product': 'iPhone 15 Pro',
        'primaryAudience': 'Window Shoppers',
        'strategy': 'Generate targeted informative email campaigns',
        'emailType': 'informative'
    }

    # TEMP VARIABLE: Test schedule data
    test_schedule = [
        {
            'day': 'Monday',
            'time': '10:00 AM',
            'type': 'Primary Campaign',
            'audience': 'Window Shoppers',
            'emailTheme': 'Discovery'
        }
    ]

    # TEMP VARIABLE: Initialize generator and generate test cards
    generator = CampaignCardGenerator()
    cards = generator.generate_campaign_cards(test_product, test_strategy, test_schedule)

    return {
        "success": True,
        "message": "Campaign generator is working",
        "test_cards": cards
    }