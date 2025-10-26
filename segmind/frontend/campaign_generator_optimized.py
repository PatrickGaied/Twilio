from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import random
import requests
import os
import threading
import time
from threading import Thread

router = APIRouter(prefix="/api/campaign-generator", tags=["campaign-generator"])

class ReturnThread(Thread):
    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}, verbose=None):
        super().__init__(group, target, name, args, kwargs)
        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)

    def join(self):
        super().join()
        return self._return


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

        # Determine if this is Google Ads or Email campaign
        is_google_ads = strategy.get('emailType', '').startswith('google-ads')
        campaign_format = 'Google Ads' if is_google_ads else 'Email'

        # TEMP VARIABLE: Build API request payload
        payload = {
            'model': 'gpt-4',
            'messages': [
                {
                    'role': 'system',
                    'content': f'''You are a marketing campaign generator. Create {campaign_format.lower()} campaign cards based on the provided strategy.

For EMAIL campaigns, return a JSON array with this structure:
{{
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
}}

For GOOGLE ADS campaigns, return a JSON array with this structure:
{{
  "id": "unique_id",
  "day": "day_name",
  "time": "time",
  "type": "campaign_type",
  "audience": "target_audience",
  "theme": "ad_theme",
  "subject": "ad_headline",
  "preview": "ad_preview_text",
  "prompt": "generation_prompt",
  "emailContent": "ad_copy_and_details",
  "imagePrompt": "visual_description_for_ad",
  "status": "pending",
  "aspectRatio": "9:16 or 16:9",
  "adFormat": "vertical or horizontal"
}}'''
                },
                {
                    'role': 'user',
                    'content': f'''Generate {campaign_format.lower()} campaign cards for:
Product: {product.get('name', 'Unknown Product')}
Strategy: {strategy.get('strategy', 'Standard marketing strategy')}
Primary Audience: {strategy.get('primaryAudience', 'General audience')}
Campaign Type: {strategy.get('emailType', 'informative')}
Custom Instructions: {strategy.get('customPrompt', 'None')}

Weekly Schedule:
{schedule_text}

{f"""Generate GOOGLE ADS campaigns with:
- Short, compelling headlines (max 30 characters)
- Concise ad copy focused on conversion
- Visual descriptions optimized for {strategy.get('emailType', '').replace('google-ads-', '')} format
- Clear call-to-action text
- Format-specific layout recommendations""" if is_google_ads else """Generate EMAIL campaigns with:
- Compelling subject lines
- Engaging email content
- Specific image prompts for visual generation
- Professional email formatting"""}'''
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

        # for index, schedule in enumerate(weekly_schedule):

        campaign_cards = []

        for index, schedule in enumerate(weekly_schedule):

            theme_thread = ReturnThread(target=self._get_theme_for_campaign, args=(schedule['type'],))
            subject_thread = ReturnThread(target=self._generate_subject, args=(product.get('name', 'Product'), schedule['type'], schedule['audience']))
            email_thread = ReturnThread(target=self._generate_email_content, args=(product.get('name', 'Product'), schedule['type'], schedule['audience']))
            image_thread = ReturnThread(target=self._generate_image_prompt, args=(product.get('name', 'Product'), schedule['type']))

            theme_thread.start()
            subject_thread.start()
            email_thread.start()
            image_thread.start()

            # TEMP VARIABLE: Build individual campaign card
            card = {
                'id': f"card_{int(datetime.now().timestamp())}_{index}",
                'day': schedule['day'],
                'time': schedule['time'],
                'type': schedule['type'],
                'audience': schedule['audience'],
                'theme': theme_thread.join(),
                'subject': subject_thread.join(),
                'preview': f"{schedule['day']} {schedule['time']}: {schedule['type']}",
                'prompt': f"{schedule['type']} email for {schedule['audience']} promoting {product.get('name', 'Product')}",
                'emailContent': email_thread.join(),
                'imagePrompt': image_thread.join(),
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

    def _generate_image_prompt(self, product_name: str, campaign_type: str) -> str:
        """Generate image prompt for visual generation."""
        # TEMP VARIABLE: Base image prompts dictionary
        base_prompts = {
            'Primary Campaign': f"Clean, modern product photography of {product_name} on a minimal white background with soft studio lighting, professional commercial style",
            'Follow-up': f"{product_name} with a subtle urgency overlay, warm lighting, call-to-action focused design",
            'Premium Drop': f"Luxury product shot of {product_name} with dramatic lighting, black or dark background, premium feel, exclusive atmosphere",
            'Weekly Recap': f"Collection layout featuring {product_name} alongside other tech products, organized grid layout, modern tech aesthetic",
            'Sale Campaign': f"Dynamic sale image of {product_name} with bold red and yellow accents, sale badges, energetic composition",
            'Promotional Campaign': f"Promotional banner style image of {product_name} with vibrant colors, special offer styling, eye-catching design"
        }

        return base_prompts.get(campaign_type, base_prompts['Primary Campaign'])


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