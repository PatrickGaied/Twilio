#!/usr/bin/env python3
"""
Email Campaign Card Generator

This Python script replicates the functionality of the Next.js API endpoint
for generating email campaign cards using OpenAI's GPT-4 API.
"""

import json
import random
import requests
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

class CampaignCardGenerator:
    def __init__(self, openai_api_key: Optional[str] = None):
        """
        Initialize the campaign card generator.

        Args:
            openai_api_key: OpenAI API key. If None, will try to get from environment.
        """
        # TEMP VARIABLE: Store API key temporarily for class usage
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        if not self.openai_api_key:
            print("Warning: No OpenAI API key provided. Will use fallback templates only.")

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
                print("Falling back to template generation...")

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
  "imagePrompt": "image_generation_prompt",
  "status": "pending"
}'''
                },
                {
                    'role': 'user',
                    'content': f'''Generate campaign cards for:
Product: {product.get('name', 'Unknown Product')}
Strategy: {strategy.get('strategy', 'Standard marketing strategy')}
Primary Audience: {strategy.get('primaryAudience', 'General audience')}

Weekly Schedule:
{schedule_text}

Each campaign should have compelling subject lines, engaging email content, and specific image prompts for visual generation.'''
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

        # TEMP VARIABLE: Loop through schedule items with index
        for index, schedule in enumerate(weekly_schedule):
            # TEMP VARIABLE: Build individual campaign card
            card = {
                'id': f"card_{int(datetime.now().timestamp())}_{index}",
                'day': schedule['day'],
                'time': schedule['time'],
                'type': schedule['type'],
                'audience': schedule['audience'],
                'theme': self._get_theme_for_campaign(schedule['type']),
                'subject': self._generate_subject(product.get('name', 'Product'),
                                                schedule['type'], schedule['audience']),
                'preview': f"{schedule['day']} {schedule['time']}: {schedule['type']}",
                'prompt': f"{schedule['type']} email for {schedule['audience']} promoting {product.get('name', 'Product')}",
                'emailContent': self._generate_email_content(product.get('name', 'Product'),
                                                           schedule['type'], schedule['audience']),
                'imagePrompt': self._generate_image_prompt(product.get('name', 'Product'),
                                                         schedule['type']),
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


def main():
    """Example usage of the CampaignCardGenerator."""

    # TEMP VARIABLE: Example product data for testing
    product = {
        'name': 'iPhone 15 Pro',
        'category': 'Phones',
        'price': 999
    }

    # TEMP VARIABLE: Example strategy data for testing
    strategy = {
        'product': 'iPhone 15 Pro',
        'primaryAudience': 'Window Shoppers',
        'strategy': 'Generate targeted informative email campaigns for window shoppers with compelling hero images and personalized content.',
        'emailType': 'informative',
        'customPrompt': ''
    }

    # TEMP VARIABLE: Example weekly schedule for testing
    weekly_schedule = [
        {
            'day': 'Monday',
            'time': '10:00 AM',
            'type': 'Primary Campaign',
            'audience': 'Window Shoppers',
            'emailTheme': 'Discovery & Exploration'
        },
        {
            'day': 'Wednesday',
            'time': '2:00 PM',
            'type': 'Primary Campaign',
            'audience': 'Window Shoppers',
            'emailTheme': 'Feature Showcase'
        },
        {
            'day': 'Thursday',
            'time': '11:00 AM',
            'type': 'Follow-up',
            'audience': 'Cart Abandoners',
            'emailTheme': 'Urgency & Completion'
        },
        {
            'day': 'Friday',
            'time': '9:00 AM',
            'type': 'Premium Drop',
            'audience': 'High Converters',
            'emailTheme': 'Exclusive Access'
        },
        {
            'day': 'Sunday',
            'time': '6:00 PM',
            'type': 'Weekly Recap',
            'audience': 'All Segments',
            'emailTheme': 'Weekly Highlights'
        }
    ]

    # TEMP VARIABLE: Initialize generator instance
    generator = CampaignCardGenerator()
    # TEMP VARIABLE: Store generated campaign cards
    cards = generator.generate_campaign_cards(product, strategy, weekly_schedule)

    # Pretty print the results
    print("Generated Campaign Cards:")
    print("=" * 50)
    print(json.dumps(cards, indent=2))

    # TEMP VARIABLE: Define output file path
    output_file = 'campaign_cards_output.json'
    # Save to file
    with open(output_file, 'w') as f:
        json.dump(cards, f, indent=2)

    print(f"\nResults saved to: {output_file}")


if __name__ == "__main__":
    main()