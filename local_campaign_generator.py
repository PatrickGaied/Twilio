#!/usr/bin/env python3
"""
Local Campaign Generator - Standalone version for testing
Reads from test_payload.json and generates enhanced campaign cards
"""

import json
import os
import random
import requests

from datetime import datetime
from typing import List, Dict, Any, Optional

class CampaignCardGenerator:
    def __init__(self, openai_api_key: Optional[str] = None):
        """
        Initialize the campaign card generator.

        Args:
            openai_api_key: OpenAI API key. If None, will try to get from environment.
        """
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
                print(" Using OpenAI to generate campaign cards...")
                return self._generate_with_openai(product, strategy, weekly_schedule)
            except Exception as e:
                print(f" OpenAI generation failed: {e}")
                print("Falling back to template generation...")
        else:
            print("📝 No OpenAI API key found, using template generation...")

        return self._generate_with_templates(product, strategy, weekly_schedule)

    def _generate_with_openai(self, product: Dict[str, Any], strategy: Dict[str, Any],
                             weekly_schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate campaign cards using OpenAI API."""

        # Build schedule text for API prompt
        schedule_text = "\n".join([
            f"{s['day']} {s['time']}: {s['type']} for {s['audience']}"
            for s in weekly_schedule
        ])

        # Prepare API request headers
        headers = {
            'Authorization': f'Bearer {self.openai_api_key}',
            'Content-Type': 'application/json',
        }

        # Build API request payload
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

        print(f"Making OpenAI API request...")
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )

        if not response.ok:
            raise Exception(f"OpenAI API request failed: {response.status_code} - {response.text}")

        # Parse response data
        ai_data = response.json()
        generated_content = ai_data['choices'][0]['message']['content']

        try:
            # Parse JSON from AI response
            campaign_cards = json.loads(generated_content)
            print(f" Successfully generated {len(campaign_cards)} campaign cards with OpenAI")
            return campaign_cards
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from AI response: {e}")
            print(f"Raw response: {generated_content}")
            raise Exception("Failed to parse JSON from AI response")

    def _generate_with_templates(self, product: Dict[str, Any], strategy: Dict[str, Any],
                                weekly_schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate campaign cards using predefined templates."""

        campaign_cards = []

        for index, schedule in enumerate(weekly_schedule):
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

        print(f"Generated {len(campaign_cards)} campaign cards using templates")
        return campaign_cards

    def _get_theme_for_campaign(self, campaign_type: str) -> str:
        """Get theme for campaign type."""
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

        type_subjects = subjects.get(campaign_type, subjects['Primary Campaign'])
        return random.choice(type_subjects)

    def _generate_email_content(self, product_name: str, campaign_type: str, audience: str) -> str:
        """Generate email content."""
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
    """Main function to run the local campaign generator."""
    print("Starting Local Campaign Generator...")

    # Check if test payload exists
    payload_file = 'test_payload.json'
    if not os.path.exists(payload_file):
        print(f"Error: {payload_file} not found in current directory")
        return

    try:
        # Load test payload
        print(f" Loading test payload from {payload_file}...")
        with open(payload_file, 'r') as f:
            data = json.load(f)

        # Extract data from payload
        cards = data['cards']
        product = data['product']
        strategy = data['strategy']

        print(f"Product: {product['name']}")
        print(f"Strategy: {strategy['strategy'][:50]}...")
        print(f"Processing {len(cards)} campaign cards...")

        # Convert cards to weekly schedule format
        weekly_schedule = []
        for card in cards:
            schedule_item = {
                'day': card['day'],
                'time': card['time'],
                'type': card['type'],
                'audience': card['audience'],
                'emailTheme': card['theme']
            }
            weekly_schedule.append(schedule_item)

        # Initialize generator and process cards
        generator = CampaignCardGenerator()

        print("\n" + "="*50)
        print(" PROCESSING CAMPAIGN CARDS")
        print("="*50)

        start_time = datetime.now()
        enhanced_cards = generator.generate_campaign_cards(
            product=product,
            strategy=strategy,
            weekly_schedule=weekly_schedule
        )
        end_time = datetime.now()

        # Map enhanced cards back to original IDs
        processed_cards = []
        for i, card in enumerate(cards):
            if i < len(enhanced_cards):
                enhanced_card = enhanced_cards[i]
                enhanced_card['id'] = card['id']  # Preserve original ID
                enhanced_card['status'] = card['status']
            else:
                # Fallback for missing cards
                enhanced_card = {
                    "id": card['id'],
                    "day": card['day'],
                    "time": card['time'],
                    "type": card['type'],
                    "audience": card['audience'],
                    "theme": card['theme'],
                    "subject": generator._generate_subject(product['name'], card['type'], card['audience']),
                    "preview": f"{card['day']} {card['time']}: {card['type']} for {card['audience']}",
                    "prompt": f"{card['type']} email for {card['audience']} promoting {product['name']}",
                    "emailContent": generator._generate_email_content(product['name'], card['type'], card['audience']),
                    "imagePrompt": generator._generate_image_prompt(product['name'], card['type']),
                    "status": card['status']
                }

            processed_cards.append(enhanced_card)

        # Create result
        result = {
            "success": True,
            "cards": processed_cards,
            "processed_at": datetime.now().isoformat(),
            "total_cards": len(processed_cards),
            "processing_time_seconds": (end_time - start_time).total_seconds(),
            "ai_generated": bool(generator.openai_api_key)
        }

        # Save result to file
        output_file = 'campaign_result.json'
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)

        print("\n" + "="*50)
        print("CAMPAIGN GENERATION COMPLETE")
        print("="*50)
        print(f"  Processing time: {result['processing_time_seconds']:.2f} seconds")
        print(f"Generated {len(processed_cards)} enhanced campaign cards")
        print(f"AI-powered: {'Yes' if result['ai_generated'] else 'No (templates used)'}")
        print(f"Results saved to: {output_file}")

        # Print sample results
        print("\n SAMPLE CAMPAIGN CARD:")
        print("-" * 30)
        sample_card = processed_cards[0]
        print(f"ID: {sample_card['id']}")
        print(f"Type: {sample_card['type']}")
        print(f"Audience: {sample_card['audience']}")
        print(f"Subject: {sample_card['subject']}")
        print(f"Preview: {sample_card['preview'][:80]}...")
        print(f"Image Prompt: {sample_card['imagePrompt'][:80]}...")

    except FileNotFoundError:
        print(f" Error: Could not find {payload_file}")
    except json.JSONDecodeError as e:
        print(f" Error: Invalid JSON in {payload_file}: {e}")
    except Exception as e:
        print(f" Error: {e}")


if __name__ == "__main__":
    main()