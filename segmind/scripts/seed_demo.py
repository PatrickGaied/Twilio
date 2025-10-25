#!/usr/bin/env python3
"""
Seed demo data for Segmind platform
Generates realistic customer segments and messaging data
"""

import requests
import json
import random
from datetime import datetime, timedelta
from faker import Faker
import time

fake = Faker()
BASE_URL = "http://localhost:8000/api"

def seed_segments():
    """Create customer segments"""
    print("🎯 Creating customer segments...")

    segments = [
        {
            "name": "High Converters",
            "type": "high_converters",
            "description": "Customers with >10% conversion rate and high LTV",
            "criteria": {
                "conversion_rate": {"gt": 0.1},
                "lifetime_value": {"gt": 1000}
            }
        },
        {
            "name": "Cart Abandoners - Electronics",
            "type": "cart_abandoners",
            "description": "Users who added electronics to cart but didn't purchase",
            "criteria": {
                "cart_events": {"gt": 0},
                "purchase_events": {"eq": 0},
                "category": {"eq": "electronics"}
            }
        },
        {
            "name": "Mobile App Users",
            "type": "window_shoppers",
            "description": "Active mobile app users with high engagement",
            "criteria": {
                "platform": {"eq": "mobile"},
                "session_count": {"gt": 5}
            }
        },
        {
            "name": "VIP Loyalty Members",
            "type": "loyal_customers",
            "description": "Premium customers with 5+ orders",
            "criteria": {
                "total_orders": {"gte": 5},
                "membership_tier": {"eq": "vip"}
            }
        },
        {
            "name": "Re-engagement Targets",
            "type": "at_risk",
            "description": "Customers inactive for 30+ days",
            "criteria": {
                "last_activity": {"lt": "30_days_ago"},
                "previous_purchases": {"gt": 0}
            }
        }
    ]

    for segment in segments:
        try:
            response = requests.post(f"{BASE_URL}/segments/", json=segment)
            if response.status_code == 200:
                print(f"  ✅ Created segment: {segment['name']}")
            else:
                print(f"  ❌ Failed to create segment: {segment['name']}")
        except Exception as e:
            print(f"  ❌ Error creating segment {segment['name']}: {e}")

def seed_campaigns():
    """Create sample campaigns"""
    print("\n📧 Creating sample campaigns...")

    campaigns = [
        {
            "name": "Black Friday - Electronics Sale",
            "segment_id": "seg_2",  # Cart Abandoners
            "channel": "sms",
            "content": "🔥 Black Friday FLASH SALE! Your {{product_name}} is 40% OFF! Limited time - complete your purchase now: {{checkout_link}}",
            "scheduled_at": (datetime.now() + timedelta(hours=2)).isoformat()
        },
        {
            "name": "Welcome Series - Day 1",
            "segment_id": "seg_3",  # Mobile App Users
            "channel": "email",
            "subject": "Welcome to Segmind! Here's 20% off your first order",
            "content": "Hi {{first_name}}! Welcome to our community. Use code WELCOME20 for 20% off your first purchase. Start shopping: {{shop_link}}",
        },
        {
            "name": "VIP Early Access",
            "segment_id": "seg_4",  # VIP Members
            "channel": "whatsapp",
            "content": "🌟 VIP EXCLUSIVE: Get early access to our new collection! Shop 24 hours before everyone else. See what's new: {{exclusive_link}}",
        },
        {
            "name": "We Miss You - Come Back",
            "segment_id": "seg_5",  # Re-engagement
            "channel": "email",
            "subject": "We miss you! Here's 30% off to welcome you back",
            "content": "It's been a while since your last visit. Come back and enjoy 30% off everything! Use code COMEBACK30: {{return_link}}",
        }
    ]

    for campaign in campaigns:
        try:
            response = requests.post(f"{BASE_URL}/messaging/campaigns", json=campaign)
            if response.status_code == 200:
                print(f"  ✅ Created campaign: {campaign['name']}")
            else:
                print(f"  ❌ Failed to create campaign: {campaign['name']}")
        except Exception as e:
            print(f"  ❌ Error creating campaign {campaign['name']}: {e}")

def send_sample_messages():
    """Send sample messages to demonstrate activity"""
    print("\n💬 Sending sample messages...")

    channels = ["sms", "email", "whatsapp", "push"]
    customers = [f"cust_{i}" for i in range(1, 11)]

    for i in range(20):
        message = {
            "customer_id": random.choice(customers),
            "channel": random.choice(channels),
            "content": fake.text(max_nb_chars=160),
            "subject": fake.sentence() if random.choice([True, False]) else None
        }

        try:
            response = requests.post(f"{BASE_URL}/messaging/send", json=message)
            if response.status_code == 200:
                print(f"  ✅ Sent message {i+1}/20")
            else:
                print(f"  ❌ Failed to send message {i+1}")
        except Exception as e:
            print(f"  ❌ Error sending message: {e}")

        time.sleep(0.1)  # Small delay to avoid overwhelming

def generate_sample_data():
    """Generate additional sample data files"""
    print("\n📊 Generating sample data files...")

    # Customer data
    customers = []
    for i in range(100):
        customer = {
            "id": f"cust_{i+1}",
            "email": fake.email(),
            "phone": fake.phone_number(),
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "total_orders": random.randint(0, 20),
            "total_spent": round(random.uniform(0, 5000), 2),
            "last_activity": fake.date_time_between(start_date='-90d', end_date='now').isoformat(),
            "conversion_rate": round(random.uniform(0, 0.3), 3),
            "lifetime_value": round(random.uniform(0, 5000), 2)
        }
        customers.append(customer)

    with open('../data/samples/customers.json', 'w') as f:
        json.dump(customers, f, indent=2)

    # Event data
    events = []
    event_types = ['view', 'cart', 'purchase', 'email_open', 'sms_click']
    for i in range(1000):
        event = {
            "id": f"event_{i+1}",
            "customer_id": f"cust_{random.randint(1, 100)}",
            "event_type": random.choice(event_types),
            "timestamp": fake.date_time_between(start_date='-30d', end_date='now').isoformat(),
            "properties": {
                "product_id": random.randint(1000, 9999),
                "category": random.choice(['electronics', 'clothing', 'home', 'sports']),
                "value": round(random.uniform(10, 500), 2)
            }
        }
        events.append(event)

    with open('../data/samples/events.json', 'w') as f:
        json.dump(events, f, indent=2)

    print("  ✅ Generated customers.json (100 customers)")
    print("  ✅ Generated events.json (1000 events)")

def test_api_endpoints():
    """Test that all API endpoints are working"""
    print("\n🔍 Testing API endpoints...")

    endpoints = [
        ("/segments/", "GET"),
        ("/segments/stats/overview", "GET"),
        ("/messaging/campaigns", "GET"),
        ("/analytics/overview", "GET"),
        ("/analytics/channels", "GET"),
        ("/analytics/realtime", "GET")
    ]

    for endpoint, method in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}")
            else:
                response = requests.post(f"{BASE_URL}{endpoint}")

            if response.status_code in [200, 201]:
                print(f"  ✅ {method} {endpoint}")
            else:
                print(f"  ❌ {method} {endpoint} - Status: {response.status_code}")
        except Exception as e:
            print(f"  ❌ {method} {endpoint} - Error: {e}")

def main():
    print("🚀 Seeding Segmind Demo Data")
    print("=" * 50)

    # Check if API is running
    try:
        response = requests.get(f"{BASE_URL.replace('/api', '')}/health")
        if response.status_code == 200:
            print("✅ API is running")
        else:
            print("❌ API health check failed")
            return
    except Exception as e:
        print(f"❌ Cannot connect to API at {BASE_URL}")
        print("Make sure the backend is running: ./run.sh backend")
        return

    # Seed data
    seed_segments()
    seed_campaigns()
    send_sample_messages()
    generate_sample_data()
    test_api_endpoints()

    print("\n" + "=" * 50)
    print("✅ Demo data seeding completed!")
    print("\nNext steps:")
    print("1. Start the frontend: ./run.sh frontend")
    print("2. Visit http://localhost:3000")
    print("3. Explore the customer segmentation dashboard")

if __name__ == "__main__":
    main()