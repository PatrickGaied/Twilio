#!/usr/bin/env python3
"""
Example usage of the Campaign Card Generator

This script shows different ways to use the CampaignCardGenerator class
with various products, strategies, and campaign types.
"""

from generate_campaign_cards import CampaignCardGenerator
import json

def example_1_basic_usage():
    """Basic usage with default templates (no OpenAI required)."""
    print("=== Example 1: Basic Usage (Template Mode) ===")

    generator = CampaignCardGenerator()  # No API key = template mode

    product = {
        'name': 'MacBook Pro M3',
        'category': 'Laptops',
        'price': 1999
    }

    strategy = {
        'primaryAudience': 'Creative Professionals',
        'strategy': 'Target creative professionals with productivity-focused messaging'
    }

    schedule = [
        {
            'day': 'Tuesday',
            'time': '9:00 AM',
            'type': 'Primary Campaign',
            'audience': 'Creative Professionals',
            'emailTheme': 'Productivity Focus'
        },
        {
            'day': 'Friday',
            'time': '3:00 PM',
            'type': 'Premium Drop',
            'audience': 'High Converters',
            'emailTheme': 'Exclusive Access'
        }
    ]

    cards = generator.generate_campaign_cards(product, strategy, schedule)

    for card in cards:
        print(f"📧 {card['subject']}")
        print(f"📅 {card['day']} at {card['time']}")
        print(f"👥 Audience: {card['audience']}")
        print(f"📝 Preview: {card['emailContent'][:100]}...")
        print("-" * 50)

def example_2_sale_campaign():
    """Example with sale-focused campaigns."""
    print("\n=== Example 2: Sale Campaign ===")

    generator = CampaignCardGenerator()

    product = {
        'name': 'AirPods Pro',
        'category': 'Audio',
        'price': 249
    }

    strategy = {
        'primaryAudience': 'Music Lovers',
        'strategy': 'Create urgency-driven sale campaigns for audio enthusiasts',
        'emailType': 'sale'
    }

    schedule = [
        {
            'day': 'Monday',
            'time': '8:00 AM',
            'type': 'Sale Campaign',
            'audience': 'All Segments',
            'emailTheme': 'Flash Sale'
        },
        {
            'day': 'Wednesday',
            'time': '12:00 PM',
            'type': 'Follow-up',
            'audience': 'Cart Abandoners',
            'emailTheme': 'Last Chance'
        }
    ]

    cards = generator.generate_campaign_cards(product, strategy, schedule)

    print(f"Generated {len(cards)} sale campaign cards:")
    for card in cards:
        print(f"🔥 {card['subject']}")
        print(f"🎯 Theme: {card['theme']}")
        print()

def example_3_custom_schedule():
    """Example with custom weekly schedule for educational content."""
    print("\n=== Example 3: Educational Campaign ===")

    generator = CampaignCardGenerator()

    product = {
        'name': 'iPad Air',
        'category': 'Tablets',
        'price': 599
    }

    strategy = {
        'primaryAudience': 'Students & Educators',
        'strategy': 'Educational content focusing on learning and productivity',
        'emailType': 'educational'
    }

    # Full week schedule
    schedule = [
        {'day': 'Monday', 'time': '7:00 AM', 'type': 'Educational Recap', 'audience': 'Students', 'emailTheme': 'Study Tips'},
        {'day': 'Tuesday', 'time': '10:00 AM', 'type': 'Primary Campaign', 'audience': 'Educators', 'emailTheme': 'Teaching Tools'},
        {'day': 'Wednesday', 'time': '2:00 PM', 'type': 'Primary Campaign', 'audience': 'Students', 'emailTheme': 'Learning Apps'},
        {'day': 'Thursday', 'time': '11:00 AM', 'type': 'Follow-up', 'audience': 'Cart Abandoners', 'emailTheme': 'Education Discount'},
        {'day': 'Friday', 'time': '4:00 PM', 'type': 'Premium Drop', 'audience': 'Educational Institutions', 'emailTheme': 'Bulk Pricing'},
        {'day': 'Saturday', 'time': '9:00 AM', 'type': 'Weekly Recap', 'audience': 'All Segments', 'emailTheme': 'Weekend Learning'},
        {'day': 'Sunday', 'time': '6:00 PM', 'type': 'Educational Recap', 'audience': 'All Segments', 'emailTheme': 'Week Prep'}
    ]

    cards = generator.generate_campaign_cards(product, strategy, schedule)

    print(f"Generated {len(cards)} educational campaign cards:")

    # Group by day for better visualization
    by_day = {}
    for card in cards:
        day = card['day']
        if day not in by_day:
            by_day[day] = []
        by_day[day].append(card)

    for day, day_cards in by_day.items():
        print(f"\n📅 {day}:")
        for card in day_cards:
            print(f"  {card['time']}: {card['subject']} (→ {card['audience']})")

def example_4_save_to_files():
    """Example showing how to save different campaign types to separate files."""
    print("\n=== Example 4: Save Different Campaign Types ===")

    generator = CampaignCardGenerator()

    # Generate campaigns for different products
    products = [
        {'name': 'iPhone 15 Pro', 'category': 'Phones'},
        {'name': 'Samsung Galaxy S24', 'category': 'Phones'},
        {'name': 'MacBook Pro', 'category': 'Laptops'}
    ]

    base_schedule = [
        {'day': 'Monday', 'time': '10:00 AM', 'type': 'Primary Campaign', 'audience': 'Window Shoppers', 'emailTheme': 'Introduction'},
        {'day': 'Wednesday', 'time': '2:00 PM', 'type': 'Follow-up', 'audience': 'Cart Abandoners', 'emailTheme': 'Urgency'},
        {'day': 'Friday', 'time': '9:00 AM', 'type': 'Premium Drop', 'audience': 'High Converters', 'emailTheme': 'Exclusive'}
    ]

    all_campaigns = {}

    for product in products:
        strategy = {
            'primaryAudience': 'Tech Enthusiasts',
            'strategy': f'Promote {product["name"]} to tech-savvy customers'
        }

        cards = generator.generate_campaign_cards(product, strategy, base_schedule)
        all_campaigns[product['name']] = cards

        # Save individual product campaigns
        filename = f"campaigns_{product['name'].replace(' ', '_').lower()}.json"
        with open(filename, 'w') as f:
            json.dump(cards, f, indent=2)

        print(f"✅ Saved {len(cards)} campaigns for {product['name']} → {filename}")

    # Save combined campaigns
    with open('all_campaigns_combined.json', 'w') as f:
        json.dump(all_campaigns, f, indent=2)

    print("✅ Saved combined campaigns → all_campaigns_combined.json")

def main():
    """Run all examples."""
    print("🚀 Campaign Card Generator Examples")
    print("=" * 60)

    example_1_basic_usage()
    example_2_sale_campaign()
    example_3_custom_schedule()
    example_4_save_to_files()

    print("\n✨ All examples completed! Check the generated JSON files.")

if __name__ == "__main__":
    main()